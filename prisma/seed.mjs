import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function upsertUser(email, name, role, company) {
  const password = "Password123!";
  const passwordHash = bcrypt.hashSync(password, 10);
  const user = await prisma.user.upsert({
    where: { email },
    create: { email, name, role, company, passwordHash },
    update: { name, role, company },
  });
  return { email: user.email, password, role };
}

async function main() {
  const creds = [];
  creds.push(await upsertUser("broker.demo@cedewise.test", "Demo Broker", "BROKER", "Cedewise"));
  creds.push(
    await upsertUser(
      "manager.demo@cedewise.test",
      "Demo Underwriting Manager",
      "UNDERWRITING_MANAGER",
      "Cedewise"
    )
  );
  creds.push(await upsertUser("coinsurer.demo@cedewise.test", "Demo Co-Insurer", "CO_INSURER", "Cedewise"));
  creds.push(await upsertUser("insurer.demo@cedewise.test", "Demo Insurer", "INSURER", "Cedewise"));

  console.log("Demo users ready:\n");
  for (const c of creds) {
    console.log(`${c.role}: ${c.email} / ${c.password}`);
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


