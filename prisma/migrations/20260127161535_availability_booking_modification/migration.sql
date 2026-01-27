/*
  Warnings:

  - You are about to drop the column `dayOfWeek` on the `availability` table. All the data in the column will be lost.
  - You are about to drop the column `slotDuration` on the `availability` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `bookings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slotId]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `startTime` on the `availability` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `endTime` on the `availability` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `slotId` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "availability" DROP COLUMN "dayOfWeek",
DROP COLUMN "slotDuration",
DROP COLUMN "startTime",
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL,
DROP COLUMN "endTime",
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "slotId" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'CONFIRMED';

-- CreateIndex
CREATE UNIQUE INDEX "bookings_slotId_key" ON "bookings"("slotId");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "availability"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
