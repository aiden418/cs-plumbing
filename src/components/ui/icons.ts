/**
 * The site's icons, in one place. Every icon is a lucide-react icon drawn
 * with the design system's stroke (1.75) and hidden from assistive
 * technology: an icon always sits beside a text label that carries the
 * meaning (design-system.md section 4). Pass `strokeWidth`, `aria-hidden` or
 * any other lucide prop to override.
 *
 * Sizes: 20 px in text rows (`size-5`), 24 px standalone (`size-6`).
 *
 * Plain .ts with no hooks, so server and client components can both use it.
 */
import { createElement, type ComponentType } from "react";
import {
  AlertTriangle as LucideAlertTriangle,
  ArrowLeft as LucideArrowLeft,
  ArrowRight as LucideArrowRight,
  ArrowUpRight as LucideArrowUpRight,
  Award as LucideAward,
  BadgePercent as LucideBadgePercent,
  Briefcase as LucideBriefcase,
  Bug as LucideBug,
  Building2 as LucideBuilding2,
  Calculator as LucideCalculator,
  Calendar as LucideCalendar,
  CalendarCheck as LucideCalendarCheck,
  CalendarClock as LucideCalendarClock,
  Camera as LucideCamera,
  Check as LucideCheck,
  CheckCircle as LucideCheckCircle,
  ChevronDown as LucideChevronDown,
  ChevronLeft as LucideChevronLeft,
  ChevronRight as LucideChevronRight,
  ClipboardCheck as LucideClipboardCheck,
  Clock as LucideClock,
  DoorOpen as LucideDoorOpen,
  Download as LucideDownload,
  Droplets as LucideDroplets,
  ExternalLink as LucideExternalLink,
  FileCheck as LucideFileCheck,
  FileText as LucideFileText,
  Flame as LucideFlame,
  Fuel as LucideFuel,
  GraduationCap as LucideGraduationCap,
  Hammer as LucideHammer,
  HardHat as LucideHardHat,
  Home as LucideHome,
  ImageIcon as LucideImage,
  Landmark as LucideLandmark,
  Layers as LucideLayers,
  Mail as LucideMail,
  MapPin as LucideMapPin,
  Menu as LucideMenu,
  MessageSquareQuote as LucideMessageSquareQuote,
  MessageSquareText as LucideMessageSquareText,
  Minus as LucideMinus,
  PenLine as LucidePenLine,
  Phone as LucidePhone,
  Plug as LucidePlug,
  Plus as LucidePlus,
  Printer as LucidePrinter,
  RotateCcw as LucideRotateCcw,
  Send as LucideSend,
  Shield as LucideShield,
  ShieldCheck as LucideShieldCheck,
  ShieldPlus as LucideShieldPlus,
  ShowerHead as LucideShowerHead,
  Star as LucideStar,
  Sun as LucideSun,
  Tag as LucideTag,
  ThumbsUp as LucideThumbsUp,
  TreePine as LucideTreePine,
  Trophy as LucideTrophy,
  Upload as LucideUpload,
  Users as LucideUsers,
  Vote as LucideVote,
  Warehouse as LucideWarehouse,
  Wrench as LucideWrench,
  X as LucideX,
  Zap as LucideZap,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

/** The stroke every icon on the site is drawn with. */
export const ICON_STROKE = 1.75;

export type IconProps = LucideProps;
export type Icon = ComponentType<IconProps>;

/** Wrap a lucide icon so it defaults to the site's stroke and aria-hidden. */
export function withSiteStroke(icon: LucideIcon, name: string): Icon {
  function SiteIcon(props: IconProps) {
    return createElement(icon, { strokeWidth: ICON_STROKE, "aria-hidden": true, ...props });
  }
  SiteIcon.displayName = name;
  return SiteIcon;
}

export const AlertTriangle = withSiteStroke(LucideAlertTriangle, "AlertTriangle");
export const ArrowLeft = withSiteStroke(LucideArrowLeft, "ArrowLeft");
export const ArrowRight = withSiteStroke(LucideArrowRight, "ArrowRight");
export const ArrowUpRight = withSiteStroke(LucideArrowUpRight, "ArrowUpRight");
export const Award = withSiteStroke(LucideAward, "Award");
export const BadgePercent = withSiteStroke(LucideBadgePercent, "BadgePercent");
export const Briefcase = withSiteStroke(LucideBriefcase, "Briefcase");
export const Bug = withSiteStroke(LucideBug, "Bug");
export const Building2 = withSiteStroke(LucideBuilding2, "Building2");
export const Calculator = withSiteStroke(LucideCalculator, "Calculator");
export const Calendar = withSiteStroke(LucideCalendar, "Calendar");
export const CalendarCheck = withSiteStroke(LucideCalendarCheck, "CalendarCheck");
export const CalendarClock = withSiteStroke(LucideCalendarClock, "CalendarClock");
export const Camera = withSiteStroke(LucideCamera, "Camera");
export const Check = withSiteStroke(LucideCheck, "Check");
export const CheckCircle = withSiteStroke(LucideCheckCircle, "CheckCircle");
export const ChevronDown = withSiteStroke(LucideChevronDown, "ChevronDown");
export const ChevronLeft = withSiteStroke(LucideChevronLeft, "ChevronLeft");
export const ChevronRight = withSiteStroke(LucideChevronRight, "ChevronRight");
export const ClipboardCheck = withSiteStroke(LucideClipboardCheck, "ClipboardCheck");
export const Clock = withSiteStroke(LucideClock, "Clock");
export const DoorOpen = withSiteStroke(LucideDoorOpen, "DoorOpen");
export const Download = withSiteStroke(LucideDownload, "Download");
export const Droplets = withSiteStroke(LucideDroplets, "Droplets");
export const ExternalLink = withSiteStroke(LucideExternalLink, "ExternalLink");
export const FileCheck = withSiteStroke(LucideFileCheck, "FileCheck");
export const FileText = withSiteStroke(LucideFileText, "FileText");
export const Flame = withSiteStroke(LucideFlame, "Flame");
export const Fuel = withSiteStroke(LucideFuel, "Fuel");
export const GraduationCap = withSiteStroke(LucideGraduationCap, "GraduationCap");
export const Hammer = withSiteStroke(LucideHammer, "Hammer");
export const HardHat = withSiteStroke(LucideHardHat, "HardHat");
export const Home = withSiteStroke(LucideHome, "Home");
export const ImageIcon = withSiteStroke(LucideImage, "ImageIcon");
export const Landmark = withSiteStroke(LucideLandmark, "Landmark");
export const Layers = withSiteStroke(LucideLayers, "Layers");
export const Mail = withSiteStroke(LucideMail, "Mail");
export const MapPin = withSiteStroke(LucideMapPin, "MapPin");
export const Menu = withSiteStroke(LucideMenu, "Menu");
export const MessageSquareQuote = withSiteStroke(LucideMessageSquareQuote, "MessageSquareQuote");
export const MessageSquareText = withSiteStroke(LucideMessageSquareText, "MessageSquareText");
export const Minus = withSiteStroke(LucideMinus, "Minus");
export const PenLine = withSiteStroke(LucidePenLine, "PenLine");
export const Phone = withSiteStroke(LucidePhone, "Phone");
export const Plug = withSiteStroke(LucidePlug, "Plug");
export const Plus = withSiteStroke(LucidePlus, "Plus");
export const Printer = withSiteStroke(LucidePrinter, "Printer");
export const RotateCcw = withSiteStroke(LucideRotateCcw, "RotateCcw");
export const Send = withSiteStroke(LucideSend, "Send");
export const Shield = withSiteStroke(LucideShield, "Shield");
export const ShieldCheck = withSiteStroke(LucideShieldCheck, "ShieldCheck");
export const ShieldPlus = withSiteStroke(LucideShieldPlus, "ShieldPlus");
export const ShowerHead = withSiteStroke(LucideShowerHead, "ShowerHead");
export const Star = withSiteStroke(LucideStar, "Star");
export const Sun = withSiteStroke(LucideSun, "Sun");
export const Tag = withSiteStroke(LucideTag, "Tag");
export const ThumbsUp = withSiteStroke(LucideThumbsUp, "ThumbsUp");
export const TreePine = withSiteStroke(LucideTreePine, "TreePine");
export const Trophy = withSiteStroke(LucideTrophy, "Trophy");
export const Upload = withSiteStroke(LucideUpload, "Upload");
export const Users = withSiteStroke(LucideUsers, "Users");
export const Vote = withSiteStroke(LucideVote, "Vote");
export const Warehouse = withSiteStroke(LucideWarehouse, "Warehouse");
export const Wrench = withSiteStroke(LucideWrench, "Wrench");
export const X = withSiteStroke(LucideX, "X");
export const Zap = withSiteStroke(LucideZap, "Zap");
