import { pgTable, serial, integer } from "drizzle-orm/pg-core";

export const siteVisits = pgTable("site_visits", {
  id: serial("id").primaryKey(),
  count: integer("count").notNull().default(0),
});
