import { prisma } from "../lib/prisma";

const categories = [
  { name: "Mathematics", slug: "mathematics" },
  { name: "Physics", slug: "physics" },
  { name: "Chemistry", slug: "chemistry" },
  { name: "Biology", slug: "biology" },
  { name: "English Language", slug: "english-language" },
  { name: "History", slug: "history" },
  { name: "Geography", slug: "geography" },
  { name: "Computer Science", slug: "computer-science" },
  { name: "Programming", slug: "programming" },
  { name: "Web Development", slug: "web-development" },
  { name: "Data Science", slug: "data-science" },
  { name: "Art & Drawing", slug: "art-drawing" },
  { name: "Music", slug: "music" },
  { name: "Photography", slug: "photography" },
  { name: "Economics", slug: "economics" },
  { name: "Business & Finance", slug: "business-finance" },
  { name: "Public Speaking", slug: "public-speaking" },
  { name: "Psychology", slug: "psychology" },
  { name: "Languages", slug: "languages" },
  { name: "Test Prep", slug: "test-prep" },
];

const seedCategory = async () => {
  try {
    console.log("Seeding categories...");

    const result = await prisma.category.createMany({
      data: categories,
      skipDuplicates: true, // avoids errors if slug already exists
    });

    console.log(`✅ Successfully seeded ${result.count} categories!`);
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
  } finally {
    await prisma.$disconnect();
    console.log("Prisma disconnected.");
  }
};

seedCategory();
