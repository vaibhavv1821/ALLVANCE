import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const activityLogs = sqliteTable('activity_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  action: text('action').notNull(),
  module: text('module').notNull(),
  details: text('details'),
  timestamp: integer('timestamp').notNull(),
});

export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
