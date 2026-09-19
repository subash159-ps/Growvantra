import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@growvantra.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "growvantra";

  const passwordHash = await bcrypt.hash(adminPassword, 12);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      name: "Growvantra Admin",
      role: "ADMIN",
    },
  });
  console.log(`Seeded admin user: ${adminEmail} (password: ${adminPassword})`);

  const services = [
    {
      title: "Web Design & Development",
      slug: "web-design-development",
      description:
        "Fast, modern, conversion-focused websites built to represent your brand and turn visitors into leads.",
      order: 1,
    },
    {
      title: "SEO",
      slug: "seo",
      description:
        "Search engine optimization to help your business rank higher and get found by the customers already looking for you.",
      order: 2,
    },
    {
      title: "Social Media Marketing",
      slug: "social-media-marketing",
      description:
        "Content, strategy, and community management across the platforms where your customers spend their time.",
      order: 3,
    },
    {
      title: "Google Ads",
      slug: "google-ads",
      description:
        "Targeted search and display campaigns that put your business in front of high-intent customers.",
      order: 4,
    },
    {
      title: "Meta Ads",
      slug: "meta-ads",
      description:
        "Facebook and Instagram ad campaigns built to grow reach, engagement, and qualified leads.",
      order: 5,
    },
    {
      title: "Content Marketing",
      slug: "content-marketing",
      description:
        "Blog posts, guides, and on-site content that builds authority and feeds your SEO and social strategy.",
      order: 6,
    },
    {
      title: "Branding & Graphic Design",
      slug: "branding-graphic-design",
      description:
        "Logos, visual identity, and marketing collateral that make your business instantly recognizable.",
      order: 7,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }
  console.log(`Seeded ${services.length} services.`);

  // Demo projects — Growvantra has no real client work published yet, so these
  // are clearly-labeled DEMO items that show capability. No imageUrl for now
  // (cards fall back to a category icon) — add real client screenshots via
  // the admin Image URL field as real work lands.
  const portfolio = [
    {
      title: "Local Service Business Website",
      slug: "demo-local-service-business-website",
      description:
        "A mobile-first site for a local trades business — service pages, click-to-call, service-area coverage, and a quote form that drops straight into the lead inbox.",
      category: "Web Design & Development",
      imageUrl: null,
      type: "DEMO" as const,
      createdAt: new Date("2026-09-04T00:00:00Z"),
    },
    {
      title: "Local SEO Growth Program",
      slug: "demo-local-seo-growth-program",
      description:
        "A 90-day local search build-out: technical audit, Google Business Profile optimization, service-plus-location landing pages, and a review-generation loop.",
      category: "SEO",
      imageUrl: null,
      type: "DEMO" as const,
      createdAt: new Date("2026-09-03T00:00:00Z"),
    },
    {
      title: "E-Commerce Launch Campaign",
      slug: "demo-ecommerce-launch-campaign",
      description:
        "A paid-social launch for a new online brand — pixel and event setup, a cold-audience creative test matrix, and retargeting flows for cart abandoners.",
      category: "Meta Ads",
      imageUrl: null,
      type: "DEMO" as const,
      createdAt: new Date("2026-09-02T00:00:00Z"),
    },
    {
      title: "Restaurant Social Media Kit",
      slug: "demo-restaurant-social-media-kit",
      description:
        "A month of ready-to-post content for a single-location restaurant — reels, story templates, a posting calendar, and captions built around local discovery.",
      category: "Social Media Marketing",
      imageUrl: null,
      type: "DEMO" as const,
      createdAt: new Date("2026-09-01T00:00:00Z"),
    },
  ];

  for (const { createdAt, ...project } of portfolio) {
    await prisma.portfolio.upsert({
      where: { slug: project.slug },
      update: project,
      create: { ...project, createdAt },
    });
  }
  console.log(`Seeded ${portfolio.length} portfolio projects.`);

  const managerEmail = process.env.SEED_MANAGER_EMAIL ?? "manager@globalhood.example";
  const managerPasswordHash = await bcrypt.hash(
    process.env.SEED_MANAGER_PASSWORD ?? "changeme123",
    12,
  );
  await prisma.user.upsert({
    where: { email: managerEmail },
    update: {},
    create: {
      email: managerEmail,
      passwordHash: managerPasswordHash,
      name: "Sample Campaign Manager",
      role: "CAMPAIGN_MANAGER",
    },
  });
  console.log(`Seeded campaign manager user: ${managerEmail}`);

  const client = await prisma.client.upsert({
    where: { id: "seed-sample-client" },
    update: {},
    create: {
      id: "seed-sample-client",
      name: "Sample Client Co.",
      contactName: "Jordan Lee",
      email: "jordan@sampleclient.example",
    },
  });
  console.log(`Seeded sample client: ${client.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
