import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD must be set in the environment to seed the first admin user.",
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash, name: "CodeLess Admin" },
  });

  console.log(`Seeded admin user: ${admin.email}`);

  // Optional: a couple of demo leads in development so the dashboard isn't empty.
  if (process.env.SEED_DEMO_LEADS === "true") {
    await prisma.lead.createMany({
      data: [
        {
          name: "Nino Beridze",
          email: "nino@example.com",
          phone: "+995 555 10 20 30",
          experienceLevel: "some",
          source: "instagram",
          locale: "ka",
          message: "Interested in the next cohort.",
        },
        {
          name: "Giorgi Kapanadze",
          email: "giorgi@example.com",
          experienceLevel: "none",
          source: "friend",
          locale: "en",
        },
      ],
    });
    console.log("Seeded demo leads.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
