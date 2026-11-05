import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const dsaProblems = sqliteTable('dsa_problems', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  platform: text('platform').notNull(), // LeetCode, CodeForces, GFG, etc.
  difficulty: text('difficulty').notNull(), // Easy, Medium, Hard
  status: text('status').notNull().default('unsolved'), // unsolved, solving, solved, revision
  topic: text('topic').notNull(), // Arrays, DP, Graphs, Trees, etc.
  url: text('url'),
  notes: text('notes'),
  solvedAt: integer('solved_at'),
  createdAt: integer('created_at').notNull(),
});

export type DsaProblem = typeof dsaProblems.$inferSelect;
export type NewDsaProblem = typeof dsaProblems.$inferInsert;
