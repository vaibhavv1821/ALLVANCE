import { SeedInterviewQuestion } from './types';

export const PROJECT_QUESTIONS: SeedInterviewQuestion[] = [
  {
    id: 'proj-01',
    categoryId: 'project-prep',
    title: 'Walk me through the high-level architecture of your primary project.',
    difficulty: 'INTERMEDIATE',
    answer:
      'Structure your response using a Layered / Client-Server narrative: 1. Client Layer: Frontend / mobile client framework (e.g. React Native with TypeScript), state management layer (Zustand/Context), and local persistent cache (SQLite). 2. API Gateway & Network: Protocol (RESTful JSON over HTTPS / WebSockets), route authentication middleware. 3. Application / Service Layer: Business logic services (e.g. Booking Service, Payment Service), validation schemas (Zod). 4. Data Layer: Primary relational database (PostgreSQL / SQLite) with indexes, plus ephemeral caching layer (Redis). 5. Cloud & DevOps: Containerization (Docker) and deployment pipelines.',
    example:
      '"In my project, ALLVANCE, I implemented a client-centric, local-first architecture. The client is built in React Native and Expo SDK 58 using TypeScript for strict type safety. Rather than depending on continuous cloud availability, all user data, bookmarks, and mock test records are stored locally in an embedded SQLite database using Drizzle ORM. UI state is managed via lightweight Zustand stores, and navigation is handled by file-based Expo Router. This architecture guarantees sub-10ms response times with zero cloud server expenses."',
    keyPoints: [
      'Start broad (high-level layers), then drill down into specific components.',
      'Explain the communication protocol between layers.',
    ],
    followUps: [
      {
        question: 'Why did you choose a local-first / client-centric approach over a cloud-first backend?',
        answer: 'To guarantee 100% offline uptime in environments with unstable internet connectivity while keeping infrastructure operational costs at zero.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'TCS', 'Capgemini', 'InfoCepts'],
    tags: ['Architecture', 'System Design', 'Project Overview'],
  },
  {
    id: 'proj-02',
    categoryId: 'project-prep',
    title: 'Why did you choose your specific technology stack over alternative frameworks?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Interviewers evaluate whether you chose technologies based on sound engineering trade-offs rather than mere popularity. Structure: 1. State the requirements: (e.g. cross-platform iOS/Android support, type safety, offline relational storage). 2. Contrast with alternatives: (e.g. React Native vs Flutter; SQLite vs AsyncStorage). 3. Justify the decision with trade-offs.',
    example:
      '"We chose React Native with Expo and TypeScript over Flutter/Dart because our team already had strong JavaScript and web fundamentals, allowing us to hit the ground running without learning Dart from scratch. We selected SQLite with Drizzle ORM over basic AsyncStorage because our interview question bank required relational joins, complex category filtering, and transactional updates across questions, attempts, and revisions—capabilities that a simple key-value store cannot deliver efficiently."',
    keyPoints: [
      'Demonstrates conscious technical decision-making.',
      'Acknowledge trade-offs honestly (e.g. Flutter has slightly more consistent cross-platform canvas rendering, but RN leverages existing web ecosystems).',
    ],
    followUps: [
      {
        question: 'What is a limitation of your chosen tech stack that you had to work around?',
        answer: 'React Native’s asynchronous bridge overhead when communicating heavy data between native modules and JS thread, which we mitigated using synchronous SQLite JSI bindings.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini', 'Cognizant'],
    tags: ['Tech Stack', 'Tradeoffs', 'Technology Selection'],
  },
  {
    id: 'proj-03',
    categoryId: 'project-prep',
    title: 'How did you design the database schema for your project and what normalization level did you achieve?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Explain your entity relationship modeling process: 1. Identify Core Entities: (e.g. Users, Bookings, Services, Questions, Categories, Revisions). 2. Relationships & Constraints: Primary keys, foreign keys with ON DELETE CASCADE rules, unique constraints. 3. Normalization: Explain achieving 3NF (removing partial dependencies in 2NF, removing transitive dependencies in 3NF). 4. Indexing Strategy: Indexes placed on frequently queried foreign keys, status filters, and sorting timestamp columns.',
    example:
      '"For ServMate, we structured our schema in 3rd Normal Form (3NF) across 8 core tables. A Customer can have multiple Bookings; each Booking references exactly one Technician and one Service, linking to an Invoice and Payment record. We eliminated partial dependencies by separating Technician profiles from their independent availability schedule slots. We indexed foreign keys (customer_id, technician_id) and placed composite indexes on (booking_date, status) to optimize daily schedule lookups from O(N) to O(log N)."',
    keyPoints: [
      'Justify why you stopped at 3NF (higher normal forms require excessive joins).',
      'Mention specific indexes and explain the query patterns they optimize.',
    ],
    followUps: [
      {
        question: 'Did you intentionally denormalize any part of your schema?',
        answer: 'Yes, we stored a pre-calculated average_rating and review_count directly on the technician table to avoid computing expensive AVG() aggregates across thousands of review rows on every search.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini', 'InfoCepts'],
    tags: ['Database Design', 'Schema', 'Normalization', 'Indexes'],
  },
  {
    id: 'proj-04',
    categoryId: 'project-prep',
    title: 'How did you handle Authentication and Authorization in your application?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Explain the end-to-end security pipeline: 1. Password Security: Passwords salted and hashed with Argon2id or bcrypt before storage (never stored in plaintext). 2. Authentication Protocol: Stateless JWT (JSON Web Tokens) or session cookies. Short-lived Access Token (15 min) paired with rotating Refresh Token (7 days) stored in SecureStore / HTTP-only secure cookies. 3. Authorization Middleware: Role-Based Access Control (RBAC) inspecting user roles (Admin, Provider, User) before granting access to protected endpoints.',
    example:
      '"In our backend, user authentication relies on JWTs with a dual-token refresh rotation mechanism. When the user logs in, credentials are verified against bcrypt hashes. The server issues a short-lived Access Token (15-min expiry) containing the user’s ID and role payload, and a secure Refresh Token stored in an HTTP-only, SameSite cookie. Protected routes pass through an auth middleware that verifies the JWT cryptographic signature. Role-Based Access Control ensures regular users cannot invoke admin management endpoints."',
    keyPoints: [
      'Never store sensitive JWT tokens in unencrypted localStorage (vulnerable to XSS).',
      'Explain token expiration and refresh rotation to mitigate token theft.',
    ],
    followUps: [
      {
        question: 'What is the risk of storing JWTs in browser localStorage?',
        answer: 'Any cross-site scripting (XSS) vulnerability can read localStorage and steal user tokens. HTTP-only cookies prevent JavaScript access.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini', 'Cognizant'],
    tags: ['Authentication', 'JWT', 'Security', 'RBAC'],
  },
  {
    id: 'proj-05',
    categoryId: 'project-prep',
    title: 'How did you design your RESTful API endpoints and contracts?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Explain adhering to REST constraints: 1. Resource-Oriented Naming: Use nouns instead of verbs (e.g. GET /api/v1/services, POST /api/v1/bookings, DELETE /api/v1/bookings/:id). 2. Appropriate HTTP Verbs: GET (retrieve), POST (create), PUT (complete replacement), PATCH (partial update), DELETE (remove). 3. Standard HTTP Status Codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Server Error. 4. Consistent JSON Envelope: Consistent response structure ({ success: true, data: {...}, error?: string }). 5. Input Validation: Validating request payloads using Zod or Joi schemas before processing.',
    keyPoints: [
      'Idempotency: GET, PUT, and DELETE must be idempotent; POST is non-idempotent.',
      'API versioning (e.g. /api/v1/) enables future backward compatibility.',
    ],
    followUps: [
      {
        question: 'What is the difference between PUT and PATCH?',
        answer: 'PUT replaces the entire resource representation; PATCH applies a partial update modifying only the specified fields.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['REST APIs', 'API Design', 'HTTP Verbs'],
  },
  {
    id: 'proj-06',
    categoryId: 'project-prep',
    title: 'What was the single most difficult technical challenge you encountered, and how did you resolve it?',
    difficulty: 'ADVANCED',
    answer:
      'Use the STAR Method: 1. Situation: Describe a specific, gnarly technical bug or concurrency bottleneck. 2. Task: Explain why standard naive approaches failed. 3. Action: Describe your diagnostic process (profiling, reading logs, isolating minimal reproduction), your research into theoretical solutions, and the implementation. 4. Result: Quantitative metrics showing resolution.',
    example:
      '"In ServMate, our hardest challenge was handling high-concurrency slot booking collisions: when two users attempted to book the exact same technician time slot at the same second. Initially, we used simple SELECT then INSERT logic, which caused race conditions and double-bookings. I resolved this by architecting a two-tier locking pipeline: first, a fast Redis distributed lock with a 15-second TTL during checkout; second, wrapping the final database confirmation in a PostgreSQL SERIALIZABLE transaction with `SELECT ... FOR UPDATE` row-level locks on the schedule slot. Load testing with Artillery across 500 concurrent requests confirmed zero double-bookings with sub-80ms response times."',
    keyPoints: [
      'Shows real engineering depth and tenacity.',
      'Quantify results: 0 double-bookings, <80ms response time.',
    ],
    followUps: [
      {
        question: 'What happens if the Redis server crashes during the checkout lock?',
        answer: 'The database row lock provides the ultimate transactional source of truth; Redis merely acts as a high-speed front-line filter.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini', 'InfoCepts'],
    tags: ['STAR Method', 'Concurrency', 'Challenges', 'Debugging'],
  },
  {
    id: 'proj-07',
    categoryId: 'project-prep',
    title: 'How did you handle security and prevent vulnerabilities like SQL Injection and XSS?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Structure by threat vectors and defenses: 1. SQL Injection: Used parameterized queries and ORMs (Drizzle / Prisma / Sequelize) that automatically escape all user inputs, completely preventing raw string concatenation in SQL statements. 2. Cross-Site Scripting (XSS): Sanitized user HTML inputs using DOMPurify, encoded output strings, and avoided dangerous innerHTML. 3. Cross-Site Request Forgery (CSRF): Enforced SameSite=Strict on session cookies and verified CSRF tokens. 4. Rate Limiting & DoS: Implemented express-rate-limit backed by Redis to prevent brute-force attacks on login endpoints.',
    keyPoints: [
      'Never concatenate raw user input strings into SQL statements.',
      'Validate inputs strictly using schema validation (Zod).',
    ],
    followUps: [
      {
        question: 'Why do Parameterized Queries prevent SQL Injection fundamentally?',
        answer: 'Because the database engine pre-compiles the SQL query structure first; user parameters are treated strictly as literal data values, never as executable code.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini', 'HCL'],
    tags: ['Security', 'SQL Injection', 'XSS', 'Best Practices'],
  },
  {
    id: 'proj-08',
    categoryId: 'project-prep',
    title: 'How did you manage Application State across your components?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Explain your state categorization strategy: 1. Local Component State (useState / useReducer): For UI-only ephemeral state (modal toggles, text input focus, animation state). 2. Global Client State (Zustand / Redux): For cross-cutting app state (user theme mode, active user profile, daily streak counter). 3. Server / Cache State (TanStack Query / local SQLite): For remote or persistent data, handling caching, refetching, and pagination.',
    example:
      '"In ALLVANCE, we chose Zustand over Redux for global state because it has zero boilerplate, does not require wrapping the tree in Context Providers, and allows selector-based subscriptions so components only re-render when their specific subscribed slice changes. For heavy domain entities (interview questions, categories), we bypass memory stores entirely and query local SQLite directly using fast indexed queries, keeping app memory footprint under 60MB."',
    keyPoints: [
      'Avoid putting everything in global state; keep local state local.',
      'Selector-based subscriptions prevent unnecessary full-tree re-renders.',
    ],
    followUps: [
      {
        question: 'Why is React Context API sub-optimal for high-frequency state updates?',
        answer: 'Any update to a Context value forces every consumer component to re-render, causing performance bottlenecks unless heavily memoized.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['State Management', 'Zustand', 'React', 'Performance'],
  },
  {
    id: 'proj-09',
    categoryId: 'project-prep',
    title: 'How would you scale your project if daily active users grew from 1,000 to 1,000,000?',
    difficulty: 'ADVANCED',
    answer:
      'Structure a multi-tier scaling roadmap: 1. Stateless Backend & Horizontal Scaling: Make Node.js servers completely stateless, containerize with Docker, and autoscale behind an AWS ALB (Application Load Balancer). 2. Caching Layer: Introduce Redis clusters to cache hot database reads (service catalogs, user sessions). 3. Database Scaling: Implement PostgreSQL Read-Replicas to distribute read queries, use connection pooling (pgBouncer), and eventually shard database tables by user region. 4. Content Delivery (CDN): Offload all static media, images, and bundles to AWS CloudFront / Cloudflare edge CDN. 5. Asynchronous Task Queues: Decouple heavy jobs (sending emails, video processing) to RabbitMQ / BullMQ worker threads.',
    keyPoints: [
      'Scale horizontally (add more small machines) rather than vertically (buying one giant server).',
      '80/20 rule: 80% of database load can be absorbed by a well-designed Redis cache layer.',
    ],
    followUps: [
      {
        question: 'What is the "Cache Stampede" problem and how do you prevent it?',
        answer: 'When a popular cache key expires and thousands of concurrent requests all miss the cache simultaneously, overloading the database. Solved using probabilistic early expiration (XFetch) or mutex locks.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'InfoCepts'],
    tags: ['Scalability', 'System Design', 'Redis', 'Load Balancing'],
  },
  {
    id: 'proj-10',
    categoryId: 'project-prep',
    title: 'How did you test your project to ensure reliability and prevent regressions?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Structure by the Testing Pyramid: 1. Unit Tests (Jest): Testing pure functions, utility algorithms, encryption helpers, and data parsing logic in isolation with 100% code coverage. 2. Integration Tests: Testing database repository methods with real SQLite in-memory test databases, and testing API route handlers with Supertest. 3. End-to-End (E2E) / UI Tests: Testing critical user journeys (e.g. login -> book service -> checkout). 4. Automated CI: Running linters (ESLint), TypeScript type checks (tsc --noEmit), and automated test suites on every GitHub pull request.',
    keyPoints: [
      'Unit tests are fast and cheap; E2E tests are comprehensive but slow.',
      'Mock external network boundaries, but test database repositories against real SQLite.',
    ],
    followUps: [
      {
        question: 'What is the difference between Mocks, Stubs, and Spies in Jest?',
        answer: 'Stub provides predefined canned answers; Spy wraps real methods to record call arguments and counts; Mock simulates an entire object with programmable behavior and assertions.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['Testing', 'Jest', 'CI/CD', 'Code Quality'],
  },
  {
    id: 'proj-11',
    categoryId: 'project-prep',
    title: 'Explain your Git branching strategy and how you resolve merge conflicts.',
    difficulty: 'BEGINNER',
    answer:
      'Explain using Git Flow / GitHub Flow: 1. Main / Production branch: Always stable and deployable. 2. Feature branches: Created off main for each user story (e.g. feature/interview-prep). 3. Pull Requests & Code Reviews: Peer review required before merging, with automated CI passing linting and tests. 4. Merge Conflicts: When conflicts arise, rebase or merge main into the feature branch, inspect conflicting files, compare diff markers (<<<<<<< HEAD), discuss intent with teammate if necessary, resolve code manually, test the build, and commit.',
    codeExample: `git checkout -b feature/interview-prep
# Work, commit changes
git fetch origin
git rebase origin/main # Or git merge origin/main
# Resolve conflicts in VS Code / IDE
git add .
git rebase --continue
git push origin feature/interview-prep`,
    keyPoints: [
      'Keep pull requests small (<400 lines) to simplify code review and reduce conflict risks.',
      'Never push directly to main without review.',
    ],
    followUps: [
      {
        question: 'What is the difference between Git Merge and Git Rebase?',
        answer: 'git merge creates a 3-way merge commit preserving exact history branch topology; git rebase replays your commits on top of the target branch creating a clean linear commit history.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro'],
    tags: ['Git', 'Branching', 'Version Control'],
  },
  {
    id: 'proj-12',
    categoryId: 'project-prep',
    title: 'How did you profile and optimize frontend/mobile rendering performance?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Structure by diagnostic techniques and optimizations: 1. Profiling: Used React DevTools Profiler and Flipper to identify unnecessary component re-renders and dropped frames (FPS drops). 2. List Virtualization: Replaced ScrollView with FlatList / FlashList, configuring windowSize and getItemLayout to recycle views. 3. Memoization: Used React.memo, useMemo, and useCallback on expensive computations and callbacks passed to child items. 4. Asset Optimization: Compressed images to WebP format, used vector SVGs, and enabled Hermes JavaScript engine for 2x faster app startup.',
    keyPoints: [
      'Hermes engine provides ahead-of-time (AOT) bytecode compilation, reducing app startup time and RAM.',
      'Never memoize prematurely; profile first to identify real re-render bottlenecks.',
    ],
    followUps: [
      {
        question: 'Why does ScrollView cause performance problems with large lists?',
        answer: 'ScrollView renders all items into memory simultaneously; FlatList virtualizes, rendering only items within the visible viewport window.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['Performance', 'React Native', 'Profiling', 'Hermes'],
  },
  {
    id: 'proj-13',
    categoryId: 'project-prep',
    title: 'In ServMate, how did you handle technician scheduling across time zones and daylight savings?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Explain storing all database timestamps in UTC (Unix epoch milliseconds or ISO-8601 UTC strings) and converting to the technician’s local time zone on the client display. Slot generation calculates availability in the provider’s local operating window and stores slot boundaries in UTC.',
    keyPoints: [
      'Always store timestamps in UTC on the backend.',
      'Time zone conversion occurs exclusively at the presentation layer.',
    ],
    followUps: [
      {
        question: 'What library is recommended for time zone handling in modern JavaScript/TypeScript?',
        answer: 'date-fns-tz, Day.js with timezone plugin, or native Temporal API.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts'],
    tags: ['ServMate', 'Timezones', 'Scheduling'],
  },
  {
    id: 'proj-14',
    categoryId: 'project-prep',
    title: 'In IntelliVault, how did you ensure encrypted data cannot be decrypted by a compromised cloud server?',
    difficulty: 'ADVANCED',
    answer:
      'Explain the zero-knowledge security architecture: all cryptographic key derivation (Argon2id) and AES-256-GCM encryption occurs exclusively on the client mobile device before any data is sent over the network. The master passphrase is never transmitted to the server. The server stores only opaque ciphertext bytes, nonces, and authentication tags. Even if the server database is completely leaked, attackers cannot decrypt files without the user’s client-side passphrase.',
    keyPoints: [
      'Zero-knowledge: server possesses zero knowledge of plaintext or decryption keys.',
      'Argon2id protects against GPU/ASIC brute-force attacks on the passphrase.',
    ],
    followUps: [
      {
        question: 'What happens if a user forgets their master passphrase in a zero-knowledge system?',
        answer: 'Data is permanently unrecoverable by design; mitigated using social recovery (Shamir’s Secret Sharing) or emergency paper recovery keys.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts'],
    tags: ['IntelliVault', 'Zero Knowledge', 'Cryptography'],
  },
  {
    id: 'proj-15',
    categoryId: 'project-prep',
    title: 'In MindMap, how does Conflict-Free Replicated Data Types (CRDTs) achieve real-time collaborative editing?',
    difficulty: 'ADVANCED',
    answer:
      'Explain how CRDTs (like Yjs) mathematically resolve concurrent conflicting edits across multiple users without a central server arbiter. Every edit operation (insert, delete, move node) is assigned a globally unique Lamport timestamp and client ID. Because CRDT operations are commutative and associative, all clients converge deterministically to the identical document state regardless of network latency or the order in which update packets arrive.',
    keyPoints: [
      'CRDTs provide Strong Eventual Consistency.',
      'Unlike Operational Transformation (OT), CRDTs do not require a central coordinating server.',
    ],
    followUps: [
      {
        question: 'What is the trade-off of CRDTs compared to simple JSON documents?',
        answer: 'Memory overhead: CRDTs maintain metadata (tombstones for deletions and Lamport clocks) for every character or node.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts'],
    tags: ['MindMap', 'CRDT', 'Real-Time', 'WebSockets'],
  },
  {
    id: 'proj-16',
    categoryId: 'project-prep',
    title: 'In CampusMart, how did you prevent image upload bottlenecks on your backend server?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Explain utilizing AWS S3 Pre-signed URLs: instead of uploading high-resolution listing photos through the Node.js backend server (which consumes server bandwidth and memory), the client requests a cryptographically signed temporary upload URL from the server (`POST /api/v1/uploads/presigned-url`). The client then uploads the image directly to AWS S3. S3 triggers an event to generate thumbnail variants asynchronously.',
    keyPoints: [
      'Eliminates server CPU/bandwidth bottleneck by 80%.',
      'Secure: Pre-signed URLs have strict expiration times and size limits.',
    ],
    followUps: [
      {
        question: 'How do you prevent users from uploading non-image malicious files to S3 via pre-signed URLs?',
        answer: 'Configure Content-Type restrictions and exact byte-length headers inside the cryptographic policy signature.',
      },
    ],
    companies: ['Deloitte', 'Infosys'],
    tags: ['CampusMart', 'AWS S3', 'Pre-signed URLs', 'Cloud'],
  },
  {
    id: 'proj-17',
    categoryId: 'project-prep',
    title: 'In ValueMyCar, how did you evaluate ML model accuracy and prevent data leakage?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Explain the ML pipeline: 1. Data Split: Stratified train-test split (80/20) executed BEFORE any data preprocessing. 2. Pipeline Encapsulation: All feature scalers and categorical target encoders were fit ONLY on training folds to prevent data leakage. 3. Evaluation Metrics: Root Mean Squared Error (RMSE), Mean Absolute Error (MAE), and R2 score. MAE was selected as the primary business metric because it translates directly into average Indian Rupee pricing error. 4. Validation: 5-fold cross-validation ensured the model did not overfit.',
    keyPoints: [
      'Never fit scalers or encoders on the full dataset before splitting (causes data leakage).',
      'MAE provides intuitive domain error interpretation.',
    ],
    followUps: [
      {
        question: 'What is Target Leakage in machine learning?',
        answer: 'When training features contain information about the target variable that would not be available at the actual time of prediction.',
      },
    ],
    companies: ['InfoCepts', 'Deloitte'],
    tags: ['ValueMyCar', 'Machine Learning', 'Data Leakage', 'Metrics'],
  },
  {
    id: 'proj-18',
    categoryId: 'project-prep',
    title: 'How did you handle third-party API failures and implement Circuit Breakers?',
    difficulty: 'ADVANCED',
    answer:
      'Explain handling downstream dependency failures: 1. Timeouts: Enforce strict timeouts (e.g. 3 seconds) so hanging external APIs do not exhaust thread pools. 2. Retries with Exponential Backoff and Jitter: Automatically retry transient network failures (e.g. after 500ms, 1s, 2s + random jitter). 3. Circuit Breaker Pattern (Netflix Hystrix / Opossum): Tracks failure rates. If failure rate exceeds 50%, the breaker TRIPS (OPEN state), immediately returning cached fallback responses without hitting the dying external service. After a cooldown, it enters HALF-OPEN state to test if the service has recovered.',
    keyPoints: [
      'Prevents cascading failures across microservices.',
      'States: CLOSED (normal), OPEN (fast-fail fallback), HALF-OPEN (testing recovery).',
    ],
    followUps: [
      {
        question: 'Why is adding "Jitter" to exponential backoff retries important?',
        answer: 'Without jitter, all failed clients retry at the exact same synchronized intervals, generating a "thundering herd" spike that crashes the recovering server again.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts', 'Infosys'],
    tags: ['Circuit Breaker', 'Resilience', 'Microservices'],
  },
  {
    id: 'proj-19',
    categoryId: 'project-prep',
    title: 'What technical decisions would you make differently if you rebuilt your project from scratch today?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Interviewers love this question because it tests technical maturity, self-reflection, and continuous learning. Pick 1-2 real architectural improvements (e.g. adopting strict database migrations earlier, using domain-driven modular boundaries, or implementing automated end-to-end tests from day one).',
    example:
      '"If rebuilding ALLVANCE from scratch today, I would make two key architectural improvements: First, I would introduce database migration versioning tools from day one rather than writing custom DDL execution scripts later, which would have streamlined schema updates. Second, I would structure our feature modules using Clean Architecture / Ports and Adapters, decoupling database repository interfaces completely from SQLite-specific implementations to make future cloud sync even easier."',
    keyPoints: [
      'Demonstrates self-reflection and engineering growth.',
      'Frame it as progressive architectural refinement, not a failure.',
    ],
    followUps: [
      {
        question: 'What was your biggest architectural takeaway from this project?',
        answer: 'Investing early in type safety, database constraints, and automated tests saves hundreds of hours of manual debugging later.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini', 'Cognizant'],
    tags: ['Reflection', 'Architecture', 'Continuous Improvement'],
  },
  {
    id: 'proj-20',
    categoryId: 'project-prep',
    title: 'How did you handle database schema migrations without data loss in production?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Explain migration best practices: 1. Versioned Migration Scripts: Incremental numbered scripts (0001_initial.sql, 0002_placement.sql). 2. Schema Migrations Tracking Table: A dedicated table recording applied versions and timestamps. 3. Transactional DDL: Executing each migration inside a BEGIN TRANSACTION / COMMIT block so that if an error occurs, changes roll back cleanly without leaving the schema in a corrupted half-migrated state. 4. Backward Compatibility: Adding columns as nullable or with defaults to avoid breaking running application code.',
    keyPoints: [
      'Never edit previously executed migration files.',
      'Always test migrations on staging data before applying to production.',
    ],
    followUps: [
      {
        question: 'How do you handle dropping a column safely in a production database without downtime?',
        answer: 'Follow the Expand and Contract pattern: Stop writing to the column in code -> Deploy app -> Remove column from code -> Drop column in database migration.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['Database Migrations', 'DDL', 'Transactions'],
  },
  {
    id: 'proj-21',
    categoryId: 'project-prep',
    title: 'Explain how you optimized mobile battery consumption and network calls in your project.',
    difficulty: 'INTERMEDIATE',
    answer:
      'Explain mobile power optimization: 1. Geolocation: Replaced continuous GPS tracking with adaptive geofencing and distance filters (only request location updates when moved >50 meters). 2. Network Batching: Batched analytics and sync events, flushing periodically rather than firing immediate HTTP requests for every tap. 3. Local Caching: Used SQLite to cache static datasets, eliminating redundant network round-trips.',
    keyPoints: [
      'GPS radios and cellular antennas are primary battery drains on mobile devices.',
      'Batching network calls allows cellular radios to return to low-power sleep states.',
    ],
    followUps: [
      {
        question: 'What is the cellular radio state machine in mobile OS?',
        answer: 'Cellular chips have high-power, low-power, and idle states; firing periodic single requests keeps the chip awake in high-power mode continuously.',
      },
    ],
    companies: ['Deloitte', 'Infosys'],
    tags: ['Mobile Optimization', 'Battery', 'Networking'],
  },
  {
    id: 'proj-22',
    categoryId: 'project-prep',
    title: 'How did you implement error logging and crash monitoring in your application?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Explain error handling infrastructure: 1. Global Error Boundaries: React Error Boundary components catching unhandled UI rendering exceptions and displaying friendly fallback screens rather than crashing. 2. Centralized Error Handlers: Express.js error middleware catching unhandled promise rejections. 3. Logging & Monitoring: Integrated logging services (Sentry / Winston) that capture error stack traces, device OS, and user breadcrumbs with personal data masked.',
    keyPoints: [
      'Never display raw database error stack traces to end-users (security vulnerability).',
      'Breadcrumbs record the user actions preceding the crash.',
    ],
    followUps: [
      {
        question: 'What is a React Error Boundary?',
        answer: 'A class component that implements componentDidCatch() or getDerivedStateFromError() to catch JavaScript errors in child component trees.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['Error Handling', 'Logging', 'Monitoring', 'Sentry'],
  },
  {
    id: 'proj-23',
    categoryId: 'project-prep',
    title: 'What was your individual role and contribution in your final-year group project?',
    difficulty: 'BEGINNER',
    answer:
      'Be specific, honest, and take ownership of your exact technical deliverables while acknowledging team collaboration. Highlight the architectural components, database schema, or features you spearheaded personally.',
    example:
      '"In our 4-person capstone project, I served as the Core Backend and Database Lead. While our team collaborated on initial requirements and UI wireframes, my personal responsibility was designing the relational schema in PostgreSQL, writing database migrations, building the RESTful API endpoints in Node.js, and implementing the JWT authentication middleware. I also set up our automated GitHub Actions CI pipeline that verified linting and unit test coverage before each merge."',
    keyPoints: [
      'Clarifies individual accountability versus team deliverables.',
      'Shows pride in technical execution without undermining teammates.',
    ],
    followUps: [
      {
        question: 'How did you coordinate tasks between frontend and backend teammates?',
        answer: 'We wrote OpenAPI / Swagger specifications first, agreeing on JSON request/response contracts before writing code.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Deloitte'],
    tags: ['Group Project', 'Teamwork', 'Individual Contribution'],
  },
  {
    id: 'proj-24',
    categoryId: 'project-prep',
    title: 'How did you validate and sanitize user inputs across the frontend and backend?',
    difficulty: 'BEGINNER',
    answer:
      'Explain the Defense-in-Depth principle: Never trust the client. 1. Client-side Validation: Instant user feedback on forms (email regex, required fields) using React Hook Form and Zod to enhance user experience. 2. Server-side Validation: The true security boundary. The backend independently validates all incoming request bodies against the same Zod schema, rejecting malformed or malicious payloads with 400 Bad Request before hitting business logic or database queries.',
    keyPoints: [
      'Client-side validation is for User Experience; Server-side validation is for Security.',
      'TypeScript type safety exists only at compile-time; runtime schema validation (Zod) is required for external JSON inputs.',
    ],
    followUps: [
      {
        question: 'Why isn’t TypeScript alone enough to validate user input?',
        answer: 'TypeScript types are completely erased during compilation into JavaScript; runtime inputs like network JSON payloads must be validated at runtime.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['Validation', 'Zod', 'Security'],
  },
  {
    id: 'proj-25',
    categoryId: 'project-prep',
    title: 'In IntelliVault, how did you handle secure biometric authentication on Android and iOS?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Explain hardware-backed security modules: 1. Android Keystore / iOS Secure Enclave: Generate asymmetric keys inside hardware security chips that cannot be extracted even by a rooted device. 2. Biometric Prompt API: The OS prompts the user for fingerprint or face recognition. 3. Signature verification: Successful biometric scan unlocks the private key inside the secure enclave to sign or decrypt the local master vault key in ephemeral memory.',
    keyPoints: [
      'Biometric data (fingerprint raw images) never leaves the hardware chip and is never seen by the app.',
      'FLAG_SECURE on Android prevents sensitive screens from appearing in app switchers or screenshots.',
    ],
    followUps: [
      {
        question: 'What is FLAG_SECURE on Android?',
        answer: 'A window manager flag that blocks screenshots, screen recording, and masks the app window in the recent tasks overview.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts'],
    tags: ['IntelliVault', 'Biometrics', 'Android Security'],
  },
  {
    id: 'proj-26',
    categoryId: 'project-prep',
    title: 'How do you handle database connection leaks in backend applications?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Explain connection pool management: Connection leaks occur when code borrows a connection from the pool but fails to return/close it (e.g. unhandled exceptions bypass connection.release()). Prevention: 1. Always use try-finally or try-with-resources blocks where connection.release() is guaranteed in finally. 2. Use pool timeout monitors (e.g. HikariCP leakDetectionThreshold) that log stack traces of connections held longer than a threshold. 3. Monitor pool metrics (active vs idle connections).',
    keyPoints: [
      'Unclosed connections eventually exhaust the pool, causing all subsequent queries to hang and time out.',
      'ORM frameworks manage connection acquisition and release automatically per query/transaction.',
    ],
    followUps: [
      {
        question: 'What happens when a database connection pool is exhausted?',
        answer: 'Incoming requests queue up until connectionTimeout expires, then fail with "Pool Exhausted" or "Connection Timeout" 500 errors.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['Database', 'Connection Pooling', 'Debugging'],
  },
  {
    id: 'proj-27',
    categoryId: 'project-prep',
    title: 'In CampusMart, how did you implement real-time chat between buyer and seller?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Explain the WebSocket architecture: 1. Connection: Mobile client establishes persistent WebSocket connection to server authenticated via JWT query token. 2. Room Subscriptions: Users join conversation rooms based on conversation_id. 3. Message Delivery: When buyer sends message, server persists message to database first (durability), then broadcasts message event to the room via Socket.io / WebSockets. 4. Push Notification Fallback: If seller is offline (not connected to socket), server sends a push notification via Firebase Cloud Messaging (FCM).',
    keyPoints: [
      'WebSockets for active in-app chat; FCM push notifications for background alerts.',
      'Always persist messages to the database before acknowledging to the client.',
    ],
    followUps: [
      {
        question: 'How do you scale WebSockets across multiple server instances?',
        answer: 'Use Redis Pub/Sub adapter (e.g. @socket.io/redis-adapter) to broadcast messages across all server nodes.',
      },
    ],
    companies: ['Deloitte', 'Infosys'],
    tags: ['CampusMart', 'WebSockets', 'Real-Time', 'FCM'],
  },
  {
    id: 'proj-28',
    categoryId: 'project-prep',
    title: 'How do you handle database seed data and test data isolation during automated testing?',
    difficulty: 'BEGINNER',
    answer:
      'Explain test environment isolation: 1. Dedicated Test Database: Automated tests run against a dedicated in-memory SQLite database or isolated test container, never touching production or shared development data. 2. Seed Factories: Using test fixture factories that generate realistic mock models with unique IDs. 3. Transaction Rollback per Test: Wrapping each test case in a database transaction that rolls back at the end of the test, ensuring tests run in complete isolation with zero side-effects.',
    keyPoints: [
      'Tests must be idempotent and independent of execution order.',
      'In-memory SQLite provides sub-second test execution speeds.',
    ],
    followUps: [
      {
        question: 'Why should unit tests never connect to a live external database?',
        answer: 'External database network latency makes tests slow, flaky, and dependent on external network availability.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['Testing', 'Database Seeding', 'Isolation'],
  },
  {
    id: 'proj-29',
    categoryId: 'project-prep',
    title: 'In ValueMyCar, how did you deploy and serialize the Python ML inference model?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Explain model serialization and inference serving: 1. Training & Serialization: After training XGBoost models in Scikit-Learn, the model pipeline was serialized into ONNX (Open Neural Network Exchange) format or Joblib format. 2. Serving Architecture: Served via a lightweight Python FastAPI microservice running inside a Docker container. 3. Low-Latency Inference: ONNX Runtime optimized CPU inference latency to under 15ms per prediction, and FastAPI handled asynchronous concurrent request routing.',
    keyPoints: [
      'ONNX runtime provides hardware-accelerated, cross-platform inference.',
      'FastAPI provides automatic OpenAPI documentation and type validation.',
    ],
    followUps: [
      {
        question: 'Why choose ONNX over standard Python pickle for machine learning models?',
        answer: 'ONNX is language-independent, more secure (no arbitrary code execution risk), and optimized for low-latency CPU/GPU inference.',
      },
    ],
    companies: ['InfoCepts', 'Deloitte'],
    tags: ['ValueMyCar', 'Model Deployment', 'ONNX', 'FastAPI'],
  },
  {
    id: 'proj-30',
    categoryId: 'project-prep',
    title: 'How did you pitch your project to technical and non-technical stakeholders?',
    difficulty: 'BEGINNER',
    answer:
      'Explain tailoring communication to your audience: 1. For Non-Technical Stakeholders: Focus on the Problem, the Solution, User Experience, Business Value, and Cost Savings (avoid acronyms and framework jargon). 2. For Technical Interviewers: Focus on Architecture, Data Flow, Security Guarantees, Concurrency Handling, Latency Metrics, and Engineering Trade-offs.',
    example:
      '"When presenting to business stakeholders, I explain ALLVANCE as a student empowerment tool that removes internet barriers and boosts college placement rates by making practice accessible anytime. When speaking with engineering interviewers, I explain it as an offline-first mobile architecture utilizing embedded SQLite, Drizzle ORM, and indexed relational queries to achieve sub-10ms query performance without cloud infrastructure costs."',
    keyPoints: [
      'Communicating effectively across different audiences is a prized consulting skill.',
      'Translate technical implementation into business impact.',
    ],
    followUps: [
      {
        question: 'What is the biggest business metric your project impacts?',
        answer: 'Student placement preparedness and study consistency, tracked via daily active study streaks.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'TCS', 'Capgemini', 'InfoCepts'],
    tags: ['Communication', 'Stakeholders', 'Consulting'],
  },
];
