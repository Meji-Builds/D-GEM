-- AlterTable
ALTER TABLE "EventSettings" ADD COLUMN     "bronzePerks" TEXT NOT NULL DEFAULT 'Logo on site
Programme listing',
ADD COLUMN     "goldPerks" TEXT NOT NULL DEFAULT 'Logo on stage
Speaking slot
Booth
Full media pack',
ADD COLUMN     "silverPerks" TEXT NOT NULL DEFAULT 'Logo on site
Booth
Media mentions';
