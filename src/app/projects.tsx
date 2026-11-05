import React from 'react';
import { ModuleScreenLayout } from '@/components/ModuleScreenLayout';

export default function ProjectsScreen() {
  return (
    <ModuleScreenLayout
      id="projects"
      title="Project Portfolio"
      subtitle="Full-Stack & Systems Architecture Showcase"
      iconName="FolderGit2"
      accentColor="#14B8A6"
      description="Document your flagship software projects, architecture diagrams, technical trade-offs, deployment links, and elevator pitches for interview discussions."
      highlights={[
        {
          title: 'Project Architecture Blueprints',
          desc: 'Detail tech stacks, backend architecture, database schemas, and caching layers.',
        },
        {
          title: 'Interview Elevator Pitch',
          desc: 'Formulate crisp 2-minute project introductions highlighting personal contributions and technical hurdles solved.',
        },
        {
          title: 'Live Metrics & GitHub Links',
          desc: 'Save production links, README URLs, API documentation, and performance benchmarks.',
        },
      ]}
      showBack={true}
    />
  );
}
