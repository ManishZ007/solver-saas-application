-- AlterTable
ALTER TABLE "users" ADD COLUMN     "coin" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "free_coin_use" BOOLEAN NOT NULL DEFAULT false;
