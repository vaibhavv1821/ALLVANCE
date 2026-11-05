export interface ProjectInterviewQnA {
  id: string;
  question: string;
  answer: string;
}

export interface FlagshipProjectBlueprint {
  id: string;
  title: string;
  subtitle: string;
  techStack: string;
  problemStatement: string;
  introduction: string;
  architecture: string;
  databaseDesign: string;
  apis: string;
  challenges: string;
  technicalDecisions: string;
  scalability: string;
  security: string;
  futureImprovements: string;
  curatedQuestions: ProjectInterviewQnA[];
}

export const FLAGSHIP_PROJECTS: FlagshipProjectBlueprint[] = [
  {
    id: 'servmate',
    title: 'ServMate',
    subtitle: 'On-Demand Local Home Services & Technician Booking Platform',
    techStack: 'React Native, Node.js, Express, PostgreSQL, Redis, Socket.io, Docker',
    problemStatement:
      'Finding reliable, vetted local home service professionals (electricians, plumbers, appliance technicians) involves opaque pricing, delayed arrival times, and unverified service guarantees.',
    introduction:
      'ServMate is a full-stack, mobile-first marketplace connecting urban households with verified local service professionals. Features include instant slot booking, real-time technician GPS tracking, transparent pricing calculators, and in-app escrow payments.',
    architecture:
      'Microservices-inspired modular backend with an API Gateway routing to Authentication, Booking Engine, Geolocation/Tracking, and Billing services. Client application built with React Native for cross-platform iOS & Android mobile performance, utilizing SQLite for offline appointment caching and WebSockets for real-time live location broadcasts.',
    databaseDesign:
      'Relational schema in PostgreSQL with tables: users, technicians, service_categories, services, bookings, technician_schedules, reviews, and payments. Spatial indexing using PostGIS for efficient geofencing and proximity searches (finding nearest technicians within a 5km radius).',
    apis:
      'RESTful endpoints with JSON payloads for authentication (JWT), booking creation (`POST /api/v1/bookings`), technician availability slots (`GET /api/v1/technicians/:id/slots`), and WebSockets (`ws://`) for live GPS coordinates streaming.',
    challenges:
      'Handling high-concurrency slot booking collisions (preventing two users from booking the same technician slot simultaneously). Resolved by implementing Redis distributed locks (Redlock) and database transaction row-level locking (`SELECT ... FOR UPDATE`).',
    technicalDecisions:
      'Chose PostgreSQL over MongoDB due to strong ACID compliance requirements for financial transactions and booking state consistency. Used Redis for caching frequent static service catalogs and managing ephemeral WebSocket session state.',
    scalability:
      'Stateless Node.js services horizontally scaled behind an NGINX reverse proxy. Geolocation queries partitioned by geographic zone IDs to reduce spatial scan overhead.',
    security:
      'Argon2 password hashing, short-lived JWT access tokens with rotating refresh tokens stored in secure HTTP-only cookies, input validation via Zod schemas, and rate-limiting using express-rate-limit backed by Redis.',
    futureImprovements:
      'Automated dynamic pricing based on surge demand and weather conditions, AI-powered diagnostic photo analysis to recommend specific replacement parts before technician dispatch.',
    curatedQuestions: [
      {
        id: 'sm_q1',
        question: 'How did you prevent double-booking of technicians when two users book the same slot at the same second?',
        answer:
          'We implemented a two-tier locking mechanism. First, a lightweight distributed lock in Redis with a 15-second TTL during checkout. Second, at the database level, booking confirmation runs within a SERIALIZABLE transaction with `SELECT ... FOR UPDATE` row locking on the technician availability slot table, ensuring atomic state transitions.',
      },
      {
        id: 'sm_q2',
        question: 'How does real-time technician tracking work on the mobile client without draining battery?',
        answer:
          'Instead of continuous GPS polling, we implemented adaptive geolocation sampling on the technician app: polling every 5 seconds when moving at vehicular speed and dropping to 30 seconds when stationary. On the customer side, Socket.io receives lightweight coordinate deltas and smoothly interpolates the vehicle marker using React Native Reanimated.',
      },
      {
        id: 'sm_q3',
        question: 'Why did you choose a relational database (PostgreSQL) instead of a NoSQL document database?',
        answer:
          'Service bookings have strict relational integrity: a booking links a customer, a technician, multiple service line items, an invoice, and a payment record. ACID guarantees and foreign key constraints prevent orphan records and phantom bookings, which are critical for financial reconciliation.',
      },
      {
        id: 'sm_q4',
        question: 'How did you handle offline network drops while a customer is viewing services?',
        answer:
          'We leveraged React Native with local SQLite storage. When online, category and catalog data are synced and cached locally with a version hash. When the device loses connectivity, the app transparently serves cached data while indicating offline mode to the user.',
      },
    ],
  },
  {
    id: 'intellivault',
    title: 'IntelliVault',
    subtitle: 'Zero-Knowledge Encrypted Document & Credential Locker',
    techStack: 'React Native, Expo SDK, TypeScript, SQLite, WebCrypto / Libsodium, biometric auth',
    problemStatement:
      'Individuals store sensitive documents (passports, tax filings, private keys) on vulnerable cloud drives or unencrypted messaging apps, exposing them to credential theft, server-side data leaks, and third-party snooping.',
    introduction:
      'IntelliVault is a zero-knowledge local-first mobile security vault for documents, identity credentials, and sensitive notes. All files are client-side encrypted using AES-256-GCM before persistent storage, meaning even cloud sync nodes cannot decrypt user files without the master passphrase.',
    architecture:
      'Client-centric zero-trust architecture. Master passphrase never leaves the device. Key derivation using Argon2id creates high-entropy symmetric encryption keys. Sensitive metadata and encrypted blobs are stored in an encrypted SQLite database on the device, gated behind biometric authentication (Face ID / Fingerprint).',
    databaseDesign:
      'Encrypted SQLite storage using SQLCipher / local encrypted key-value store. Tables: vault_items (id, item_type, encrypted_payload, nonce, auth_tag, created_at, updated_at), item_tags, audit_logs (tamper-evident hash chain of all vault access events).',
    apis:
      'Minimalist zero-knowledge cloud backup sync protocol (`POST /api/v1/sync/push`, `GET /api/v1/sync/pull`) transferring only encrypted ciphertexts, nonces, and cryptographic hashes without ever possessing user decryption keys.',
    challenges:
      'Balancing high-grade cryptographic key derivation (Argon2id) with mobile hardware performance constraints. Heavy memory and iteration settings could freeze the mobile UI thread. Resolved by offloading cryptographic computations to native background worker threads.',
    technicalDecisions:
      'Selected AES-256-GCM (Galois/Counter Mode) because it provides both confidentiality and authenticated integrity (preventing bit-flipping attacks). Chose Argon2id over bcrypt or PBKDF2 due to its resistance against GPU/ASIC brute-force attacks.',
    scalability:
      'Because the server only stores opaque encrypted blobs, server storage requirements are minimal and sync endpoints are completely stateless, allowing effortless horizontal scaling across object stores like S3 or Cloudflare R2.',
    security:
      'Zero-knowledge architecture, OS Secure Keychain/Keystore integration for wrapping the master key with biometric verification, auto-lock on app backgrounding, screenshot prevention (FLAG_SECURE on Android), and anti-tamper integrity checks.',
    futureImprovements:
      'Shamir’s Secret Sharing for social recovery of lost master keys without compromising zero-knowledge properties, end-to-end encrypted peer-to-peer file sharing via ephemeral QR codes.',
    curatedQuestions: [
      {
        id: 'iv_q1',
        question: 'What does "Zero-Knowledge" mean in the context of IntelliVault?',
        answer:
          'Zero-knowledge means that our architecture is mathematically constructed so that the service provider (server) has zero access to user plaintext data or encryption keys. The master passphrase never leaves the client device, and all cryptographic operations occur strictly client-side before any persistent storage or network sync.',
      },
      {
        id: 'iv_q2',
        question: 'Why did you select AES-256-GCM instead of AES-CBC?',
        answer:
          'AES-CBC provides encryption but lacks authentication, leaving it vulnerable to padding oracle attacks and ciphertext tampering unless paired with a separate HMAC. AES-GCM is an Authenticated Encryption with Associated Data (AEAD) mode that guarantees both data confidentiality and cryptographic authenticity in a single, hardware-accelerated pass.',
      },
      {
        id: 'iv_q3',
        question: 'How do you prevent UI freezing when performing computationally heavy key derivation on mobile?',
        answer:
          'Key derivation with Argon2id requires significant memory and CPU iterations. Running it synchronously on the JavaScript thread would freeze the UI and drop frames. We offloaded the derivation to native background threads using native modules, communicating completion back via asynchronous Promises.',
      },
      {
        id: 'iv_q4',
        question: 'How does biometric unlock interact with the master encryption key?',
        answer:
          'When the user sets up biometrics, the master encryption key is encrypted with a device-specific key generated inside the Android Keystore / iOS Secure Enclave that requires biometric user authentication to decrypt. If biometric authentication succeeds, the Keystore unlocks the master key into ephemeral memory.',
      },
    ],
  },
  {
    id: 'mindmap',
    title: 'MindMap',
    subtitle: 'Real-Time Collaborative Visual Workspace & Knowledge Graph',
    techStack: 'React, TypeScript, Canvas API / SVG, WebSockets, Node.js, CRDT (Yjs), MongoDB',
    problemStatement:
      'Remote teams struggle to brainstorm and organize complex technical ideas visually without experiencing sync latency, lost changes, or conflicting edits when multiple collaborators draw simultaneously.',
    introduction:
      'MindMap is a high-performance visual brainstorming application and infinite canvas workspace. It enables distributed engineering teams to model system architectures, map out hierarchical concepts, and collaborate with zero-latency live cursor tracking and automatic conflict resolution.',
    architecture:
      'Event-driven peer-and-server architecture utilizing Conflict-free Replicated Data Types (CRDTs) powered by Yjs. Canvas rendering optimized using HTML5 2D Canvas with spatial quadtree partitioning. Real-time updates synchronized over bidirectional WebSocket connections.',
    databaseDesign:
      'Document database (MongoDB) storing workspace metadata, board permissions, snapshot versions, and serialized CRDT update vectors. Redis for WebSocket pub/sub routing across multiple application server instances.',
    apis:
      'WebSocket protocol for bi-directional binary delta synchronizations (`sync-step-1`, `sync-step-2`, `update-delta`). REST endpoints for workspace management, PDF/PNG canvas export, and role-based access control.',
    challenges:
      'Handling concurrent multi-user node movement without overwriting edits or causing jumpy UI glitches. Solved by replacing operational transformation (OT) with state-based CRDTs, ensuring eventual consistency regardless of network packet arrival order.',
    technicalDecisions:
      'Chose Canvas API over pure DOM/SVG nodes for the infinite canvas because DOM nodes degraded significantly above 2,000 visual elements, whereas Canvas with dirty-rectangle repainting handles 50,000+ elements at 60 FPS.',
    scalability:
      'Decoupled canvas sync logic from HTTP APIs. Redis Pub/Sub coordinates WebSocket rooms across multiple Node.js worker nodes, while canvas snapshots are periodically compressed and offloaded to cold storage.',
    security:
      'Fine-grained role-based access control (Viewer, Commenter, Editor, Owner), workspace token verification on WebSocket handshake, input sanitization on rich-text node notes to prevent XSS.',
    futureImprovements:
      'Automated semantic clustering of mind map nodes using vector embeddings and local LLMs, offline-first mesh sync using WebRTC data channels for low-latency peer-to-peer editing.',
    curatedQuestions: [
      {
        id: 'mm_q1',
        question: 'How do you handle simultaneous conflicting edits from two users on the same mind map node?',
        answer:
          'We utilize CRDTs (Conflict-free Replicated Data Types) via Yjs. CRDTs model data mathematically such that concurrent operations commute and resolve deterministically without a central arbiter. Every change carries a Lamport timestamp and client ID, guaranteeing strong eventual consistency across all connected clients.',
      },
      {
        id: 'mm_q2',
        question: 'Why did you transition from DOM/SVG elements to HTML5 Canvas for the visual rendering?',
        answer:
          'DOM-based graphs trigger extensive browser reflow and layout recalculation when panning or zooming with thousands of nodes. HTML5 Canvas gives us direct control over the graphics pipeline, allowing viewport culling (only rendering visible nodes within the screen bounds) and achieving a steady 60 FPS.',
      },
      {
        id: 'mm_q3',
        question: 'How does live cursor tracking work across hundreds of concurrent users without choking network bandwidth?',
        answer:
          'Cursor positions are broadcast over an ephemeral awareness channel throttled to 30ms (approx. 33 updates/sec) with delta compression. Furthermore, cursor updates bypass database persistence completely and flow strictly through memory-based Redis Pub/Sub channels.',
      },
    ],
  },
  {
    id: 'campusmart',
    title: 'CampusMart',
    subtitle: 'Hyperlocal Student Marketplace & Peer-to-Peer Exchange',
    techStack: 'React Native, Node.js, Express, MongoDB, AWS S3, Firebase Cloud Messaging, JWT',
    problemStatement:
      'College students waste thousands of rupees buying textbooks, dorm appliances, and lab equipment each semester, while graduating seniors discard usable items due to lack of a safe, campus-exclusive trade platform.',
    introduction:
      'CampusMart is a hyperlocal peer-to-peer marketplace reserved strictly for verified college students (.edu or institutional email verification). It facilitates safe on-campus buying, selling, and renting of textbooks, electronics, bicycles, and study materials.',
    architecture:
      'Monolithic backend deployed with Docker containers on AWS EC2, with media uploads directly stream-signed to AWS S3. Push notifications orchestrated via Firebase Cloud Messaging (FCM). Mobile client implemented with React Native with offline listing drafts and instant chat.',
    databaseDesign:
      'MongoDB collections: users (including campus_domain, student_id_verified, trust_score), listings (category, price, condition, images, geolocation, status), chats, messages, and reports. Compound indexes on { campus_id: 1, category: 1, created_at: -1 } for fast feed filtering.',
    apis:
      'REST APIs for authentication with campus OTP verification, multipart image upload via S3 pre-signed URLs, listing search with text filters, and WebSocket server for real-time buyer-seller negotiation messaging.',
    challenges:
      'Preventing unauthorized commercial spam and fraudulent listings from external non-student actors. Resolved by enforcing institutional email domain verification combined with student ID card OCR verification.',
    technicalDecisions:
      'Utilized AWS S3 pre-signed URLs so that heavy image files upload directly from the mobile device to cloud storage, preventing server bandwidth saturation and reducing server CPU overhead by 70%.',
    scalability:
      'Feed queries cached with Redis for top campus hubs. Database read-replicas configured to handle heavy seasonal spikes (semester beginning and end).',
    security:
      'Campus domain whitelisting, S3 bucket private policies, content moderation filters scanning listing descriptions for banned keywords, in-app safety guidelines warning against off-campus meetups.',
    futureImprovements:
      'In-app student escrow payment with QR-code proof of physical handover, algorithmic textbook price estimator recommending fair pricing based on book edition and condition.',
    curatedQuestions: [
      {
        id: 'cm_q1',
        question: 'Why did you use S3 Pre-signed URLs for image uploads instead of sending images to your Node.js backend?',
        answer:
          'Routing high-resolution listing photos through the backend server consumes substantial CPU, RAM, and network bandwidth, creating a severe bottleneck under traffic spikes. With S3 Pre-signed URLs, the server merely authenticates the request and issues a cryptographically signed temporary upload URL; the client uploads directly to S3.',
      },
      {
        id: 'cm_q2',
        question: 'How do you ensure only genuine students can access and trade on the platform?',
        answer:
          'Registration requires entering an official college email address. The backend checks the domain against an accredited institutional directory and issues a time-limited verification code. Optionally, students can upload their ID card for verified trust badge accreditation.',
      },
      {
        id: 'cm_q3',
        question: 'How did you optimize listing searches by category and price within a specific campus?',
        answer:
          'We created compound indexes in MongoDB on `{ campus_id: 1, status: 1, category: 1, price: 1 }`. This allows the query engine to satisfy both filtering and sorting directly from the index RAM without scanning millions of irrelevant records.',
      },
    ],
  },
  {
    id: 'valuemycar',
    title: 'ValueMyCar',
    subtitle: 'Automotive Valuation Engine & Resale Price Estimator',
    techStack: 'Python, FastAPI, Scikit-learn, XGBoost, Pandas, React Native, SQLite, Docker',
    problemStatement:
      'Used car buyers and sellers suffer from massive information asymmetry and arbitrary price negotiations due to unpredictable depreciation curves, regional variance, and hidden vehicle wear factors.',
    introduction:
      'ValueMyCar is an analytical valuation and price-prediction platform that delivers fair market valuations for used automobiles. Leveraging gradient-boosted decision trees trained on historical used vehicle sales, the engine evaluates 18 vehicle parameters to output valuation ranges and depreciation forecasts.',
    architecture:
      'Microservice architecture: High-performance Python FastAPI service hosting serialized ML inference models, paired with a React Native mobile application for interactive vehicle configuration. Local mobile cache stores offline valuation rules and historical model lookup tables.',
    databaseDesign:
      'PostgreSQL database storing car makes, models, variants, historical transaction records, fuel-type depreciation multipliers, and user valuation logs. Analytical queries aggregated using materialized views.',
    apis:
      'FastAPI endpoints: `POST /api/v1/valuation/predict` taking vehicle features (make, model, year, mileage, fuel type, owner count, accident history) and returning predicted fair price, high/low market range, and confidence score.',
    challenges:
      'Handling high-cardinality categorical features (car brands, models, and city regions) without creating memory bloat or sparse matrix degradation during machine learning model training. Solved using target encoding with smoothing and regularized frequency encoding.',
    technicalDecisions:
      'Selected XGBoost / LightGBM over deep neural networks because gradient-boosted decision trees consistently demonstrated superior R2 score (0.91 vs 0.82) and 10x faster inference latency on tabular automotive data.',
    scalability:
      'Inference model serialized with ONNX runtime for ultra-low latency (<15ms per request). FastAPI running with Gunicorn and multiple Uvicorn workers behind a reverse proxy.',
    security:
      'API rate-limiting to prevent automated scraping of valuation intelligence, input validation enforcing physical boundary checks (e.g., negative mileage or future manufacture year rejection).',
    futureImprovements:
      'Computer vision inspection module analyzing uploaded car photos to detect exterior body scratches and paint damage, automatically adjusting the valuation price deduction.',
    curatedQuestions: [
      {
        id: 'vmc_q1',
        question: 'Why did you choose Gradient Boosted Trees (XGBoost/LightGBM) over Deep Learning for price prediction?',
        answer:
          'For tabular structured data with mixed continuous and categorical variables, tree-based ensembles (XGBoost/LightGBM) regularly outperform neural networks. They are invariant to monotonic feature scaling, handle non-linear feature interactions naturally, and offer rapid inference (<15ms) without requiring GPU instances.',
      },
      {
        id: 'vmc_q2',
        question: 'How did you handle missing data and high-cardinality categorical features like car models and cities?',
        answer:
          'For high-cardinality features, one-hot encoding would have created thousands of sparse columns. Instead, we applied Target Encoding with m-estimate smoothing to prevent target leakage and overfitting. For missing values, median imputation was used for continuous features and dedicated "Unknown" categories for discrete features.',
      },
      {
        id: 'vmc_q3',
        question: 'How do you measure and validate model performance before deployment?',
        answer:
          'We evaluated model performance using 5-fold cross-validation, measuring Root Mean Squared Error (RMSE), Mean Absolute Error (MAE), and R-squared (R2). We prioritized MAE because it translates directly into average Indian Rupee price error, making the accuracy easily interpretable for users.',
      },
    ],
  },
];
