-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "username" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "title" SET DEFAULT '',
ALTER COLUMN "description" SET DEFAULT '';

-- AlterTable
ALTER TABLE "solutions" ADD COLUMN     "username" TEXT NOT NULL DEFAULT '';
