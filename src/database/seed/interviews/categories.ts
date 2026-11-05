export interface SeedCategory {
  id: string;
  groupId: string;
  groupName: string;
  name: string;
  description: string;
  icon: string;
  orderIndex: number;
}

export const SEED_INTERVIEW_CATEGORIES: SeedCategory[] = [
  // A. Programming Languages
  {
    id: 'prog-java',
    groupId: 'programming',
    groupName: 'Programming Languages',
    name: 'Java',
    description: 'JVM internals, memory model, GC, multithreading, collections, Java 8-21 streams & lambdas.',
    icon: 'Coffee',
    orderIndex: 1,
  },
  {
    id: 'prog-python',
    groupId: 'programming',
    groupName: 'Programming Languages',
    name: 'Python',
    description: 'GIL, memory management, decorators, generators, data model (dunder methods), async/await.',
    icon: 'Terminal',
    orderIndex: 2,
  },
  {
    id: 'prog-js',
    groupId: 'programming',
    groupName: 'Programming Languages',
    name: 'JavaScript',
    description: 'Event loop, prototypes, closures, V8 engine, ES6+, Promises, microtasks vs macrotasks.',
    icon: 'FileCode',
    orderIndex: 3,
  },
  {
    id: 'prog-cpp',
    groupId: 'programming',
    groupName: 'Programming Languages',
    name: 'C/C++ Fundamentals',
    description: 'Pointers, memory layout, RAII, smart pointers, templates, STL containers, virtual tables.',
    icon: 'Cpu',
    orderIndex: 4,
  },

  // B. Database
  {
    id: 'db-sql',
    groupId: 'database',
    groupName: 'Database & SQL',
    name: 'SQL',
    description: 'Complex queries, aggregations, joins, subqueries, CTEs, window functions, and query optimization.',
    icon: 'Database',
    orderIndex: 5,
  },
  {
    id: 'db-dbms',
    groupId: 'database',
    groupName: 'Database & SQL',
    name: 'DBMS Core & Architecture',
    description: 'Relational model, storage engines, B-Trees, transaction logs, locking protocols, write-ahead logging.',
    icon: 'HardDrive',
    orderIndex: 6,
  },
  {
    id: 'db-normalization',
    groupId: 'database',
    groupName: 'Database & SQL',
    name: 'Normalization & Schema Design',
    description: '1NF to 5NF, BCNF, functional dependencies, denormalization trade-offs, ER diagramming.',
    icon: 'Table',
    orderIndex: 7,
  },
  {
    id: 'db-acid',
    groupId: 'database',
    groupName: 'Database & SQL',
    name: 'Transactions & ACID',
    description: 'Atomicity, Consistency, Isolation levels (Read Uncommitted to Serializable), Durability, 2PC.',
    icon: 'ShieldCheck',
    orderIndex: 8,
  },
  {
    id: 'db-indexing',
    groupId: 'database',
    groupName: 'Database & SQL',
    name: 'Indexing & Performance',
    description: 'Clustered vs Non-clustered, Composite indexes, Cardinality, EXPLAIN plans, Cover indexes.',
    icon: 'Search',
    orderIndex: 9,
  },

  // C. Computer Science
  {
    id: 'cs-oops',
    groupId: 'cs_core',
    groupName: 'Computer Science Core',
    name: 'Object Oriented Programming (OOPs)',
    description: 'Encapsulation, Inheritance, Polymorphism, Abstraction, SOLID principles, Design Patterns.',
    icon: 'Boxes',
    orderIndex: 10,
  },
  {
    id: 'cs-os',
    groupId: 'cs_core',
    groupName: 'Computer Science Core',
    name: 'Operating Systems',
    description: 'Processes, Threads, CPU Scheduling, Deadlocks, Virtual Memory, Paging, Inter-process Communication.',
    icon: 'Server',
    orderIndex: 11,
  },
  {
    id: 'cs-cn',
    groupId: 'cs_core',
    groupName: 'Computer Science Core',
    name: 'Computer Networks',
    description: 'OSI & TCP/IP models, DNS, HTTP/HTTPS, TCP 3-way handshake, Subnetting, Sockets, CDN, WebSockets.',
    icon: 'Network',
    orderIndex: 12,
  },
  {
    id: 'cs-dsa',
    groupId: 'cs_core',
    groupName: 'Computer Science Core',
    name: 'Data Structures & Algorithms',
    description: 'Complexity analysis, Linked Lists, Trees, Graphs, Dynamic Programming, Greedy, Sorting & Searching.',
    icon: 'GitBranch',
    orderIndex: 13,
  },
  {
    id: 'cs-se',
    groupId: 'cs_core',
    groupName: 'Computer Science Core',
    name: 'Software Engineering',
    description: 'SDLC, Agile/Scrum, CI/CD, Testing pyramids, Microservices vs Monolith, Clean Code practices.',
    icon: 'Workflow',
    orderIndex: 14,
  },

  // D. Development
  {
    id: 'dev-react',
    groupId: 'development',
    groupName: 'Development & Frameworks',
    name: 'React & React Native',
    description: 'Fiber reconciliation, Virtual DOM, Hooks, state managers, Native Modules, performance tuning.',
    icon: 'Layers',
    orderIndex: 15,
  },
  {
    id: 'dev-node',
    groupId: 'development',
    groupName: 'Development & Frameworks',
    name: 'Node.js & Express.js',
    description: 'Libuv, Event loop phases, Streams, Buffers, Middlewares, Cluster module, Worker threads.',
    icon: 'ServerCog',
    orderIndex: 16,
  },
  {
    id: 'dev-api-git',
    groupId: 'development',
    groupName: 'Development & Frameworks',
    name: 'REST APIs, Git & GitHub',
    description: 'RESTful constraints, HTTP Status codes, Idempotency, OAuth2, Git internals, merge vs rebase.',
    icon: 'GitPullRequest',
    orderIndex: 17,
  },

  // E. AI/ML
  {
    id: 'aiml-core',
    groupId: 'aiml',
    groupName: 'Artificial Intelligence & Machine Learning',
    name: 'Machine Learning & Stats',
    description: 'Supervised/Unsupervised, Bias-Variance trade-off, Overfitting, Metrics, Statistics, Feature Engineering.',
    icon: 'BrainCircuit',
    orderIndex: 18,
  },
  {
    id: 'aiml-deep',
    groupId: 'aiml',
    groupName: 'Artificial Intelligence & Machine Learning',
    name: 'Deep Learning, NLP & Neural Networks',
    description: 'Backpropagation, Activation functions, CNNs, RNNs, Transformers, Attention mechanism, LLMs.',
    icon: 'Sparkles',
    orderIndex: 19,
  },

  // F. HR Interview Preparation
  {
    id: 'hr-behavioral',
    groupId: 'hr',
    groupName: 'HR & Behavioral',
    name: 'HR & Behavioral Interviews',
    description: 'STAR methodology, self-introduction, career aspirations, salary negotiation, leadership stories.',
    icon: 'UserCheck',
    orderIndex: 20,
  },

  // G. Project-Based Interview Preparation
  {
    id: 'project-prep',
    groupId: 'projects',
    groupName: 'Project-Based Preparation',
    name: 'Project Deep-Dive & Architecture',
    description: 'System design, database modeling, API contracts, technical trade-offs, and challenge narratives.',
    icon: 'FolderGit2',
    orderIndex: 21,
  },
];
