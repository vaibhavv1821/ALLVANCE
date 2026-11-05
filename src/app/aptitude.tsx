import React from 'react';
import { ModuleScreenLayout } from '@/components/ModuleScreenLayout';

export default function AptitudeScreen() {
  return (
    <ModuleScreenLayout
      id="aptitude"
      title="Aptitude & Reasoning"
      subtitle="Quantitative, Logical & Verbal Aptitude"
      iconName="Calculator"
      accentColor="#06B6D4"
      description="Sharpen quantitative formulas, speed calculation techniques, logical reasoning puzzles, syllogisms, and verbal comprehension for online assessments."
      highlights={[
        {
          title: 'Quantitative Formulas & Shortcuts',
          desc: 'Time & Work, Speed Distance Time, Percentages, Permutations, Probability, and Profit & Loss.',
        },
        {
          title: 'Logical Reasoning Drills',
          desc: 'Blood relations, seating arrangements, direction sense, and coding-decoding puzzles.',
        },
        {
          title: 'Timed Mock Assessment',
          desc: 'Practice under standard test constraints (1 min/question) with breakdown analysis.',
        },
      ]}
      showBack={true}
    />
  );
}
