import { NextResponse } from "next/server";
import { CLAIMS } from "@/lib/claims";
import { Resend } from "resend";
import { z } from "zod";
import { BUSINESS } from "@/lib/constants";
import { randomUUID } from "node:crypto";
import {
  ADMIN_EMAIL,
  escapeHtml,
  getClientIp,
  isHoneypotTripped,
  rateLimit,
  sendEmailBestEffort,
  sendEmailOrThrow,
  SMS_TO,
  tooManyRequests,
} from "@/lib/api/secure";
import {
  blobStoreIdFromToken,
  formatBytes,
  isPlanBlobUrl,
  PLAN_ATTACH_MB,
  PLAN_SIZE_MB,
  PLAN_TOTAL_MB,
  PLAN_UPLOAD,
  type PlanFileRef,
} from "@/lib/plan-upload";

// Plan sets never travel through this function: the browser uploads them to
// Vercel Blob first (src/lib/upload-plans.ts, /api/builder-portal/upload) and
// posts their URLs here as JSON. Fetching up to PLAN_ATTACH_MB of plans back
// from Blob and handing them to Resend needs more than the default budget.
export const maxDuration = 60;

const PlanFileSchema = z.object({
  url: z.string().max(600),
  name: z.string().trim().min(1).max(200),
  size: z.number().int().nonnegative(),
});

// Shared by the full Builder Portal wizard and the short "Submit plans for a
// bid" form on /builders and the new-construction city pages. The short form
// sends a community instead of a street address and may skip the description,
// so one of address/community is required rather than address alone.
const BuilderPortalSchema = z
  .object({
    name: z.string().min(2).max(100),
    company: z.string().min(2).max(150),
    email: z.string().email().max(200),
    phone: z.string().min(7).max(30),
    address: z.string().max(300).optional().default(""),
    community: z.string().max(150).optional().default(""),
    projectType: z.string().min(2).max(120).optional().default("Residential New Construction"),
    units: z.string().max(40).optional().default(""),
    sqft: z.string().max(40).optional().default(""),
    startDate: z.string().max(40).optional().default(""),
    budget: z.string().max(60).optional().default(""),
    description: z.string().max(5000).optional().default(""),
    // Which form/page sent it (e.g. "builders-hub", "nc-city:cape-coral").
    source: z.string().max(80).optional().default("builder-portal"),
    website: z.string().optional(),
    // Plan files already uploaded to Blob; checked against our store below.
    files: z.array(PlanFileSchema).max(PLAN_UPLOAD.maxFiles).optional().default([]),
  })
  .refine((d) => d.address.trim().length >= 5 || d.community.trim().length >= 2, {
    message: "address or community required",
  });

type PlanFile = PlanFileRef & { status: "attached" | "link-only" | "unavailable" };
/** Resend attachment: base64 content, the API's documented wire format. */
type Attachment = { filename: string; content: string };

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rl = rateLimit(ip);
    if (!rl.ok) return tooManyRequests(rl.retryAfter);

    // A multipart body comes from a tab that loaded the site before plans
    // moved to Blob; its files would never fit through a Vercel Function.
    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Please reload the page and try again.", code: "attachments" },
        { status: 400 }
      );
    }

    let raw: unknown;
    try {
      raw = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
    }
    const parsed = BuilderPortalSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
    }
    const { name, company, email, phone, community, projectType, units, sqft, startDate, budget, description, source, website, files } =
      parsed.data;
    const address = parsed.data.address.trim() || `${community} (community)`;

    if (isHoneypotTripped(website)) {
      return NextResponse.json({ success: true });
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "Email service unavailable. Please call 833-PLUMB-IT." },
        { status: 500 }
      );
    }
    const resend = new Resend(process.env.RESEND_API_KEY);

    const checked = checkPlanFiles(files);
    if ("error" in checked) {
      // code lets the form show this message verbatim (it is written for the builder).
      return NextResponse.json({ error: checked.error, code: "attachments" }, { status: 400 });
    }
    const plans = await collectPlanAttachments(checked.files);
    const fileCount = plans.files.length;

    const safe = {
      name: escapeHtml(name),
      company: escapeHtml(company),
      email: escapeHtml(email),
      phone: escapeHtml(phone),
      address: escapeHtml(address),
      community: escapeHtml(community),
      source: escapeHtml(source),
      projectType: escapeHtml(projectType),
      units: escapeHtml(units),
      sqft: escapeHtml(sqft),
      startDate: escapeHtml(startDate),
      budget: escapeHtml(budget),
      description: escapeHtml(description),
    };

    // Build HTML email
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1B2B4B; padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #fff; margin: 0; font-size: 20px;">
            New Builder Quote Request
          </h1>
          <p style="color: #94a3b8; margin: 4px 0 0; font-size: 14px;">
            ${safe.company} &mdash; ${safe.projectType}
          </p>
        </div>

        <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0;">
          <h2 style="font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px;">
            Contact Info
          </h2>
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tr><td style="padding: 4px 0; color: #64748b;">Name</td><td style="padding: 4px 0; font-weight: 600;">${safe.name}</td></tr>
            <tr><td style="padding: 4px 0; color: #64748b;">Company</td><td style="padding: 4px 0; font-weight: 600;">${safe.company}</td></tr>
            <tr><td style="padding: 4px 0; color: #64748b;">Email</td><td style="padding: 4px 0;"><a href="mailto:${safe.email}">${safe.email}</a></td></tr>
            <tr><td style="padding: 4px 0; color: #64748b;">Phone</td><td style="padding: 4px 0;"><a href="tel:${safe.phone}">${safe.phone}</a></td></tr>
          </table>
        </div>

        <div style="background: #fff; padding: 24px; border: 1px solid #e2e8f0; border-top: 0;">
          <h2 style="font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px;">
            Project Details
          </h2>
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tr><td style="padding: 4px 0; color: #64748b;">Address</td><td style="padding: 4px 0; font-weight: 600;">${safe.address}</td></tr>
            ${community ? `<tr><td style="padding: 4px 0; color: #64748b;">Community</td><td style="padding: 4px 0; font-weight: 600;">${safe.community}</td></tr>` : ""}
            <tr><td style="padding: 4px 0; color: #64748b;">Type</td><td style="padding: 4px 0; font-weight: 600;">${safe.projectType}</td></tr>
            ${units ? `<tr><td style="padding: 4px 0; color: #64748b;">Units</td><td style="padding: 4px 0;">${safe.units}</td></tr>` : ""}
            ${sqft ? `<tr><td style="padding: 4px 0; color: #64748b;">Sq Ft</td><td style="padding: 4px 0;">${safe.sqft}</td></tr>` : ""}
            ${startDate ? `<tr><td style="padding: 4px 0; color: #64748b;">Start Date</td><td style="padding: 4px 0;">${safe.startDate}</td></tr>` : ""}
            ${budget ? `<tr><td style="padding: 4px 0; color: #64748b;">Budget</td><td style="padding: 4px 0;">${safe.budget}</td></tr>` : ""}
          </table>
          <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 14px; color: #64748b; margin: 0 0 4px;">Description</p>
            <p style="font-size: 14px; margin: 0; white-space: pre-wrap;">${safe.description || "—"}</p>
            <p style="font-size: 12px; color: #94a3b8; margin: 12px 0 0;">Source: ${safe.source}</p>
          </div>
        </div>

        <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: 0; border-radius: 0 0 12px 12px;">
          <h2 style="font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px;">
            Plan Files
          </h2>
          ${planFilesHtml(plans.files)}
        </div>
      </div>
    `;

    // Send to business. Resend reports a rejected send as a result, not an
    // exception, so this goes through sendEmailOrThrow.
    const adminEmailId = await sendEmailOrThrow(
      resend,
      {
        from: "C&S Plumbing Website <bookings@csplumbinglee.com>",
        to: [ADMIN_EMAIL],
        replyTo: email,
        subject: `Builder Quote Request: ${company} — ${projectType} at ${address}`,
        html,
        ...(plans.attachments.length > 0 && { attachments: plans.attachments }),
      },
      "builder portal admin email"
    );

    // SMS notification
    if (SMS_TO) {
      const smsText = `New builder quote: ${company} - ${projectType} at ${address}. ${fileCount} files${fileCount > 0 ? " (links in email)" : ""}. Phone: ${phone}`;
      await sendEmailBestEffort(
        resend,
        {
          from: "C&S Plumbing Website <bookings@csplumbinglee.com>",
          to: [SMS_TO],
          subject: "Builder Quote Request",
          text: smsText.slice(0, 160),
        },
        "builder portal SMS notification"
      );
    }

    // Submitter confirmation — the portal promises "You'll get a confirmation
    // email immediately", so send one. A failure here must not fail the whole
    // submission (the admin lead email already went through).
    await sendEmailBestEffort(
      resend,
      {
        from: "C&S Plumbing of Lee <bookings@csplumbinglee.com>",
        to: [email],
        subject: "We received your quote request — C&S Plumbing",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0A0A0F; padding: 20px; text-align: center;">
            <h1 style="color: #0099FF; margin: 0;">Quote Request Received</h1>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <p>Hi ${escapeHtml(name)},</p>
            <p>Thanks for sending your project to C&S Plumbing. ${CLAIMS.bidAcknowledgement}</p>
            <div style="background: #fff; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <p style="margin: 4px 0;"><strong>Company:</strong> ${escapeHtml(company)}</p>
              <p style="margin: 4px 0;"><strong>Project:</strong> ${escapeHtml(projectType)}</p>
              <p style="margin: 4px 0;"><strong>Address:</strong> ${escapeHtml(address)}</p>
              <p style="margin: 4px 0;"><strong>Files received:</strong> ${fileCount}${fileCount > 0 ? ` (${plans.files.map((f) => escapeHtml(f.name)).join(", ")})` : ""}</p>
            </div>
            <p style="color: #666; font-size: 14px;">
              Questions? Call us at <a href="tel:${BUSINESS.phoneRaw}" style="color: #0099FF;">${BUSINESS.phone}</a>.
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 20px;">
              ${BUSINESS.fullName} &middot; ${BUSINESS.address}, ${BUSINESS.city}, ${BUSINESS.state} ${BUSINESS.zip}
            </p>
          </div>
        </div>`,
      },
      "builder portal confirmation email"
    );

    // No PII in logs; the Resend id is enough to trace a lead in the Resend dashboard.
    console.log(
      `Builder lead accepted (source=${source}, files=${fileCount}, attached=${plans.attachments.length}, resend id ${adminEmailId})`
    );

    // Id for the browser's builder_lead event (Meta custom event + dataLayer).
    // Builder leads are intentionally not sent to the OpenAI CAPI as
    // lead_created — they'd be counted as homeowner leads.
    return NextResponse.json({ success: true, eventId: randomUUID() });
  } catch (error) {
    console.error("Builder portal error:", error);
    return NextResponse.json(
      { error: "Failed to submit. Please call 833-PLUMB-IT." },
      { status: 500 }
    );
  }
}

/**
 * Accept only files that could have come through our token route: public
 * blobs in our own store, under the plan folder, within the published limits.
 * Messages are written for the builder; the form shows them verbatim.
 */
function checkPlanFiles(files: PlanFileRef[]): { files: PlanFileRef[] } | { error: string } {
  if (files.length === 0) return { files };
  const storeId = blobStoreIdFromToken(process.env.BLOB_READ_WRITE_TOKEN);
  if (!storeId) {
    // Nothing legitimate can have been uploaded without the token.
    return {
      error: `File uploads are unavailable right now. Please send your request without files and email your plans to ${BUSINESS.email}.`,
    };
  }
  const bad = files.find((f) => !isPlanBlobUrl(f.url, storeId));
  if (bad) {
    return {
      error: `${bad.name} could not be verified. Please remove it and upload it again, or email your plans to ${BUSINESS.email}.`,
    };
  }
  const tooLarge = files.find((f) => f.size > PLAN_UPLOAD.maxBytesEach);
  if (tooLarge) {
    return { error: `${tooLarge.name} is larger than ${PLAN_SIZE_MB} MB. Please email it to ${BUSINESS.email}.` };
  }
  const total = files.reduce((sum, f) => sum + f.size, 0);
  if (total > PLAN_UPLOAD.maxBytesTotal) {
    return {
      error: `Your plan set adds up to more than ${PLAN_TOTAL_MB} MB. Please remove a file, or email the full set to ${BUSINESS.email}.`,
    };
  }
  return { files };
}

/**
 * Attach the files when the whole set fits the attachment budget; otherwise
 * the office gets links only. A file that cannot be fetched is linked, never
 * a reason to lose the lead.
 */
async function collectPlanAttachments(
  files: PlanFileRef[]
): Promise<{ files: PlanFile[]; attachments: Attachment[] }> {
  const declaredTotal = files.reduce((sum, f) => sum + f.size, 0);
  const attach = declaredTotal <= PLAN_UPLOAD.attachBytesTotal;
  const out: PlanFile[] = [];
  const attachments: Attachment[] = [];
  let attachedBytes = 0;
  for (const file of files) {
    if (!attach) {
      out.push({ ...file, status: "link-only" });
      continue;
    }
    // The declared size came from the browser; the budget is enforced on
    // the bytes actually received.
    const bytes = await fetchPlanBlob(file.url, PLAN_UPLOAD.attachBytesTotal - attachedBytes);
    if (!bytes) {
      out.push({ ...file, status: "unavailable" });
      continue;
    }
    attachedBytes += bytes.byteLength;
    attachments.push({
      filename: file.name.replace(/[^\w.\-() ]+/g, "_").slice(0, 120),
      content: bytes.toString("base64"),
    });
    out.push({ ...file, status: "attached" });
  }
  return { files: out, attachments };
}

/** Fetch a blob from our store, giving up past maxBytes. Null on any failure. */
async function fetchPlanBlob(url: string, maxBytes: number): Promise<Buffer | null> {
  if (maxBytes <= 0) return null;
  try {
    const res = await fetch(url, {
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok || !res.body) return null;
    const declared = Number(res.headers.get("content-length") ?? "0");
    if (!Number.isFinite(declared) || declared > maxBytes) return null;
    const chunks: Uint8Array[] = [];
    let received = 0;
    const reader = res.body.getReader();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value.byteLength;
      if (received > maxBytes) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
    return Buffer.concat(chunks);
  } catch (error) {
    console.error("Builder portal: could not fetch a plan file for attachment:", error);
    return null;
  }
}

/** Attribute-safe URL: the URL was validated to plain characters, but never trust it raw. */
const attr = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function planFilesHtml(files: PlanFile[]): string {
  if (files.length === 0) return `<p style="font-size: 14px; margin: 0;">No files uploaded</p>`;
  const attached = files.filter((f) => f.status === "attached").length;
  const summary =
    attached === files.length
      ? `${files.length} file${files.length !== 1 ? "s" : ""} attached to this email.`
      : files.every((f) => f.status === "link-only")
        ? `${files.length} file${files.length !== 1 ? "s" : ""}, sent as links: the set is over the ${PLAN_ATTACH_MB} MB attachment limit.`
        : `${attached} of ${files.length} files attached; use the links for the rest.`;
  const status = (f: PlanFile) =>
    f.status === "attached"
      ? "attached"
      : f.status === "link-only"
        ? "link only"
        : "could not be attached, use the link";
  const rows = files
    .map(
      (f) =>
        `<li style="margin: 0 0 6px;"><a href="${attr(f.url)}" style="color: #1B2B4B;">${escapeHtml(f.name)}</a> (${formatBytes(f.size)}) &mdash; ${status(f)}</li>`
    )
    .join("");
  return `
          <p style="font-size: 14px; margin: 0 0 8px;">${summary}</p>
          <ul style="font-size: 14px; margin: 0; padding-left: 18px;">${rows}</ul>
          <p style="font-size: 12px; color: #94a3b8; margin: 12px 0 0;">Links work for ${PLAN_UPLOAD.ttlDays} days, then the files are deleted automatically. Save what you need to the job folder.</p>`;
}
