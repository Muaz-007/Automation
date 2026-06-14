"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireTenant } from "@/lib/dal";

type TenantUpdate = {
  business_name?: string;
  industry?: "real_estate" | "ecommerce" | "healthcare";
  ai_persona_name?: string;
  ai_tone?: "formal" | "friendly" | "casual";
  language?: "english" | "urdu" | "roman_urdu" | "mixed";
  system_prompt?: string | null;
  phone_number?: string | null;
  phone_number_id?: string | null;
  whatsapp_token?: string | null;
};

const NULLABLE: Array<keyof TenantUpdate> = [
  "system_prompt",
  "phone_number",
  "phone_number_id",
  "whatsapp_token",
];

export async function updateTenant(formData: FormData) {
  const tu = await requireTenant();
  const data: TenantUpdate = {};

  const fields: (keyof TenantUpdate)[] = [
    "business_name",
    "industry",
    "ai_persona_name",
    "ai_tone",
    "language",
    "system_prompt",
    "phone_number",
    "phone_number_id",
    "whatsapp_token",
  ];
  for (const f of fields) {
    const v = formData.get(f);
    if (typeof v === "string") {
      const trimmed = v.trim();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (data as any)[f] = trimmed === "" && NULLABLE.includes(f) ? null : trimmed;
    }
  }

  await prisma.tenant.update({
    where: { id: tu.tenant_id },
    data,
  });

  revalidatePath("/", "layout");
}

export async function seedDemoData() {
  const tu = await requireTenant();
  const tenantId = tu.tenant_id;

  // Skip if data already exists
  const existing = await prisma.lead.count({ where: { tenant_id: tenantId } });
  if (existing > 0) return;

  const now = Date.now();
  const minutes = (m: number) => new Date(now - m * 60_000);
  const hours = (h: number) => new Date(now - h * 3_600_000);
  const days = (d: number) => new Date(now - d * 86_400_000);

  const customers = await Promise.all(
    [
      { phone: "+923214567890", name: "Ahmed Khan", city: "Karachi" },
      { phone: "+923331234567", name: "Fatima Ali", city: "Lahore" },
      { phone: "+923009876543", name: "Bilal Hussain", city: "Islamabad" },
      { phone: "+923451112222", name: "Sana Malik", city: "Karachi" },
      { phone: "+923009998877", name: "Usman Tariq", city: "Karachi" },
      { phone: "+923355556666", name: "Hira Sheikh", city: "Lahore" },
      { phone: "+923211110000", name: "Zain Abbas", city: "Rawalpindi" },
    ].map((c) =>
      prisma.customer.create({
        data: { tenant_id: tenantId, ...c },
      }),
    ),
  );

  const leadSpecs = [
    {
      idx: 0,
      status: "hot" as const,
      hot_score: 92,
      source: "Facebook Ad",
      extracted_data: {
        budget: "1.5 crore",
        area: "DHA Phase 6",
        bedrooms: 3,
        purpose: "buy",
        timeline: "this month",
      },
      last: minutes(8),
      created: hours(2),
    },
    {
      idx: 1,
      status: "warm" as const,
      hot_score: 64,
      source: "WhatsApp Direct",
      extracted_data: {
        budget: "80 lakh",
        area: "Bahria Town",
        bedrooms: 2,
        purpose: "rent",
      },
      last: hours(1),
      created: hours(5),
    },
    {
      idx: 2,
      status: "qualifying" as const,
      hot_score: 45,
      source: "OLX",
      extracted_data: { area: "F-11", bedrooms: 4 },
      last: hours(3),
      created: hours(12),
    },
    {
      idx: 3,
      status: "new" as const,
      hot_score: 30,
      source: "Instagram",
      extracted_data: {},
      last: minutes(15),
      created: minutes(15),
    },
    {
      idx: 4,
      status: "won" as const,
      hot_score: 100,
      source: "Referral",
      extracted_data: {
        budget: "2.2 crore",
        area: "DHA Phase 8",
        bedrooms: 4,
        purpose: "buy",
      },
      last: days(1),
      created: days(2),
    },
    {
      idx: 5,
      status: "cold" as const,
      hot_score: 18,
      source: "Zameen.com",
      extracted_data: { area: "Model Town" },
      last: days(2),
      created: days(3),
    },
    {
      idx: 6,
      status: "lost" as const,
      hot_score: 10,
      source: "OLX",
      extracted_data: { budget: "30 lakh" },
      last: days(3),
      created: days(4),
    },
  ];

  await Promise.all(
    leadSpecs.map((s) =>
      prisma.lead.create({
        data: {
          tenant_id: tenantId,
          customer_id: customers[s.idx].id,
          status: s.status,
          hot_score: s.hot_score,
          source: s.source,
          extracted_data: s.extracted_data,
          last_message_at: s.last,
          created_at: s.created,
        },
      }),
    ),
  );

  // Conversation thread for the hot lead (Ahmed)
  const ahmedId = customers[0].id;
  await prisma.conversation.createMany({
    data: [
      {
        tenant_id: tenantId,
        customer_id: ahmedId,
        role: "user",
        message: "Assalam o alaikum, DHA mein house chahiye",
        created_at: hours(2),
      },
      {
        tenant_id: tenantId,
        customer_id: ahmedId,
        role: "assistant",
        message:
          "Walaikum salam Ahmed! DHA mein kis phase mein dekh rahe hain, aur budget kya hai?",
        created_at: hours(2),
      },
      {
        tenant_id: tenantId,
        customer_id: ahmedId,
        role: "user",
        message: "Phase 6 ya 7, 3 bedroom. Budget around 1.5 crore",
        created_at: hours(1),
      },
      {
        tenant_id: tenantId,
        customer_id: ahmedId,
        role: "assistant",
        message:
          "Bohat acha! 3 properties available hain Phase 6 mein. Kya is week site visit ke liye time nikal sakte hain?",
        created_at: hours(1),
      },
      {
        tenant_id: tenantId,
        customer_id: ahmedId,
        role: "user",
        message: "Haan, Saturday ko free hun. Sham ko 4 baje?",
        created_at: minutes(10),
      },
      {
        tenant_id: tenantId,
        customer_id: ahmedId,
        role: "assistant",
        message:
          "Done! Saturday 4 PM ka site visit confirm. Aapko 30 min pehle reminder bhej dunga.",
        created_at: minutes(8),
      },
    ],
  });

  // Shorter thread for warm lead (Fatima)
  const fatimaId = customers[1].id;
  await prisma.conversation.createMany({
    data: [
      {
        tenant_id: tenantId,
        customer_id: fatimaId,
        role: "user",
        message: "Bahria Town mein 2 bed apartment rent par chahiye",
        created_at: hours(5),
      },
      {
        tenant_id: tenantId,
        customer_id: fatimaId,
        role: "assistant",
        message:
          "Bahria Town mein 2 bed apartments available hain. Budget range kya hai aur kab tak shift karna hai?",
        created_at: hours(5),
      },
      {
        tenant_id: tenantId,
        customer_id: fatimaId,
        role: "user",
        message: "70 to 80 hazaar tak. Next month",
        created_at: hours(1),
      },
    ],
  });

  revalidatePath("/", "layout");
}

export async function clearDemoData() {
  const tu = await requireTenant();
  const tenantId = tu.tenant_id;

  await prisma.conversation.deleteMany({ where: { tenant_id: tenantId } });
  await prisma.lead.deleteMany({ where: { tenant_id: tenantId } });
  await prisma.customer.deleteMany({ where: { tenant_id: tenantId } });

  revalidatePath("/", "layout");
}
