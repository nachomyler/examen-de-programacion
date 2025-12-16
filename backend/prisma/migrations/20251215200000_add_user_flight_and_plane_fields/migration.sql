-- Add createdBy to Flight
ALTER TABLE "Flight" ADD COLUMN "createdBy" INTEGER;

-- Create UserFlight table
CREATE TABLE IF NOT EXISTS "UserFlight" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "flightId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserFlight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserFlight_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create unique constraint for UserFlight
CREATE UNIQUE INDEX IF NOT EXISTS "UserFlight_userId_flightId_key" ON "UserFlight"("userId", "flightId");

-- Update Plane table: rename code to name and add new fields
-- First create new table
CREATE TABLE "Plane_new" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DISPONIBLE',
    "type" TEXT NOT NULL DEFAULT 'ECONOMICO',
    "airline" TEXT NOT NULL DEFAULT 'SkyTrack Airlines',
    "serviceClass" TEXT NOT NULL DEFAULT 'Económica 3-3',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- Copy data from old table
INSERT INTO "Plane_new" ("id", "name", "model", "capacity", "status", "type", "airline", "serviceClass", "createdAt", "updatedAt")
SELECT "id", COALESCE("code", "name", 'Avión ' || "id"), "model", "capacity", "status", 'ECONOMICO', 'SkyTrack Airlines', 'Económica 3-3', "createdAt", "updatedAt"
FROM "Plane";

-- Drop old table
DROP TABLE "Plane";

-- Rename new table
ALTER TABLE "Plane_new" RENAME TO "Plane";


