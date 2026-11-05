import {
  CategoryWithStats,
  QuestionWithMetadata,
  InterviewDashboardMetrics,
} from '@/database/repositories/InterviewPrepRepository';
import {
  MockInterview,
  MockSessionWithQuestions,
  MockReportSummary,
} from '@/database/repositories/MockInterviewRepository';
import { CompanyPrepProfile } from '@/database/seed/interviews/companyData';
import { FlagshipProjectBlueprint } from '@/database/seed/interviews/flagshipProjects';
import { InterviewUserProject } from '@/database/schema/interviews';

export type InterviewTabType =
  | 'dashboard'
  | 'technical'
  | 'companies'
  | 'hr'
  | 'projects'
  | 'mock'
  | 'revision';

export interface InterviewFeatureState {
  activeTab: InterviewTabType;
  metrics: InterviewDashboardMetrics | null;
  categories: CategoryWithStats[];
  selectedCategory: CategoryWithStats | null;
  questions: QuestionWithMetadata[];
  selectedQuestion: QuestionWithMetadata | null;
  selectedCompany: CompanyPrepProfile | null;
  selectedProject: InterviewUserProject | null;
  activeMockSession: MockSessionWithQuestions | null;
  mockReport: MockReportSummary | null;
}
