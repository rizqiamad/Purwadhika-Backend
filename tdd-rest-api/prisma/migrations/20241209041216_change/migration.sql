/*
  Warnings:

  - You are about to alter the column `firstName` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(255)`.
  - You are about to alter the column `lastName` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(255)`.
  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(255)`.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "firstName" SET DATA TYPE CHAR(255),
ALTER COLUMN "lastName" SET DATA TYPE CHAR(255),
ALTER COLUMN "email" SET DATA TYPE CHAR(255);
