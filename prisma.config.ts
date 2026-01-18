import { config } from "dotenv";
import path from "path";
import { defineConfig } from "prisma/config";

// Explicitly load .env from project root with override
config({ path: path.resolve(process.cwd(), ".env"), override: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
