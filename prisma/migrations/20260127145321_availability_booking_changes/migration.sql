/*
  Warnings:

  - You are about to drop the column `isActive` on the `availability` table. All the data in the column will be lost.
  - You are about to drop the column `scheduledAt` on the `bookings` table. All the data in the column will be lost.
  - Added the required column `endTime` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "availability" DROP COLUMN "isActive",
ADD COLUMN     "isBooked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "slotDuration" INTEGER NOT NULL DEFAULT 60;

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "scheduledAt",
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;
