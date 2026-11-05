export const DSA_PLATFORMS = [
  'LeetCode',
  'GeeksforGeeks',
  'HackerRank',
  'CodeStudio',
  'Codeforces',
  'Custom',
] as const;

export const DSA_DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const;

export const DIFFICULTY_COLORS: Record<'Easy' | 'Medium' | 'Hard', { color: string; bg: string; border: string }> = {
  Easy: {
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.3)',
  },
  Medium: {
    color: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.3)',
  },
  Hard: {
    color: '#EF4444',
    bg: 'rgba(239, 68, 68, 0.12)',
    border: 'rgba(239, 68, 68, 0.3)',
  },
};

export const STATUS_COLORS: Record<string, { color: string; bg: string; label: string }> = {
  solved: {
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.12)',
    label: 'Solved',
  },
  attempted: {
    color: '#38BDF8',
    bg: 'rgba(56, 189, 248, 0.12)',
    label: 'Attempted',
  },
  unsolved: {
    color: '#94A3B8',
    bg: 'rgba(148, 163, 184, 0.12)',
    label: 'Unsolved',
  },
  revision: {
    color: '#818CF8',
    bg: 'rgba(129, 140, 248, 0.12)',
    label: 'In Revision',
  },
};

export const MASTERY_COLORS: Record<'weak' | 'average' | 'strong', { color: string; label: string }> = {
  weak: { color: '#EF4444', label: 'Weak' },
  average: { color: '#F59E0B', label: 'Average' },
  strong: { color: '#10B981', label: 'Strong' },
};

export const PRIORITY_COLORS: Record<'low' | 'medium' | 'high', { color: string; label: string }> = {
  low: { color: '#64748B', label: 'Low' },
  medium: { color: '#38BDF8', label: 'Medium' },
  high: { color: '#F59E0B', label: 'High' },
};

export const SOLUTION_LANGUAGES = [
  'Java',
  'Python',
  'C++',
  'JavaScript',
  'TypeScript',
  'Custom',
] as const;

export const POPULAR_COMPANY_TAGS = [
  'Amazon',
  'Google',
  'Microsoft',
  'Meta',
  'Infosys',
  'TCS',
  'Deloitte',
  'Accenture',
  'Cognizant',
  'Capgemini',
  'Wipro',
  'HCL',
  'Adobe',
  'Apple',
  'Netflix',
];

export const POPULAR_TOPIC_TAGS = [
  'Two Pointers',
  'Sliding Window',
  'Binary Search',
  'Dynamic Programming',
  'Backtracking',
  'Prefix Sum',
  'Monotonic Stack',
  'BFS / DFS',
  'Fast & Slow Pointers',
  'Kadane Algorithm',
  'Bit Manipulation',
  'Greedy',
  'Trie',
  'Union Find',
];
