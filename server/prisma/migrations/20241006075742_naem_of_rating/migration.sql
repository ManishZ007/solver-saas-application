/*
  Warnings:

  - You are about to drop the `Ratings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Ratings" DROP CONSTRAINT "Ratings_solution_id_fkey";

-- DropTable
DROP TABLE "Ratings";

-- CreateTable
CREATE TABLE "ratings" (
    "id" TEXT NOT NULL,
    "solution_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ratings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_solution_id_fkey" FOREIGN KEY ("solution_id") REFERENCES "solutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
