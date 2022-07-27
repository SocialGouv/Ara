/*
  Warnings:

  - You are about to drop the column `administration` on the `Audit` table. All the data in the column will be lost.
  - You are about to drop the column `ministry` on the `Audit` table. All the data in the column will be lost.
  - Added the required column `initiator` to the `Audit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Audit" DROP COLUMN "administration",
DROP COLUMN "ministry",
ADD COLUMN     "initiator" TEXT NOT NULL;
