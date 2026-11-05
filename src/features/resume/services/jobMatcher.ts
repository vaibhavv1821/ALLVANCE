import { ResumeDetailed } from '@/database/repositories/ResumeRepository';

export interface JobMatchResult {
  matchScore: number;
  grade: 'Excellent' | 'Good' | 'Moderate' | 'Low';
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
  analyzedJobTitle?: string;
  extractedRoleRequirements: string[];
}

// Common tech keywords & skill tokens to extract from job descriptions
const TECH_TERMS = [
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'golang', 'rust',
  'ruby', 'php', 'swift', 'kotlin', 'sql', 'html', 'css', 'sass', 'tailwind',
  'react', 'react native', 'next.js', 'vue', 'angular', 'svelte', 'redux', 'zustand',
  'node.js', 'express', 'nest.js', 'django', 'fastapi', 'flask', 'spring boot',
  'postgresql', 'mysql', 'mongodb', 'sqlite', 'redis', 'elasticsearch', 'dynamodb',
  'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'terraform', 'ci/cd', 'github actions',
  'git', 'linux', 'rest', 'graphql', 'grpc', 'microservices', 'distributed systems',
  'unit testing', 'jest', 'cypress', 'kafka', 'rabbitmq', 'websocket',
  'algorithms', 'data structures', 'system design', 'agile', 'scrum', 'oop'
];

export function matchJobDescription(
  resume: ResumeDetailed,
  jobDescription: string,
  targetJobTitle?: string
): JobMatchResult {
  const jdLower = jobDescription.toLowerCase();

  // 1. Build resume text
  const resumeText = [
    resume.title,
    resume.targetRole || '',
    resume.profile?.summary || '',
    ...resume.skills.map((s) => `${s.category} ${s.skills}`),
    ...resume.projects.map((p) => `${p.title} ${p.subtitle} ${p.techStack} ${p.description}`),
    ...resume.experience.map((e) => `${e.position} ${e.company} ${e.description}`),
    ...resume.education.map((ed) => `${ed.degree} ${ed.fieldOfStudy}`),
    ...resume.certifications.map((c) => `${c.name} ${c.issuer}`),
  ]
    .join(' ')
    .toLowerCase();

  // 2. Extract keywords mentioned in the Job Description
  const jdMatchedTerms: string[] = [];
  for (const term of TECH_TERMS) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(jdLower)) {
      jdMatchedTerms.push(term);
    }
  }

  // Also check for capitalized acronyms or distinct keywords in JD
  const customJdKeywords = jdLower.match(/\b[a-z]{3,15}\b/g) || [];
  const keywordFreq: Record<string, number> = {};
  for (const word of customJdKeywords) {
    if (TECH_TERMS.includes(word)) {
      keywordFreq[word] = (keywordFreq[word] || 0) + 1;
    }
  }

  // 3. Compare with Resume
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const term of jdMatchedTerms) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(resumeText)) {
      matchedKeywords.push(term);
    } else {
      missingKeywords.push(term);
    }
  }

  // 4. Calculate Match Score
  let matchScore = 50; // base score
  if (jdMatchedTerms.length > 0) {
    const ratio = matchedKeywords.length / jdMatchedTerms.length;
    matchScore = Math.round(ratio * 100);
  } else {
    // If no specific technical keywords extracted, calculate based on general overlap
    const jdWords = new Set(jdLower.match(/\b[a-z]{4,}\b/g) || []);
    let overlaps = 0;
    jdWords.forEach((w) => {
      if (resumeText.includes(w)) overlaps++;
    });
    matchScore = jdWords.size > 0 ? Math.min(100, Math.round((overlaps / jdWords.size) * 120)) : 65;
  }

  // Grade classification
  let grade: JobMatchResult['grade'] = 'Moderate';
  if (matchScore >= 80) grade = 'Excellent';
  else if (matchScore >= 65) grade = 'Good';
  else if (matchScore >= 45) grade = 'Moderate';
  else grade = 'Low';

  // 5. Formulate actionable recommendations
  const recommendations: string[] = [];

  if (missingKeywords.length > 0) {
    const topMissing = missingKeywords.slice(0, 4);
    recommendations.push(
      `Incorporate key missing technologies into your Technical Skills: "${topMissing.join('", "')}".`
    );
  }

  if (targetJobTitle && !resumeText.includes(targetJobTitle.toLowerCase())) {
    recommendations.push(
      `Align your Resume Target Role or Summary to reflect "${targetJobTitle}".`
    );
  }

  if (missingKeywords.some((k) => ['docker', 'kubernetes', 'aws', 'ci/cd'].includes(k))) {
    recommendations.push(
      'The role emphasizes DevOps & Cloud deployment. Mention relevant containerization or CI/CD tools.'
    );
  }

  if (missingKeywords.some((k) => ['system design', 'microservices', 'distributed systems'].includes(k))) {
    recommendations.push(
      'Highlight system architecture principles (e.g. caching, latency optimization, database indexing) in your project bullets.'
    );
  }

  if (matchedKeywords.length >= 6) {
    recommendations.push(
      `Strong alignment found on core competencies: ${matchedKeywords.slice(0, 5).join(', ')}.`
    );
  }

  return {
    matchScore,
    grade,
    matchedKeywords,
    missingKeywords,
    recommendations,
    analyzedJobTitle: targetJobTitle,
    extractedRoleRequirements: jdMatchedTerms,
  };
}
