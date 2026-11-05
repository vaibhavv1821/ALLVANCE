export interface ModuleDefinition {
  id: string;
  title: string;
  route: string;
  description: string;
  category: 'Career & Placement' | 'Technical Practice' | 'Productivity & Planning' | 'Intelligence & Growth' | 'System';
  accentColor: string;
  iconName: string;
  badge?: string;
}

export const ALL_MODULES: ModuleDefinition[] = [
  // 1. Placement
  {
    id: 'placement',
    title: 'Placement',
    route: '/placement',
    description: 'Track job applications, recruitment drives, package details, and offer status.',
    category: 'Career & Placement',
    accentColor: '#38BDF8',
    iconName: 'Briefcase',
    badge: 'Core',
  },
  // 2. DSA
  {
    id: 'dsa',
    title: 'DSA Practice',
    route: '/dsa',
    description: 'Master Data Structures & Algorithms with structured problem tracking and revision tags.',
    category: 'Technical Practice',
    accentColor: '#10B981',
    iconName: 'Code2',
    badge: 'Daily',
  },
  // 3. Resume
  {
    id: 'resume',
    title: 'Resume Builder',
    route: '/resume',
    description: 'ATS resume templates, bullet point optimizer, and role-specific exports.',
    category: 'Career & Placement',
    accentColor: '#818CF8',
    iconName: 'FileText',
  },
  // 4. SQL
  {
    id: 'sql',
    title: 'SQL Studio',
    route: '/sql',
    description: 'Interactive queries, schemas, database problem sets, and query optimization.',
    category: 'Technical Practice',
    accentColor: '#F59E0B',
    iconName: 'Database',
  },
  // 5. Interview Preparation
  {
    id: 'interviews',
    title: 'Interview Preparation',
    route: '/interviews',
    description: 'Mock interviews, behavioral STAR responses, CS fundamentals, and questions.',
    category: 'Career & Placement',
    accentColor: '#EC4899',
    iconName: 'MessagesSquare',
  },
  // 6. Aptitude
  {
    id: 'aptitude',
    title: 'Aptitude & Reasoning',
    route: '/aptitude',
    description: 'Quantitative aptitude, logical reasoning, and verbal practice formulas.',
    category: 'Technical Practice',
    accentColor: '#06B6D4',
    iconName: 'Calculator',
  },
  // 7. Companies
  {
    id: 'companies',
    title: 'Company Directory',
    route: '/companies',
    description: 'Hiring patterns, eligibility criteria, interview rounds, and company research.',
    category: 'Career & Placement',
    accentColor: '#8B5CF6',
    iconName: 'Building2',
  },
  // 8. Projects
  {
    id: 'projects',
    title: 'Project Portfolio',
    route: '/projects',
    description: 'Showcase system architecture, tech stacks, GitHub links, and deployment metrics.',
    category: 'Career & Placement',
    accentColor: '#14B8A6',
    iconName: 'FolderGit2',
  },
  // 9. Study Planner
  {
    id: 'planner',
    title: 'Study Planner',
    route: '/planner',
    description: 'Daily schedules, milestone roadmaps, exam countdowns, and pomodoro goals.',
    category: 'Productivity & Planning',
    accentColor: '#F97316',
    iconName: 'CalendarClock',
  },
  // 10. Knowledge Vault
  {
    id: 'knowledge',
    title: 'Knowledge Vault',
    route: '/knowledge',
    description: 'Personal offline wiki, cheat sheets, markdown notes, and quick references.',
    category: 'Productivity & Planning',
    accentColor: '#EAB308',
    iconName: 'BookMarked',
  },
  // 11. AI Assistant
  {
    id: 'ai',
    title: 'AI Assistant',
    route: '/ai',
    description: 'On-device / private intelligence for coding hints, interview feedback, and tips.',
    category: 'Intelligence & Growth',
    accentColor: '#A855F7',
    iconName: 'Bot',
    badge: 'Smart',
  },
  // 12. Analytics
  {
    id: 'analytics',
    title: 'Analytics & Insights',
    route: '/analytics',
    description: 'Growth velocity, consistency streaks, question heatmaps, and readiness index.',
    category: 'Intelligence & Growth',
    accentColor: '#6366F1',
    iconName: 'BarChart3',
  },
  // 13. Skills
  {
    id: 'skills',
    title: 'Skills Matrix',
    route: '/skills',
    description: 'Technical and soft skills taxonomy, proficiency levels, and target gaps.',
    category: 'Intelligence & Growth',
    accentColor: '#0284C7',
    iconName: 'Sparkles',
  },
  // 14. Personal Manager
  {
    id: 'personal',
    title: 'Personal Manager',
    route: '/personal',
    description: 'Habits, wellness logs, personal routines, reflections, and mindset goals.',
    category: 'Productivity & Planning',
    accentColor: '#10B981',
    iconName: 'UserCheck',
  },
  // 15. Settings
  {
    id: 'settings',
    title: 'Settings',
    route: '/settings',
    description: 'Offline database backups, dark/light themes, notifications, and profile.',
    category: 'System',
    accentColor: '#64748B',
    iconName: 'Settings',
  },
];
