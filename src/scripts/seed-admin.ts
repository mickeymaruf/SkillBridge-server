import { prisma } from "../lib/prisma";
import { UserRole } from "../../generated/prisma/enums";
import { auth } from "../lib/auth";

const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const name = process.env.ADMIN_NAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !name || !password) {
    throw new Error("Admin credentials missing in env");
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log("Admin already exists");
    return;
  }

  const user = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
      role: UserRole.ADMIN,
    },
  });

  await prisma.user.update({
    where: { id: user.user.id },
    data: {
      emailVerified: true,
    },
  });

  console.log("Admin seeded successfully", user.user.email);
};

seedAdmin()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
