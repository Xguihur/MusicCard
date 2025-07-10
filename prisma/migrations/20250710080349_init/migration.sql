-- CreateTable
CREATE TABLE "music_cards" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "coverUrl" TEXT NOT NULL,
    "lyrics" TEXT,
    "duration" INTEGER NOT NULL,
    "playDuration" INTEGER,
    "originalUrl" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "config" TEXT,
    "imageUrl" TEXT,
    "userIdentifier" TEXT NOT NULL,
    "displayTitle" TEXT
);

-- CreateTable
CREATE TABLE "user_favorites" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userIdentifier" TEXT NOT NULL,
    "musicCardId" TEXT NOT NULL,
    CONSTRAINT "user_favorites_musicCardId_fkey" FOREIGN KEY ("musicCardId") REFERENCES "music_cards" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "user_favorites_userIdentifier_musicCardId_key" ON "user_favorites"("userIdentifier", "musicCardId");
