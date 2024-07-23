/*
  Warnings:

  - You are about to drop the column `image_path` on the `trips` table. All the data in the column will be lost.
  - You are about to drop the column `image_path` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "trips" DROP COLUMN "image_path",
ADD COLUMN     "image_url" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "image_path",
ADD COLUMN     "image_url" TEXT;
