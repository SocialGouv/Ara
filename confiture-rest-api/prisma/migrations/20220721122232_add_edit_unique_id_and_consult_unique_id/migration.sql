-- Add consultUniqueId and editUniqueId columns
ALTER TABLE "Audit" 
ADD COLUMN     "consultUniqueId" TEXT,
ADD COLUMN     "editUniqueId" TEXT;


-- Copy the uniqueId column into the editUniqueId column.
-- Fill the consultUniqueId with a uuid string
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
UPDATE "Audit" SET "editUniqueId" = "uniqueId",
 "consultUniqueId" = uuid_generate_v4();
DROP EXTENSION IF EXISTS "uuid-ossp";


-- Make consultUniqueId and editUniqueId non-nullable
ALTER TABLE "Audit"
ALTER COLUMN "consultUniqueId" SET NOT NULL,
ALTER COLUMN "editUniqueId" SET NOT NULL;


-- Remove the uniqueId column and index
DROP INDEX "Audit_uniqueId_key";
ALTER TABLE "Audit" DROP COLUMN "uniqueId";

-- Create editUniqueId and consultUniqueId indexes
CREATE UNIQUE INDEX "Audit_editUniqueId_key" ON "Audit"("editUniqueId");
CREATE UNIQUE INDEX "Audit_consultUniqueId_key" ON "Audit"("consultUniqueId");