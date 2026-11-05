import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const tasks = sqliteTable('tasks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  dueDate: integer('due_date'),
  priority: text('priority').notNull().default('medium'), // low, medium, high, urgent
  status: text('status').notNull().default('pending'), // pending, in_progress, completed, cancelled
  category: text('category').notNull().default('general'), // study, interview, dsa, personal, project
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
