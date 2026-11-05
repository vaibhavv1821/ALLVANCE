export type ResumeTabType = 'resumes' | 'editor' | 'preview' | 'ats' | 'jobMatch' | 'history';

export interface ResumeSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  dateRange?: string;
  details?: string;
}

export type SectionKey =
  | 'education'
  | 'experience'
  | 'internships'
  | 'projects'
  | 'technical_skills'
  | 'soft_skills'
  | 'certifications'
  | 'achievements'
  | 'extracurricular';
