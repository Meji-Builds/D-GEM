-- CreateEnum
CREATE TYPE "FeedbackStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "EventSettings" ADD COLUMN     "feedbackState" "RegistrationState" NOT NULL DEFAULT 'CLOSED';

-- AlterTable
ALTER TABLE "FeedbackResponse" ADD COLUMN     "name" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "role" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "status" "FeedbackStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "testimonial" TEXT NOT NULL DEFAULT '';
