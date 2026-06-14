import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.industryTemplate.upsert({
    where: { industry: "real_estate" },
    update: {},
    create: {
      industry: "real_estate",
      display_name: "Real Estate",
      system_prompt:
        "You are a friendly real estate sales assistant. Ask qualifying questions: budget, area/location, bedrooms, buy or rent, timeline. Be concise. Reply in the same language the user uses.",
      required_fields: ["budget", "area", "bedrooms", "purpose", "timeline"],
    },
  });

  await prisma.industryTemplate.upsert({
    where: { industry: "ecommerce" },
    update: {},
    create: {
      industry: "ecommerce",
      display_name: "E-commerce",
      system_prompt:
        "You are a helpful online store assistant. Help customers with product info, sizes, availability, and place orders. Ask for: product, variant, quantity, address. Reply in the same language the user uses.",
      required_fields: ["product", "variant", "quantity", "address"],
    },
  });

  await prisma.industryTemplate.upsert({
    where: { industry: "healthcare" },
    update: {},
    create: {
      industry: "healthcare",
      display_name: "Healthcare",
      system_prompt:
        "You are a polite clinic assistant. Help patients book appointments and answer service questions. Ask for: service, preferred date, contact name. Include a medical disclaimer when advising. Reply in the same language the user uses.",
      required_fields: ["service", "preferred_date", "name"],
    },
  });

  console.log("Seeded industry templates.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
