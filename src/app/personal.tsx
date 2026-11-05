import React from 'react';
import { ModuleScreenLayout } from '@/components/ModuleScreenLayout';

export default function PersonalScreen() {
  return (
    <ModuleScreenLayout
      id="personal"
      title="Personal Manager"
      subtitle="Habits, Mental Wellness & Routine Logs"
      iconName="UserCheck"
      accentColor="#10B981"
      description="Nurture personal habits, track sleep and wellness, log daily reflections, avoid burnout, and stay focused during intense placement cycles."
      highlights={[
        {
          title: 'Daily Habit Loops',
          desc: 'Track habits like morning workout, deep work focus blocks, reading, and meditation.',
        },
        {
          title: 'Mental Clarity & Reflection Logs',
          desc: 'Quick daily evening reflections to celebrate small wins and reset stress levels.',
        },
        {
          title: 'Burnout Prevention Monitor',
          desc: 'Monitor study fatigue indicators and maintain healthy sleep and recovery rhythms.',
        },
      ]}
      showBack={true}
    />
  );
}
