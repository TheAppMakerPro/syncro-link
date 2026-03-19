#!/bin/bash

# Replace these two values with your real Turso credentials
TURSO_URL="https://syncro-link-YOURNAME.turso.io"
TURSO_TOKEN="YOUR_AUTH_TOKEN_HERE"

curl -s -X POST "${TURSO_URL}/v2/pipeline" \
  -H "Authorization: Bearer ${TURSO_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"requests":[{"type":"execute","stmt":{"sql":"CREATE TABLE IF NOT EXISTS \"users\" (\"id\" TEXT NOT NULL PRIMARY KEY, \"displayName\" TEXT NOT NULL, \"country\" TEXT NOT NULL, \"region\" TEXT NOT NULL DEFAULT \"\", \"city\" TEXT NOT NULL DEFAULT \"\", \"latitude\" REAL, \"longitude\" REAL, \"contactInfo\" TEXT NOT NULL DEFAULT \"\", \"bio\" TEXT NOT NULL DEFAULT \"\", \"avatarUrl\" TEXT, \"isVisible\" BOOLEAN NOT NULL DEFAULT false, \"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, \"updatedAt\" DATETIME NOT NULL)"}},{"type":"execute","stmt":{"sql":"CREATE TABLE IF NOT EXISTS \"posts\" (\"id\" TEXT NOT NULL PRIMARY KEY, \"content\" TEXT NOT NULL, \"userId\" TEXT NOT NULL, \"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, \"updatedAt\" DATETIME NOT NULL, CONSTRAINT \"posts_userId_fkey\" FOREIGN KEY (\"userId\") REFERENCES \"users\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE)"}},{"type":"execute","stmt":{"sql":"CREATE TABLE IF NOT EXISTS \"hashtags\" (\"id\" TEXT NOT NULL PRIMARY KEY, \"name\" TEXT NOT NULL)"}},{"type":"execute","stmt":{"sql":"CREATE TABLE IF NOT EXISTS \"post_hashtags\" (\"postId\" TEXT NOT NULL, \"hashtagId\" TEXT NOT NULL, PRIMARY KEY (\"postId\", \"hashtagId\"), CONSTRAINT \"post_hashtags_postId_fkey\" FOREIGN KEY (\"postId\") REFERENCES \"posts\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT \"post_hashtags_hashtagId_fkey\" FOREIGN KEY (\"hashtagId\") REFERENCES \"hashtags\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE)"}},{"type":"execute","stmt":{"sql":"CREATE TABLE IF NOT EXISTS \"media\" (\"id\" TEXT NOT NULL PRIMARY KEY, \"url\" TEXT NOT NULL, \"type\" TEXT NOT NULL, \"userId\" TEXT, \"postId\" TEXT, \"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT \"media_userId_fkey\" FOREIGN KEY (\"userId\") REFERENCES \"users\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT \"media_postId_fkey\" FOREIGN KEY (\"postId\") REFERENCES \"posts\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE)"}},{"type":"execute","stmt":{"sql":"CREATE UNIQUE INDEX IF NOT EXISTS \"hashtags_name_key\" ON \"hashtags\"(\"name\")"}},{"type":"close"}]}'

echo ""
echo "Done! If you see results above with no errors, your database is ready."
