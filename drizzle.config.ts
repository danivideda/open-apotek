import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema/",
  out: "./drizzle",
  driver: "better-sqlite",
  dbCredentials: {
    url: "./src/db/database.db",
  },
} satisfies Config;
