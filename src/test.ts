import { embed } from "ai";
import { prisma } from "./lib/prisma";

import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

async function updateTutorVector(tutorId: string, text: string) {
  // 1. Get embedding from Gemini via Vercel AI SDK
  const { embedding } = await embed({
    model: google.embeddingModel("gemini-embedding-001"), // Latest Google embedding model
    value: "Your text to embed here",
  });

  // i just want to test this model to see if this actually works
  console.log(embedding);

  // 2. Use Raw SQL to save it
  // await prisma.$executeRaw`
  //   UPDATE tutor_profiles
  //   SET embedding = ${embedding}::vector
  //   WHERE id = ${tutorId}
  // `;
}

updateTutorVector("1", "hello");
