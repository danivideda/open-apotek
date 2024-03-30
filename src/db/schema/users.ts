import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  username: text("username").notNull().unique(),
  passwordHash: text("pasword_hash").notNull(),
  jwtRefreshToken: text("jwt_refresh_token")
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
