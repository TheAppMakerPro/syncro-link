import "dotenv/config";
import path from "node:path";
import { defineConfig } from "prisma/config";

const dbUrl = process.env["TURSO_DATABASE_URL"]!;
// Prisma's datasource validator needs file: for SQLite; the adapter handles the real connection at runtime
const datasourceUrl = dbUrl.startsWith("libsql://") ? "file:placeholder.db" : dbUrl;

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    url: datasourceUrl,
  },
});
