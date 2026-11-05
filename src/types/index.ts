export type ID = string | number;
export type Timestamp = number;

export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export type ApplicationStatus =
  | 'applied'
  | 'shortlisted'
  | 'assessment'
  | 'interview'
  | 'offered'
  | 'rejected'
  | 'withdrawn';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export * from '@/theme/tokens';
export * from '@/constants/modules';
