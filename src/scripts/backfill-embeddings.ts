import { prisma } from "../lib/prisma";
import { TutorUtils } from "../modules/tutor/tutor.utils";

async function main() {
  console.log("🚀 Starting global tutor embedding sync...");

  // 1. Fetch all tutor profile IDs
  const tutors = await prisma.tutorProfile.findMany({
    select: { id: true },
  });

  console.log(`found ${tutors.length} tutors to process.`);

  let successCount = 0;
  let errorCount = 0;

  // 2. Iterate and sync each one
  for (const [index, tutor] of tutors.entries()) {
    try {
      // We pass 'prisma' as the transaction/client object
      await TutorUtils.syncTutorEmbedding(prisma, tutor.id);

      successCount++;
      console.log(`[${index + 1}/${tutors.length}] ✅ Synced ID: ${tutor.id}`);

      // OPTIONAL: Add a small delay if you have thousands of tutors
      // to stay within Gemini API rate limits
      // await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      errorCount++;
      console.error(
        `[${index + 1}/${tutors.length}] ❌ Failed ID: ${tutor.id}`,
        error,
      );
    }
  }

  console.log("\n--- Sync Complete ---");
  console.log(`✅ Successfully synced: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
