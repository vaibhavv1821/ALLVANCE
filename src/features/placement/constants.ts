export const JOB_TYPES = [
  'Full-time',
  'Internship',
  'FTE + Internship',
  'Contract',
  'Part-time',
];

export const APPLICATION_SOURCES = [
  'Campus Placement',
  'Company Career Portal',
  'LinkedIn',
  'Referral',
  'Job Board (Naukri/Indeed)',
  'Hackathon / Hiring Challenge',
  'Off-Campus Drive',
  'Direct Outreach',
];

export const DEFAULT_INDUSTRIES = [
  'Software & Technology',
  'FinTech & Banking',
  'E-Commerce & Retail',
  'Consulting & Services',
  'AI & Data Analytics',
  'Healthcare & BioTech',
  'EdTech',
  'Automotive & EV',
  'Telecom & Networking',
  'Core Engineering',
];

export const HIRING_ROUND_TYPES = [
  { value: 'assessment', label: 'Online Assessment / OA' },
  { value: 'aptitude', label: 'Aptitude & Reasoning' },
  { value: 'coding', label: 'Live Coding Round' },
  { value: 'technical', label: 'Technical Interview 1' },
  { value: 'technical2', label: 'Technical Interview 2' },
  { value: 'managerial', label: 'Managerial / Bar Raiser' },
  { value: 'hr', label: 'HR Interview' },
  { value: 'other', label: 'Other Round' },
];

export const ROUND_RESULTS = [
  { value: 'CLEARED', label: 'Cleared', color: '#10B981' },
  { value: 'PENDING', label: 'Pending', color: '#F59E0B' },
  { value: 'AWAITING_RESULT', label: 'Awaiting Result', color: '#38BDF8' },
  { value: 'REJECTED', label: 'Rejected', color: '#EF4444' },
];

export const ROUND_COMPLETION_STATUSES = [
  { value: 'SCHEDULED', label: 'Scheduled' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'SKIPPED', label: 'Skipped' },
  { value: 'CANCELLED', label: 'Cancelled' },
];
