import React from 'react';
import { ModuleScreenLayout } from '@/components/ModuleScreenLayout';

export default function SqlScreen() {
  return (
    <ModuleScreenLayout
      id="sql"
      title="SQL Studio"
      subtitle="Relational Database & Query Problem Sets"
      iconName="Database"
      accentColor="#F59E0B"
      description="Practice complex relational queries, aggregate window functions, common table expressions (CTEs), indexing strategies, and schema design."
      highlights={[
        {
          title: 'Interactive Query Practice',
          desc: 'Execute real queries directly on SQLite with instant output tables.',
        },
        {
          title: 'Top Interview Question Sets',
          desc: 'Nth highest salary, department top earners, consecutive numbers, and cumulative sums.',
        },
        {
          title: 'Schema & Indexing Cheat Sheets',
          desc: 'Quick reference for normalization, ACID transactions, isolation levels, and EXPLAIN query plan.',
        },
      ]}
      showBack={true}
    />
  );
}
