export interface CompanyChecklistItem {
  key: string;
  text: string;
}

export interface CompanyPrepProfile {
  id: string;
  name: string;
  tagline: string;
  overview: string;
  tier: string;
  headquarters: string;
  hiringRounds: {
    roundName: string;
    description: string;
    keySkillsTested: string[];
  }[];
  commonSubjects: string[];
  testStructure: string;
  techFocus: string[];
  technicalTips: string[];
  hrTips: string[];
  curatedTechnicalQuestions: string[];
  curatedHrQuestions: string[];
  curatedCodingQuestions: string[];
  curatedSqlQuestions: string[];
  curatedProjectQuestions: string[];
  defaultChecklist: CompanyChecklistItem[];
  disclaimer: string;
}

export const SEED_COMPANIES: CompanyPrepProfile[] = [
  {
    id: 'tcs',
    name: 'TCS',
    tagline: 'Tata Consultancy Services - Global IT Services & Consulting',
    overview:
      'TCS recruits through national qualifiers like TCS NQT (National Qualifier Test) and on-campus drives for Ninja, Digital, and Prime cadences. Technical interviews emphasize clean fundamentals in OOPs, basic data structures, DBMS/SQL, and clarity on academic projects.',
    tier: 'Tier 1 IT Services',
    headquarters: 'Mumbai, India',
    testStructure:
      'TCS NQT: Part A (Cognitive: Numerical, Verbal, Reasoning) + Part B (Technical: Hands-on Coding 2 problems). Technical + MR (Managerial) + HR Interview rounds (often combined in a 30-45 min panel).',
    commonSubjects: ['Core Java / Python', 'OOPs Concepts', 'SQL & RDBMS', 'Basic Data Structures', 'SDLC & Agile'],
    hiringRounds: [
      {
        roundName: 'TCS NQT Online Exam',
        description: 'Foundation Cognitive (65 min) + Advanced Cognitive & Coding (90 min) testing logical problem-solving.',
        keySkillsTested: ['Quantitative Aptitude', 'Verbal Ability', 'Coding (C++/Java/Python)'],
      },
      {
        roundName: 'Technical Interview',
        description: 'Deep dive into candidate resume, chosen programming language, OOP principles, and SQL queries.',
        keySkillsTested: ['Core OOPs', 'SQL Joins', 'Project Architecture', 'Debugging'],
      },
      {
        roundName: 'Managerial & HR Round',
        description: 'Assesses work ethic, relocation willingness, night shift acceptance, and cultural alignment.',
        keySkillsTested: ['Communication', 'Flexibility', 'Conflict Resolution', 'Company Knowledge'],
      },
    ],
    techFocus: ['Java / C++', 'SQL Joins & Group By', 'String & Array manipulation', 'Software Engineering models'],
    technicalTips: [
      'Be ready to write clean code on paper or shared screen without IDE auto-completion.',
      'Explain the difference between JDK, JRE, and JVM, or memory management in your primary language.',
      'Always justify database normalization choices in your college projects.',
    ],
    hrTips: [
      'Emphasize readiness to relocate across TCS delivery centres in India (Chennai, Pune, Bangalore, Hyderabad).',
      'Never hesitate when asked about working in rotational shifts or learning new legacy frameworks.',
    ],
    curatedTechnicalQuestions: [
      'Explain the 4 pillars of OOPs with real-world examples from your resume project.',
      'What is the difference between equals() and == in Java?',
      'Explain Primary Key vs Unique Key vs Candidate Key.',
      'What is normalisation and why do we usually stop at 3NF in enterprise apps?',
      'What are static variables and methods, and where are they stored in memory?',
    ],
    curatedHrQuestions: [
      'Tell me about yourself without repeating your CV verbatim.',
      'Why do you want to join TCS over other IT service providers?',
      'Are you open to relocation, night shifts, and working in any domain assigned by resource management?',
      'Where do you see yourself after 3 years at TCS?',
    ],
    curatedCodingQuestions: [
      'Reverse a string or check if a given sentence is a Palindrome without extra buffer.',
      'Find the second largest element in an unsorted integer array in single traversal.',
      'Count frequencies of elements in an array or characters in a string using HashMaps.',
      'Check whether two strings are Anagrams of each other.',
    ],
    curatedSqlQuestions: [
      'Find the second highest salary from the Employee table using LIMIT / subquery.',
      'Write a query to retrieve all employees who earn more than the department average salary.',
      'Differentiate between INNER JOIN, LEFT JOIN, and FULL OUTER JOIN with output tables.',
    ],
    curatedProjectQuestions: [
      'What was your exact individual role and contribution in your final-year engineering project?',
      'How did you design the database schema, and how did you prevent SQL injection?',
      'If given 2 more weeks, what architectural improvement would you implement first?',
    ],
    defaultChecklist: [
      { key: 'tcs_1', text: 'Revise 4 OOPs pillars with code snippets in Java / Python / C++' },
      { key: 'tcs_2', text: 'Practice 15 basic array & string coding problems on HackerRank' },
      { key: 'tcs_3', text: 'Master SQL SELECT, GROUP BY, HAVING, and 2nd highest salary queries' },
      { key: 'tcs_4', text: 'Prepare 90-second "Tell me about yourself" highlighting technical skills' },
      { key: 'tcs_5', text: 'Review TCS corporate values, recent revenue, and CEO leadership' },
      { key: 'tcs_6', text: 'Formulate crisp answers for relocation, bond policy, and shift readiness' },
    ],
    disclaimer:
      'Practice questions are aggregated from publicly reported candidate experiences and placement feedback. They do not represent official questions from TCS.',
  },
  {
    id: 'infosys',
    name: 'Infosys',
    tagline: 'Infosys Limited - Digital Services & Consulting Pioneer',
    overview:
      'Infosys conducts assessments through InfyTQ, HackWithInfy, and standard campus recruitment (Specialist Programmer, Digital Specialist Engineer, and Systems Engineer roles). Technical interviews focus strictly on algorithmic thinking, pseudo-code analysis, and clean modular code.',
    tier: 'Tier 1 IT Services',
    headquarters: 'Bangalore, India',
    testStructure:
      'Online Aptitude (Mathematical, Logical, Verbal, Pseudo-code, Puzzle solving) -> Technical Interview (30-40 min) -> HR Round.',
    commonSubjects: ['Core Java / Python / C++', 'Data Structures (Arrays, Linked Lists, Trees)', 'DBMS & Normalization', 'Computer Networks'],
    hiringRounds: [
      {
        roundName: 'Infosys Online Test',
        description: 'Sectional cutoff test featuring Quantitative Reasoning, Analytical Reasoning, Verbal Ability, and Pseudo-Code debugging.',
        keySkillsTested: ['Speed Math', 'Logical Deduction', 'Code Tracing'],
      },
      {
        roundName: 'Technical Interview',
        description: 'Detailed evaluation of programming fundamentals, time complexity, and data structures.',
        keySkillsTested: ['Algorithms', 'OOPs', 'SQL Subqueries', 'System Flow'],
      },
      {
        roundName: 'HR Discussion',
        description: 'Evaluates adaptability, training at Mysore campus expectations, and career goals.',
        keySkillsTested: ['Cultural Fit', 'Interpersonal Skills', 'Willingness to Upskill'],
      },
    ],
    techFocus: ['Time and Space Complexity', 'Recursion & Dynamic Programming (for DSE/SP)', 'SQL Aggregations', 'OOPs in Java/Python'],
    technicalTips: [
      'Infosys interviewers love asking you to trace code step-by-step with pen and paper.',
      'Be clear about time and space complexity using Big-O notation for every solution you suggest.',
      'Know the differences between method overloading (compile-time) and method overriding (run-time).',
    ],
    hrTips: [
      'Express enthusiasm for the world-renowned Infosys Mysore Global Education Centre training program.',
      'Highlight how you handle constructive criticism and project deadlines.',
    ],
    curatedTechnicalQuestions: [
      'What is polymorphism? Differentiate between compile-time and runtime polymorphism with virtual methods.',
      'Explain how HashMap works internally in Java (buckets, hash code, collision resolution via linked lists/red-black trees).',
      'What is an abstract class and how does it differ from an Interface? When would you prefer one over another?',
      'Explain the ACID properties of database transactions with a bank transfer example.',
      'What is deadlock in Operating Systems? What are the four Coffman conditions necessary for deadlock to occur?',
    ],
    curatedHrQuestions: [
      'What do you know about Infosys and our founders / recent milestones?',
      'How would you manage if you are assigned a technology stack you have never worked with before?',
      'Describe a time when you disagreed with a team member. How did you resolve it?',
    ],
    curatedCodingQuestions: [
      'Find the longest common prefix among an array of strings.',
      'Check if a string contains balanced parentheses `{[()]}` using a stack.',
      'Merge two sorted arrays without using extra space.',
      'Detect a cycle in a singly linked list using Floyd’s Cycle-Finding Algorithm (Tortoise and Hare).',
    ],
    curatedSqlQuestions: [
      'Write a query to fetch duplicate records from an Employees table along with their count.',
      'Explain the difference between DELETE, TRUNCATE, and DROP statements.',
      'Write a SQL query using GROUP BY and HAVING to find departments with more than 5 employees.',
    ],
    curatedProjectQuestions: [
      'Walk me through the user authentication and authorization workflow in your project.',
      'What HTTP status codes did your frontend expect from the backend API endpoints?',
      'If 10,000 users accessed your application simultaneously, what would fail first and how would you resolve it?',
    ],
    defaultChecklist: [
      { key: 'infy_1', text: 'Revise Java Collections internals: HashMap, ArrayList vs LinkedList' },
      { key: 'infy_2', text: 'Practice 20 Medium pseudo-code tracing problems with recursion' },
      { key: 'infy_3', text: 'Prepare detailed explanation of final-year engineering project architecture' },
      { key: 'infy_4', text: 'Revise Operating Systems: CPU scheduling, Deadlocks, Virtual Memory' },
      { key: 'infy_5', text: 'Research Infosys Cobalt cloud and Springboard learning platforms' },
    ],
    disclaimer:
      'Curated practice questions are assembled from student test reports and open interview repositories. Not official Infosys materials.',
  },
  {
    id: 'deloitte',
    name: 'Deloitte',
    tagline: 'Deloitte USI / India - Big Four Audit, Consulting & Advisory',
    overview:
      'Deloitte recruits for Analyst and Consultant engineering roles. Interviews blend rigorous technical competency (clean code, modern web/cloud concepts, database design) with structured business communication, client scenario handling, and professional presence.',
    tier: 'Big Four Consulting',
    headquarters: 'London, UK / Hyderabad, India (USI)',
    testStructure:
      'Online Assessment (Aptitude, Verbal, Logical, Tech MCQs, Coding) -> Technical Interview (45 min) -> Partner / Managerial Interview (30-45 min).',
    commonSubjects: ['Modern Web Tech (React/Node)', 'SQL & Analytics', 'Cloud Fundamentals', 'Business Problem Solving', 'OOPs & Clean Code'],
    hiringRounds: [
      {
        roundName: 'Online Aptitude & Coding Round',
        description: 'Quantitative aptitude, logical reasoning, verbal comprehension, CS fundamentals MCQs, and 1-2 coding problems.',
        keySkillsTested: ['Analytical Speed', 'Reading Comprehension', 'Algorithmic Accuracy'],
      },
      {
        roundName: 'Technical Interview',
        description: 'Problem-solving discussions, schema design, API structure, and practical scenario questions.',
        keySkillsTested: ['System Logic', 'Database Design', 'Framework Understanding', 'Code Readability'],
      },
      {
        roundName: 'Partner / Senior Manager Round',
        description: 'Client-handling scenarios, behavioral situations, communication poise, and business acumen.',
        keySkillsTested: ['Consulting Mindset', 'Executive Presence', 'STAR Behavioral Answers'],
      },
    ],
    techFocus: ['Relational Database Normalization', 'RESTful API principles', 'Client-Server Architecture', 'Data Integrity & Security'],
    technicalTips: [
      'Communicate your thought process before writing a line of code. Consulting interviewers rate structuring ability very highly.',
      'Be prepared to design a database schema for an e-commerce order or hotel booking scenario on the fly.',
      'Show genuine appreciation for clean code principles, code readability, and unit testing.',
    ],
    hrTips: [
      'Use the STAR method (Situation, Task, Action, Result) rigorously for behavioral and leadership questions.',
      'Highlight client-facing communication skills and ability to translate technical jargon into business value.',
    ],
    curatedTechnicalQuestions: [
      'What makes an API RESTful? Explain statelessness, uniform interface, and cacheability.',
      'Explain the difference between SQL (relational) and NoSQL (document/key-value) databases. When do you choose each?',
      'How do indexes improve query speed, and what is the trade-off of maintaining multiple indexes on high-write tables?',
      'Explain MVC (Model-View-Controller) architecture and how it separates concerns in enterprise software.',
      'What is CORS (Cross-Origin Resource Sharing) and how do browsers handle pre-flight OPTIONS requests?',
    ],
    curatedHrQuestions: [
      'Why Deloitte Consulting over pure product companies or pure tech service providers?',
      'Describe a situation where a project deadline seemed impossible. How did you prioritize tasks?',
      'If a client demands a feature that violates technical best practices, how would you advise them diplomatically?',
    ],
    curatedCodingQuestions: [
      'Given an array of meeting time intervals, determine if a person could attend all meetings without overlap.',
      'Group an array of anagrams together into sublists.',
      'Find the first non-repeating character in a stream of characters.',
      'Evaluate whether a string represents a valid IPv4 or IPv6 address.',
    ],
    curatedSqlQuestions: [
      'Write a query to calculate month-over-month revenue growth using SQL Window functions (LAG / LEAD).',
      'Explain the difference between RANK(), DENSE_RANK(), and ROW_NUMBER() with an illustrative dataset.',
      'Write a query to find all customers who placed an order in 2024 but no orders in 2023.',
    ],
    curatedProjectQuestions: [
      'What were the key technical trade-offs you made when selecting your tech stack?',
      'How did you ensure data security and prevent unauthorized access to user records?',
      'Explain how you would pitch your project as a commercial product to a non-technical stakeholder.',
    ],
    defaultChecklist: [
      { key: 'del_1', text: 'Revise SQL Window functions: ROW_NUMBER(), DENSE_RANK(), LAG(), LEAD()' },
      { key: 'del_2', text: 'Practice designing ER diagrams for 3 common scenarios: Library, Ride-sharing, E-commerce' },
      { key: 'del_3', text: 'Structure 4 personal behavioral stories using the STAR methodology' },
      { key: 'del_4', text: 'Study Deloitte’s core pillars: Integrity, Outstanding Value, Commitment to Each Other' },
      { key: 'del_5', text: 'Review REST API design standards and HTTP response status code families' },
    ],
    disclaimer:
      'Curated practice questions reflect general recruitment trends and candidate feedback for Deloitte technical interviews.',
  },
  {
    id: 'accenture',
    name: 'Accenture',
    tagline: 'Accenture - Strategy, Technology, Cloud & Digital Transformation',
    overview:
      'Accenture hires for Associate Software Engineer (ASE) and Advanced ASE (AASE) roles. The recruitment pipeline includes cognitive assessments, technical MCQs, coding challenges, and a conversational video/panel interview with strong focus on agile processes and modern tech stacks.',
    tier: 'Tier 1 Global Consulting',
    headquarters: 'Dublin, Ireland / Pan-India',
    testStructure:
      'Cognitive & Technical Assessment (90 min) -> Coding Assessment (45 min - 2 problems) -> Communication Assessment -> Technical & HR Interview (25-35 min).',
    commonSubjects: ['Cloud Basics', 'Pseudo-Code & Debugging', 'Networking Fundamentals', 'Agile Methodologies', 'Core Java/Python'],
    hiringRounds: [
      {
        roundName: 'Cognitive & Technical Assessment',
        description: 'Tests English ability, Critical thinking, Abstract reasoning, Common Applications & MS Office, Pseudo-code, Networking & Cloud.',
        keySkillsTested: ['Reasoning', 'Pseudo-code logic', 'Network basics'],
      },
      {
        roundName: 'Coding Assessment',
        description: '2 practical coding problems evaluating algorithmic implementation in C, C++, Java, or Python.',
        keySkillsTested: ['Data manipulation', 'Edge case handling', 'Syntax correctness'],
      },
      {
        roundName: 'Communication Assessment',
        description: 'Automated test scoring pronunciation, fluency, vocabulary, and listening comprehension.',
        keySkillsTested: ['Verbal Fluency', 'Grammar', 'Audio clarity'],
      },
      {
        roundName: 'Technical + HR Panel Interview',
        description: 'Evaluation of resume projects, real-world scenario problem solving, teamwork, and willingness to learn.',
        keySkillsTested: ['Project Ownership', 'Problem Solving', 'Adaptability'],
      },
    ],
    techFocus: ['Cloud concepts (IaaS, PaaS, SaaS)', 'Security & Networking', 'Pseudo-code logic', 'OOPs & Exception Handling'],
    technicalTips: [
      'Be clear about Cloud computing service models (IaaS vs PaaS vs SaaS) and deployment types (Public vs Private vs Hybrid).',
      'Pay special attention to bit manipulation and basic string algorithms for the coding round.',
      'Explain how you structured exception handling (try-catch-finally, custom exceptions) in your code.',
    ],
    hrTips: [
      'Highlight cross-functional teamwork, adaptability, and eager interest in certifications.',
      'Show understanding of Accenture’s focus on Cloud First and AI transformation for global clients.',
    ],
    curatedTechnicalQuestions: [
      'What is Cloud Computing? Differentiate between IaaS, PaaS, and SaaS with real service examples.',
      'Explain the difference between Checked and Unchecked exceptions in Java.',
      'What is the OSI model? Explain the functions of the Transport layer and Network layer.',
      'What is an API Gateway, and why is it used in microservice architectures?',
      'What are the advantages of Agile Scrum methodology over traditional Waterfall development?',
    ],
    curatedHrQuestions: [
      'Why do you want to start your professional career with Accenture?',
      'Describe a situation where you had to adapt quickly to an unexpected change in project requirements.',
      'Are you comfortable working in different domains such as Financial Services, Healthcare, or Retail?',
    ],
    curatedCodingQuestions: [
      'Count binary operations: evaluate a string composed of 0, 1, AND, OR, XOR operations.',
      'Find the maximum element in an array and count how many times it occurs.',
      'Calculate the sum of absolute differences between consecutive array elements.',
      'Implement string compression (e.g., "aabcccccaaa" -> "a2b1c5a3").',
    ],
    curatedSqlQuestions: [
      'Write a query to find all employees whose names start with "A" and contain at least 4 letters.',
      'What is the difference between UNION and UNION ALL? Which has higher performance and why?',
      'Write a query to fetch the current date and compute age from a date_of_birth column.',
    ],
    curatedProjectQuestions: [
      'How did you maintain version control with Git in your project? Explain your branching strategy.',
      'What testing methods (unit, integration, manual) did you employ to verify software quality?',
      'If a high-severity bug was reported in production right after deployment, how would you triage it?',
    ],
    defaultChecklist: [
      { key: 'acc_1', text: 'Revise Cloud service models: IaaS, PaaS, SaaS with AWS/Azure examples' },
      { key: 'acc_2', text: 'Practice 15 pseudo-code debugging problems with bitwise operators' },
      { key: 'acc_3', text: 'Test your spoken fluency and clear pronunciation for the automated audio test' },
      { key: 'acc_4', text: 'Revise OSI 7 layers and TCP/IP protocol stack fundamentals' },
      { key: 'acc_5', text: 'Prepare 3 examples demonstrating collaborative teamwork under deadlines' },
    ],
    disclaimer:
      'Practice questions are aggregated from peer reviews and campus selection reports. They do not represent official Accenture test papers.',
  },
  {
    id: 'capgemini',
    name: 'Capgemini',
    tagline: 'Capgemini - People matter, results count',
    overview:
      'Capgemini onboards software engineers across Analyst and Senior Analyst roles. The hiring process incorporates pseudo-code evaluation, English proficiency, game-based aptitude challenges, and structured technical interviews centering on programming and data structure basics.',
    tier: 'Tier 1 Global Consulting',
    headquarters: 'Paris, France / Pan-India',
    testStructure:
      'Pseudo-code Round (30 min) -> English Communication -> Game-Based Aptitude (4 mini games) -> Coding Test (2 questions) -> Technical & HR Interview.',
    commonSubjects: ['Pseudo-Code & Flowcharts', 'Core Java / C++', 'Data Structures', 'Database Queries', 'Game-based logic'],
    hiringRounds: [
      {
        roundName: 'Pseudo-Code & MCQ Assessment',
        description: 'Assesses logic tracing, variable scope, recursion evaluation, and condition evaluation.',
        keySkillsTested: ['Code Tracing', 'Algorithm Dry Run', 'Syntax Knowledge'],
      },
      {
        roundName: 'Game-Based Aptitude Test',
        description: 'Interactive gamified tests evaluating working memory, spatial reasoning, agility, and planning.',
        keySkillsTested: ['Cognitive Agility', 'Pattern Recognition', 'Working Memory'],
      },
      {
        roundName: 'Coding Assessment',
        description: 'Algorithmic problems evaluating data structures like arrays, strings, stacks, and maths.',
        keySkillsTested: ['Problem Solving', 'Edge Cases', 'Time Complexity'],
      },
      {
        roundName: 'Technical & HR Interview',
        description: 'A 30-minute interview assessing programming fundamentals, final year project, and behavioral maturity.',
        keySkillsTested: ['Communication', 'Core CS Fundamentals', 'Team Spirit'],
      },
    ],
    techFocus: ['Scope of variables and static storage', 'Array rotations & string permutations', 'SQL JOINS & Keys', 'OOPs concepts'],
    technicalTips: [
      'Master the dry running of nested loops, bitwise operations, and recursive calls for pseudo-code questions.',
      'Explain memory allocation differences between Stack memory and Heap memory.',
      'Be prepared to explain why String is immutable in Java.',
    ],
    hrTips: [
      'Emphasize collaborative values ("People matter, results count").',
      'Demonstrate enthusiasm for continuous learning and technology certifications.',
    ],
    curatedTechnicalQuestions: [
      'Why is String immutable in Java? Explain string constant pool, security, and thread-safety advantages.',
      'What is the difference between Call by Value and Call by Reference? Does Java support Call by Reference?',
      'Explain method overloading vs method overriding with return type rules and exception handling constraints.',
      'What is an Index in DBMS? How does a B-Tree structure accelerate retrieval of range queries?',
      'Explain the difference between process and thread with resource sharing implications.',
    ],
    curatedHrQuestions: [
      'Why do you want to join Capgemini specifically?',
      'Can you describe a time when you received tough feedback on your code or work? How did you react?',
      'Are you willing to work on support or maintenance projects if client requirements demand it?',
    ],
    curatedCodingQuestions: [
      'Rotate an array to the right by k steps in O(n) time and O(1) auxiliary space.',
      'Find all pairs in an integer array whose sum equals a given target.',
      'Remove all duplicate characters from a string while preserving original character order.',
      'Implement binary search on a sorted array iteratively and recursively.',
    ],
    curatedSqlQuestions: [
      'Write a query to find the department with the highest total salary expenditure.',
      'What is a FOREIGN KEY constraint and what are the effects of ON DELETE CASCADE vs ON DELETE SET NULL?',
      'How does the GROUP BY clause work behind the scenes with aggregate functions like COUNT, SUM, and AVG?',
    ],
    curatedProjectQuestions: [
      'What third-party libraries or npm packages did you utilize in your project, and why did you choose them?',
      'How did you manage state in your frontend application (e.g. Redux, Context API, Zustand, Local State)?',
      'Describe how your project handles edge cases like invalid user input or network timeouts.',
    ],
    defaultChecklist: [
      { key: 'cap_1', text: 'Practice 20 pseudo-code loop and recursion tracing questions' },
      { key: 'cap_2', text: 'Review String immutability and memory allocation (Stack vs Heap)' },
      { key: 'cap_3', text: 'Practice gamified cognitive puzzles (grid memory, switch challenge)' },
      { key: 'cap_4', text: 'Prepare project architecture diagram and API request cycle explanation' },
      { key: 'cap_5', text: 'Revisit SQL Foreign Key behaviors and cascade deletion rules' },
    ],
    disclaimer:
      'Curated practice questions reflect general recruitment experiences and student submissions for Capgemini.',
  },
  {
    id: 'cognizant',
    name: 'Cognizant',
    tagline: 'Cognizant - GenC, GenC Elevate, GenC Next',
    overview:
      'Cognizant conducts recruitment across GenC (Foundational IT), GenC Elevate (Advanced Full-Stack), and GenC Next (Specialized Cloud, AI, and Product Engineering). Technical interviews place heavy emphasis on practical coding, database queries, and web application architecture.',
    tier: 'Tier 1 Global IT Services',
    headquarters: 'Teaneck, New Jersey, USA / Chennai, India',
    testStructure:
      'Aptitude & Communication Round -> Technical Assessment (Hands-on coding, SQL queries, HTML/CSS/JS) -> Technical Interview (30-45 min) -> HR Round.',
    commonSubjects: ['Full-Stack Fundamentals', 'SQL & RDBMS', 'Java / Python', 'Data Structures', 'Web Technologies'],
    hiringRounds: [
      {
        roundName: 'Online Written Test',
        description: 'Quantitative aptitude, analytical reasoning, verbal ability, and code snippet comprehension.',
        keySkillsTested: ['Problem Solving Speed', 'English Comprehension', 'Code Logic'],
      },
      {
        roundName: 'Skill-Based Coding & Query Test',
        description: 'Includes programming questions and practical SQL queries on a live compiler platform.',
        keySkillsTested: ['Data Structures', 'SQL Joins & Grouping', 'Debugging'],
      },
      {
        roundName: 'Technical Interview',
        description: 'In-depth interview covering candidate’s preferred language, web concepts, and project implementation.',
        keySkillsTested: ['Core OOPs', 'Database Architecture', 'Practical Problem Solving'],
      },
      {
        roundName: 'HR Interview',
        description: 'Discussion on relocation, shift readiness, salary package expectations, and professional alignment.',
        keySkillsTested: ['Communication', 'Flexibility', 'Commitment'],
      },
    ],
    techFocus: ['Object Oriented Programming', 'SQL multi-table queries', 'Frontend-Backend interaction', 'RESTful services'],
    technicalTips: [
      'For GenC Elevate/Next, be prepared to write working code for Medium LeetCode problems (Strings, HashMaps, Trees).',
      'Explain practical database concepts like normalization and transactions with clear entity examples.',
      'Know the differences between synchronous and asynchronous operations.',
    ],
    hrTips: [
      'Demonstrate flexibility with respect to project allocation and location preference.',
      'Show positive awareness of Cognizant’s digital engineering and cloud transformation capabilities.',
    ],
    curatedTechnicalQuestions: [
      'Explain the difference between ArrayList and LinkedList in Java. In what scenario is LinkedList faster?',
      'What are ACID properties? How does SQLite / PostgreSQL maintain durability during power loss?',
      'Explain the difference between GET and POST HTTP methods. Can a GET request have a body?',
      'What is the difference between synchronous and asynchronous programming? How does the event loop handle async tasks?',
      'What are access specifiers in OOPs? Explain public, protected, default, and private visibility.',
    ],
    curatedHrQuestions: [
      'What motivates you to work in the IT industry?',
      'Describe a challenging college project deadline and how your team successfully met it.',
      'Where do you see yourself in the next 5 years in terms of technical growth?',
    ],
    curatedCodingQuestions: [
      'Find the intersection of two unsorted arrays without duplicates in the result.',
      'Check if a binary tree is symmetric around its center (mirror tree).',
      'Calculate the length of the longest substring without repeating characters.',
      'Find the missing number in an array containing numbers from 1 to N.',
    ],
    curatedSqlQuestions: [
      'Write a query to find employees who joined in the last 6 months.',
      'Write a query to display employee name along with their manager name from a self-referencing Employee table.',
      'What is an Index? Differentiate between Clustered Index and Non-Clustered Index.',
    ],
    curatedProjectQuestions: [
      'How did you handle user input validation on both the client side and server side?',
      'Explain how your application handles errors and displays friendly error messages to the user.',
      'What version control workflow did you follow while collaborating with team members?',
    ],
    defaultChecklist: [
      { key: 'cog_1', text: 'Revise Java Collections: ArrayList vs LinkedList vs HashSet complexity' },
      { key: 'cog_2', text: 'Practice self-join SQL queries for employee-manager relationship tables' },
      { key: 'cog_3', text: 'Implement Two-Pointer techniques for array and string problems' },
      { key: 'cog_4', text: 'Understand the difference between Clustered and Non-Clustered indexing' },
      { key: 'cog_5', text: 'Prepare your personal response for location flexibility across Cognizant hubs' },
    ],
    disclaimer:
      'Curated practice questions reflect general recruitment feedback and student interview debriefs for Cognizant.',
  },
  {
    id: 'wipro',
    name: 'Wipro',
    tagline: 'Wipro - Spirit of Wipro & Elite National Talent Hunt',
    overview:
      'Wipro hires graduates through the Elite National Talent Hunt (NTH) and Turbo cadences. The interview focuses on solid grounding in core computer science, basic coding, communication aptitude, and willingness to adapt to enterprise technology stacks.',
    tier: 'Tier 1 IT Services',
    headquarters: 'Bangalore, India',
    testStructure:
      'Aptitude Test (Quants, Logical, Verbal) -> Written Communication (Essay writing) -> Online Coding Test (2 questions) -> Technical Interview -> HR Round.',
    commonSubjects: ['Core C/C++/Java', 'Basic Algorithms', 'Essay Writing & Grammar', 'SQL Basics', 'Project Overview'],
    hiringRounds: [
      {
        roundName: 'Online Assessment',
        description: 'Quantitative aptitude, logical reasoning, verbal comprehension, written communication essay, and 2 coding tasks.',
        keySkillsTested: ['Problem Solving', 'Written English Grammar', 'Coding Logic'],
      },
      {
        roundName: 'Technical Interview',
        description: 'Candidate is asked questions based on chosen programming language, academic subjects, and resume projects.',
        keySkillsTested: ['Core OOPs', 'Pointers/Memory (if C++)', 'SQL Queries', 'Project Explanation'],
      },
      {
        roundName: 'HR Round',
        description: 'Evaluates personality, career goals, shift work flexibility, and cultural alignment with the Spirit of Wipro.',
        keySkillsTested: ['Cultural Fit', 'Flexibility', 'Values Alignment'],
      },
    ],
    techFocus: ['Fundamental Algorithms (Sorting, Searching)', 'Strings & Arrays', 'Basic SQL Queries', 'OOPs Concepts'],
    technicalTips: [
      'Wipro interviewers frequently ask you to explain standard sorting algorithms (Bubble, Selection, Merge, Quick Sort) with time complexities.',
      'Ensure you can write clean syntax without relying on built-in library functions for fundamental algorithms.',
      'Know the differences between static and dynamic binding.',
    ],
    hrTips: [
      'Learn the 4 tenets of the Spirit of Wipro: Be passionate about clients, Treat each person with respect, Be global and responsible, Unyielding integrity.',
      'Express genuine willingness to work in any assigned technology domain or location.',
    ],
    curatedTechnicalQuestions: [
      'Explain the working and time complexity of Merge Sort vs Quick Sort. Which one is stable?',
      'What are constructors in OOPs? Explain Default, Parameterized, and Copy constructors.',
      'What is the difference between a structure and a class in C++?',
      'Explain the difference between TCP and UDP protocols. Which one is connection-oriented and reliable?',
      'What is normalization in databases and what anomalies does it eliminate?',
    ],
    curatedHrQuestions: [
      'What do you know about Wipro and our chairman Azim Premji / Rishad Premji?',
      'Are you ready to sign a service agreement if applicable, and are you open to relocation?',
      'How do you deal with stress or tight deadlines during academic examinations or projects?',
    ],
    curatedCodingQuestions: [
      'Check if a given number is a Prime number in O(sqrt(n)) time.',
      'Generate Fibonacci series up to N terms using both iterative and recursive approaches.',
      'Find the GCD and LCM of two integers using the Euclidean algorithm.',
      'Count the number of vowels, consonants, digits, and special symbols in a given string.',
    ],
    curatedSqlQuestions: [
      'Write a query to find the 3rd highest salary using subqueries or DENSE_RANK().',
      'Explain the difference between WHERE clause and HAVING clause in SQL.',
      'Write a query to retrieve all employees whose salary is between 30,000 and 60,000.',
    ],
    curatedProjectQuestions: [
      'What was the primary objective of your college project and how does it solve the problem statement?',
      'Which database did you choose for your project and why?',
      'Did you encounter any major bugs during development? How did you identify and resolve them?',
    ],
    defaultChecklist: [
      { key: 'wip_1', text: 'Revise Merge Sort, Quick Sort, and Binary Search algorithms and complexities' },
      { key: 'wip_2', text: 'Memorize the 4 tenets of the Spirit of Wipro' },
      { key: 'wip_3', text: 'Practice 15 number-theory coding problems (Fibonacci, Prime, Armstrong, GCD)' },
      { key: 'wip_4', text: 'Master SQL WHERE vs HAVING and subquery salary calculations' },
      { key: 'wip_5', text: 'Write a 200-word essay on a current technological topic to practice essay timing' },
    ],
    disclaimer:
      'Curated practice questions reflect general recruitment experiences and student submissions for Wipro.',
  },
  {
    id: 'hcl',
    name: 'HCLTech',
    tagline: 'HCLTech - Supercharging Progress',
    overview:
      'HCLTech recruits engineering graduates for Software Engineer and Graduate Engineer Trainee (GET) positions. The selection process evaluates aptitude, domain knowledge in software engineering, programming fluency, and technical agility.',
    tier: 'Tier 1 Global Technology Company',
    headquarters: 'Noida, India',
    testStructure:
      'Online Aptitude Test (Quants, Verbal, Reasoning) -> Technical Test (Programming fundamentals & Coding) -> Technical Interview -> HR Interview.',
    commonSubjects: ['Core Java / C++', 'Operating Systems', 'Computer Networks', 'Database Management', 'Basic Coding'],
    hiringRounds: [
      {
        roundName: 'Aptitude & Technical MCQ Round',
        description: 'Tests numerical ability, logical deduction, English proficiency, and core CS fundamentals.',
        keySkillsTested: ['Quantitative Logic', 'CS Core MCQs', 'Speed'],
      },
      {
        roundName: 'Coding Assessment',
        description: 'Hands-on coding problems on string handling, array transformations, and mathematical calculations.',
        keySkillsTested: ['Algorithmic Logic', 'Syntax Fluency', 'Corner Cases'],
      },
      {
        roundName: 'Technical Interview',
        description: 'One-on-one technical discussion evaluating academic projects, OOP principles, data structures, and database design.',
        keySkillsTested: ['Core Concepts', 'Project Clarity', 'Problem Solving'],
      },
      {
        roundName: 'HR Interview',
        description: 'Evaluates behavioral traits, shift readiness, relocation, and career commitment.',
        keySkillsTested: ['Communication', 'Culture Fit', 'Professionalism'],
      },
    ],
    techFocus: ['Data Structures (Stacks, Queues, Linked Lists)', 'OOPs fundamentals', 'OS Concepts (Paging, Semaphores)', 'SQL Queries'],
    technicalTips: [
      'Review fundamental Operating System concepts such as Virtual Memory, Paging, and Semaphores vs Mutexes.',
      'Be ready to implement basic data structures like Stacks or Queues from scratch using arrays or linked lists.',
      'Know the difference between deep copy and shallow copy in object-oriented programming.',
    ],
    hrTips: [
      'Learn about HCLTech’s core focus areas: Digital, Engineering and R&D, and Cloud Native solutions.',
      'Demonstrate enthusiasm for learning emerging technologies and taking on challenging assignments.',
    ],
    curatedTechnicalQuestions: [
      'What is the difference between Mutex and Semaphore in Operating Systems?',
      'Explain paging and segmentation in virtual memory management. What is thrashing?',
      'What is the difference between shallow copy and deep copy in object cloning?',
      'Explain the difference between stack memory and heap memory allocation in C++/Java.',
      'What is an uncommitted read (dirty read) in database transactions, and how is it prevented?',
    ],
    curatedHrQuestions: [
      'Why do you want to join HCLTech as a Graduate Engineer Trainee?',
      'How do you stay updated with emerging technologies in software engineering?',
      'Tell me about a time when you worked on a team project where someone wasn’t pulling their weight.',
    ],
    curatedCodingQuestions: [
      'Implement a stack using two queues.',
      'Find the contiguous subarray with the largest sum (Kadane’s Algorithm).',
      'Remove duplicate elements from a sorted linked list.',
      'Check whether two strings are isomorphic.',
    ],
    curatedSqlQuestions: [
      'Write a query to find the nth highest salary from an Employee table without using LIMIT.',
      'Explain the difference between primary key and candidate key with an example table.',
      'Write a query to retrieve records that exist in Table A but do not exist in Table B (LEFT JOIN or NOT EXISTS).',
    ],
    curatedProjectQuestions: [
      'What architecture did you use for your project (e.g., monolithic, 3-tier, microservices)?',
      'How did you test your code to ensure it was bug-free before submission?',
      'If you had unlimited resources, how would you scale your project to support 1 million active users?',
    ],
    defaultChecklist: [
      { key: 'hcl_1', text: 'Revise Operating Systems: Mutex vs Semaphore, Paging, and Virtual Memory' },
      { key: 'hcl_2', text: 'Practice Kadane’s algorithm for maximum subarray sum' },
      { key: 'hcl_3', text: 'Implement Stack using Queues and Queue using Stacks' },
      { key: 'hcl_4', text: 'Master SQL NOT EXISTS and anti-join queries' },
      { key: 'hcl_5', text: 'Prepare your explanation of deep copy vs shallow copy with memory diagrams' },
    ],
    disclaimer:
      'Curated practice questions reflect general recruitment experiences and student submissions for HCLTech.',
  },
  {
    id: 'infocepts',
    name: 'InfoCepts',
    tagline: 'InfoCepts - Data & AI Solutions Specialist',
    overview:
      'InfoCepts is a premier global Data & AI solutions firm. Engineering interviews emphasize strong database concepts, SQL query mastery, data modeling, analytical problem-solving, Python scripting, and an understanding of data pipelines and modern BI/cloud architectures.',
    tier: 'Specialized Data & AI Solutions',
    headquarters: 'Tysons Corner, Virginia, USA / Nagpur & Pune, India',
    testStructure:
      'Online Aptitude & Data Concepts Test -> Advanced SQL & Python Coding Round -> Technical Interview (Data & AI focus) -> HR Round.',
    commonSubjects: ['Advanced SQL', 'Data Warehousing & Dimensional Modeling', 'Python for Data Analysis', 'ETL / ELT Concepts', 'RDBMS & Indexing'],
    hiringRounds: [
      {
        roundName: 'Online Aptitude & SQL Assessment',
        description: 'Covers logical reasoning, quantitative analysis, data interpretation, and complex SQL query writing.',
        keySkillsTested: ['Analytical Thinking', 'Complex SQL Joins', 'Data Logic'],
      },
      {
        roundName: 'Technical Interview (Round 1: SQL & Data Modeling)',
        description: 'Intense evaluation of SQL queries, window functions, schema design (Star vs Snowflake schema), and indexing.',
        keySkillsTested: ['Window Functions', 'Dimensional Modeling', 'Query Optimization'],
      },
      {
        roundName: 'Technical Interview (Round 2: Python & Project)',
        description: 'Focuses on Python scripting, data structures, data pipeline logic, API consumption, and resume project discussions.',
        keySkillsTested: ['Python Pandas/Core', 'ETL Concepts', 'Project Deep-Dive'],
      },
      {
        roundName: 'HR & Cultural Alignment Round',
        description: 'Evaluates passion for the data industry, problem-solving mindset, communication, and adaptability.',
        keySkillsTested: ['Communication', 'Data Passion', 'Cultural Fit'],
      },
    ],
    techFocus: ['Advanced SQL (CTEs, Window Functions)', 'Data Warehousing (Star & Snowflake schema)', 'Python Scripting', 'Database Optimization'],
    technicalTips: [
      'InfoCepts places supreme value on SQL mastery. Expect questions on window functions (PARTITION BY, ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD).',
      'Understand the difference between OLTP (Transactional) and OLAP (Analytical) database systems.',
      'Be clear about Fact tables vs Dimension tables and how schemas are modeled for analytics.',
    ],
    hrTips: [
      'Express passionate curiosity for Data Engineering, Analytics, and generative AI transformation.',
      'Highlight any academic or personal projects where you analyzed, visualized, or processed datasets.',
    ],
    curatedTechnicalQuestions: [
      'What is the difference between OLTP and OLAP systems? How do their database schemas differ?',
      'Explain Star Schema vs Snowflake Schema in Data Warehousing. What are Fact and Dimension tables?',
      'Explain Common Table Expressions (CTEs). How do recursive CTEs work in SQL?',
      'What are Window Functions in SQL and how do they differ from regular aggregate functions with GROUP BY?',
      'How does an execution plan (EXPLAIN) help in optimizing slow-running SQL queries?',
    ],
    curatedHrQuestions: [
      'Why are you specifically interested in specializing in Data & AI at InfoCepts rather than general application development?',
      'Describe a time when you discovered an interesting insight from a dataset or project.',
      'How do you approach learning complex analytical tools and technologies independently?',
    ],
    curatedCodingQuestions: [
      'Using Python, read a CSV file or list of dictionaries and calculate average metrics grouped by category without external libraries.',
      'Write a Python function to find the top K most frequent elements in a list.',
      'Implement an efficient algorithm to merge two sorted lists or intervals.',
      'Write a Python program to validate and clean malformed data rows (e.g. missing dates or null values).',
    ],
    curatedSqlQuestions: [
      'Write a query using Window Functions (DENSE_RANK) to find the top 3 highest-earning employees per department.',
      'Write a SQL query using LAG() to calculate the day-over-day change in sales revenue.',
      'Explain the difference between correlated and non-correlated subqueries with performance implications.',
      'Given an Orders table and Customers table, write a query to find customers who placed consecutive orders on consecutive days.',
    ],
    curatedProjectQuestions: [
      'Did your project involve storing or analyzing structured or unstructured data? How did you design the schema?',
      'How did you ensure data consistency and integrity across multiple related tables?',
      'If your project’s database grew from 1,000 rows to 10 million rows, what specific indexing and partitioning steps would you take?',
    ],
    defaultChecklist: [
      { key: 'ic_1', text: 'Master SQL Window Functions: PARTITION BY, ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD' },
      { key: 'ic_2', text: 'Understand Star Schema vs Snowflake Schema and Fact vs Dimension tables' },
      { key: 'ic_3', text: 'Revise OLTP vs OLAP system differences and query workload patterns' },
      { key: 'ic_4', text: 'Practice 15 complex multi-table SQL queries with CTEs and self-joins' },
      { key: 'ic_5', text: 'Prepare your narrative on why you want a specialized career in Data & AI' },
    ],
    disclaimer:
      'Curated practice questions reflect general recruitment experiences and student submissions for InfoCepts.',
  },
];
