import React from 'react';
import { ModuleScreenLayout } from '@/components/ModuleScreenLayout';

export default function SkillsScreen() {
  return (
    <ModuleScreenLayout
      id="skills"
      title="Skills Matrix"
      subtitle="Competency Mapping & Skill Gap Analysis"
      iconName="Sparkles"
      accentColor="#0284C7"
      description="Map your technical and soft skills inventory, self-rate proficiency levels from beginner to expert, and target high-yield skills for target job descriptions."
      highlights={[
        {
          title: 'Skill Taxonomy Breakdown',
          desc: 'Languages (TypeScript, Python, C++, Java), Frameworks (React Native, Node, Next.js), Tools (Docker, Git, Linux).',
        },
        {
          title: 'Proficiency Level Ratings',
          desc: 'Track level 1 (Learned) to level 5 (Production Expert) with proof projects.',
        },
        {
          title: 'Job Description Matcher',
          desc: 'Compare your skills matrix against job descriptions to highlight resume gaps.',
        },
      ]}
      showBack={true}
    />
  );
}
