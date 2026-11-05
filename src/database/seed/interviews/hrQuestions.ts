import { SeedInterviewQuestion } from './types';

export const HR_QUESTIONS: SeedInterviewQuestion[] = [
  {
    id: 'hr-01',
    categoryId: 'hr-behavioral',
    title: 'Tell me about yourself (Self-Introduction).',
    difficulty: 'BEGINNER',
    answer:
      'Structure your response using the Present-Past-Future Framework: 1. Present: Highlight your current education/role, degree specialization, and core technical expertise (e.g. "I am a final-year Computer Science student specializing in building offline-first mobile applications with React Native and scalable backend services"). 2. Past: Mention 1-2 impactful projects, internships, or open-source achievements that demonstrate practical problem-solving. 3. Future: Connect your career aspirations directly to this specific company and role, explaining why you are excited to contribute your skills to their mission.',
    example:
      '"Good morning/afternoon! My name is Alex Vance. I am completing my B.Tech in Computer Science with a strong focus on full-stack mobile development and database architecture. During my academic journey, I built ALLVANCE, an offline-first mobile suite using React Native and SQLite that eliminated cloud latency for students. I also interned at Acme Cloud, where I optimized caching layers and reduced client API latencies by 38%. What excites me about joining your team is your work on enterprise-scale digital transformations. I am eager to bring my engineering discipline, problem-solving mindset, and passion for clean code to this role."',
    keyPoints: [
      'Keep it strictly between 90 seconds and 2 minutes (150-250 words).',
      'Do NOT recite your resume line-by-line; tell a coherent story.',
      'Always conclude by connecting your skills to the prospective company.',
    ],
    followUps: [
      {
        question: 'What is the biggest takeaway from your self-introduction?',
        answer: 'You have hands-on practical engineering experience, a bias for action, and clear reasons for choosing this employer.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Deloitte', 'Accenture', 'Capgemini', 'Cognizant', 'Wipro', 'HCL', 'InfoCepts'],
    tags: ['HR', 'Self Introduction', 'Icebreaker'],
  },
  {
    id: 'hr-02',
    categoryId: 'hr-behavioral',
    title: 'Why should we hire you?',
    difficulty: 'BEGINNER',
    answer:
      'Frame your answer around a 3-part Value Proposition: 1. Technical Competence: You possess the foundational engineering skills and problem-solving agility needed for the role. 2. Demonstrated Track Record: You have built functional projects and collaborated on engineering teams. 3. Cultural Alignment & Coachability: You are adaptable, fast at learning new tech stacks, and eager to add immediate value.',
    example:
      '"You should hire me because I offer a combination of rigorous technical grounding and high learning agility. I don’t just understand data structures and frameworks conceptually; I have implemented them in production-style projects like an encrypted vault and a local service marketplace. Furthermore, I am disciplined, work effectively under deadlines, and actively seek feedback to improve. While I can contribute to your software delivery immediately, I will also continuously upskill in your technology ecosystem to support long-term business goals."',
    keyPoints: [
      'Never criticize other candidates.',
      'Back up broad claims ("I am a hard worker") with concrete evidence ("I delivered my capstone project 2 weeks ahead of schedule").',
    ],
    followUps: [
      {
        question: 'What makes you unique compared to other candidates with the same degree?',
        answer: 'My end-to-end project ownership: from database schema design and API contracts to mobile UI implementation and automated testing.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Deloitte', 'Accenture', 'Capgemini'],
    tags: ['HR', 'Value Proposition', 'Fit'],
  },
  {
    id: 'hr-03',
    categoryId: 'hr-behavioral',
    title: 'Why do you want to join our company?',
    difficulty: 'BEGINNER',
    answer:
      'Customize your answer using specific company research: 1. Core strengths: Mention specific flagship products, digital platforms, or recent initiatives (e.g. Infosys Cobalt, TCS BaNCS, Accenture Cloud First, InfoCepts Data/AI specialization). 2. Training & Culture: Praise their world-class employee development, structured mentoring, and global exposure. 3. Impact: Express enthusiasm for solving real-world challenges for enterprise clients at scale.',
    example:
      '"I want to join your organization because of your reputation for technological excellence and impactful client transformations. I followed your recent work in Cloud-first modernization and AI adoption, and I want to begin my career in an environment where technical standards are high and learning is prioritized. Your structured graduate onboarding program is widely regarded as one of the best in the industry, and I know it will provide the ideal launchpad for me to grow into a versatile software engineer."',
    keyPoints: [
      'Demonstrates that you researched the company before the interview.',
      'Avoid generic answers like "Because you are a Fortune 500 company".',
    ],
    followUps: [
      {
        question: 'What do you know about our recent milestones or leadership?',
        answer: 'Be prepared with the CEO’s name, recent revenue numbers, and key strategic priorities (Cloud, AI, ESG).',
      },
    ],
    companies: ['TCS', 'Infosys', 'Deloitte', 'Accenture', 'Capgemini', 'Wipro'],
    tags: ['HR', 'Company Research', 'Motivation'],
  },
  {
    id: 'hr-04',
    categoryId: 'hr-behavioral',
    title: 'What are your greatest strengths and greatest weaknesses?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Strengths: Pick 2 professional strengths relevant to software engineering (e.g. systematic debugging persistence, rapid technical adaptability) and illustrate with an example. Weakness: Pick a genuine professional weakness (avoid fake weaknesses like "I work too hard"), explain the self-awareness you gained, and describe the proactive steps you are taking to mitigate it.',
    example:
      '"My greatest strength is systematic problem-solving and persistence. When troubleshooting complex bugs, I don’t randomly tweak code; I analyze logs, reproduce the issue in isolation, and trace root causes methodically. My greatest weakness was public speaking and speaking up in large technical panels. Recognizing this, I joined our college technical seminar committee and volunteered to present weekly tech demos to 40+ peers. While I still prepare diligently, I am now much more comfortable and articulate presenting technical concepts to groups."',
    keyPoints: [
      'Never choose a weakness that disqualifies you from core job duties (e.g. "I dislike coding").',
      'Always emphasize the active remedial steps you are taking to improve.',
    ],
    followUps: [
      {
        question: 'How do your peers view your weakness during group projects?',
        answer: 'They know I prepare thoroughly in writing first, which often results in clearer documentation for the whole team.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Deloitte', 'Capgemini', 'Wipro', 'HCL'],
    tags: ['HR', 'Strengths', 'Weaknesses', 'Self-Awareness'],
  },
  {
    id: 'hr-05',
    categoryId: 'hr-behavioral',
    title: 'What are your short-term and long-term career goals?',
    difficulty: 'BEGINNER',
    answer:
      'Structure with clarity and realism: Short-Term (1-2 years): Master the assigned technology stack, earn relevant certifications (e.g. AWS/Azure), understand domain business logic, and become an independent, reliable contributor who ships clean, bug-free features. Long-Term (3-5 years): Grow into a Senior Software Engineer or Technical Lead who designs scalable systems, mentors junior developers, and bridges client business needs with architectural execution.',
    example:
      '"In the short term, over the next 18 to 24 months, my goal is to absorb team best practices, master our tech stack, and deliver high-quality production code with minimal supervision, while completing relevant cloud certifications. In the long term, over the next 5 years, I see myself growing into a Lead Engineer role where I can architect robust distributed systems, guide junior engineers, and directly contribute to high-impact technical decisions."',
    keyPoints: [
      'Shows ambition without sounding unrealistic or arrogant.',
      'Aligns your personal timeline with standard corporate promotion cadences.',
    ],
    followUps: [
      {
        question: 'Would you be interested in moving into management or staying on the technical track?',
        answer: 'I prefer to solidify my technical depth first as an individual contributor before exploring technical leadership or architectural roles.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Deloitte', 'Accenture', 'Cognizant'],
    tags: ['HR', 'Career Goals', 'Future Planning'],
  },
  {
    id: 'hr-06',
    categoryId: 'hr-behavioral',
    title: 'How do you handle work pressure, stress, and tight deadlines?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Frame with a disciplined, structured process: 1. Deconstruct and Prioritize: Break large intimidating deadlines into smaller, manageable milestones using Eisenhower Matrix or agile task boards. 2. Transparent Communication: Alert stakeholders early if bottlenecks emerge, proposing scope adjustments rather than hiding issues. 3. Focus on Solutions: Stay calm, avoid panic, and focus on execution. 4. Work-Life Decompression: Maintain physical health, sleep, and exercise to prevent burnout.',
    example:
      '"When faced with intense deadlines, I rely on prioritization and transparent communication. During our semester project submission, our database migration failed 48 hours before the deadline. Instead of panicking, I broke the recovery into three steps: isolate corrupt tables, write a rollback script, and repopulate seed data. I communicated the revised timeline to our professor, worked methodically with my teammate, and submitted the project on time. Pressure helps me focus, as long as I approach it with a calm, structured plan."',
    keyPoints: [
      'Demonstrates emotional maturity and problem-solving composure.',
      'Highlights early proactive communication over silent failure.',
    ],
    followUps: [
      {
        question: 'What do you do if you realize you cannot meet an agreed deadline?',
        answer: 'Inform my team lead immediately with the current progress status, reasons for the delay, and an actionable revised delivery estimate.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Deloitte', 'Capgemini', 'Wipro'],
    tags: ['HR', 'Pressure', 'Time Management', 'Deadlines'],
  },
  {
    id: 'hr-07',
    categoryId: 'hr-behavioral',
    title: 'Describe a time when you experienced conflict in a team. How did you resolve it? (STAR Method)',
    difficulty: 'INTERMEDIATE',
    answer:
      'Use the STAR Method: Situation: Set the scene (project and team). Task: Explain the conflicting views or disagreement. Action: Describe how you initiated a calm, data-driven discussion, listened to their perspective, evaluated pros/cons objectively, and reached a compromise. Result: Quantifiable positive outcome for the project and relationship.',
    example:
      '"Situation: During a 4-person capstone project, our frontend developer wanted to use Firebase for instant setup, while I advocated for Node.js and PostgreSQL because our problem involved complex relational queries. Task: We reached an impasse that threatened our sprint schedule. Action: Rather than arguing subjectively, I scheduled a 30-minute sync where we mapped out our data requirements. I showed that our booking model had 6 interrelated tables that would require messy denormalization in NoSQL. We compromised: we used Node.js and PostgreSQL for core data, but used Firebase Authentication to save him frontend setup time. Result: The team delivered on schedule, both sides felt valued, and the architecture scaled smoothly."',
    keyPoints: [
      'Focus on the conflict being IDEAS or TECHNICAL CHOICES, not personal attacks.',
      'Showcase empathy, objective trade-off evaluation, and willingness to compromise.',
    ],
    followUps: [
      {
        question: 'What if the team member refused to compromise?',
        answer: 'Escalate constructively to the project lead or mentor with objective data points, and commit fully to whichever decision the lead makes.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Accenture', 'Capgemini'],
    tags: ['STAR Method', 'Conflict Resolution', 'Behavioral'],
  },
  {
    id: 'hr-08',
    categoryId: 'hr-behavioral',
    title: 'Describe a situation where you demonstrated leadership.',
    difficulty: 'INTERMEDIATE',
    answer:
      'Use the STAR Method: Leadership is not about holding a title; it is about taking initiative, unblocking teammates, fostering accountability, and keeping team morale high during obstacles.',
    example:
      '"Situation: In our college hackathon, our designated team lead fell sick on day one, leaving our 4-person team disoriented with 20 hours remaining. Task: We needed to re-organize immediately to complete our disaster-relief alert prototype. Action: I stepped forward, rallied the team, and facilitated a quick 10-minute sprint planning session. I mapped our remaining user stories, assigned tasks based on individual strengths, and set up 2-hour mini-checkpoints. When our API integration broke at 2 AM, I stayed up debugging with our backend dev while ensuring the others got rest to handle the morning pitch. Result: We submitted our working prototype with 45 minutes to spare and won the Runner-Up prize. My teammates thanked me for keeping the team focused and calm under pressure."',
    keyPoints: [
      'Highlight servant leadership: helping others succeed, unblocking roadblocks, sharing credit.',
      'Avoid sounding boastful or dismissive of others.',
    ],
    followUps: [
      {
        question: 'How do you handle a team member who is not contributing their share of work?',
        answer: 'Speak with them privately in a non-accusatory manner to understand if they are facing personal issues or technical blockers, offer help, and clarify expectations.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Accenture', 'TCS'],
    tags: ['STAR Method', 'Leadership', 'Teamwork'],
  },
  {
    id: 'hr-09',
    categoryId: 'hr-behavioral',
    title: 'Are you willing to relocate to a different city and work in rotational shifts?',
    difficulty: 'BEGINNER',
    answer:
      'For IT service majors (TCS, Infosys, Wipro, Cognizant, Accenture, Capgemini), relocation and shift readiness are critical hiring criteria. State clearly and enthusiastically that you are 100% open to relocation across any company delivery center in India and willing to work in rotational shifts if client project schedules require it.',
    example:
      '"Yes, absolutely. I am at the beginning of my professional career, and I view relocation as an exciting opportunity to gain independence, adapt to new cities, and collaborate with diverse teams. I have already discussed this with my family, and they fully support my career aspirations. Similarly, I understand that global enterprise clients operate across multiple time zones, and I am completely comfortable working in rotational or night shifts as required by project needs."',
    keyPoints: [
      'Hesitation or placing conditions on location (e.g. "Only Bangalore") can result in rejection.',
      'Confirm that you have family support for relocation.',
    ],
    followUps: [
      {
        question: 'What is your preferred location if given a choice?',
        answer: 'You can mention a preference (e.g. Bangalore, Pune, Hyderabad), but always reiterate that you are happy to work wherever the company needs you.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro', 'Cognizant', 'HCL'],
    tags: ['HR', 'Relocation', 'Shifts', 'Flexibility'],
  },
  {
    id: 'hr-10',
    categoryId: 'hr-behavioral',
    title: 'What are your salary expectations?',
    difficulty: 'BEGINNER',
    answer:
      'For freshers/campus hiring: Express respect for company compensation standards while emphasizing that learning and growth opportunities are your foremost priority. For experienced roles: State your current compensation and cite researched market benchmarks (e.g. Glassdoor / AmbitionBox ranges) diplomatically.',
    example:
      '"As a fresher entering the industry, my primary focus is to join a reputable organization where I can build a solid engineering foundation, work on meaningful projects, and grow as a professional. I trust that your company has a well-structured and competitive compensation package for graduate engineer trainees that reflects industry standards and the responsibilities of this role. I will be very happy to accept your standard package for this position."',
    keyPoints: [
      'Do not quote arbitrary inflated numbers as a campus graduate.',
      'Show that you value long-term career growth over short-term negotiation.',
    ],
    followUps: [
      {
        question: 'If you are offered our standard CTC, will you accept the offer letter immediately?',
        answer: 'Yes, I am genuinely excited about the role and company, and I will be delighted to accept.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Deloitte', 'Accenture', 'Capgemini', 'Wipro'],
    tags: ['HR', 'Salary', 'Negotiation'],
  },
  {
    id: 'hr-11',
    categoryId: 'hr-behavioral',
    title: 'Do you have any questions for me? (Best questions to ask the interviewer)',
    difficulty: 'BEGINNER',
    answer:
      'Never say "No, I don’t have any questions." Having thoughtful questions shows high engagement, intellectual curiosity, and genuine enthusiasm for the role. Prepare 2-3 targeted questions about team engineering culture, onboarding expectations, or technology roadmaps.',
    example:
      'Here are 3 excellent questions to ask:\n1. "What does success look like for a graduate engineer joining your team in the first 90 days?"\n2. "What are some of the technical challenges your team is currently tackling around cloud migration or modern tech stacks?"\n3. "Could you share what you personally enjoy most about working at this company?"',
    keyPoints: [
      'Do not ask about basic salary, lunch timings, or leave policies in technical rounds.',
      'Ask questions that make the interviewer reflect positively on their own experience.',
    ],
    followUps: [
      {
        question: 'Why is asking questions so important at the end of an interview?',
        answer: 'It demonstrates that you are interviewing the company as much as they are interviewing you, signaling maturity and serious career commitment.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Deloitte', 'Accenture', 'Capgemini', 'Cognizant', 'Wipro', 'HCL', 'InfoCepts'],
    tags: ['HR', 'Questions to Ask', 'Closing'],
  },
  {
    id: 'hr-12',
    categoryId: 'hr-behavioral',
    title: 'Describe a major failure or mistake you made. What did you learn?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Use the STAR Method: Own the mistake completely without blaming teammates or tools. Explain the immediate containment action, the root cause analysis, and the permanent preventative process you instituted.',
    example:
      '"Situation: During an internship, I pushed a database schema change directly to the staging environment without backing up the testing database first. Task: A foreign key constraint conflict corrupted the testing dataset used by the QA team. Action: I immediately took accountability, apologized to the QA lead, and spent the evening writing an automated seed recovery script to restore test fixtures. Result: Staging was restored within 2 hours. More importantly, I introduced a pre-deployment database migration checklist with automated snapshot backups before any DDL script execution, ensuring that mistake never recurred."',
    keyPoints: [
      'Demonstrates accountability, humility, and systemic learning.',
      'Never say "I have never made a mistake".',
    ],
    followUps: [
      {
        question: 'How do you prevent repeating the same mistake twice?',
        answer: 'By codifying learnings into automated CI/CD checks, checklists, and documentation rather than relying solely on memory.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Accenture'],
    tags: ['STAR Method', 'Failure', 'Accountability'],
  },
  {
    id: 'hr-13',
    categoryId: 'hr-behavioral',
    title: 'How do you handle constructive criticism and negative feedback on your code?',
    difficulty: 'BEGINNER',
    answer:
      'Explain that you view code reviews as collaborative learning opportunities rather than personal criticism. Code is separate from personal identity; the shared goal is shipping robust, maintainable software.',
    example:
      '"I actively welcome code reviews and technical feedback. During my internship, a senior engineer left 14 comments on my first pull request pointing out unhandled edge cases and suggesting more idiomatic TypeScript patterns. Initially, it was humbling, but I realized it was the fastest way to grow. I thanked the engineer, implemented all suggestions, and documented those patterns so my subsequent PRs required minimal revisions. I believe a culture of honest code review makes both the codebase and the engineers stronger."',
    keyPoints: [
      'Separates ego from code quality.',
      'Demonstrates high coachability and team maturity.',
    ],
    followUps: [
      {
        question: 'What if you believe the reviewer’s comment is technically incorrect?',
        answer: 'I schedule a polite 5-minute discussion with the reviewer, share documentation or benchmarks supporting my approach, and agree on the best technical solution.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Deloitte', 'Capgemini'],
    tags: ['HR', 'Feedback', 'Code Reviews'],
  },
  {
    id: 'hr-14',
    categoryId: 'hr-behavioral',
    title: 'How do you quickly learn a new technology or programming language?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Explain your structured learning methodology: 1. Core Syntax & Mental Model: Read official documentation and build mental models comparing it to known languages (e.g. comparing TypeScript to Java). 2. Hands-on Project: Build a small, functional CRUD project from scratch rather than getting stuck in tutorial purgatory. 3. Best Practices & Debugging: Read production open-source repositories to understand idiomatic patterns, linting rules, and edge cases.',
    example:
      '"My approach to learning new technologies is project-driven and systematic. When I needed to learn React Native for ALLVANCE, I didn’t just watch videos; I read the core documentation to understand the bridge/fabric architecture, and immediately began building a functional note-taking app. When I encountered performance issues with list rendering, I researched FlatList optimizations and virtualization. Building real software forces you to encounter and solve real edge cases rapidly."',
    keyPoints: [
      'Avoids "tutorial hell".',
      'Demonstrates self-directed learning agility.',
    ],
    followUps: [
      {
        question: 'How long does it take you to become productive in a new language?',
        answer: 'Typically 1-2 weeks to master syntax and basic tooling, and 3-4 weeks to write idiomatic production code with framework proficiency.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini', 'Cognizant'],
    tags: ['HR', 'Learning Agility', 'Upskilling'],
  },
  {
    id: 'hr-15',
    categoryId: 'hr-behavioral',
    title: 'Are you a team player or an individual contributor?',
    difficulty: 'BEGINNER',
    answer:
      'Explain that you are comfortable with both modes and understand when each is required: you excel as a team player during system architecture, sprint planning, and collaborative code reviews, but can also focus deeply as an individual contributor to execute complex coding tasks independently.',
    example:
      '"I consider myself an adaptable engineer who thrives in both settings. When collaborating with a team, I communicate clearly, actively listen, and ensure our API contracts and interfaces are well-defined. Once milestones are assigned, I can switch into deep-focus individual contributor mode, writing clean code and tests independently without needing constant supervision. Great software requires collaborative team alignment paired with disciplined individual execution."',
    keyPoints: [
      'Do not pigeonhole yourself as only one or the other.',
      'Highlights balance between collaboration and autonomous productivity.',
    ],
    followUps: [
      {
        question: 'Which environment do you personally find more fulfilling?',
        answer: 'I find collaborative environments most rewarding because bouncing ideas off teammates leads to better architectural decisions than working in isolation.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro'],
    tags: ['HR', 'Teamwork', 'Autonomy'],
  },
  {
    id: 'hr-16',
    categoryId: 'hr-behavioral',
    title: 'Describe a situation where you went above and beyond your assigned responsibilities.',
    difficulty: 'INTERMEDIATE',
    answer:
      'Use the STAR Method: Highlight initiative and proactive problem-solving where you identified an unaddressed problem and solved it for the benefit of the whole team without being asked.',
    example:
      '"Situation: During a group software engineering project, onboarding new teammates was chaotic because local environment setup took 4-5 hours due to mismatched Node and database versions. Task: My assigned task was only to build the authentication module. Action: Seeing teammates struggle, I volunteered over the weekend to write a Docker Compose configuration and a 1-page setup script that containerized the entire application, database, and mock seeds. Result: New teammate onboarding dropped from 5 hours to under 10 minutes (single `docker-compose up` command), and our professor commended our project for excellent developer ergonomics."',
    keyPoints: [
      'Shows proactive initiative and organizational empathy.',
      'Measurable impact: reduced setup from 5 hours to 10 minutes.',
    ],
    followUps: [
      {
        question: 'What motivated you to do that over the weekend?',
        answer: 'I realized that saving 4 hours per teammate across 5 teammates saved 20 hours of collective team time, keeping our overall project on track.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Accenture'],
    tags: ['STAR Method', 'Initiative', 'Proactivity'],
  },
  {
    id: 'hr-17',
    categoryId: 'hr-behavioral',
    title: 'What would your professors or former teammates say about you?',
    difficulty: 'BEGINNER',
    answer:
      'Highlight 2-3 genuine professional traits (e.g. reliable follow-through, calm temperament under deadlines, strong technical problem-solving) and illustrate with feedback you actually received.',
    example:
      '"My professors and teammates would describe me as dependable, methodical, and calm under pressure. My project mentor specifically praised my ability to break down vague specifications into concrete engineering milestones and keep our repository clean and well-documented. They know that if I take ownership of a module, it will be delivered reliably and tested thoroughly."',
    keyPoints: [
      'Avoid bragging; state observations grounded in real collaborative experience.',
      'Dependability and follow-through are top traits employers look for.',
    ],
    followUps: [
      {
        question: 'What is one area your teammates would say you could improve?',
        answer: 'They might say I am sometimes overly detail-oriented during documentation, though they appreciate it during bug debugging.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini'],
    tags: ['HR', 'Peer Feedback', 'Reputation'],
  },
  {
    id: 'hr-18',
    categoryId: 'hr-behavioral',
    title: 'What motivates you to perform your best work?',
    difficulty: 'BEGINNER',
    answer:
      'Combine intrinsic motivation (passion for solving complex problems, building software people use) with external motivation (delivering value to the team, professional mastery).',
    example:
      '"What motivates me most is the tangible impact of software engineering: writing clean code that solves a real user problem or makes someone’s day easier. For example, when my classmates started using ALLVANCE to track their placement prep offline, seeing their positive feedback gave me immense satisfaction. I am also driven by continuous technical mastery—the excitement of solving a difficult algorithmic puzzle or mastering a new distributed systems pattern."',
    keyPoints: [
      'Focus on user impact and problem-solving fulfillment.',
      'Avoid saying money or perks are your only motivation.',
    ],
    followUps: [
      {
        question: 'How do you stay motivated during repetitive or tedious tasks?',
        answer: 'I look for opportunities to automate repetitive tasks with scripts or focus on how the task fits into the larger client deliverable.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro'],
    tags: ['HR', 'Motivation', 'Drive'],
  },
  {
    id: 'hr-19',
    categoryId: 'hr-behavioral',
    title: 'How do you manage your time when juggling multiple competing assignments?',
    difficulty: 'BEGINNER',
    answer:
      'Explain your personal time-management system: prioritizing tasks using impact vs urgency (Eisenhower Matrix), time-blocking focused deep work sessions, tracking progress on Kanban boards, and setting realistic buffer margins.',
    example:
      '"I manage competing priorities using a structured 3-step system: 1. Categorization: I organize tasks by urgency and impact using the Eisenhower Matrix. 2. Time-blocking: I schedule dedicated 90-minute deep-work blocks for heavy coding and problem-solving, keeping communications for designated intervals. 3. Buffer Margins: I always include a 15% buffer before deadlines for unforeseen debugging. During final year exams while building our capstone project, this framework allowed me to maintain an 8.9 CGPA while delivering our project on time."',
    keyPoints: [
      'Demonstrates organized personal productivity habits.',
      'Cites concrete results balancing academics and projects.',
    ],
    followUps: [
      {
        question: 'What productivity tools or apps do you personally use?',
        answer: 'I use Notion/Trello for Kanban tracking, Google Calendar for time-blocking, and local Git commits for tracking development progress.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Deloitte'],
    tags: ['HR', 'Time Management', 'Productivity'],
  },
  {
    id: 'hr-20',
    categoryId: 'hr-behavioral',
    title: 'What will you do if your manager asks you to do something you ethically disagree with?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Demonstrate high ethical integrity paired with diplomatic communication: 1. Clarify: Seek clarification privately to ensure you haven’t misunderstood the request or context. 2. Explain Concerns: Respectfully explain your specific ethical, legal, or policy concerns objectively. 3. Propose Alternatives: Suggest ethical alternative solutions that achieve the business goal without compromising standards. 4. Escalate if necessary: If the request clearly violates law or company code of conduct, follow established whistleblower/HR reporting channels.',
    example:
      '"First, I would seek a private conversation with my manager to make sure I fully understood the request and context. I would then politely and objectively voice my specific concerns, explaining the potential risks to the company’s reputation, security, or compliance. I would always propose an ethical alternative that accomplishes the underlying business goal. If the manager still insisted on an action that violated company policy or the law, I would follow our corporate compliance and HR reporting channels, because professional integrity must never be compromised."',
    keyPoints: [
      'Shows integrity and courage without being confrontational.',
      'Values company compliance and ethics.',
    ],
    followUps: [
      {
        question: 'Have you ever faced an ethical dilemma in your academic life?',
        answer: 'Share an example such as refusing to copy someone’s code or ensuring proper citation and license attribution for third-party libraries.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Accenture'],
    tags: ['HR', 'Ethics', 'Integrity'],
  },
  {
    id: 'hr-21',
    categoryId: 'hr-behavioral',
    title: 'Would you prefer working in a fast-paced startup or a large global enterprise?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Avoid dismissing either; explain the advantages of both while showing why this specific company’s environment aligns with your current career stage.',
    example:
      '"Both environments have immense value. Startups teach agility and wearing multiple hats, while global enterprises offer structured engineering discipline, established architectural standards, world-class mentorship, and the opportunity to work on mission-critical systems used by millions. At this stage of my career, I specifically want to join your enterprise because learning proper software engineering practices, testing methodologies, and large-scale delivery pipelines will build the strongest possible foundation for my lifelong career."',
    keyPoints: [
      'Validates both while convincingly pitching the current employer.',
      'Shows appreciation for enterprise scale and quality processes.',
    ],
    followUps: [
      {
        question: 'Are you comfortable working in large teams with strict processes and hierarchies?',
        answer: 'Yes, I appreciate that processes in large enterprises exist to ensure reliability, security, and consistent software quality at scale.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'TCS', 'Capgemini'],
    tags: ['HR', 'Enterprise vs Startup', 'Culture Fit'],
  },
  {
    id: 'hr-22',
    categoryId: 'hr-behavioral',
    title: 'Describe your proudest engineering achievement to date.',
    difficulty: 'BEGINNER',
    answer:
      'Select a real project, hackathon, or internship accomplishment where your technical contribution produced a measurable, tangible result.',
    example:
      '"My proudest engineering achievement was architecting and shipping ALLVANCE, our offline-first placement preparation application. Students in many hostels face patchy internet connectivity that disrupted their daily coding practice. I architected a full local SQLite database with Drizzle ORM, storing 400+ interview questions and local analytics with zero cloud dependencies. Seeing over 50 of my batchmates use it daily without latency or network failures made me incredibly proud of building software that genuinely helped people."',
    keyPoints: [
      'Focuses on problem solved, technical execution, and user impact.',
      'Demonstrates passion for real-world software.',
    ],
    followUps: [
      {
        question: 'What was the hardest technical bug you solved during that project?',
        answer: 'Handling relational schema version migrations in SQLite without losing existing user bookmarks and attempts data.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['HR', 'Accomplishment', 'Projects'],
  },
  {
    id: 'hr-23',
    categoryId: 'hr-behavioral',
    title: 'How do you maintain work-life balance during demanding project cycles?',
    difficulty: 'BEGINNER',
    answer:
      'Explain that work-life balance is about sustainable productivity: intense focus during work hours, disciplined task management, regular physical activity, and adequate rest so you show up energized and sharp every day.',
    example:
      '"I believe sustainable high performance requires disciplined boundaries. When at work, I stay fully focused, minimize distractions, and communicate transparently. Outside work, I stay physically active through regular running and spend time reading. Taking care of physical and mental health ensures I show up to work every morning with sharp concentration, high energy, and enthusiasm for problem-solving."',
    keyPoints: [
      'Highlights that rest fuels professional quality.',
      'Avoids sounding like you refuse to put in extra effort when project emergencies arise.',
    ],
    followUps: [
      {
        question: 'Are you willing to work overtime during critical project releases?',
        answer: 'Yes, absolutely. During milestone releases or client emergencies, I am fully committed to putting in extra hours to ensure the team succeeds.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Deloitte', 'Capgemini'],
    tags: ['HR', 'Work Life Balance', 'Wellbeing'],
  },
  {
    id: 'hr-24',
    categoryId: 'hr-behavioral',
    title: 'What will you do if you are assigned a legacy technology stack you didn’t choose?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Emphasize professional adaptability: enterprise systems run on mission-critical legacy foundations (COBOL, Java 8, C++) that generate billions in business value. Frame learning it as an opportunity to understand core domain logic and eventually participate in modernizing it.',
    example:
      '"I would embrace it with a positive and disciplined attitude. Large enterprises run mission-critical operations on established systems because they are proven and reliable. Working on a legacy stack offers two great advantages: first, you understand the core business domain logic that has driven the company for years; second, legacy systems will eventually be migrated, and engineers who understand both the legacy foundation and modern cloud architectures are the most valuable assets during digital transformations."',
    keyPoints: [
      'Shows maturity and broad business perspective.',
      'Refuses to be snobbish about only working on trendy frameworks.',
    ],
    followUps: [
      {
        question: 'How would you approach modernizing a piece of legacy code?',
        answer: 'Write comprehensive integration tests first to establish a behavioral safety net, then refactor incrementally using the Strangler Fig pattern.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Wipro', 'Capgemini', 'Cognizant'],
    tags: ['HR', 'Legacy Systems', 'Adaptability'],
  },
  {
    id: 'hr-25',
    categoryId: 'hr-behavioral',
    title: 'If offered this job, when can you join us?',
    difficulty: 'BEGINNER',
    answer:
      'State your availability clearly: For college students, provide your official graduation / final exam completion date. For working professionals, state your official notice period (e.g. 30, 60, or 90 days) and mention willingness to negotiate an early buyout if needed.',
    example:
      '"I am completing my final semester examinations in June 2025. Following my last exam, I will be completely available to join your onboarding batch immediately by July 1st, 2025. I am ready to complete any pre-joining training modules or certifications before that date."',
    keyPoints: [
      'Clear, definitive timeline without ambiguity.',
      'Offer to begin pre-joining self-study or certifications upfront.',
    ],
    followUps: [
      {
        question: 'Are you available for an internship before full-time onboarding?',
        answer: 'Yes, if my college curriculum permits an eighth-semester internship, I would love to start early.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro', 'HCL'],
    tags: ['HR', 'Availability', 'Joining Date'],
  },
  {
    id: 'hr-26',
    categoryId: 'hr-behavioral',
    title: 'Tell me about a time you had to deal with an ambiguous project requirement.',
    difficulty: 'INTERMEDIATE',
    answer:
      'Use the STAR Method: Highlight proactive stakeholder interviews, creating mockups or prototypes to validate assumptions, and iterating rather than making dangerous unilateral assumptions.',
    example:
      '"Situation: In a hackathon, our problem statement was vaguely phrased as "Build a smart solution for campus productivity". Task: The team was confused about what to build. Action: Instead of coding blindly, I conducted quick 5-minute interviews with 10 students around the venue to identify real pain points. Over 80% reported missing deadline notifications. I sketched a 3-screen wireframe on paper, validated it with 3 users, and wrote user stories with clear acceptance criteria for our team. Result: We built a targeted, focused application that the judges specifically praised for solving a validated, well-defined user problem."',
    keyPoints: [
      'Proactive clarification over silent guesswork.',
      'Using mockups/prototypes to align expectations.',
    ],
    followUps: [
      {
        question: 'How do you document requirements once clarified?',
        answer: 'Using user stories with clear "Given-When-Then" acceptance criteria.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Accenture'],
    tags: ['STAR Method', 'Ambiguity', 'Problem Solving'],
  },
  {
    id: 'hr-27',
    categoryId: 'hr-behavioral',
    title: 'What are your hobbies and interests outside of computer science?',
    difficulty: 'BEGINNER',
    answer:
      'Share genuine interests (reading, sports, chess, hiking, photography, music) that reflect a balanced, curious personality. Avoid generic answers like "watching movies" or "browsing social media".',
    example:
      '"Outside of technology, I am an avid long-distance runner and enjoy playing chess. Running trains mental discipline, endurance, and pacing—skills that directly help me stay patient during complex debugging sessions. Chess helps sharpen strategic planning and pattern recognition. I also enjoy reading non-fiction books on technology history and biographies."',
    keyPoints: [
      'Shows that you are a well-rounded individual.',
      'Connects your hobbies subtly to positive traits like discipline and strategic thinking.',
    ],
    followUps: [
      {
        question: 'What is the last book you read?',
        answer: 'Be prepared with a real book title (e.g. "Clean Code" by Robert Martin or "Atomic Habits" by James Clear) and 1 key takeaway.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro'],
    tags: ['HR', 'Hobbies', 'Personality'],
  },
  {
    id: 'hr-28',
    categoryId: 'hr-behavioral',
    title: 'How do you stay updated with emerging technology trends?',
    difficulty: 'BEGINNER',
    answer:
      'Mention high-quality technical publications, engineering blogs, podcasts, and communities you actually read (e.g. Hacker News, Martin Fowler’s architecture blog, GitHub Trending, podcasts like Software Engineering Daily).',
    example:
      '"I follow a disciplined weekly learning routine. Every morning I spend 20 minutes reading Hacker News and engineering blogs from tech companies like Uber, Netflix, and Cloudflare to see how real-world distributed architectures evolve. I also follow official release notes for frameworks like React Native and TypeScript, and participate in open-source discussions on GitHub."',
    keyPoints: [
      'Demonstrates genuine intellectual curiosity and passion for engineering.',
      'Mention reputable engineering blogs rather than generic social media.',
    ],
    followUps: [
      {
        question: 'What is an emerging technology trend you are currently excited about?',
        answer: 'Edge AI inference and on-device machine learning models running locally on mobile devices without cloud dependency.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Cognizant', 'InfoCepts'],
    tags: ['HR', 'Continuous Learning', 'Technology Trends'],
  },
  {
    id: 'hr-29',
    categoryId: 'hr-behavioral',
    title: 'What does "Professional Integrity" mean to you?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Explain that integrity means doing the right thing even when no one is watching: writing honest code, respecting software licenses, protecting user privacy, owning mistakes rather than hiding them, and communicating transparently with teammates and clients.',
    example:
      '"To me, professional integrity is about consistency between values and actions. In software engineering, it means not cutting corners on security or testing just to hit an arbitrary deadline, properly attributing open-source licenses, keeping client data confidential, and taking ownership when an error occurs instead of deflecting blame. Trust is the foundation of engineering teams, and integrity is how that trust is earned and preserved."',
    keyPoints: [
      'Crucial for consulting and enterprise firms (Deloitte, TCS, Infosys).',
      'Integrates technical honesty with moral responsibility.',
    ],
    followUps: [
      {
        question: 'How do you handle discovering a security flaw in your code right before a production release?',
        answer: 'Flag it immediately to the release manager; shipping a known security vulnerability is never acceptable.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'TCS', 'Accenture'],
    tags: ['HR', 'Integrity', 'Professionalism'],
  },
  {
    id: 'hr-30',
    categoryId: 'hr-behavioral',
    title: 'Do you have any other job offers currently?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Answer honestly and professionally without bragging or sounding desperate. If you have an offer, mention it diplomatically while reiterating why this specific company remains your top preference.',
    example:
      '"I am currently participating in a few campus recruitment drives and have an offer from another IT services provider. However, this company is my preferred choice because your digital transformation work, enterprise training standards, and engineering culture align much more closely with where I want to build my long-term career. If selected today, I will gladly choose this opportunity."',
    keyPoints: [
      'Honesty signals high demand and market credibility.',
      'Reiterating that this company is your top choice reassures the hiring team that you will accept.',
    ],
    followUps: [
      {
        question: 'What will be your deciding factor between offers?',
        answer: 'The quality of technical mentorship, opportunities to work on modern tech stacks, and long-term career growth potential.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'TCS', 'Accenture', 'Capgemini'],
    tags: ['HR', 'Job Offers', 'Decision Making'],
  },
];
