// Curated list of currencies + timezones surfaced in the tenant Settings page.
// Keeps the dropdowns short and relevant for SMB markets we expect to launch in.

export const CURRENCY_OPTIONS: { code: string; label: string }[] = [
  { code: "USD", label: "USD — US Dollar" },
  { code: "PKR", label: "PKR — Pakistani Rupee" },
  { code: "INR", label: "INR — Indian Rupee" },
  { code: "AED", label: "AED — UAE Dirham" },
  { code: "SAR", label: "SAR — Saudi Riyal" },
  { code: "GBP", label: "GBP — British Pound" },
  { code: "EUR", label: "EUR — Euro" },
  { code: "CAD", label: "CAD — Canadian Dollar" },
  { code: "AUD", label: "AUD — Australian Dollar" },
  { code: "BDT", label: "BDT — Bangladeshi Taka" },
  { code: "NGN", label: "NGN — Nigerian Naira" },
];

export const TIMEZONE_OPTIONS: { value: string; label: string }[] = [
  { value: "UTC", label: "UTC — Universal" },
  { value: "Asia/Karachi", label: "Asia/Karachi — Pakistan (PKT, +05:00)" },
  { value: "Asia/Kolkata", label: "Asia/Kolkata — India (IST, +05:30)" },
  { value: "Asia/Dubai", label: "Asia/Dubai — UAE (GST, +04:00)" },
  { value: "Asia/Riyadh", label: "Asia/Riyadh — Saudi Arabia (AST, +03:00)" },
  { value: "Asia/Dhaka", label: "Asia/Dhaka — Bangladesh (BST, +06:00)" },
  { value: "Asia/Singapore", label: "Asia/Singapore — Singapore (SGT, +08:00)" },
  { value: "Asia/Hong_Kong", label: "Asia/Hong_Kong — Hong Kong (HKT, +08:00)" },
  { value: "Europe/London", label: "Europe/London — UK (GMT/BST)" },
  { value: "Europe/Berlin", label: "Europe/Berlin — Central Europe (CET/CEST)" },
  { value: "America/New_York", label: "America/New_York — US East (EST/EDT)" },
  { value: "America/Chicago", label: "America/Chicago — US Central (CST/CDT)" },
  { value: "America/Los_Angeles", label: "America/Los_Angeles — US West (PST/PDT)" },
  { value: "America/Sao_Paulo", label: "America/Sao_Paulo — Brazil (BRT)" },
  { value: "Africa/Lagos", label: "Africa/Lagos — Nigeria (WAT)" },
  { value: "Australia/Sydney", label: "Australia/Sydney — Australia East (AEST/AEDT)" },
];
