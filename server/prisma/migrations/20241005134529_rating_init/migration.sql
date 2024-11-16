/*
  Warnings:

  - You are about to drop the column `rating_on_solution` on the `solutions` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "solutions_rating_on_solution_idx";

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "profile_image" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "solutions" DROP COLUMN "rating_on_solution";

-- CreateTable
CREATE TABLE "Ratings" (
    "id" TEXT NOT NULL,
    "solution_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ratings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ratings" ADD CONSTRAINT "Ratings_solution_id_fkey" FOREIGN KEY ("solution_id") REFERENCES "solutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
