import React from 'react';
import { ModuleScreenLayout } from '@/components/ModuleScreenLayout';

export default function ResumeScreen() {
  return (
    <ModuleScreenLayout
      id="resume"
      title="Resume Builder"
      subtitle="ATS-Optimized Resumes & Profiles"
      iconName="FileText"
      accentColor="#818CF8"
      description="Create, manage, and tailor ATS-friendly single-page resumes with metric-driven bullet points and role-specific exports."
      highlights={[
        {
          title: 'ATS-Friendly Templates',
          desc: 'Clean markdown-based and clean PDF layout designs accepted by top ATS systems.',
        },
        {
          title: 'Action-Verb Bullet Optimizer',
          desc: 'Formulate impact statements using Google XYZ formula (Accomplished [X], measured by [Y], by doing [Z]).',
        },
        {
          title: 'Version Control per Role',
          desc: 'Maintain distinct versions tailored for SDE, Frontend, Data Engineering, and Backend roles.',
        },
      ]}
      showBack={true}
    />
  );
}
