import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const schemaMigrations = sqliteTable('schema_migrations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  version: integer('version').notNull().unique(),
  name: text('name').notNull(),
  appliedAt: integer('applied_at').notNull(),
});

export type SchemaMigration = typeof schemaMigrations.$inferSelect;
export type NewSchemaMigration = typeof schemaMigrations.$inferInsert;
