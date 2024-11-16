/*
  Warnings:

  - You are about to drop the column `rating_on_comment` on the `solutions` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "solutions_rating_on_comment_idx";

-- AlterTable
ALTER TABLE "solutions" DROP COLUMN "rating_on_comment",
ADD COLUMN     "rating_on_solution" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "solutions_rating_on_solution_idx" ON "solutions"("rating_on_solution");
