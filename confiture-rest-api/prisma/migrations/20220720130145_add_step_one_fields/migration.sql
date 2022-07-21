/*
  Warnings:

  - Added the required column `administration` to the `Audit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `auditorEmail` to the `Audit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `auditorName` to the `Audit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactEmail` to the `Audit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactFormUrl` to the `Audit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ministry` to the `Audit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Audit` table without a default value. This is not possible if the table is not empty.
  - Made the column `procedure` on table `Audit` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Audit" ADD COLUMN     "administration" TEXT NOT NULL,
ADD COLUMN     "auditorEmail" TEXT NOT NULL,
ADD COLUMN     "auditorName" TEXT NOT NULL,
ADD COLUMN     "contactEmail" TEXT NOT NULL,
ADD COLUMN     "contactFormUrl" TEXT NOT NULL,
ADD COLUMN     "contactName" TEXT,
ADD COLUMN     "ministry" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL,
ALTER COLUMN "procedure" SET NOT NULL;

-- CreateTable
CREATE TABLE "Recipent" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "auditId" INTEGER,

    CONSTRAINT "Recipent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Recipent" ADD CONSTRAINT "Recipent_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
