import { SEED_INTERVIEW_CATEGORIES } from './categories';
import { SEED_COMPANIES } from './companyData';
import { FLAGSHIP_PROJECTS } from './flagshipProjects';
import { JAVA_QUESTIONS } from './javaQuestions';
import { PYTHON_QUESTIONS } from './pythonQuestions';
import { SQL_QUESTIONS } from './sqlQuestions';
import { DBMS_QUESTIONS } from './dbmsQuestions';
import { OOPS_QUESTIONS } from './oopsQuestions';
import { DSA_QUESTIONS } from './dsaQuestions';
import { OS_QUESTIONS } from './osQuestions';
import { CN_QUESTIONS } from './cnQuestions';
import { HR_QUESTIONS } from './hrQuestions';
import { PROJECT_QUESTIONS } from './projectQuestions';
import { DEV_QUESTIONS } from './devQuestions';
import { AIML_QUESTIONS } from './aimlQuestions';
import { SeedInterviewQuestion } from './types';

export * from './types';
export * from './categories';
export * from './companyData';
export * from './flagshipProjects';

export const ALL_INTERVIEW_QUESTIONS: SeedInterviewQuestion[] = [
  ...JAVA_QUESTIONS,
  ...PYTHON_QUESTIONS,
  ...SQL_QUESTIONS,
  ...DBMS_QUESTIONS,
  ...OOPS_QUESTIONS,
  ...DSA_QUESTIONS,
  ...OS_QUESTIONS,
  ...CN_QUESTIONS,
  ...HR_QUESTIONS,
  ...PROJECT_QUESTIONS,
  ...DEV_QUESTIONS,
  ...AIML_QUESTIONS,
];
