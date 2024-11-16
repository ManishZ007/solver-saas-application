/*
  Warnings:

  - You are about to drop the column `name` on the `chats` table. All the data in the column will be lost.
  - Added the required column `username` to the `chats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "chats" DROP COLUMN "name",
ADD COLUMN     "username" TEXT NOT NULL;
