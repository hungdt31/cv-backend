/*
  Warnings:

  - You are about to drop the column `first_name` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "first_name",
ADD COLUMN     "name" TEXT;
