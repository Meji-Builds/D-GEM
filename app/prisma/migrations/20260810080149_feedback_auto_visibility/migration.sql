-- CreateEnum
CREATE TYPE "FeedbackVisibility" AS ENUM ('AUTO', 'OPEN', 'CLOSED');

-- AlterTable
ALTER TABLE "EventSettings" ALTER COLUMN "feedbackState" DROP DEFAULT;
ALTER TABLE "EventSettings"
  ALTER COLUMN "feedbackState" TYPE "FeedbackVisibility"
  USING (CASE "feedbackState"::text WHEN 'OPEN' THEN 'OPEN' ELSE 'AUTO' END)::"FeedbackVisibility";
ALTER TABLE "EventSettings" ALTER COLUMN "feedbackState" SET DEFAULT 'AUTO';
