export interface SeedInterviewQuestion {
  id: string;
  categoryId: string;
  title: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  answer: string;
  example?: string;
  codeExample?: string;
  keyPoints: string[];
  followUps: Array<{ question: string; answer?: string }>;
  companies: string[];
  tags: string[];
}
