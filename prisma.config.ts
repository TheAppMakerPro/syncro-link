import "dotenv/config";
import path from "node:path";
import { defineConfig } from "prisma/config";

// Prisma migrate needs https:// not libsql://
const dbUrl = process.env["TURSO_DATABASE_URL"]?.replace("libsql://", "https://");

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    url: dbUrl,
  },
});
