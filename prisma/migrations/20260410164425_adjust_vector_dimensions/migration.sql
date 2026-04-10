-- Alter the column type to 768
ALTER TABLE "tutor_profiles" ALTER COLUMN "embedding" TYPE vector(768);

-- This is an empty migration.