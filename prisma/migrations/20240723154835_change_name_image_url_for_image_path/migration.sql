/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `trips` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "trips" DROP COLUMN "imageUrl",
ADD COLUMN     "image_path" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "imageUrl",
ADD COLUMN     "image_path" TEXT;
