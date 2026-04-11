import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  // 1. Point to your schema file
  schema: "prisma/schema.prisma",

  // 2. Connect to Neon using your .env variable
  datasource: {
    url: env("DATABASE_URL"),
  },

  // 3. Setup Migration and Seeding paths
  // This allows you to run 'npx prisma db seed' easily
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
});