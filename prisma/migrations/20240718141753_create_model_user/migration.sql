/*
  Warnings:

  - Added the required column `user_id` to the `trips` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_trips" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "destination" TEXT NOT NULL,
    "starts_at" DATETIME NOT NULL,
    "ends_at" DATETIME NOT NULL,
    "user_id" TEXT NOT NULL,
    "is_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "trips_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_trips" ("created_at", "destination", "ends_at", "id", "is_confirmed", "starts_at") SELECT "created_at", "destination", "ends_at", "id", "is_confirmed", "starts_at" FROM "trips";
DROP TABLE "trips";
ALTER TABLE "new_trips" RENAME TO "trips";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
