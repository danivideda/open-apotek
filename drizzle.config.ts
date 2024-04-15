import type { Config } from "drizzle-kit";
import "dotenv/config";

export default {
  schema: "./src/db/schema/",
  out: "./drizzle",
  driver: "better-sqlite",
  dbCredentials: {
    // url: "./src/db/database.db",
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
