import React from 'react';
import { ModuleScreenLayout } from '@/components/ModuleScreenLayout';

export default function CompaniesScreen() {
  return (
    <ModuleScreenLayout
      id="companies"
      title="Company Directory"
      subtitle="Hiring Trends, Tier Lists & Round Breakdown"
      iconName="Building2"
      accentColor="#8B5CF6"
      description="Research target product and service companies, compensation tiers, recruitment criteria, standard online assessment platforms, and past interview experiences."
      highlights={[
        {
          title: 'Tiered Target Company Lists',
          desc: 'Categorize companies into Dream, Target, and Safe based on eligibility and hiring bars.',
        },
        {
          title: 'Hiring Process Roadmaps',
          desc: 'Know what each company emphasizes: OA platforms (HackerRank, CodeSignal), round counts, and system design expectations.',
        },
        {
          title: 'Alumni & Referral Network Log',
          desc: 'Track senior alumni contacts, LinkedIn outreach dates, and response status.',
        },
      ]}
      showBack={true}
    />
  );
}
