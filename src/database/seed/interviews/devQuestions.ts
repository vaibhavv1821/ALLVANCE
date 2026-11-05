import { SeedInterviewQuestion } from './types';

export const DEV_QUESTIONS: SeedInterviewQuestion[] = [
  {
    id: 'dev-01',
    categoryId: 'dev-react',
    title: 'How does React Virtual DOM and the Fiber Reconciliation algorithm work?',
    difficulty: 'INTERMEDIATE',
    answer:
      'The Virtual DOM (VDOM) is a lightweight JavaScript object representation of the real DOM kept in memory. When state changes, React creates a new VDOM tree and compares it with the previous VDOM tree using a Diffing algorithm (heuristic O(n) complexity based on component types and keys). React Fiber (the reconciliation engine introduced in React 16) broke rendering into incremental units of work (fibers). It splits rendering into two phases: 1. Render Phase (asynchronous, interruptible): builds the work-in-progress fiber tree and computes changes. 2. Commit Phase (synchronous): applies the computed DOM mutations to the actual browser DOM in one rapid pass.',
    keyPoints: [
      'Fiber allows prioritizing urgent updates (like typing/animations) over non-urgent updates (data fetching).',
      'Keys must be unique and stable across sibling elements to preserve state across re-renders.',
    ],
    followUps: [
      {
        question: 'Why should you never use array index as a React key for dynamic lists?',
        answer: 'Reordering, inserting, or deleting items shifts indices, causing React to misidentify items, leading to UI rendering bugs and state corruption in child components.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['React', 'Virtual DOM', 'Fiber', 'Reconciliation'],
  },
  {
    id: 'dev-02',
    categoryId: 'dev-react',
    title: 'Explain React Hooks rules and the dependency array in useEffect.',
    difficulty: 'BEGINNER',
    answer:
      'Two fundamental rules of React Hooks: 1. Only call Hooks at the top level (never inside loops, conditions, or nested functions) so React can preserve Hook state based on consistent call order. 2. Only call Hooks from React function components or custom Hooks. useEffect(callback, deps) dependency array behaviors: 1. No deps array: runs after EVERY render. 2. Empty array []: runs ONCE after initial mount (equivalent to componentDidMount). 3. Array with variables [a, b]: runs on mount and whenever any specified dependency value changes by reference (Object.is).',
    codeExample: `useEffect(() => {
    const subscription = dataSource.subscribe(handleData);
    // Cleanup function executed on unmount or before re-running effect:
    return () => { subscription.unsubscribe(); };
}, [dataSource]);`,
    keyPoints: [
      'Always return a cleanup function to prevent memory leaks (timers, subscriptions, event listeners).',
      'Functions defined inside components recreate on every render; use useCallback to keep references stable in dependency arrays.',
    ],
    followUps: [
      {
        question: 'What is the difference between useEffect and useLayoutEffect?',
        answer: 'useEffect runs asynchronously after browser paint (non-blocking). useLayoutEffect runs synchronously immediately after DOM mutations before browser paint, used to measure DOM layout without visual flicker.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['React', 'Hooks', 'useEffect'],
  },
  {
    id: 'dev-03',
    categoryId: 'dev-react',
    title: 'How does React Native architecture work? (Bridge vs New Architecture / Fabric & TurboModules)',
    difficulty: 'ADVANCED',
    answer:
      'Legacy Architecture: Used an asynchronous JSON Bridge to communicate between the JavaScript thread and the Native (iOS/Android) thread. High serialization/deserialization overhead caused frame drops during rapid scrolling or complex gestures. New Architecture: Replaced the bridge with JSI (JavaScript Interface), allowing the C++ JavaScript engine (Hermes) to directly hold references to and invoke Native C++ and Java/Obj-C objects synchronously. It introduces Fabric (the new concurrent C++ rendering system) and TurboModules (lazy-loaded native modules loaded on demand via JSI).',
    keyPoints: [
      'JSI enables direct memory access between JavaScript and C++ without JSON string serialization.',
      'Hermes is the default JavaScript engine optimized for fast Android/iOS mobile startup.',
    ],
    followUps: [
      {
        question: 'How does ALLVANCE benefit from JSI?',
        answer: 'SQLite bindings (expo-sqlite) use synchronous JSI calls directly to SQLite C-APIs, executing database queries in <5ms without asynchronous bridge stalls.',
      },
    ],
    companies: ['Deloitte', 'Infosys'],
    tags: ['React Native', 'Architecture', 'Fabric', 'JSI', 'Hermes'],
  },
  {
    id: 'dev-04',
    categoryId: 'dev-node',
    title: 'How does the Node.js Event Loop work and what are its 6 phases?',
    difficulty: 'ADVANCED',
    answer:
      'Node.js runs single-threaded JavaScript using an event-driven, non-blocking I/O model powered by the Libuv C library. The Event Loop executes across 6 distinct phases in each tick: 1. Timers: Executes callbacks scheduled by setTimeout() and setInterval(). 2. Pending Callbacks: Executes I/O callbacks deferred from the previous loop iteration. 3. Idle, Prepare: Internal kernel operations. 4. Poll: Retrieves new I/O events, executes I/O callbacks, and blocks waiting for incoming events when appropriate. 5. Check: Executes setImmediate() callbacks. 6. Close Callbacks: Executes socket.on("close") cleanup handlers. In between every phase, process.nextTick() and resolved Promise Microtasks run with highest priority.',
    keyPoints: [
      'process.nextTick() executes immediately after the current operation, before any other microtasks or event loop phases.',
      'Worker Threads (worker_threads module) provide true multi-core CPU parallelism for CPU-heavy tasks.',
    ],
    followUps: [
      {
        question: 'What is the difference between process.nextTick() and setImmediate()?',
        answer: 'process.nextTick() fires immediately on the microtask queue before the event loop advances; setImmediate() fires on the next check phase of the event loop.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'InfoCepts'],
    tags: ['Node.js', 'Event Loop', 'Libuv', 'Concurrency'],
  },
  {
    id: 'dev-05',
    categoryId: 'dev-node',
    title: 'What are Node.js Streams and Buffers and why are they critical for performance?',
    difficulty: 'INTERMEDIATE',
    answer:
      'A Buffer is a chunk of raw binary memory allocated outside the V8 JavaScript heap (in C++ memory space), used for handling binary data (files, TCP network packets). Streams are collections of data that might not be available all at once and don’t have to fit into RAM simultaneously. Instead of reading an entire 2GB video file into memory (causing OutOfMemoryError), streams read and process chunks piece-by-piece. Types: Readable, Writable, Duplex, and Transform (e.g. zlib compression). Using pipe() handles Backpressure automatically (pausing the readable stream when the writable buffer is full).',
    codeExample: `const fs = require('fs');
// Memory-efficient piping of large file:
const readStream = fs.createReadStream('large_video.mp4');
const writeStream = fs.createWriteStream('copy.mp4');
readStream.pipe(writeStream);`,
    keyPoints: [
      'Keeps memory usage constant (O(1)) regardless of file size.',
      'Backpressure prevents fast producers from overflowing slow consumers.',
    ],
    followUps: [
      {
        question: 'What is Backpressure in Node.js streams?',
        answer: 'The mechanism where a slow writable stream signals the fast readable stream to pause emitting data until its internal buffer drains.',
      },
    ],
    companies: ['Deloitte', 'Infosys'],
    tags: ['Node.js', 'Streams', 'Buffers', 'Memory'],
  },
  {
    id: 'dev-06',
    categoryId: 'dev-api-git',
    title: 'What is OAuth 2.0 and how does the Authorization Code Grant with PKCE work?',
    difficulty: 'ADVANCED',
    answer:
      'OAuth 2.0 is an industry-standard delegation protocol that allows a third-party application to obtain limited access to a user’s resources (e.g. Google profile) without exposing the user’s password. The Authorization Code Flow with PKCE (Proof Key for Code Exchange) is the modern standard for SPAs and mobile apps: 1. Client generates a random Code Verifier and hashes it to create a Code Challenge. 2. User authorizes on Identity Provider; IdP returns a temporary Authorization Code. 3. Client exchanges Code + Code Verifier for an Access Token. 4. IdP verifies the hash, preventing code interception attacks on public mobile clients.',
    keyPoints: [
      'PKCE eliminates the need for hardcoded client secrets on mobile applications.',
      'OpenID Connect (OIDC) is an identity layer built on top of OAuth 2.0 that provides an ID Token (JWT).',
    ],
    followUps: [
      {
        question: 'What is the difference between an Access Token and an ID Token in OIDC?',
        answer: 'ID Token contains user identity information (authentication); Access Token grants authorization to call specific APIs.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['OAuth2', 'Security', 'PKCE', 'Authentication'],
  },
  {
    id: 'dev-07',
    categoryId: 'dev-api-git',
    title: 'What is the difference between Git Fetch and Git Pull?',
    difficulty: 'BEGINNER',
    answer:
      'git fetch downloads commits, files, and branches from the remote repository into your local repository, updating your remote-tracking branches (e.g. origin/main) WITHOUT merging them into your current working branch. It is safe and never modifies your working code. git pull is a composite command: it first executes git fetch, and then immediately runs git merge to merge the fetched commits into your current local branch. Always inspect changes with git fetch and git diff before pulling.',
    keyPoints: [
      'git pull = git fetch + git merge.',
      'git pull --rebase replays your local commits on top of remote commits, avoiding noisy merge commits.',
    ],
    followUps: [
      {
        question: 'How do you undo the last local Git commit without losing your file changes?',
        answer: 'git reset --soft HEAD~1.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro'],
    tags: ['Git', 'Fetch', 'Pull', 'Version Control'],
  },
  {
    id: 'dev-08',
    categoryId: 'dev-api-git',
    title: 'What are Idempotent HTTP Methods in RESTful API design?',
    difficulty: 'INTERMEDIATE',
    answer:
      'An HTTP method is Idempotent if making the same request multiple identical times produces the exact same server-side state as making it once. GET, HEAD, OPTIONS are idempotent and safe (read-only). PUT is idempotent because replacing a resource with identical data 10 times yields the exact same final state. DELETE is idempotent because deleting a resource 10 times leaves it deleted (subsequent requests return 404, but server state remains unchanged). POST is NOT idempotent because repeating it creates multiple new duplicate resources.',
    keyPoints: [
      'Idempotency is crucial for safe network retries during network timeouts.',
      'Stripe/payment APIs use Idempotency-Key headers to make POST requests idempotent.',
    ],
    followUps: [
      {
        question: 'Is PATCH idempotent?',
        answer: 'Not necessarily; a PATCH request like {"count": {"$inc": 1}} alters server state on each repetition.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['REST APIs', 'Idempotency', 'HTTP'],
  },
];
