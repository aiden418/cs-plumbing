// herovideo.swift
//
// Command-line tool behind `npm run video:build` (scripts/build-hero-video.mjs).
// It makes the smaller hero-video files from public/videos/hero-loop.mp4 using
// only what ships with macOS (AVFoundation + VideoToolbox + ImageIO): no ffmpeg,
// nothing downloaded. The driver compiles this file into a cache folder; the
// binary is never committed. Nothing in here is specific to one clip.
//
//   herovideo probe    <file>
//   herovideo frame    <file> --time <seconds> --out <png> [--crop x,y,w,h] [--size WxH]
//   herovideo encode   <in> <out.mp4> --codec h264|hevc --bitrate <bits/s>
//                      [--crop x,y,w,h] [--size WxH] [--fps 30] [--keyint 60]
//                      [--encoder auto|hardware|software]
//                      [--rate-control auto|variable|average]
//   herovideo compare  <reference> <test> [--crop x,y,w,h] [--fps 30] [--frames]
//   herovideo encoders [--properties]
//
// Every command prints one JSON object on stdout and exits non-zero with a
// message on stderr when something is wrong. Crop rectangles are in source
// pixels measured from the top-left corner of the upright picture.
//
// What `encode` always does: H.264 High (CABAC) or HEVC Main tagged hvc1, 8-bit
// BT.709 video range, constant frame rate, B-frames allowed, a keyframe at
// least every --keyint frames and every keyframe a clean restart point (closed
// GOP), no audio, and the index before the picture data so a browser can start
// playing while the file is still arriving. It refuses to leave a file behind
// that fails any of those checks.
//
// Build (what the driver runs; x86_64 instead of arm64 on an Intel Mac):
//   xcrun swiftc -O -swift-version 5 -target arm64-apple-macos14 \
//     -sdk "$(xcrun --show-sdk-path)" scripts/video/herovideo.swift -o <cache>/herovideo

import AVFoundation
import CoreGraphics
import CoreMedia
import CoreVideo
import Foundation
import ImageIO
import UniformTypeIdentifiers
import VideoToolbox

// MARK: - Errors, output, arguments

struct ToolError: Error, CustomStringConvertible {
    let description: String
    init(_ description: String) { self.description = description }
}

func describe(_ error: Error) -> String {
    if let tool = error as? ToolError { return tool.description }
    let ns = error as NSError
    var text = "\(ns.localizedDescription) [\(ns.domain) \(ns.code)]"
    if let reason = ns.localizedFailureReason { text += " \(reason)" }
    if let underlying = ns.userInfo[NSUnderlyingErrorKey] as? NSError {
        text += " (underlying: \(underlying.domain) \(underlying.code))"
    }
    return text
}

func printJSON(_ object: [String: Any]) throws {
    let data = try JSONSerialization.data(
        withJSONObject: object, options: [.prettyPrinted, .sortedKeys, .withoutEscapingSlashes])
    FileHandle.standardOutput.write(data)
    FileHandle.standardOutput.write(Data("\n".utf8))
}

/// A number that prints in JSON as written (3.3, not 3.2999999999999998).
func rounded(_ value: Double, places: Int) -> NSDecimalNumber {
    NSDecimalNumber(string: String(format: "%.\(places)f", value))
}

struct Args {
    private(set) var positional: [String] = []
    private var values: [String: String] = [:]
    private var switches: Set<String> = []

    init(_ raw: ArraySlice<String>, options: Set<String>, switches known: Set<String> = []) throws {
        var iterator = raw.makeIterator()
        while let token = iterator.next() {
            guard token.hasPrefix("--") else {
                positional.append(token)
                continue
            }
            let name = String(token.dropFirst(2))
            if known.contains(name) {
                switches.insert(name)
            } else if options.contains(name) {
                guard let value = iterator.next() else { throw ToolError("missing value for --\(name)") }
                values[name] = value
            } else {
                throw ToolError("unknown option --\(name)")
            }
        }
    }

    func has(_ name: String) -> Bool { switches.contains(name) }
    func string(_ name: String) -> String? { values[name] }

    func int(_ name: String) throws -> Int? {
        guard let text = values[name] else { return nil }
        guard let value = Int(text) else { throw ToolError("--\(name) expects a whole number, got \"\(text)\"") }
        return value
    }

    func double(_ name: String) throws -> Double? {
        guard let text = values[name] else { return nil }
        guard let value = Double(text), value.isFinite else {
            throw ToolError("--\(name) expects a number, got \"\(text)\"")
        }
        return value
    }

    /// "1280x720"
    func size(_ name: String) throws -> (width: Int, height: Int)? {
        guard let text = values[name] else { return nil }
        let parts = text.lowercased().split(separator: "x").compactMap { Int($0) }
        guard parts.count == 2, parts[0] > 0, parts[1] > 0 else {
            throw ToolError("--\(name) expects WIDTHxHEIGHT, got \"\(text)\"")
        }
        return (parts[0], parts[1])
    }

    /// "x,y,width,height"
    func rect(_ name: String) throws -> CGRect? {
        guard let text = values[name] else { return nil }
        let parts = text.split(separator: ",").compactMap { Int($0) }
        guard parts.count == 4, parts[0] >= 0, parts[1] >= 0, parts[2] > 0, parts[3] > 0 else {
            throw ToolError("--\(name) expects x,y,width,height in whole pixels, got \"\(text)\"")
        }
        return CGRect(x: parts[0], y: parts[1], width: parts[2], height: parts[3])
    }
}

// MARK: - Container (ISO base media file) helpers

struct Box {
    let type: String
    let offset: UInt64
    let size: UInt64
}

func topLevelBoxes(atPath path: String) throws -> [Box] {
    guard let handle = FileHandle(forReadingAtPath: path) else { throw ToolError("cannot open \(path)") }
    defer { try? handle.close() }
    let fileSize = try handle.seekToEnd()
    var boxes: [Box] = []
    var offset: UInt64 = 0
    while offset + 8 <= fileSize {
        try handle.seek(toOffset: offset)
        let header = [UInt8](try handle.read(upToCount: 16) ?? Data())
        guard header.count >= 8 else { break }
        var size = header[0..<4].reduce(UInt64(0)) { $0 << 8 | UInt64($1) }
        let type = String(bytes: header[4..<8], encoding: .isoLatin1) ?? "????"
        var headerSize: UInt64 = 8
        if size == 1 {
            guard header.count >= 16 else { throw ToolError("truncated box header in \(path)") }
            size = header[8..<16].reduce(UInt64(0)) { $0 << 8 | UInt64($1) }
            headerSize = 16
        } else if size == 0 {
            size = fileSize - offset
        }
        guard size >= headerSize, offset + size <= fileSize else {
            throw ToolError("malformed '\(type)' box at byte \(offset) in \(path)")
        }
        boxes.append(Box(type: type, offset: offset, size: size))
        offset += size
    }
    return boxes
}

/// True when the index (`moov`) comes before the picture data (`mdat`), so a
/// browser can start playing before the whole file has arrived.
func moovPrecedesMdat(_ boxes: [Box]) -> Bool {
    guard let moov = boxes.firstIndex(where: { $0.type == "moov" }),
        let mdat = boxes.firstIndex(where: { $0.type == "mdat" })
    else { return false }
    return moov < mdat
}

// MARK: - Codec description

func fourCC(_ code: FourCharCode) -> String {
    let bytes: [UInt8] = [24, 16, 8, 0].map { UInt8((code >> $0) & 0xFF) }
    return String(bytes: bytes, encoding: .isoLatin1) ?? String(format: "%08X", code)
}

/// The RFC 6381 `codecs=` value for a video sample description, read from the
/// decoder configuration stored in the file (avcC / hvcC), e.g. avc1.640028 or
/// hvc1.1.6.L93.B0.
func rfc6381(_ description: CMFormatDescription) -> String? {
    let type = fourCC(CMFormatDescriptionGetMediaSubType(description))
    let atoms =
        CMFormatDescriptionGetExtension(
            description, extensionKey: kCMFormatDescriptionExtension_SampleDescriptionExtensionAtoms)
        as? [String: Any]
    switch type {
    case "avc1", "avc3":
        guard let data = atoms?["avcC"] as? Data else { return nil }
        let b = [UInt8](data)
        guard b.count >= 4 else { return nil }
        // profile_idc, constraint flags, level_idc
        return type + "." + String(format: "%02X%02X%02X", b[1], b[2], b[3])
    case "hvc1", "hev1":
        guard let data = atoms?["hvcC"] as? Data else { return nil }
        let b = [UInt8](data)
        guard b.count >= 13 else { return nil }
        let space = ["", "A", "B", "C"][Int(b[1] >> 6)]
        let tier = (b[1] & 0x20) != 0 ? "H" : "L"
        let profile = b[1] & 0x1F
        let compatibility =
            (UInt32(b[2]) << 24) | (UInt32(b[3]) << 16) | (UInt32(b[4]) << 8) | UInt32(b[5])
        // ISO/IEC 14496-15 Annex E: the 32 compatibility flags in reverse bit order.
        var reversed: UInt32 = 0
        for bit in 0..<32 where compatibility & (UInt32(1) << UInt32(bit)) != 0 {
            reversed |= UInt32(1) << UInt32(31 - bit)
        }
        var constraints = Array(b[6..<12])
        while let last = constraints.last, last == 0 { constraints.removeLast() }
        var parts = [
            type, "\(space)\(profile)", String(reversed, radix: 16, uppercase: true), "\(tier)\(b[12])",
        ]
        parts += constraints.map { String($0, radix: 16, uppercase: true) }
        return parts.joined(separator: ".")
    default:
        return nil
    }
}

func colorTags(_ description: CMFormatDescription) -> [String: Any] {
    var tags: [String: Any] = [:]
    func text(_ key: CFString) -> String? {
        CMFormatDescriptionGetExtension(description, extensionKey: key) as? String
    }
    tags["colorPrimaries"] = text(kCMFormatDescriptionExtension_ColorPrimaries) ?? "untagged"
    tags["transferFunction"] = text(kCMFormatDescriptionExtension_TransferFunction) ?? "untagged"
    tags["yCbCrMatrix"] = text(kCMFormatDescriptionExtension_YCbCrMatrix) ?? "untagged"
    tags["fullRange"] =
        (CMFormatDescriptionGetExtension(description, extensionKey: kCMFormatDescriptionExtension_FullRangeVideo)
            as? Bool) ?? false
    return tags
}

// MARK: - Loading a video

struct Video {
    let path: String
    let asset: AVURLAsset
    let track: AVAssetTrack
    let naturalSize: CGSize
    let preferredTransform: CGAffineTransform
    /// Upright picture rectangle after the track's own rotation, before normalising to 0,0.
    let displayRect: CGRect
    let nominalFrameRate: Double
    let duration: CMTime
    let formatDescription: CMFormatDescription
    let audioTrackCount: Int

    var displayWidth: Int { Int(displayRect.width.rounded()) }
    var displayHeight: Int { Int(displayRect.height.rounded()) }
    var hasIdentityTransform: Bool { preferredTransform.isIdentity }
}

func loadVideo(_ path: String) async throws -> Video {
    guard FileManager.default.isReadableFile(atPath: path) else { throw ToolError("cannot read \(path)") }
    let asset = AVURLAsset(
        url: URL(fileURLWithPath: path), options: [AVURLAssetPreferPreciseDurationAndTimingKey: true])
    let videoTracks = try await asset.loadTracks(withMediaType: .video)
    guard let track = videoTracks.first else { throw ToolError("no video track in \(path)") }
    let audioTracks = try await asset.loadTracks(withMediaType: .audio)
    let naturalSize = try await track.load(.naturalSize)
    let transform = try await track.load(.preferredTransform)
    let frameRate = try await track.load(.nominalFrameRate)
    let descriptions = try await track.load(.formatDescriptions)
    let duration = try await asset.load(.duration)
    guard let description = descriptions.first else { throw ToolError("no format description in \(path)") }
    guard duration.isNumeric, duration.seconds > 0 else { throw ToolError("\(path) has no duration") }
    return Video(
        path: path, asset: asset, track: track, naturalSize: naturalSize, preferredTransform: transform,
        displayRect: CGRect(origin: .zero, size: naturalSize).applying(transform).standardized,
        nominalFrameRate: Double(frameRate), duration: duration, formatDescription: description,
        audioTrackCount: audioTracks.count)
}

// MARK: - probe

struct SampleScan {
    var frames = 0
    var bytes = 0
    var keyframes: [Int] = []
    var reordered = false
}

/// Walks the stored (still compressed) samples: count, size, keyframes, and
/// whether display order differs from decode order (B-frames).
func scanSamples(_ video: Video) throws -> SampleScan {
    let reader = try AVAssetReader(asset: video.asset)
    let output = AVAssetReaderTrackOutput(track: video.track, outputSettings: nil)
    output.alwaysCopiesSampleData = false
    guard reader.canAdd(output) else { throw ToolError("cannot read samples from \(video.path)") }
    reader.add(output)
    guard reader.startReading() else {
        throw ToolError("cannot read \(video.path): \(reader.error.map(describe) ?? "unknown error")")
    }
    var scan = SampleScan()
    var latest = CMTime.negativeInfinity
    while let sample = output.copyNextSampleBuffer() {
        guard CMSampleBufferGetNumSamples(sample) > 0 else { continue }
        let attachments =
            (CMSampleBufferGetSampleAttachmentsArray(sample, createIfNecessary: false) as? [NSDictionary])?.first
        if (attachments?[kCMSampleAttachmentKey_DoNotDisplay] as? Bool) ?? false { continue }
        if !((attachments?[kCMSampleAttachmentKey_NotSync] as? Bool) ?? false) {
            scan.keyframes.append(scan.frames)
        }
        let time = CMSampleBufferGetPresentationTimeStamp(sample)
        if time < latest { scan.reordered = true } else { latest = time }
        scan.bytes += CMSampleBufferGetTotalSampleSize(sample)
        scan.frames += CMSampleBufferGetNumSamples(sample)
    }
    guard reader.status == .completed else {
        throw ToolError("reading \(video.path) stopped early: \(reader.error.map(describe) ?? "unknown error")")
    }
    return scan
}

func probe(_ path: String) async throws -> [String: Any] {
    let video = try await loadVideo(path)
    let scan = try scanSamples(video)
    let boxes = try topLevelBoxes(atPath: path)
    let attributes = try FileManager.default.attributesOfItem(atPath: path)
    let seconds = video.duration.seconds
    var videoInfo: [String: Any] = [
        "width": video.displayWidth,
        "height": video.displayHeight,
        "fourcc": fourCC(CMFormatDescriptionGetMediaSubType(video.formatDescription)),
        "frameRate": rounded(video.nominalFrameRate, places: 3),
        "frameCount": scan.frames,
        "keyframes": scan.keyframes,
        "frameReordering": scan.reordered,
        "averageBitrate": Int((Double(scan.bytes) * 8 / seconds).rounded()),
        "uprightWithoutRotation": video.hasIdentityTransform,
    ]
    if let codec = rfc6381(video.formatDescription) { videoInfo["codec"] = codec }
    videoInfo.merge(colorTags(video.formatDescription)) { current, _ in current }
    return [
        "file": path,
        "bytes": (attributes[.size] as? NSNumber)?.intValue ?? 0,
        "durationSeconds": rounded(seconds, places: 4),
        "topLevelBoxes": boxes.map { $0.type },
        "fastStart": moovPrecedesMdat(boxes),
        "audioTracks": video.audioTrackCount,
        "video": videoInfo,
    ]
}

func runProbe(_ raw: ArraySlice<String>) async throws {
    let args = try Args(raw, options: [])
    guard args.positional.count == 1 else { throw ToolError("usage: herovideo probe <file>") }
    try printJSON(try await probe(args.positional[0]))
}

// MARK: - frame

func scaled(_ image: CGImage, width: Int, height: Int) throws -> CGImage {
    let spaces = [image.colorSpace, CGColorSpace(name: CGColorSpace.sRGB)].compactMap { $0 }
    for space in spaces {
        guard
            let context = CGContext(
                data: nil, width: width, height: height, bitsPerComponent: 8, bytesPerRow: 0, space: space,
                bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue)
        else { continue }
        context.interpolationQuality = .high
        context.draw(image, in: CGRect(x: 0, y: 0, width: width, height: height))
        if let result = context.makeImage() { return result }
    }
    throw ToolError("cannot scale the still to \(width)x\(height)")
}

func writePNG(_ image: CGImage, to path: String) throws {
    let url = URL(fileURLWithPath: path)
    guard
        let destination = CGImageDestinationCreateWithURL(
            url as CFURL, UTType.png.identifier as CFString, 1, nil)
    else { throw ToolError("cannot create \(path)") }
    CGImageDestinationAddImage(destination, image, nil)
    guard CGImageDestinationFinalize(destination) else { throw ToolError("cannot write \(path)") }
}

func runFrame(_ raw: ArraySlice<String>) async throws {
    let args = try Args(raw, options: ["time", "out", "crop", "size"])
    guard args.positional.count == 1, let seconds = try args.double("time"), let out = args.string("out")
    else {
        throw ToolError("usage: herovideo frame <file> --time <seconds> --out <png> [--crop x,y,w,h] [--size WxH]")
    }
    let video = try await loadVideo(args.positional[0])
    guard seconds >= 0, seconds < video.duration.seconds else {
        throw ToolError("--time \(seconds) is outside the clip (0 to \(video.duration.seconds) s)")
    }
    let generator = AVAssetImageGenerator(asset: video.asset)
    generator.requestedTimeToleranceBefore = .zero
    generator.requestedTimeToleranceAfter = .zero
    generator.appliesPreferredTrackTransform = true
    let request = CMTime(seconds: seconds, preferredTimescale: 60000)
    let (still, actual) = try await generator.image(at: request)
    var image = still
    if let crop = try args.rect("crop") {
        guard crop.maxX <= CGFloat(image.width), crop.maxY <= CGFloat(image.height),
            let cropped = image.cropping(to: crop)
        else { throw ToolError("--crop is outside the \(image.width)x\(image.height) frame") }
        image = cropped
    }
    if let size = try args.size("size") {
        image = try scaled(image, width: size.width, height: size.height)
    }
    try writePNG(image, to: out)
    try printJSON([
        "out": out,
        "requestedSeconds": rounded(seconds, places: 4),
        "actualSeconds": rounded(actual.seconds, places: 4),
        "width": image.width,
        "height": image.height,
    ])
}

// MARK: - Crop / scale geometry shared by encode and compare

struct Geometry {
    /// Crop in upright source pixels, top-left origin.
    let crop: CGRect
    let width: Int
    let height: Int
    /// Maps the stored track picture onto the output frame.
    let transform: CGAffineTransform
    /// True when the output is a 1:1 cut-out of the source (no scaling, no rotation).
    let isPlainCrop: Bool
}

func makeGeometry(_ video: Video, crop requested: CGRect?, size: (width: Int, height: Int)?) throws -> Geometry {
    let full = CGRect(x: 0, y: 0, width: video.displayWidth, height: video.displayHeight)
    let crop = requested ?? full
    guard full.contains(crop) else {
        throw ToolError(
            "crop \(Int(crop.minX)),\(Int(crop.minY)),\(Int(crop.width)),\(Int(crop.height)) is outside the "
                + "\(video.displayWidth)x\(video.displayHeight) frame")
    }
    let width = size?.width ?? Int(crop.width)
    let height = size?.height ?? Int(crop.height)
    guard width % 2 == 0, height % 2 == 0 else {
        throw ToolError("output size \(width)x\(height) must have even width and height")
    }
    let scaleX = CGFloat(width) / crop.width
    let scaleY = CGFloat(height) / crop.height
    guard abs(scaleX - scaleY) / scaleX < 0.005 else {
        throw ToolError(
            "crop \(Int(crop.width))x\(Int(crop.height)) and output \(width)x\(height) have different shapes; "
                + "the picture would be stretched")
    }
    let transform = video.preferredTransform
        .concatenating(CGAffineTransform(translationX: -video.displayRect.minX, y: -video.displayRect.minY))
        .concatenating(CGAffineTransform(translationX: -crop.minX, y: -crop.minY))
        .concatenating(CGAffineTransform(scaleX: scaleX, y: scaleY))
    return Geometry(
        crop: crop, width: width, height: height, transform: transform,
        isPlainCrop: video.hasIdentityTransform && scaleX == 1 && scaleY == 1)
}

let workingPixelFormat = kCVPixelFormatType_420YpCbCr8BiPlanarVideoRange

/// Decodes the source and renders each output frame (cropped / scaled, 8-bit
/// BT.709 video range) at a fixed frame rate.
func makeRenderedOutput(_ video: Video, geometry: Geometry, fps: Int32) -> AVAssetReaderVideoCompositionOutput {
    let composition = AVMutableVideoComposition()
    composition.renderSize = CGSize(width: geometry.width, height: geometry.height)
    composition.frameDuration = CMTime(value: 1, timescale: fps)
    composition.colorPrimaries = AVVideoColorPrimaries_ITU_R_709_2
    composition.colorTransferFunction = AVVideoTransferFunction_ITU_R_709_2
    composition.colorYCbCrMatrix = AVVideoYCbCrMatrix_ITU_R_709_2
    let instruction = AVMutableVideoCompositionInstruction()
    instruction.timeRange = CMTimeRange(start: .zero, duration: video.duration)
    let layer = AVMutableVideoCompositionLayerInstruction(assetTrack: video.track)
    layer.setTransform(geometry.transform, at: .zero)
    instruction.layerInstructions = [layer]
    composition.instructions = [instruction]
    let output = AVAssetReaderVideoCompositionOutput(
        videoTracks: [video.track],
        videoSettings: [kCVPixelBufferPixelFormatTypeKey as String: workingPixelFormat])
    output.videoComposition = composition
    output.alwaysCopiesSampleData = false
    return output
}

// MARK: - Encoder selection

enum Codec: String {
    case h264, hevc
    var avType: AVVideoCodecType { self == .h264 ? .h264 : .hevc }
    var cmType: CMVideoCodecType { self == .h264 ? kCMVideoCodecType_H264 : kCMVideoCodecType_HEVC }
    /// The sample-entry tag the output must carry. Safari only plays HEVC tagged hvc1.
    var fourCC: String { self == .h264 ? "avc1" : "hvc1" }
}

enum EncoderMode: String {
    case auto, hardware, software

    /// What VideoToolbox is asked for. `hardware` fails instead of quietly
    /// falling back; `software` never touches the media engine.
    var specification: [String: Any] {
        switch self {
        case .auto: return [:]
        case .hardware: return [kVTVideoEncoderSpecification_RequireHardwareAcceleratedVideoEncoder as String: true]
        case .software: return [kVTVideoEncoderSpecification_EnableHardwareAcceleratedVideoEncoder as String: false]
        }
    }
}

enum RateControl: String {
    /// `variable` where the encoder offers it, otherwise `average`.
    case auto
    /// VBR (macOS 26+, hardware encoders): the encoder may spend more on the
    /// hard parts of the clip and less on the easy ones. Measured on the hero
    /// clip at matched file size this is 0.4-0.9 dB better than `average`, and
    /// it lands much closer to the requested rate.
    case variable
    /// The classic average-bit-rate target; works on every macOS and encoder.
    case average
}

func encoderList() -> [[String: Any]] {
    var list: CFArray?
    guard VTCopyVideoEncoderList(nil, &list) == noErr, let entries = list as? [[String: Any]] else { return [] }
    return entries
}

struct ResolvedEncoder {
    let id: String
    let name: String
    let hardware: Bool
    /// Names of the compression properties this encoder accepts.
    let properties: Set<String>

    var json: [String: Any] { ["id": id, "name": name, "hardware": hardware] }
}

/// Which encoder VideoToolbox picks for this codec, size and request.
func resolveEncoder(_ codec: Codec, width: Int, height: Int, mode: EncoderMode) -> ResolvedEncoder? {
    var encoderID: CFString?
    var supported: CFDictionary?
    let status = VTCopySupportedPropertyDictionaryForEncoder(
        width: Int32(width), height: Int32(height), codecType: codec.cmType,
        encoderSpecification: mode.specification as CFDictionary, encoderIDOut: &encoderID,
        supportedPropertiesOut: &supported)
    guard status == noErr, let id = encoderID as String? else { return nil }
    let entry = encoderList().first { ($0[kVTVideoEncoderList_EncoderID as String] as? String) == id }
    return ResolvedEncoder(
        id: id,
        name: (entry?[kVTVideoEncoderList_EncoderName as String] as? String) ?? id,
        hardware: (entry?[kVTVideoEncoderList_IsHardwareAccelerated as String] as? Bool) ?? false,
        properties: Set((supported as? [String: Any])?.keys.map { $0 } ?? []))
}

func runEncoders(_ raw: ArraySlice<String>) throws {
    let args = try Args(raw, options: [], switches: ["properties"])
    let wanted: Set<String> = ["avc1", "hvc1"]
    let entries: [[String: Any]] = encoderList().compactMap { entry -> [String: Any]? in
        guard let type = entry[kVTVideoEncoderList_CodecType as String] as? NSNumber else { return nil }
        let code = fourCC(type.uint32Value)
        guard wanted.contains(code) else { return nil }
        let id = (entry[kVTVideoEncoderList_EncoderID as String] as? String) ?? ""
        var info: [String: Any] = [
            "codec": code,
            "id": id,
            "name": (entry[kVTVideoEncoderList_EncoderName as String] as? String) ?? "",
            "hardware": (entry[kVTVideoEncoderList_IsHardwareAccelerated as String] as? Bool) ?? false,
        ]
        if args.has("properties") {
            var supported: CFDictionary?
            let status = VTCopySupportedPropertyDictionaryForEncoder(
                width: 1280, height: 720, codecType: type.uint32Value,
                encoderSpecification: [kVTVideoEncoderSpecification_EncoderID as String: id] as CFDictionary,
                encoderIDOut: nil, supportedPropertiesOut: &supported)
            if status == noErr, let dictionary = supported as? [String: Any] {
                info["properties"] = dictionary.keys.sorted()
            }
        }
        return info
    }
    try printJSON(["encoders": entries])
}

// MARK: - encode

/// Feeds the rendered frames to the writer as fast as it will take them.
final class EncodeJob: @unchecked Sendable {
    private let reader: AVAssetReader
    private let output: AVAssetReaderOutput
    private let writer: AVAssetWriter
    private let input: AVAssetWriterInput
    private let queue = DispatchQueue(label: "herovideo.encode")
    private var continuation: CheckedContinuation<Void, Error>?
    private(set) var frames = 0

    init(reader: AVAssetReader, output: AVAssetReaderOutput, writer: AVAssetWriter, input: AVAssetWriterInput) {
        self.reader = reader
        self.output = output
        self.writer = writer
        self.input = input
    }

    func run() async throws {
        try await withCheckedThrowingContinuation { (continuation: CheckedContinuation<Void, Error>) in
            queue.async {
                self.continuation = continuation
                self.input.requestMediaDataWhenReady(on: self.queue) { self.pump() }
            }
        }
    }

    private func pump() {
        while continuation != nil, input.isReadyForMoreMediaData {
            guard let sample = output.copyNextSampleBuffer() else {
                input.markAsFinished()
                if reader.status == .completed {
                    finish(nil)
                } else {
                    finish(ToolError("decoding the source stopped early: \(reader.error.map(describe) ?? "unknown error")"))
                }
                return
            }
            guard input.append(sample) else {
                input.markAsFinished()
                finish(ToolError("the encoder refused a frame: \(writer.error.map(describe) ?? "unknown error")"))
                return
            }
            frames += 1
        }
    }

    private func finish(_ error: Error?) {
        guard let continuation else { return }
        self.continuation = nil
        if let error { continuation.resume(throwing: error) } else { continuation.resume() }
    }
}

/// AVAssetWriter moves the index to the front by writing the file twice. Run
/// from a sandboxed shell it leaves the first copy behind as
/// "<name>.sb-<id>-<random>"; nothing else in the folder is touched.
func removeWriterLeftovers(for output: URL) {
    let folder = output.deletingLastPathComponent()
    let prefix = output.lastPathComponent + ".sb-"
    let names = (try? FileManager.default.contentsOfDirectory(atPath: folder.path)) ?? []
    for name in names where name.hasPrefix(prefix) {
        try? FileManager.default.removeItem(at: folder.appendingPathComponent(name))
    }
}

func runEncode(_ raw: ArraySlice<String>) async throws {
    let usage =
        "usage: herovideo encode <in> <out.mp4> --codec h264|hevc --bitrate <bits/s> [--crop x,y,w,h] [--size WxH] "
        + "[--fps 30] [--keyint 60] [--encoder auto|hardware|software] [--rate-control auto|variable|average]"
    let args = try Args(raw, options: ["codec", "bitrate", "crop", "size", "fps", "keyint", "encoder", "rate-control"])
    guard args.positional.count == 2, let codecName = args.string("codec"), let bitrate = try args.int("bitrate")
    else { throw ToolError(usage) }
    guard let codec = Codec(rawValue: codecName) else { throw ToolError("--codec must be h264 or hevc") }
    guard let mode = EncoderMode(rawValue: args.string("encoder") ?? "auto") else {
        throw ToolError("--encoder must be auto, hardware or software")
    }
    guard let requestedRateControl = RateControl(rawValue: args.string("rate-control") ?? "auto") else {
        throw ToolError("--rate-control must be auto, variable or average")
    }
    let fps = Int32(try args.int("fps") ?? 30)
    let keyint = try args.int("keyint") ?? 60
    guard bitrate >= 50_000, bitrate <= 100_000_000, fps >= 1, fps <= 120, keyint >= 1 else {
        throw ToolError("--bitrate, --fps or --keyint is out of range")
    }

    let inputURL = URL(fileURLWithPath: args.positional[0]).standardizedFileURL.resolvingSymlinksInPath()
    let outputURL = URL(fileURLWithPath: args.positional[1]).standardizedFileURL.resolvingSymlinksInPath()
    guard inputURL.path != outputURL.path else { throw ToolError("refusing to write over the source file") }
    guard outputURL.pathExtension.lowercased() == "mp4" else { throw ToolError("the output must be an .mp4 file") }

    let started = Date()
    let video = try await loadVideo(inputURL.path)
    let geometry = try makeGeometry(video, crop: try args.rect("crop"), size: try args.size("size"))
    let expectedFrames = Int((video.duration.seconds * Double(fps)).rounded())

    guard let encoder = resolveEncoder(codec, width: geometry.width, height: geometry.height, mode: mode) else {
        throw ToolError("no \(mode.rawValue) \(codec.rawValue) encoder is available on this Mac")
    }

    // Rate control: VBR when the encoder has it, the plain average target otherwise.
    var variableKeys: (rate: String, ceiling: String, window: String)?
    if #available(macOS 26.0, *) {
        let keys = (
            rate: kVTCompressionPropertyKey_VariableBitRate as String,
            ceiling: kVTCompressionPropertyKey_VBVMaxBitRate as String,
            window: kVTCompressionPropertyKey_VBVBufferDuration as String
        )
        if [keys.rate, keys.ceiling, keys.window].allSatisfy(encoder.properties.contains) { variableKeys = keys }
    }
    if requestedRateControl == .variable, variableKeys == nil {
        throw ToolError("\(encoder.name) has no variable-bit-rate mode on this macOS; use --rate-control average")
    }
    let rateControl: RateControl = requestedRateControl == .average || variableKeys == nil ? .average : .variable

    var compression: [String: Any] = [
        AVVideoMaxKeyFrameIntervalKey: keyint,
        AVVideoAllowFrameReorderingKey: true,
        AVVideoExpectedSourceFrameRateKey: Int(fps),
    ]
    switch codec {
    case .h264:
        compression[AVVideoProfileLevelKey] = AVVideoProfileLevelH264HighAutoLevel
        compression[AVVideoH264EntropyModeKey] = AVVideoH264EntropyModeCABAC
    case .hevc:
        compression[AVVideoProfileLevelKey] = kVTProfileLevel_HEVC_Main_AutoLevel as String
    }
    if let keys = variableKeys, rateControl == .variable {
        // The shape of Apple's own "high quality" encoder preset: a ceiling of
        // 1.5x the target over a 4-second window. Look-ahead is left off: it
        // measured slightly worse on this kind of footage.
        compression[keys.rate] = bitrate
        compression[keys.ceiling] = bitrate + bitrate / 2
        compression[keys.window] = 4.0
    } else {
        compression[AVVideoAverageBitRateKey] = bitrate
    }
    // Every keyframe a clean restart point (HEVC would otherwise use open GOPs).
    let closedGOPKey = kVTCompressionPropertyKey_AllowOpenGOP as String
    if encoder.properties.contains(closedGOPKey) { compression[closedGOPKey] = false }
    let speedKey = kVTCompressionPropertyKey_PrioritizeEncodingSpeedOverQuality as String
    if encoder.properties.contains(speedKey) { compression[speedKey] = false }

    var settings: [String: Any] = [
        AVVideoCodecKey: codec.avType.rawValue,
        AVVideoWidthKey: geometry.width,
        AVVideoHeightKey: geometry.height,
        AVVideoColorPropertiesKey: [
            AVVideoColorPrimariesKey: AVVideoColorPrimaries_ITU_R_709_2,
            AVVideoTransferFunctionKey: AVVideoTransferFunction_ITU_R_709_2,
            AVVideoYCbCrMatrixKey: AVVideoYCbCrMatrix_ITU_R_709_2,
        ],
        AVVideoCompressionPropertiesKey: compression,
    ]
    if !mode.specification.isEmpty { settings[AVVideoEncoderSpecificationKey] = mode.specification }

    // Source frames, rendered to the output size.
    let reader = try AVAssetReader(asset: video.asset)
    let rendered = makeRenderedOutput(video, geometry: geometry, fps: fps)
    guard reader.canAdd(rendered) else { throw ToolError("cannot decode \(video.path)") }
    reader.add(rendered)

    // Encoder + MP4 writer.
    try? FileManager.default.removeItem(at: outputURL)
    func discardOutput() {
        try? FileManager.default.removeItem(at: outputURL)
        removeWriterLeftovers(for: outputURL)
    }
    let writer = try AVAssetWriter(outputURL: outputURL, fileType: .mp4)
    writer.shouldOptimizeForNetworkUse = true
    guard writer.canApply(outputSettings: settings, forMediaType: .video) else {
        throw ToolError("\(encoder.name) does not accept these \(codec.rawValue) settings for an MP4 file")
    }
    let input = AVAssetWriterInput(mediaType: .video, outputSettings: settings)
    input.expectsMediaDataInRealTime = false
    input.mediaTimeScale = CMTimeScale(fps) * 1000
    guard writer.canAdd(input) else { throw ToolError("cannot add the video track to the output") }
    writer.add(input)

    guard reader.startReading() else {
        throw ToolError("cannot decode \(video.path): \(reader.error.map(describe) ?? "unknown error")")
    }
    guard writer.startWriting() else {
        discardOutput()
        throw ToolError("cannot start writing: \(writer.error.map(describe) ?? "unknown error")")
    }
    writer.startSession(atSourceTime: .zero)

    let job = EncodeJob(reader: reader, output: rendered, writer: writer, input: input)
    do {
        try await job.run()
    } catch {
        reader.cancelReading()
        writer.cancelWriting()
        discardOutput()
        throw error
    }
    writer.endSession(atSourceTime: CMTime(value: CMTimeValue(job.frames), timescale: fps))
    await writer.finishWriting()
    removeWriterLeftovers(for: outputURL)
    guard writer.status == .completed else {
        discardOutput()
        throw ToolError("writing failed: \(writer.error.map(describe) ?? "unknown error")")
    }

    // Read the result back. Anything that would not play everywhere is a failed build, not a file.
    do {
        guard job.frames == expectedFrames else {
            throw ToolError("encoded \(job.frames) frames, expected \(expectedFrames)")
        }
        let boxes = try topLevelBoxes(atPath: outputURL.path)
        guard moovPrecedesMdat(boxes) else {
            throw ToolError("the output is not fast-start (moov does not precede mdat)")
        }
        let written = try await loadVideo(outputURL.path)
        let tag = fourCC(CMFormatDescriptionGetMediaSubType(written.formatDescription))
        guard tag == codec.fourCC else { throw ToolError("the output is tagged \(tag), expected \(codec.fourCC)") }
        guard written.displayWidth == geometry.width, written.displayHeight == geometry.height else {
            throw ToolError("the output is \(written.displayWidth)x\(written.displayHeight), expected \(geometry.width)x\(geometry.height)")
        }
        guard written.audioTrackCount == 0 else { throw ToolError("the output has an audio track") }
        let attributes = try FileManager.default.attributesOfItem(atPath: outputURL.path)
        var result: [String: Any] = [
            "out": outputURL.path,
            "bytes": (attributes[.size] as? NSNumber)?.intValue ?? 0,
            "frames": job.frames,
            "requestedBitrate": bitrate,
            "rateControl": rateControl.rawValue,
            "keyframeInterval": keyint,
            "width": geometry.width,
            "height": geometry.height,
            "crop": [Int(geometry.crop.minX), Int(geometry.crop.minY), Int(geometry.crop.width), Int(geometry.crop.height)],
            "fourcc": tag,
            "encoderRequest": mode.rawValue,
            "encoder": encoder.json,
            "topLevelBoxes": boxes.map { $0.type },
            "seconds": rounded(Date().timeIntervalSince(started), places: 2),
        ]
        if let codecString = rfc6381(written.formatDescription) { result["codec"] = codecString }
        try printJSON(result)
    } catch {
        discardOutput()
        throw error
    }
}

// MARK: - compare (objective quality: PSNR and SSIM on the luma plane)

struct Luma {
    let width: Int
    let height: Int
    var pixels: [UInt8]
}

func luma(of sample: CMSampleBuffer, crop: CGRect?) throws -> Luma {
    guard let buffer = CMSampleBufferGetImageBuffer(sample) else { throw ToolError("a decoded frame has no picture") }
    CVPixelBufferLockBaseAddress(buffer, .readOnly)
    defer { CVPixelBufferUnlockBaseAddress(buffer, .readOnly) }
    guard let base = CVPixelBufferGetBaseAddressOfPlane(buffer, 0) else { throw ToolError("cannot read a decoded frame") }
    let stride = CVPixelBufferGetBytesPerRowOfPlane(buffer, 0)
    let planeWidth = CVPixelBufferGetWidthOfPlane(buffer, 0)
    let planeHeight = CVPixelBufferGetHeightOfPlane(buffer, 0)
    let x = Int(crop?.minX ?? 0)
    let y = Int(crop?.minY ?? 0)
    let width = Int(crop?.width ?? CGFloat(planeWidth))
    let height = Int(crop?.height ?? CGFloat(planeHeight))
    guard x + width <= planeWidth, y + height <= planeHeight else { throw ToolError("crop is outside a decoded frame") }
    var pixels = [UInt8](repeating: 0, count: width * height)
    pixels.withUnsafeMutableBytes { destination in
        for row in 0..<height {
            memcpy(destination.baseAddress! + row * width, base + (y + row) * stride + x, width)
        }
    }
    return Luma(width: width, height: height, pixels: pixels)
}

func psnr(_ a: Luma, _ b: Luma) -> Double {
    var sum: UInt64 = 0
    a.pixels.withUnsafeBufferPointer { pa in
        b.pixels.withUnsafeBufferPointer { pb in
            for index in 0..<pa.count {
                let difference = Int(pa[index]) - Int(pb[index])
                sum += UInt64(difference * difference)
            }
        }
    }
    guard sum > 0 else { return 100 }
    let mse = Double(sum) / Double(a.pixels.count)
    return min(100, 10 * log10(255 * 255 / mse))
}

/// Structural similarity on 8x8 windows every 4 pixels (the x264 convention).
func ssim(_ a: Luma, _ b: Luma) -> Double {
    let c1 = (0.01 * 255) * (0.01 * 255)
    let c2 = (0.03 * 255) * (0.03 * 255)
    var total = 0.0
    var windows = 0
    a.pixels.withUnsafeBufferPointer { pa in
        b.pixels.withUnsafeBufferPointer { pb in
            var y = 0
            while y + 8 <= a.height {
                var x = 0
                while x + 8 <= a.width {
                    var sa = 0, sb = 0, saa = 0, sbb = 0, sab = 0
                    for row in 0..<8 {
                        let offset = (y + row) * a.width + x
                        for column in 0..<8 {
                            let va = Int(pa[offset + column])
                            let vb = Int(pb[offset + column])
                            sa += va
                            sb += vb
                            saa += va * va
                            sbb += vb * vb
                            sab += va * vb
                        }
                    }
                    let meanA = Double(sa) / 64
                    let meanB = Double(sb) / 64
                    let varianceA = Double(saa) / 64 - meanA * meanA
                    let varianceB = Double(sbb) / 64 - meanB * meanB
                    let covariance = Double(sab) / 64 - meanA * meanB
                    total += ((2 * meanA * meanB + c1) * (2 * covariance + c2))
                        / ((meanA * meanA + meanB * meanB + c1) * (varianceA + varianceB + c2))
                    windows += 1
                    x += 4
                }
                y += 4
            }
        }
    }
    return windows > 0 ? total / Double(windows) : 1
}

func runCompare(_ raw: ArraySlice<String>) async throws {
    let args = try Args(raw, options: ["crop", "fps"], switches: ["frames"])
    guard args.positional.count == 2 else {
        throw ToolError("usage: herovideo compare <reference> <test> [--crop x,y,w,h] [--fps 30] [--frames]")
    }
    let reference = try await loadVideo(args.positional[0])
    let test = try await loadVideo(args.positional[1])
    let fps = Int32(try args.int("fps") ?? 30)
    let geometry = try makeGeometry(
        reference, crop: try args.rect("crop"), size: (test.displayWidth, test.displayHeight))
    let decodeSettings: [String: Any] = [kCVPixelBufferPixelFormatTypeKey as String: workingPixelFormat]

    // Reference: the decoded source itself when the test is a 1:1 cut-out,
    // otherwise the source scaled exactly the way the encoder received it.
    let referenceReader = try AVAssetReader(asset: reference.asset)
    let referenceOutput: AVAssetReaderOutput
    let referenceCrop: CGRect?
    let referenceKind: String
    if geometry.isPlainCrop {
        referenceOutput = AVAssetReaderTrackOutput(track: reference.track, outputSettings: decodeSettings)
        referenceCrop = geometry.crop
        referenceKind = "decoded source pixels (1:1 crop)"
    } else {
        referenceOutput = makeRenderedOutput(reference, geometry: geometry, fps: fps)
        referenceCrop = nil
        referenceKind = "source scaled to the output size (what the encoder was given)"
    }
    referenceOutput.alwaysCopiesSampleData = false
    referenceReader.add(referenceOutput)

    let testReader = try AVAssetReader(asset: test.asset)
    let testOutput = AVAssetReaderTrackOutput(track: test.track, outputSettings: decodeSettings)
    testOutput.alwaysCopiesSampleData = false
    testReader.add(testOutput)

    guard referenceReader.startReading(), testReader.startReading() else {
        throw ToolError("cannot decode one of the two files")
    }

    var frames = 0
    var psnrSum = 0.0, psnrMin = Double.infinity, psnrMinFrame = 0
    var ssimSum = 0.0, ssimMin = Double.infinity, ssimMinFrame = 0
    var psnrEach: [NSDecimalNumber] = []
    var ssimEach: [NSDecimalNumber] = []
    while true {
        let a = referenceOutput.copyNextSampleBuffer()
        let b = testOutput.copyNextSampleBuffer()
        guard let a, let b else {
            guard a == nil, b == nil else {
                throw ToolError("the two files have a different number of frames (stopped after \(frames))")
            }
            break
        }
        let la = try luma(of: a, crop: referenceCrop)
        let lb = try luma(of: b, crop: nil)
        guard la.width == lb.width, la.height == lb.height else {
            throw ToolError("frame sizes differ: \(la.width)x\(la.height) vs \(lb.width)x\(lb.height)")
        }
        let p = psnr(la, lb)
        let s = ssim(la, lb)
        psnrSum += p
        ssimSum += s
        if p < psnrMin { psnrMin = p; psnrMinFrame = frames }
        if s < ssimMin { ssimMin = s; ssimMinFrame = frames }
        psnrEach.append(rounded(p, places: 2))
        ssimEach.append(rounded(s, places: 4))
        frames += 1
    }
    guard frames > 0 else { throw ToolError("no frames to compare") }
    guard referenceReader.status == .completed, testReader.status == .completed else {
        throw ToolError("decoding stopped early")
    }
    var result: [String: Any] = [
        "frames": frames,
        "reference": referenceKind,
        "psnrY": [
            "mean": rounded(psnrSum / Double(frames), places: 2),
            "min": rounded(psnrMin, places: 2),
            "minFrame": psnrMinFrame,
        ],
        "ssimY": [
            "mean": rounded(ssimSum / Double(frames), places: 4),
            "min": rounded(ssimMin, places: 4),
            "minFrame": ssimMinFrame,
        ],
    ]
    if args.has("frames") {
        result["psnrYFrames"] = psnrEach
        result["ssimYFrames"] = ssimEach
    }
    try printJSON(result)
}

// MARK: - Entry point

let usage = """
    herovideo — hero video helper (AVFoundation / VideoToolbox, macOS only)

      herovideo probe    <file>
      herovideo frame    <file> --time <seconds> --out <png> [--crop x,y,w,h] [--size WxH]
      herovideo encode   <in> <out.mp4> --codec h264|hevc --bitrate <bits/s> [--crop x,y,w,h] [--size WxH]
                         [--fps 30] [--keyint 60] [--encoder auto|hardware|software]
                         [--rate-control auto|variable|average]
      herovideo compare  <reference> <test> [--crop x,y,w,h] [--fps 30] [--frames]
      herovideo encoders [--properties]
    """

func run() async throws {
    let arguments = CommandLine.arguments
    guard arguments.count >= 2 else {
        FileHandle.standardError.write(Data((usage + "\n").utf8))
        exit(64)
    }
    let rest = arguments.dropFirst(2)
    switch arguments[1] {
    case "probe": try await runProbe(rest)
    case "frame": try await runFrame(rest)
    case "encode": try await runEncode(rest)
    case "compare": try await runCompare(rest)
    case "encoders": try runEncoders(rest)
    case "help", "--help", "-h": print(usage)
    default: throw ToolError("unknown command \"\(arguments[1])\"\n\n\(usage)")
    }
}

do {
    try await run()
} catch {
    FileHandle.standardError.write(Data("herovideo: \(describe(error))\n".utf8))
    exit(1)
}
