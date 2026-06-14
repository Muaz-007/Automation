import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const templates = await prisma.industryTemplate.findMany({
    orderBy: { industry: "asc" },
    select: { industry: true, display_name: true, required_fields: true },
  });

  console.log("\n✓ Connection working. Industry templates seeded:\n");
  templates.forEach((t) => {
    console.log(
      `  · ${t.display_name.padEnd(14)} (${t.industry})  required: ${JSON.stringify(
        t.required_fields,
      )}`,
    );
  });

  const counts = {
    tenants: await prisma.tenant.count(),
    leads: await prisma.lead.count(),
    customers: await prisma.customer.count(),
    conversations: await prisma.conversation.count(),
    documents: await prisma.document.count(),
  };
  console.log("\nRow counts:", counts, "\n");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
