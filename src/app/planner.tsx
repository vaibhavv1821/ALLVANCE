import React from 'react';
import { ModuleScreenLayout } from '@/components/ModuleScreenLayout';

export default function PlannerScreen() {
  return (
    <ModuleScreenLayout
      id="planner"
      title="Study Planner"
      subtitle="Daily Objectives, Milestones & Timelines"
      iconName="CalendarClock"
      accentColor="#F97316"
      description="Plan your daily learning schedule, set study sprints, track milestone countdowns, and build study consistency offline."
      highlights={[
        {
          title: 'Daily Task Checklists',
          desc: 'Prioritize high, medium, and low priority tasks with category tags.',
        },
        {
          title: 'Placement Countdown Timers',
          desc: 'Keep target drive deadlines and interview milestones top of mind.',
        },
        {
          title: 'Sprint & Weekly Goals',
          desc: 'Set weekly targets (e.g., 20 DSA problems, 2 mock tests, 1 system design topic).',
        },
      ]}
      showBack={true}
    />
  );
}
