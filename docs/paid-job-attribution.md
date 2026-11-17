# Paid job attribution

Website enquiries carry an office-only source receipt and the same unique lead ID returned on successful submission. It covers contact/chat, booking, estimate, quote builder and builder portal submissions. No ServiceM8 API integration is configured by this change. Office staff must copy the receipt to the matching job diary and apply the matching job badge.

## Source rules

- Last non-direct website arrival within 30 days. Direct returns preserve the previous source without extending expiry. A new tagged arrival or external referral replaces it.
- A paid Google Search UTM identifies Search. A Google click ID without a Search tag identifies Google Ads, campaign type unspecified.
- Facebook and Instagram require explicit paid-medium tags. A bare fbclid or Facebook referrer is not evidence of paid advertising.
- Keep direct, organic and unknown separate from paid. Existing Found Us Via badges combine paid and unpaid and must not be used as paid-revenue evidence.
- The cookie is host-only, HttpOnly, SameSite=Lax and Secure on HTTPS. It stores allowlisted campaign/click fields, a path, referrer hostname and timestamp; arbitrary query fields and full referrer URLs are excluded. GPC disables this new source cookie.
- Blocked/deleted cookies, cross-device visits and copied URLs limit attribution. URL tags are source evidence, not cryptographic proof or incrementality measurement.

## Office workflow

1. Match the enquiry to an existing open job before creating another. Search customer, phone/email and service address. One enquiry appearing in several channels is not several acquired jobs.
2. Paste the Job source tracking block into the job diary. Apply exactly one primary Paid badge to the job, never the client. Client badges may carry into future jobs.
3. Retain the original lead ID and campaign ID. If a later contact changes the evidence, document the reason; do not silently overwrite it.
4. For Meta Instant Forms, retain Meta lead ID, creation time, campaign/ad IDs and platform from the exported lead record. Only a confirmed ad-origin record qualifies as paid. Organic form submissions remain non-paid. Use Paid - Meta (unspecified) if the platform is unavailable. Website tags do not capture in-app form submissions.
5. For Local Services calls/messages, match the LSA lead record to the job using phone/customer, time and requested service, and retain the LSA lead ID. Apply Paid - Google Local Services. Do not infer LSA from a generic Google badge.
6. Generic calls to the shared business number need a matching ad call record or a dedicated call-tracking setup. A website telephone click is not proof of a connected call or booked job.
7. Record job status, invoice total excluding sales tax, discounts/refunds, payment status and direct costs (materials, loaded labor, subcontractors and job-specific fees). Missing costs are unknown, never zero.

## Reporting

Report spend, distinct leads, booked jobs, completed jobs, net revenue, direct costs, contribution profit, ROAS and contribution ROI by source/campaign. Count each job and invoice once across platforms. For lead-cohort ROI, use spend in the acquisition period and later outcomes of leads acquired in that same period; show still-open jobs separately. An invoice-period cash view should be a separate report, not mixed with acquisition ROI.

- ROAS = attributed net revenue / ad spend.
- Contribution ROI = (attributed net revenue - direct job costs - ad spend) / ad spend.
- Fully loaded marketing ROI also subtracts attributable agency, creative and tracking costs.
- Cost per acquired job = ad spend / distinct new acquired jobs.
- Where spend is zero, ROI is undefined. Where costs are incomplete, publish ROAS and label profit ROI unavailable.

## Tag templates

Google Search final URL suffix (no leading question mark):

```text
utm_source=google&utm_medium=paid_search&utm_campaign={campaignid}&utm_id={campaignid}&utm_content={creative}&utm_term={keyword}
```

Meta website ad URL parameters:

```text
utm_source={{site_source_name}}&utm_medium=paid_social&utm_campaign={{campaign.id}}&utm_id={{campaign.id}}&utm_content={{ad.id}}&utm_term={{adset.id}}
```

Use the same convention for future ads. Check sitelink URLs separately; ad-level suffixes do not establish coverage for every asset or future campaign. Do not paste tracking parameters onto organic posts.

## Validation and rollback

Tests cover source classification, expiry, malformed cookies, privacy filtering, GPC and the serialized Set-Cookie round trip. End-to-end checks use the existing local Resend capture harness, with OpenAI conversion credentials and SMS gateway disabled; never submit fake leads to production.

Roll back the code commit to remove source capture and office email blocks. Existing tracking tags are harmless without the capture code and can be removed separately if needed. No historical job source is changed by this release, and no completed-job revenue is uploaded to advertising platforms.
