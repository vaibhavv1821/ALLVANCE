import {
  DsaProblem,
  DsaTopic,
  DsaSubtopic,
  DsaSolution,
  DsaAttempt,
  DsaRevision,
} from '@/database/schema/dsa';
import { ProblemDetailed, ProblemFilterOptions } from '@/database/repositories/DsaProblemRepository';
import { TopicWithStats } from '@/database/repositories/DsaTopicRepository';
import { RevisionWithProblem } from '@/database/repositories/DsaRevisionRepository';
import {
  DsaDashboardMetrics,
  DsaAnalyticsMetrics,
} from '@/database/repositories/DsaDashboardRepository';

export type DsaTabType = 'overview' | 'roadmap' | 'problems' | 'revision' | 'analytics';

export interface ProblemFormData {
  title: string;
  problemStatement?: string;
  problemIdExt?: string;
  platform: string;
  externalUrl?: string;
  topicId?: string;
  topicName: string;
  subtopicId?: string;
  subtopicName?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'unsolved' | 'attempted' | 'solved' | 'revision';
  approach?: string;
  algorithmExplanation?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  notes?: string;
  importantEdgeCases?: string;
  tags: string[];
  companies: string[];
}

export interface SolutionFormData {
  title: string;
  language: string;
  code: string;
  approach?: string;
  explanation?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  edgeCases?: string;
  mistakes?: string;
  isOptimal?: boolean;
}

export interface AttemptFormData {
  status: 'failed' | 'partially_solved' | 'solved';
  timeSpentMinutes: number;
  approachNotes?: string;
  codeSnippet?: string;
  language?: string;
}

export interface TopicFormData {
  title: string;
  level: number;
  levelName: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  mastery: 'weak' | 'average' | 'strong';
  notes?: string;
}

// ==========================================
// AI Integration Preparation (Requirement 15)
// ==========================================
export interface DsaAiExplanationRequest {
  problemTitle: string;
  problemStatement?: string;
  code?: string;
  language?: string;
}

export interface DsaAiHintRequest {
  problemTitle: string;
  topicName: string;
  currentApproach?: string;
  hintLevel: 1 | 2 | 3; // 1: small nudge, 2: pattern hint, 3: full pseudocode
}

export interface DsaAiComplexityAnalysis {
  timeComplexity: string;
  spaceComplexity: string;
  reasoning: string;
  optimizationsPossible: string[];
}

export interface DsaAiProblemSuggestion {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  reason: string;
}

export interface IDsaAiService {
  explainProblem(request: DsaAiExplanationRequest): Promise<string>;
  generateHint(request: DsaAiHintRequest): Promise<string>;
  analyzeComplexity(code: string, language: string): Promise<DsaAiComplexityAnalysis>;
  suggestNextProblems(weakTopics: string[]): Promise<DsaAiProblemSuggestion[]>;
}
