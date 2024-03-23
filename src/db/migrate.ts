import { db, sqlite } from ".";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

migrate(db, { migrationsFolder: "./drizzle" });

sqlite.close();
