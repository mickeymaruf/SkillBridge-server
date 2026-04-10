import { google } from "@ai-sdk/google";
import { embed } from "ai";

// This helper ensures the AI "understands" the tutor's current state
const syncTutorEmbedding = async (tx: any, tutorProfileId: string) => {
  // 1. Fetch the latest data including categories
  const tutor = await tx.tutorProfile.findUnique({
    where: { id: tutorProfileId },
    include: {
      user: { select: { name: true } },
      categories: { include: { category: true } },
    },
  });

  if (!tutor) return;

  // 2. Create a rich text description for the AI
  const descriptor = `
    Mentor Name: ${tutor.user.name}
    Bio: ${tutor.bio ?? "Expert mentor"}
    Specialties: ${tutor.categories.map((c: any) => c.category.name).join(", ")}
  `.trim();

  // 3. Generate the 768-dimension vector using Gemini
  const { embedding } = await embed({
    model: google.embeddingModel("gemini-embedding-001"),
    value: descriptor,
    providerOptions: {
      google: {
        outputDimensionality: 768,
      },
    },
  });

  // 4. Format the numbers into a string like "[0.1, 0.2, 0.3...]"
  const vectorString = `[${embedding.join(",")}]`;

  // 5. Update the Unsupported column via raw SQL
  // We pass the string as a single parameter to ensure Prisma doesn't treat it as an array.
  await tx.$executeRaw`
    UPDATE tutor_profiles 
    SET embedding = ${vectorString}::vector 
    WHERE id = ${tutorProfileId}
  `;
};

export const TutorUtils = {
  syncTutorEmbedding,
};
