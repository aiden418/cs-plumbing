import { z } from "zod";

// Shared by the browser and API so every entry point collects a usable lead.
export const serviceRequestSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  phone: z.string().trim().max(30).refine((value) => {
    const digits = value.replace(/\D/g, "");
    return digits.length === 10 || (digits.length === 11 && digits.startsWith("1"));
  }, "Please enter a 10-digit phone number."),
  zip: z.string().trim().regex(/^\d{5}$/, "Please enter a 5-digit ZIP code."),
  service: z.string().trim().min(2, "Please select a service.").max(120),
  message: z.string().trim().max(5000).optional().default(""),
  source: z.string().max(40).optional(),
  sourcePath: z.string().max(200).optional(),
  website: z.string().optional(),
  // City utility (UEP) connection estimates: where the property is, the date
  // printed on the city's Notice of Availability, and what is being connected.
  address: z.string().trim().max(300).optional(),
  noticeDate: z.string().trim().max(40).optional(),
  utilities: z.string().trim().max(160).optional(),
  connectionStatus: z.string().trim().max(160).optional(),
  // One per filled-in form, repeated on every retry (src/lib/lead.ts).
  submissionKey: z.string().max(64).optional(),
  // A marked test visit (?cs_test=1). JSON sends a boolean, multipart a string.
  test: z.union([z.boolean(), z.string().max(8)]).optional(),
});

export const SERVICE_REQUEST_OPTIONS = [
  ["water-heater", "Water Heater"],
  ["repipe", "Whole-Home Repiping"],
  ["leak", "Leak Repair"],
  ["drain", "Drain Cleaning / Backup"],
  ["emergency", "Emergency Plumbing"],
  ["residential", "Residential Plumbing"],
  ["commercial", "Commercial Plumbing"],
  ["new-construction", "New Construction"],
  ["remodel", "Remodeling"],
  ["uep", "City Utility (UEP) Connection"],
  ["other", "Other"],
] as const;
