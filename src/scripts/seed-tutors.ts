import { prisma } from "../lib/prisma";
import { UserRole } from "../../generated/prisma/enums";
import { auth } from "../lib/auth";

/**
 * Creates a tutor user and then a tutor profile
 */
const createTutorWithProfile = async (
  email: string,
  name: string,
  password: string,
  hourlyRate: number,
  categorySlugs: string[],
) => {
  // 1️⃣ Check if user already exists in DB
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    // 2️⃣ Create user via Better Auth
    const signUp = await auth.api.signUpEmail({
      body: { email, password, name, role: UserRole.TUTOR },
    });

    // 3️⃣ Mark email verified in DB
    await prisma.user.update({
      where: { id: signUp.user.id },
      data: { emailVerified: true },
    });

    console.log(`User created via auth: ${email}`);

    // 4️⃣ Check if tutor profile already exists
    const existingProfile = await prisma.tutorProfile.findUnique({
      where: { userId: signUp.user.id },
    });

    if (existingProfile) {
      console.log(`Tutor profile already exists for ${email}`);
      return existingProfile;
    }

    // 5️⃣ Create tutor profile with categories
    await prisma.tutorProfile.create({
      data: {
        userId: signUp.user.id,
        hourlyRate,
        categories: {
          create: categorySlugs.map((slug) => ({
            category: { connect: { slug } },
          })),
        },
      },
      include: { categories: { include: { category: true } } },
    });

    console.log(`Tutor profile created for ${email}`);
  } else {
    console.log(`User already exists: ${email}`);
  }
};

const dummyTutors = [
  {
    email: "alice.tutor@example.com",
    name: "Alice Tutor",
    password: "Password123!",
    hourlyRate: 40,
    categories: ["mathematics", "physics"],
  },
  {
    email: "bob.tutor@example.com",
    name: "Bob Tutor",
    password: "Password123!",
    hourlyRate: 35,
    categories: ["programming", "web-development"],
  },
  {
    email: "carol.tutor@example.com",
    name: "Carol Tutor",
    password: "Password123!",
    hourlyRate: 45,
    categories: ["biology", "chemistry"],
  },
  {
    email: "dave.tutor@example.com",
    name: "Dave Tutor",
    password: "Password123!",
    hourlyRate: 30,
    categories: ["history", "geography"],
  },
  {
    email: "eve.tutor@example.com",
    name: "Eve Tutor",
    password: "Password123!",
    hourlyRate: 50,
    categories: ["english-language", "public-speaking"],
  },
  {
    email: "frank.tutor@example.com",
    name: "Frank Tutor",
    password: "Password123!",
    hourlyRate: 28,
    categories: ["psychology", "languages"],
  },
  {
    email: "grace.tutor@example.com",
    name: "Grace Tutor",
    password: "Password123!",
    hourlyRate: 38,
    categories: ["music", "art-drawing"],
  },
  {
    email: "henry.tutor@example.com",
    name: "Henry Tutor",
    password: "Password123!",
    hourlyRate: 32,
    categories: ["data-science", "economics"],
  },
  {
    email: "irene.tutor@example.com",
    name: "Irene Tutor",
    password: "Password123!",
    hourlyRate: 36,
    categories: ["programming", "computer-science"],
  },
  {
    email: "jack.tutor@example.com",
    name: "Jack Tutor",
    password: "Password123!",
    hourlyRate: 42,
    categories: ["mathematics", "data-science"],
  },
  {
    email: "kate.tutor@example.com",
    name: "Kate Tutor",
    password: "Password123!",
    hourlyRate: 34,
    categories: ["biology", "chemistry"],
  },
  {
    email: "leo.tutor@example.com",
    name: "Leo Tutor",
    password: "Password123!",
    hourlyRate: 31,
    categories: ["web-development", "programming"],
  },
  {
    email: "maya.tutor@example.com",
    name: "Maya Tutor",
    password: "Password123!",
    hourlyRate: 46,
    categories: ["english-language", "history"],
  },
  {
    email: "nate.tutor@example.com",
    name: "Nate Tutor",
    password: "Password123!",
    hourlyRate: 29,
    categories: ["geography", "economics"],
  },
  {
    email: "olivia.tutor@example.com",
    name: "Olivia Tutor",
    password: "Password123!",
    hourlyRate: 37,
    categories: ["photography", "art-drawing"],
  },
  {
    email: "paul.tutor@example.com",
    name: "Paul Tutor",
    password: "Password123!",
    hourlyRate: 33,
    categories: ["psychology", "public-speaking"],
  },
  {
    email: "quinn.tutor@example.com",
    name: "Quinn Tutor",
    password: "Password123!",
    hourlyRate: 44,
    categories: ["mathematics", "physics"],
  },
  {
    email: "rachel.tutor@example.com",
    name: "Rachel Tutor",
    password: "Password123!",
    hourlyRate: 39,
    categories: ["programming", "data-science"],
  },
  {
    email: "steve.tutor@example.com",
    name: "Steve Tutor",
    password: "Password123!",
    hourlyRate: 35,
    categories: ["computer-science", "web-development"],
  },
  {
    email: "tina.tutor@example.com",
    name: "Tina Tutor",
    password: "Password123!",
    hourlyRate: 41,
    categories: ["biology", "chemistry"],
  },
];

// Seed all tutors
(async () => {
  try {
    console.log("Starting dummy tutors creation...");

    for (const tutor of dummyTutors) {
      await createTutorWithProfile(
        tutor.email,
        tutor.name,
        tutor.password,
        tutor.hourlyRate,
        tutor.categories,
      );
    }

    console.log("All dummy tutors created successfully!");
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
})();
