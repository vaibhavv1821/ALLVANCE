import React from 'react';
import { ModuleScreenLayout } from '@/components/ModuleScreenLayout';

export default function DsaScreen() {
  return (
    <ModuleScreenLayout
      id="dsa"
      title="DSA Practice"
      subtitle="Data Structures & Algorithms Mastery"
      iconName="Code2"
      accentColor="#10B981"
      description="Structured problem tracking across LeetCode, Codeforces, and GFG with space/time complexity notes, topic tags, and spaced repetition revisions."
      highlights={[
        {
          title: 'Curated Topic Roadmaps',
          desc: 'Arrays, Two Pointers, Sliding Window, DP, Trees, Graphs, Bit Manipulation.',
        },
        {
          title: 'Revision & Spaced Repetition',
          desc: 'Flag tricky problems and schedule automated review reminders.',
        },
        {
          title: 'Complexity & Approach Vault',
          desc: 'Save your own clean intuition notes, edge cases, and code templates.',
        },
      ]}
      showBack={true}
    />
  );
}
