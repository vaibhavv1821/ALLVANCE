import React from 'react';
import { ModuleScreenLayout } from '@/components/ModuleScreenLayout';

export default function AiScreen() {
  return (
    <ModuleScreenLayout
      id="ai"
      title="AI Assistant"
      subtitle="On-Device & Local Intelligent Companion"
      iconName="Bot"
      accentColor="#A855F7"
      description="Private growth assistant for code hints, mock behavioral interviews, resume bullet optimization, and conceptual explanations."
      highlights={[
        {
          title: 'DSA Guided Hints',
          desc: 'Get hints step-by-step from intuition to pseudo-code without spoiling the answer.',
        },
        {
          title: 'Behavioral Answer Feedback',
          desc: 'Critique STAR responses on conciseness, measurable impact, and clarity.',
        },
        {
          title: 'Private & Local-First',
          desc: 'Zero mandatory cloud backends or expensive subscriptions.',
        },
      ]}
      showBack={true}
    />
  );
}
