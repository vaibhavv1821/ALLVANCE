import { ResumeDetailed } from '@/database/repositories/ResumeRepository';

export interface AtsCategoryScore {
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
  feedback: string;
}

export interface AtsAnalysisResult {
  overallScore: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  breakdown: {
    contact: AtsCategoryScore;
    sections: AtsCategoryScore;
    skills: AtsCategoryScore;
    projects: AtsCategoryScore;
    actionVerbs: AtsCategoryScore;
    quantifiableMetrics: AtsCategoryScore;
    contentDensity: AtsCategoryScore;
  };
  missingSections: string[];
  actionVerbsFound: string[];
  metricsFound: string[];
  suggestions: {
    type: 'critical' | 'improvement' | 'strength';
    title: string;
    description: string;
  }[];
  keywordCoverage: {
    detected: string[];
    suggested: string[];
  };
  wordCount: number;
  disclaimer: string;
}

// 120+ High-Impact Action Verbs for Software & Tech Resumes
const STRONG_ACTION_VERBS = new Set([
  'accelerated', 'achieved', 'administered', 'allocated', 'analyzed', 'applied',
  'architected', 'automated', 'boosted', 'built', 'centralized', 'championed',
  'collaborated', 'composed', 'computed', 'conceptualized', 'configured', 'constructed',
  'converted', 'coordinated', 'created', 'customized', 'debugged', 'decreased',
  'defined', 'delivered', 'deployed', 'designed', 'developed', 'devised',
  'diagnosed', 'diminished', 'directed', 'documented', 'doubled', 'drafted',
  'eliminated', 'enabled', 'enacted', 'enforced', 'engineered', 'enhanced',
  'established', 'evaluated', 'executed', 'expanded', 'expedited', 'fabricated',
  'facilitated', 'formulated', 'fostered', 'generated', 'guided', 'halved',
  'headed', 'identified', 'implemented', 'improved', 'incorporated', 'increased',
  'initiated', 'innovated', 'inspected', 'installed', 'instituted', 'integrated',
  'introduced', 'invented', 'investigated', 'launched', 'led', 'leveraged',
  'maintained', 'managed', 'maximized', 'measured', 'mentored', 'migrated',
  'minimized', 'modernized', 'monitored', 'negotiated', 'optimized', 'orchestrated',
  'organized', 'originated', 'overhauled', 'oversaw', 'partnered', 'performed',
  'pioneered', 'planned', 'prioritized', 'produced', 'programmed', 'published',
  'rearchitected', 'rebuilt', 'reduced', 'refactored', 'refined', 'reorganized',
  'resolved', 'restructured', 'revamped', 'revitalized', 'scaled', 'scheduled',
  'secured', 'simplified', 'slashed', 'solved', 'spearheaded', 'standardized',
  'streamlined', 'strengthened', 'supervised', 'surpassed', 'synthesized', 'systematized',
  'targeted', 'tested', 'trained', 'transformed', 'transitioned', 'troubleshot',
  'unified', 'upgraded', 'validated', 'visualized', 'yielded'
]);

// High-Demand Technical Keywords
const ESSENTIAL_TECH_KEYWORDS = [
  'algorithms', 'data structures', 'system design', 'apis', 'rest', 'graphql',
  'microservices', 'sqlite', 'sql', 'postgresql', 'mongodb', 'redis', 'caching',
  'docker', 'kubernetes', 'aws', 'cloud', 'ci/cd', 'git', 'github', 'unit testing',
  'react', 'react native', 'typescript', 'javascript', 'python', 'c++', 'java',
  'node.js', 'concurrency', 'multithreading', 'optimization', 'performance'
];

export function analyzeResumeATS(resume: ResumeDetailed): AtsAnalysisResult {
  const suggestions: AtsAnalysisResult['suggestions'] = [];
  const missingSections: string[] = [];

  // ================= 1. CONTACT INFO (15 pts) =================
  let contactScore = 0;
  const p = resume.profile;
  if (p) {
    if (p.fullName && p.fullName.trim().length > 2) contactScore += 3;
    if (p.email && p.email.includes('@')) contactScore += 3;
    if (p.phone && p.phone.trim().length >= 8) contactScore += 3;
    if (p.location && p.location.trim().length > 2) contactScore += 2;
    if (p.linkedinUrl && p.linkedinUrl.toLowerCase().includes('linkedin')) contactScore += 2;
    if (p.githubUrl && p.githubUrl.toLowerCase().includes('github')) contactScore += 2;
    if (p.portfolioUrl && p.portfolioUrl.trim().length > 5) contactScore += 1;
  }
  contactScore = Math.min(15, contactScore);

  if (!p?.email || !p.email.includes('@')) {
    suggestions.push({
      type: 'critical',
      title: 'Missing or Invalid Email',
      description: 'Recruiters and ATS parsers require a valid email address to contact you.',
    });
  }
  if (!p?.phone) {
    suggestions.push({
      type: 'critical',
      title: 'Missing Phone Number',
      description: 'Add an active contact phone number with country code.',
    });
  }
  if (!p?.githubUrl) {
    suggestions.push({
      type: 'improvement',
      title: 'Add GitHub Link',
      description: 'Technical recruiters look for public repositories and open-source contributions.',
    });
  }
  if (!p?.linkedinUrl) {
    suggestions.push({
      type: 'improvement',
      title: 'Add LinkedIn Profile',
      description: 'Most ATS tools cross-reference applicant profiles with LinkedIn.',
    });
  }

  // ================= 2. SECTIONS COMPLETENESS (20 pts) =================
  let sectionsScore = 0;
  const hasEdu = resume.education && resume.education.length > 0;
  const hasExp = resume.experience && resume.experience.some((e) => e.isInternship === 0);
  const hasInternship = resume.experience && resume.experience.some((e) => e.isInternship === 1);
  const hasProj = resume.projects && resume.projects.length > 0;
  const hasSkills = resume.skills && resume.skills.length > 0;
  const hasCert = resume.certifications && resume.certifications.length > 0;
  const hasAchieve = resume.achievements && resume.achievements.length > 0;
  const hasSummary = Boolean(p?.summary && p.summary.trim().length >= 30);

  if (hasEdu) sectionsScore += 5; else missingSections.push('Education');
  if (hasProj) sectionsScore += 5; else missingSections.push('Projects');
  if (hasSkills) sectionsScore += 4; else missingSections.push('Technical Skills');
  if (hasExp || hasInternship) sectionsScore += 3; else missingSections.push('Experience / Internships');
  if (hasCert || hasAchieve) sectionsScore += 2; else missingSections.push('Certifications / Achievements');
  if (hasSummary) sectionsScore += 1; else missingSections.push('Professional Summary');

  if (!hasProj) {
    suggestions.push({
      type: 'critical',
      title: 'Zero Projects Listed',
      description: 'Projects demonstrate hands-on software engineering ability. Add at least 2 key projects.',
    });
  }
  if (!hasEdu) {
    suggestions.push({
      type: 'critical',
      title: 'Education Missing',
      description: 'Add your university degree, major, CGPA/percentage, and graduation dates.',
    });
  }

  // ================= 3. SKILLS & KEYWORDS (20 pts) =================
  let skillsScore = 0;
  const allSkillsRaw = (resume.skills || []).map((s) => s.skills).join(', ');
  const skillItems = allSkillsRaw
    .split(/[,|;•\n]/)
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length > 1);
  const uniqueSkillsCount = new Set(skillItems).size;

  if (uniqueSkillsCount >= 16) skillsScore = 20;
  else if (uniqueSkillsCount >= 10) skillsScore = 16;
  else if (uniqueSkillsCount >= 6) skillsScore = 12;
  else if (uniqueSkillsCount >= 3) skillsScore = 8;
  else skillsScore = Math.max(0, uniqueSkillsCount * 2);

  if (uniqueSkillsCount < 8) {
    suggestions.push({
      type: 'improvement',
      title: 'Expand Technical Skills List',
      description: `Only ${uniqueSkillsCount} skills found. Categorize your languages, frameworks, databases, and developer tools.`,
    });
  }

  // Detect technical keywords from entire resume text
  const fullText = [
    p?.summary || '',
    ...resume.education.map((e) => `${e.degree} ${e.fieldOfStudy} ${e.description}`),
    ...resume.experience.map((e) => `${e.position} ${e.company} ${e.description}`),
    ...resume.projects.map((pr) => `${pr.title} ${pr.techStack} ${pr.description}`),
    ...resume.skills.map((s) => `${s.category} ${s.skills}`),
    ...resume.certifications.map((c) => `${c.name} ${c.issuer}`),
    ...resume.achievements.map((a) => `${a.title} ${a.description}`),
  ]
    .join(' ')
    .toLowerCase();

  const detectedKeywords: string[] = [];
  const suggestedKeywords: string[] = [];

  for (const kw of ESSENTIAL_TECH_KEYWORDS) {
    if (fullText.includes(kw)) {
      detectedKeywords.push(kw);
    } else {
      suggestedKeywords.push(kw);
    }
  }

  // ================= 4. PROJECTS EVALUATION (15 pts) =================
  let projectsScore = 0;
  if (resume.projects.length >= 3) projectsScore += 6;
  else if (resume.projects.length >= 1) projectsScore += 3 * resume.projects.length;

  // Check if projects have tech stacks defined
  const projsWithTech = resume.projects.filter((pr) => pr.techStack && pr.techStack.trim().length > 3).length;
  if (projsWithTech >= 2) projectsScore += 5;
  else if (projsWithTech >= 1) projectsScore += 3;

  // Check if projects have descriptions with substance
  const projsWithGoodDesc = resume.projects.filter((pr) => pr.description && pr.description.trim().length >= 40).length;
  if (projsWithGoodDesc >= 2) projectsScore += 4;
  else if (projsWithGoodDesc >= 1) projectsScore += 2;

  projectsScore = Math.min(15, projectsScore);

  if (projsWithTech < resume.projects.length && resume.projects.length > 0) {
    suggestions.push({
      type: 'improvement',
      title: 'Explicitly List Tech Stack on Every Project',
      description: 'ATS parsers look for tools and languages directly affiliated with each project entry.',
    });
  }

  // ================= 5. ACTION VERBS ANALYSIS (10 pts) =================
  const wordsInText = fullText.match(/[a-z]+/g) || [];
  const detectedVerbs = new Set<string>();

  for (const word of wordsInText) {
    if (STRONG_ACTION_VERBS.has(word)) {
      detectedVerbs.add(word);
    }
  }

  const actionVerbsFound = Array.from(detectedVerbs);
  let actionVerbsScore = 0;
  if (actionVerbsFound.length >= 10) actionVerbsScore = 10;
  else if (actionVerbsFound.length >= 6) actionVerbsScore = 8;
  else if (actionVerbsFound.length >= 3) actionVerbsScore = 5;
  else actionVerbsScore = Math.min(4, actionVerbsFound.length * 1.5);

  if (actionVerbsFound.length < 5) {
    suggestions.push({
      type: 'improvement',
      title: 'Begin Bullet Points with Strong Action Verbs',
      description: 'Use assertive verbs like "Architected", "Engineered", "Optimized", "Scaled", or "Spearheaded".',
    });
  }

  // ================= 6. QUANTIFIABLE METRICS (10 pts) =================
  // Matches percentages (40%), numbers (15,000+, 200 users), latencies (30ms), multipliers (3x), currencies ($5k, ₹50,000)
  const metricRegex = /(\b\d+([.,]\d+)?\s*(%|x|ms|s|k|m|qps|users|clients|rps|gb|tb|lpa|inr|\$|₹|\+)?\b)/gi;
  const matches = fullText.match(metricRegex) || [];
  const validMetrics = matches.filter((m) => {
    const trimmed = m.trim();
    // Exclude basic years like 2021, 2024, 2025 unless accompanied by percent/unit
    if (/^(19|20)\d{2}$/.test(trimmed)) return false;
    return /\d/.test(trimmed);
  });

  const uniqueMetrics = Array.from(new Set(validMetrics.map((v) => v.trim())));
  let metricsScore = 0;
  if (uniqueMetrics.length >= 6) metricsScore = 10;
  else if (uniqueMetrics.length >= 4) metricsScore = 8;
  else if (uniqueMetrics.length >= 2) metricsScore = 5;
  else metricsScore = Math.min(3, uniqueMetrics.length * 2);

  if (uniqueMetrics.length < 3) {
    suggestions.push({
      type: 'critical',
      title: 'Add Quantifiable Results & Metrics',
      description: 'Use the Google XYZ formula: "Accomplished [X], measured by [Y], by doing [Z]" (e.g. "Reduced API latency by 38%").',
    });
  }

  // ================= 7. CONTENT DENSITY & LENGTH (10 pts) =================
  const totalWords = wordsInText.length;
  let densityScore = 10;
  let densityFeedback = 'Optimal content length and word count for standard 1-page format.';

  if (totalWords < 150) {
    densityScore = 4;
    densityFeedback = 'Resume is too sparse. Add more descriptive bullet points to projects and experience.';
    suggestions.push({
      type: 'improvement',
      title: 'Resume Content is Very Short',
      description: `Current word count is ~${totalWords} words. A strong 1-page technical resume contains 350-650 words.`,
    });
  } else if (totalWords < 250) {
    densityScore = 7;
    densityFeedback = 'Content is somewhat brief. Elaborate on implementation details and architectural decisions.';
  } else if (totalWords > 950) {
    densityScore = 6;
    densityFeedback = 'Resume is quite long. Consider consolidating to keep to a tight, high-impact structure.';
    suggestions.push({
      type: 'improvement',
      title: 'Consider Trimming Wordiness',
      description: 'Keep bullets concise and punchy. Aim for 2-3 impactful lines per project or role.',
    });
  }

  // Calculate Overall Score
  const rawTotal =
    contactScore +
    sectionsScore +
    skillsScore +
    projectsScore +
    actionVerbsScore +
    metricsScore +
    densityScore;

  const overallScore = Math.min(100, Math.max(0, Math.round(rawTotal)));

  let grade: AtsAnalysisResult['grade'] = 'C';
  if (overallScore >= 90) grade = 'A+';
  else if (overallScore >= 80) grade = 'A';
  else if (overallScore >= 70) grade = 'B';
  else if (overallScore >= 55) grade = 'C';
  else grade = 'D';

  if (overallScore >= 85) {
    suggestions.unshift({
      type: 'strength',
      title: 'ATS-Ready Master Profile',
      description: 'Your resume features robust section coverage, distinct metrics, action verbs, and contact links.',
    });
  }

  return {
    overallScore,
    grade,
    breakdown: {
      contact: {
        name: 'Contact Information',
        score: contactScore,
        maxScore: 15,
        percentage: Math.round((contactScore / 15) * 100),
        feedback: contactScore >= 13 ? 'All contact points & links verified' : 'Missing essential contact links',
      },
      sections: {
        name: 'Section Completeness',
        score: sectionsScore,
        maxScore: 20,
        percentage: Math.round((sectionsScore / 20) * 100),
        feedback: missingSections.length === 0 ? 'All key sections present' : `Missing: ${missingSections.slice(0, 3).join(', ')}`,
      },
      skills: {
        name: 'Technical Skills Breadth',
        score: skillsScore,
        maxScore: 20,
        percentage: Math.round((skillsScore / 20) * 100),
        feedback: `${uniqueSkillsCount} distinct skills and technologies found`,
      },
      projects: {
        name: 'Project Architecture',
        score: projectsScore,
        maxScore: 15,
        percentage: Math.round((projectsScore / 15) * 100),
        feedback: `${resume.projects.length} projects with tech stack and achievements`,
      },
      actionVerbs: {
        name: 'Action Verbs',
        score: actionVerbsScore,
        maxScore: 10,
        percentage: Math.round((actionVerbsScore / 10) * 100),
        feedback: `${actionVerbsFound.length} high-impact technical action verbs detected`,
      },
      quantifiableMetrics: {
        name: 'Quantifiable Impact',
        score: metricsScore,
        maxScore: 10,
        percentage: Math.round((metricsScore / 10) * 100),
        feedback: `${uniqueMetrics.length} measurable metrics/percentages identified`,
      },
      contentDensity: {
        name: 'Length & Formatting Density',
        score: densityScore,
        maxScore: 10,
        percentage: Math.round((densityScore / 10) * 100),
        feedback: densityFeedback,
      },
    },
    missingSections,
    actionVerbsFound,
    metricsFound: uniqueMetrics.slice(0, 10),
    suggestions,
    keywordCoverage: {
      detected: detectedKeywords,
      suggested: suggestedKeywords.slice(0, 8),
    },
    wordCount: totalWords,
    disclaimer: 'Note: Estimated heuristic score based on standard recruitment ATS patterns — not an official recruiter endorsement.',
  };
}
