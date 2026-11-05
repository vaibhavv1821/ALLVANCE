import React from 'react';
import { ModuleScreenLayout } from '@/components/ModuleScreenLayout';

export default function AnalyticsScreen() {
  return (
    <ModuleScreenLayout
      id="analytics"
      title="Analytics & Insights"
      subtitle="Readiness Index, Streaks & Performance Metrics"
      iconName="BarChart3"
      accentColor="#6366F1"
      description="Visual analytics on practice streaks, problem solving velocity, application funnel conversion rates, and overall interview readiness score."
      highlights={[
        {
          title: 'Placement Readiness Index',
          desc: 'Aggregate score computed across DSA, SQL, Aptitude, CS Core, and Resume strength.',
        },
        {
          title: 'Daily Practice Heatmap',
          desc: 'GitHub-style activity calendar tracking daily consistency and active days.',
        },
        {
          title: 'Topic Mastery Distribution',
          desc: 'Radar and bar charts revealing strong areas vs blind spots needing attention.',
        },
      ]}
      showBack={true}
    />
  );
}
