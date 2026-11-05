import React from 'react';
import { ModuleScreenLayout } from '@/components/ModuleScreenLayout';

export default function AiTab() {
  return (
    <ModuleScreenLayout
      id="ai"
      title="AI Growth Assistant"
      subtitle="Intelligent Guidance, Code Hints & STAR Coach"
      iconName="Bot"
      accentColor="#A855F7"
      description="Private, on-device intelligence companion designed to generate hints for tough DSA problems, evaluate behavioral interview responses, and critique your resume bullets."
      highlights={[
        {
          title: 'DSA Code Hint Generator',
          desc: 'Get progressive conceptual hints without spoiling the entire solution.',
        },
        {
          title: 'STAR Method Interview Coach',
          desc: 'Analyze your behavioral answers against Situation, Task, Action, Result parameters.',
        },
        {
          title: 'Resume Bullet Optimizer',
          desc: 'Transform passive job descriptions into metric-driven action bullets.',
        },
      ]}
      showBack={false}
    />
  );
}
