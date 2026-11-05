import { SeedInterviewQuestion } from './types';

export const DBMS_QUESTIONS: SeedInterviewQuestion[] = [
  {
    id: 'dbms-01',
    categoryId: 'db-dbms',
    title: 'Explain the 3-Tier Schema Architecture of DBMS and Data Independence.',
    difficulty: 'BEGINNER',
    answer:
      'The ANSI/SPARC 3-tier architecture divides DBMS into three abstraction levels: 1. Physical / Internal Level (how data is physically stored on disk, data structures, access paths), 2. Conceptual / Logical Level (what data is stored, entity relationships, constraints, tables), 3. External / View Level (how individual user groups perceive data via customized views). Data Independence is the ability to modify the schema at one level without forcing modifications to schemas at higher levels: Physical Data Independence (modifying indexes/storage without breaking logical tables) and Logical Data Independence (modifying logical schemas like adding columns without breaking existing user views).',
    keyPoints: [
      'Physical data independence is easier to achieve than logical data independence.',
      'Separates user views from underlying physical storage mechanics.',
    ],
    followUps: [
      {
        question: 'Which data independence is harder to achieve?',
        answer: 'Logical data independence, because changing table structures often impacts application queries.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro'],
    tags: ['DBMS Architecture', 'Data Independence', 'Basics'],
  },
  {
    id: 'dbms-02',
    categoryId: 'db-acid',
    title: 'Explain ACID Properties in DBMS with real-world banking examples.',
    difficulty: 'BEGINNER',
    answer:
      'ACID ensures transaction reliability: 1. Atomicity: "All or nothing". Either all operations in a transaction succeed and commit, or in the event of failure, everything is rolled back (e.g. money deducted from Account A must be credited to Account B; if crash occurs in between, A is refunded). 2. Consistency: Database transitions from one valid state to another, satisfying all integrity constraints (e.g. total balance of bank accounts remains conserved). 3. Isolation: Concurrent transactions execute without interfering with one another as if running sequentially. 4. Durability: Once a transaction commits, its modifications are permanently recorded on non-volatile storage and survive system crashes.',
    keyPoints: [
      'Atomicity and Durability are managed by the Recovery Manager (using Write-Ahead Logs).',
      'Isolation is managed by the Concurrency Control component (using Locks/Timestamping).',
      'Consistency is maintained by application logic, constraints, and the other three ACID properties.',
    ],
    followUps: [
      {
        question: 'Which DBMS component ensures Durability?',
        answer: 'The Recovery Manager using Write-Ahead Logging (WAL) and Redo logs on non-volatile disk.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Deloitte', 'Capgemini', 'Wipro', 'HCL'],
    tags: ['ACID', 'Transactions', 'Banking Example'],
  },
  {
    id: 'dbms-03',
    categoryId: 'db-acid',
    title: 'What are the 4 Transaction Isolation Levels and the Read Phenomena they prevent?',
    difficulty: 'ADVANCED',
    answer:
      'SQL standard defines 4 isolation levels to balance concurrency and consistency: 1. Read Uncommitted: Transactions can read uncommitted changes from other transactions (permits Dirty Reads, Non-repeatable Reads, Phantom Reads). 2. Read Committed: Transactions read only committed data (prevents Dirty Reads, permits Non-repeatable Reads and Phantoms). 3. Repeatable Read: Re-reading the same row within a transaction guarantees identical values (prevents Dirty Reads and Non-repeatable Reads, permits Phantom Reads in standard SQL). 4. Serializable: Full serial execution order (prevents all anomalies: Dirty Reads, Non-repeatable Reads, Phantom Reads).',
    keyPoints: [
      'Dirty Read: Reading uncommitted, in-flight data that might later be rolled back.',
      'Non-repeatable Read: Re-reading a row returns modified column values because another committed transaction updated it.',
      'Phantom Read: Re-executing a range query returns new rows inserted by another committed transaction.',
    ],
    followUps: [
      {
        question: 'What is the default isolation level in MySQL InnoDB vs PostgreSQL?',
        answer: 'MySQL InnoDB defaults to Repeatable Read (with Next-Key Locking preventing phantoms); PostgreSQL defaults to Read Committed.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts', 'Infosys'],
    tags: ['Isolation Levels', 'Concurrency', 'Read Phenomena'],
  },
  {
    id: 'dbms-04',
    categoryId: 'db-indexing',
    title: 'Why do relational databases use B+ Trees instead of Binary Search Trees or B-Trees for indexing?',
    difficulty: 'ADVANCED',
    answer:
      'Binary Search Trees (BST / AVL / Red-Black) have a small branching factor (2), resulting in deep trees that require many disk I/O operations (each child lookup is a disk page read). B-Trees and B+ Trees have large branching factors (fan-out of 100+), keeping tree height shallow (3-4 levels for millions of rows). B+ Trees are superior to standard B-Trees because: 1. Internal nodes store ONLY keys and page pointers (no data records), maximizing fan-out and fitting far more keys per disk block RAM cache. 2. Leaf nodes contain all actual data pointers and are linked sequentially via a Doubly Linked List, enabling ultra-fast O(log n) range queries and sequential scans.',
    keyPoints: [
      'Tree height is typically 3 to 4, meaning at most 3-4 disk page reads to find any row.',
      'Sequential range scans in B+ trees simply traverse leaf node pointers without tree backtracking.',
    ],
    followUps: [
      {
        question: 'How many disk I/O operations are needed to locate a record in a 3-level B+ Tree?',
        answer: 'At most 3 disk reads (and often the root page is permanently cached in RAM, reducing it to 1-2).',
      },
    ],
    companies: ['Deloitte', 'InfoCepts', 'Infosys'],
    tags: ['B+ Tree', 'Indexing', 'Data Structures', 'Storage'],
  },
  {
    id: 'dbms-05',
    categoryId: 'db-acid',
    title: 'What is Two-Phase Locking (2PL) and Strict 2PL?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Two-Phase Locking (2PL) is a concurrency control protocol that guarantees conflict serializability. It has two phases: 1. Growing Phase: Transaction may acquire locks, but CANNOT release any locks. 2. Shrinking Phase: Transaction may release locks, but CANNOT acquire any new locks. Strict 2PL adds the rule that all Exclusive (X) locks held by a transaction must be retained until the transaction COMMITS or ABORTS, preventing cascading rollbacks (dirty reads). Rigorous 2PL holds both Shared (S) and Exclusive (X) locks until commit.',
    keyPoints: [
      'Basic 2PL guarantees serializability, but can still lead to deadlocks and cascading rollbacks.',
      'Strict 2PL is the most widely adopted protocol in commercial RDBMS engines.',
    ],
    followUps: [
      {
        question: 'Can deadlocks occur under 2PL?',
        answer: 'Yes, 2PL guarantees serializability, but does NOT prevent deadlocks.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'InfoCepts'],
    tags: ['2PL', 'Concurrency', 'Locking'],
  },
  {
    id: 'dbms-06',
    categoryId: 'db-dbms',
    title: 'What is Write-Ahead Logging (WAL) and how does it guarantee durability?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Write-Ahead Logging (WAL) is a database logging technique where any modification to data must be written and flushed to a persistent log file on disk BEFORE the corresponding dirty data pages are written to the actual database file. If a power outage or crash occurs, unwritten changes in volatile RAM can be reconstructed by reading the log and applying REDO actions for committed transactions, while incomplete in-flight transactions are rolled back via UNDO actions.',
    keyPoints: [
      'Sequential disk writes to WAL are orders of magnitude faster than random disk writes to database files.',
      'SQLite uses WAL mode (allvance.db-wal) to allow concurrent readers while a writer appends to the log.',
    ],
    followUps: [
      {
        question: 'What is Checkpointing in WAL?',
        answer: 'The periodic background process where dirty pages recorded in the WAL are flushed to the main database file, allowing the WAL file to be truncated.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'InfoCepts'],
    tags: ['WAL', 'Durability', 'Crash Recovery'],
  },
  {
    id: 'dbms-07',
    categoryId: 'db-normalization',
    title: 'Explain Boyce-Codd Normal Form (BCNF) vs 3rd Normal Form (3NF).',
    difficulty: 'INTERMEDIATE',
    answer:
      '3NF requires: for every functional dependency X -> Y, either 1. Y is a prime attribute (part of a candidate key), or 2. X is a superkey. BCNF (Boyce-Codd Normal Form) is a stricter variant that removes the prime attribute loophole: for EVERY functional dependency X -> Y, X MUST be a Superkey. Every relation in BCNF is in 3NF, but not every 3NF relation is in BCNF. BCNF guarantees zero redundancy from functional dependencies, but decomposing to BCNF might not always preserve functional dependencies.',
    keyPoints: [
      'BCNF eliminates all anomalies arising from functional dependencies.',
      'If a 3NF relation has no overlapping candidate keys, it is automatically in BCNF.',
    ],
    followUps: [
      {
        question: 'Can a BCNF decomposition lose dependency preservation?',
        answer: 'Yes, in rare cases where non-trivial dependencies span attributes across decomposed tables, 3NF is preferred to preserve dependencies.',
      },
    ],
    companies: ['Infosys', 'Deloitte', 'Capgemini'],
    tags: ['BCNF', '3NF', 'Normalization'],
  },
  {
    id: 'dbms-08',
    categoryId: 'db-dbms',
    title: 'What is Deadlock Prevention: Wait-Die vs Wound-Wait schemes?',
    difficulty: 'ADVANCED',
    answer:
      'Both use transaction timestamps (Ti older than Tj): 1. Wait-Die (Non-preemptive): If an older transaction Ti requests a resource held by younger Tj, Ti is allowed to WAIT. If a younger Ti requests a resource held by older Tj, Ti DIES (aborts and restarts with same timestamp). 2. Wound-Wait (Preemptive): If an older Ti requests a resource held by younger Tj, Ti WOUNDS Tj (preempts and forces Tj to abort). If a younger Ti requests a resource held by older Tj, Ti is allowed to WAIT. Neither scheme allows circular wait, completely preventing deadlocks.',
    keyPoints: [
      'Older transactions always have higher priority.',
      'Wound-Wait generally causes fewer transaction aborts than Wait-Die.',
    ],
    followUps: [
      {
        question: 'Why do restarted transactions retain their original timestamp?',
        answer: 'To prevent starvation; retaining the old timestamp ensures the transaction eventually becomes the oldest in the system and will not be aborted again.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts'],
    tags: ['Deadlocks', 'Concurrency', 'Timestamps'],
  },
  {
    id: 'dbms-09',
    categoryId: 'db-dbms',
    title: 'What are Armstrong’s Axioms for Functional Dependencies?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Armstrong’s Axioms are sound and complete inference rules used to derive all functional dependencies implied by a given set F: 1. Reflexivity: If Y is a subset of X, then X -> Y. 2. Augmentation: If X -> Y, then XZ -> YZ for any attribute set Z. 3. Transitivity: If X -> Y and Y -> Z, then X -> Z. Secondary derived rules include: Union (if X -> Y and X -> Z, then X -> YZ), Decomposition (if X -> YZ, then X -> Y and X -> Z), and Pseudo-transitivity.',
    keyPoints: [
      'Sound: Derives only valid dependencies.',
      'Complete: Can derive every valid dependency in the closure F+.',
    ],
    followUps: [
      {
        question: 'How do you find Candidate Keys using Attribute Closure?',
        answer: 'Compute the closure of attribute sets (X+); any minimal set X whose closure contains all relation attributes is a Candidate Key.',
      },
    ],
    companies: ['Infosys', 'TCS', 'Capgemini'],
    tags: ['Functional Dependencies', 'Armstrong Axioms', 'Theory'],
  },
  {
    id: 'dbms-10',
    categoryId: 'db-dbms',
    title: 'What is the CAP Theorem in Distributed Databases?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Formulated by Eric Brewer, the CAP theorem states that a distributed data store can simultaneously provide at most two of the following three guarantees in the presence of network partitions: 1. Consistency (C): Every read receives the most recent write or an error. 2. Availability (A): Every non-failing node returns a non-error response, without guarantee that it contains the most recent write. 3. Partition Tolerance (P): The system continues to operate despite arbitrary network packet drops or node disconnections. Because physical network partitions (P) are inevitable, distributed systems must trade off between Consistency (CP - e.g. HBase, MongoDB, CockroachDB) and Availability (AP - e.g. Cassandra, DynamoDB).',
    keyPoints: [
      'Network partitions are physical realities; you cannot choose "CA" in distributed environments.',
      'BASE model (Basically Available, Soft-state, Eventual consistency) describes AP systems.',
    ],
    followUps: [
      {
        question: 'What is PACELC theorem as an extension of CAP?',
        answer: 'If there is a Partition (P), trade Consistency (C) vs Availability (A); Else (E), trade Latency (L) vs Consistency (C).',
      },
    ],
    companies: ['Deloitte', 'InfoCepts', 'Infosys'],
    tags: ['CAP Theorem', 'Distributed Systems', 'NoSQL'],
  },
  {
    id: 'dbms-11',
    categoryId: 'db-dbms',
    title: 'Explain Database Sharding vs Database Partitioning.',
    difficulty: 'INTERMEDIATE',
    answer:
      'Partitioning divides a large table into smaller physical segments on the SAME database server instance (e.g. Range partitioning by month, List partitioning by region). It improves maintenance and query pruning without changing application connections. Sharding is horizontal partitioning ACROSS MULTIPLE INDEPENDENT database servers/nodes. Each shard holds a subset of rows, distributing CPU, RAM, and disk I/O horizontally across clusters.',
    keyPoints: [
      'Sharding introduces cross-shard joins and distributed transaction complexity (2PC).',
      'Partitioning is managed transparently by the database engine on a single machine.',
    ],
    followUps: [
      {
        question: 'What is a Shard Key?',
        answer: 'The attribute used to determine which shard a row belongs to (e.g., hash(user_id) % num_shards).',
      },
    ],
    companies: ['Deloitte', 'InfoCepts', 'Infosys'],
    tags: ['Sharding', 'Partitioning', 'Scalability'],
  },
  {
    id: 'dbms-12',
    categoryId: 'db-dbms',
    title: 'What is the Two-Phase Commit (2PC) Protocol in Distributed Transactions?',
    difficulty: 'ADVANCED',
    answer:
      '2PC coordinates a distributed transaction across multiple database nodes to guarantee atomic commit: 1. Prepare Phase: Coordinator sends a "Prepare" message to all participant nodes. Each participant executes the transaction locally up to commit, writes undo/redo logs, and replies "VOTE_COMMIT" or "VOTE_ABORT". 2. Commit Phase: If ALL participants voted to commit, the coordinator writes a commit record to its log and sends "GLOBAL_COMMIT". Participants commit and reply "ACK". If even one participant voted abort or timed out, the coordinator sends "GLOBAL_ROLLBACK".',
    keyPoints: [
      '2PC is a blocking protocol: if the coordinator crashes during the commit phase, participants remain locked in doubt.',
      'Saga Pattern or 3PC is often preferred in modern microservices to avoid synchronous distributed locking.',
    ],
    followUps: [
      {
        question: 'What is the main drawback of 2PC in high-throughput systems?',
        answer: 'High network latency and coordinator single point of failure where resources remain locked until recovery.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts'],
    tags: ['2PC', 'Distributed Transactions', 'Commit'],
  },
  {
    id: 'dbms-13',
    categoryId: 'db-normalization',
    title: 'What is Lossless Join Decomposition and how do you test for it?',
    difficulty: 'INTERMEDIATE',
    answer:
      'A decomposition of relation R into R1 and R2 is Lossless (non-additive) if joining R1 and R2 using natural join produces exactly the original relation R with zero spurious/phantom tuples. Test rule: Decomposition is lossless if and only if the common attributes (R1 ∩ R2) form a Superkey of at least one of the decomposed relations (R1 ∩ R2 -> R1 OR R1 ∩ R2 -> R2).',
    keyPoints: [
      'Lossy decompositions introduce fake rows that did not exist in the original table.',
      'Lossless join property is mandatory for correct database normalization.',
    ],
    followUps: [
      {
        question: 'What causes a decomposition to be lossy?',
        answer: 'When decomposed tables are joined on columns that are not unique keys in either table, generating cross-product phantom rows.',
      },
    ],
    companies: ['Infosys', 'Capgemini', 'TCS'],
    tags: ['Lossless Join', 'Decomposition', 'Normalization'],
  },
  {
    id: 'dbms-14',
    categoryId: 'db-indexing',
    title: 'What is Hash Indexing and how does it compare to B-Tree Indexing?',
    difficulty: 'INTERMEDIATE',
    answer:
      'A Hash Index uses a hash function to map column keys directly to bucket addresses. It provides lightning-fast O(1) average lookup time for point equality queries (WHERE id = 5). However, Hash Indexes CANNOT be used for range queries (WHERE age BETWEEN 20 AND 30), partial key matching, or sorted ordering (ORDER BY) because hash functions scramble key order. B-Tree indexes provide O(log n) lookups and support both equality, range queries, and prefix matching, making B-Trees the standard index in general-purpose RDBMS.',
    keyPoints: [
      'Hash indexes: O(1) equality only.',
      'B-Tree indexes: O(log n) equality, range scans, prefix scans, ORDER BY.',
    ],
    followUps: [
      {
        question: 'Can Hash Index be used for ORDER BY queries?',
        answer: 'No, hash values do not preserve the natural sorting order of keys.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts'],
    tags: ['Hash Index', 'B-Tree', 'Indexing'],
  },
  {
    id: 'dbms-15',
    categoryId: 'db-dbms',
    title: 'Explain the Slotted Page Architecture in Database Storage Engines.',
    difficulty: 'ADVANCED',
    answer:
      'The Slotted Page architecture organizes variable-length records within a fixed-size disk block page (e.g. 4KB or 8KB). A page header at the beginning contains page metadata and an array of slot pointers (offset and length of each record) growing downwards. The actual record data is inserted from the bottom/end of the page growing upwards. The free space resides in the middle. When records are updated or deleted, slot pointers are adjusted without altering external row pointers (Record IDs: PageID + SlotNumber remain stable).',
    keyPoints: [
      'Allows variable-length attributes and records within pages.',
      'Record ID (RID) = (Page Number, Slot Index) provides pointer stability during internal fragmentation defragmentation.',
    ],
    followUps: [
      {
        question: 'What happens when free space in the middle of a slotted page is exhausted?',
        answer: 'The page splits, or a new page is allocated, and overflow pages are used for very large values (BLOB/TEXT).',
      },
    ],
    companies: ['Deloitte', 'InfoCepts'],
    tags: ['Storage Engines', 'Slotted Page', 'Internals'],
  },
  {
    id: 'dbms-16',
    categoryId: 'db-dbms',
    title: 'What is the Buffer Pool and LRU eviction policy in DBMS?',
    difficulty: 'INTERMEDIATE',
    answer:
      'The Buffer Pool is a dedicated memory region in RAM where the DBMS caches database disk pages. When a query requests a page, the engine first checks the buffer pool. If present (Cache Hit), read is instantaneous. If absent (Cache Miss), the page is fetched from disk and loaded into a buffer frame. When the buffer pool is full, an eviction policy decides which clean/dirty page to evict. Modern engines use modified LRU (LRU-K or Clock with 2-Hand) to prevent sequential table scans from polluting the cache.',
    keyPoints: [
      'Dirty pages (modified in RAM) are written to WAL first, then asynchronously flushed to disk via checkpointing.',
      'Buffer Hit Ratio measures cache efficiency (>99% is ideal in OLTP).',
    ],
    followUps: [
      {
        question: 'Why does basic LRU fail during large sequential table scans?',
        answer: 'A single table scan reads millions of single-use pages, evicting frequently accessed index pages from RAM (Scan Resistance problem).',
      },
    ],
    companies: ['Deloitte', 'InfoCepts'],
    tags: ['Buffer Pool', 'Caching', 'Memory Management'],
  },
  {
    id: 'dbms-17',
    categoryId: 'db-dbms',
    title: 'Explain Relational Algebra fundamental operators.',
    difficulty: 'BEGINNER',
    answer:
      'Relational algebra is the procedural query language foundational to relational databases: 1. Selection (σ): Filters rows satisfying a predicate (WHERE). 2. Projection (π): Selects specific columns (SELECT col1, col2). 3. Cartesian Product (✕): Combines all tuples from two relations. 4. Set Union (∪): Combines tuples from union-compatible relations. 5. Set Difference (−): Tuples in R but not in S. 6. Rename (ρ): Renames a relation or attributes. Derived operators include Natural Join (⨝) and Theta Join.',
    keyPoints: [
      'SQL queries are parsed and translated into relational algebra query trees for optimization.',
      'Relational algebra equivalence rules enable rule-based query rewrite optimizations.',
    ],
    followUps: [
      {
        question: 'What is the relational algebra equivalent of SQL SELECT name FROM Users WHERE age > 21?',
        answer: 'π_name(σ_age > 21 (Users)).',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro'],
    tags: ['Relational Algebra', 'Theory', 'Basics'],
  },
  {
    id: 'dbms-18',
    categoryId: 'db-normalization',
    title: 'What is 4NF and Multivalued Dependency (MVD)?',
    difficulty: 'ADVANCED',
    answer:
      'A Multivalued Dependency (MVD) X ->> Y occurs when the presence of a key X determines a set of values for Y independently of other attributes Z. A relation is in 4th Normal Form (4NF) if it is in BCNF and for every non-trivial MVD X ->> Y, X is a Superkey. 4NF eliminates independent 1-to-many relationships stored in the same table (e.g. storing an Employee’s multiple skills and multiple phone numbers in one table generates Cartesian product redundancy).',
    keyPoints: [
      'Solved by decomposing into two tables: (Employee, Skill) and (Employee, Phone).',
      'Non-trivial MVD: Y is not a subset of X, and X ∪ Y does not equal the entire relation.',
    ],
    followUps: [
      {
        question: 'How many rows are generated if an employee has 3 skills and 4 phone numbers in an unnormalized table?',
        answer: '3 * 4 = 12 rows with repeated data.',
      },
    ],
    companies: ['Deloitte', 'Infosys'],
    tags: ['4NF', 'MVD', 'Normalization'],
  },
  {
    id: 'dbms-19',
    categoryId: 'db-dbms',
    title: 'What is Database Replication: Master-Slave vs Multi-Master?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Replication copies data across multiple database servers for high availability and fault tolerance: 1. Master-Slave (Primary-Replica): All write transactions go to a single Master node; read queries are distributed across multiple Read-Replicas. If Master dies, a replica is elected as new primary. 2. Multi-Master: Multiple nodes accept writes concurrently. Offers zero write bottleneck, but requires complex conflict resolution algorithms (CRDTs or Last-Write-Wins) when concurrent conflicting writes happen.',
    keyPoints: [
      'Synchronous replication guarantees zero data loss (RPO=0) but increases write latency.',
      'Asynchronous replication offers low write latency but risks small data loss during master failover.',
    ],
    followUps: [
      {
        question: 'What is Replication Lag?',
        answer: 'The time delay between a commit on the primary node and its application on read replicas.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts', 'Infosys'],
    tags: ['Replication', 'High Availability', 'Architecture'],
  },
  {
    id: 'dbms-20',
    categoryId: 'db-dbms',
    title: 'What is Query Optimization: Cost-Based vs Rule-Based?',
    difficulty: 'ADVANCED',
    answer:
      'Rule-Based Optimization (RBO) uses fixed heuristic rules (e.g. "always use index if available") without considering data distribution or table sizes. Cost-Based Optimization (CBO) evaluates multiple alternative execution plans, using table statistics, cardinality estimates, index selectivity, and CPU/IO cost models to choose the plan with the lowest estimated total cost.',
    keyPoints: [
      'Outdated table statistics cause CBO to choose terrible plans (e.g. full scan instead of index).',
      'Command: ANALYZE TABLE or UPDATE STATISTICS refreshes histograms.',
    ],
    followUps: [
      {
        question: 'Why is ANALYZE TABLE important in SQLite / PostgreSQL?',
        answer: 'It samples column data distributions and builds statistical tables that the query planner uses to estimate row counts accurately.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts'],
    tags: ['Query Optimizer', 'CBO', 'Performance'],
  },
  {
    id: 'dbms-21',
    categoryId: 'db-dbms',
    title: 'What are Weak Entities and Identifying Relationships in ER Modeling?',
    difficulty: 'BEGINNER',
    answer:
      'A Weak Entity is an entity that cannot be uniquely identified by its own attributes alone and depends on the existence of a strong entity (owner entity). It has a Partial Key (discriminator), rendered with a dashed underline. An Identifying Relationship connects the weak entity to its strong owner (drawn as a double diamond). The primary key of a weak entity is the composite of the owner’s primary key plus the weak entity’s partial key.',
    example: 'An Order has strong entity status; OrderItems is a weak entity identified by (order_id + item_number).',
    keyPoints: [
      'Represented by a double rectangle in ER diagrams.',
      'Deleting the owner strong entity cascades to delete dependent weak entities.',
    ],
    followUps: [
      {
        question: 'Can a weak entity have a primary key of its own?',
        answer: 'No, it only possesses a partial key (discriminator); it requires the owner’s primary key to form a complete primary key.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini'],
    tags: ['ER Modeling', 'Weak Entity', 'Database Design'],
  },
  {
    id: 'dbms-22',
    categoryId: 'db-dbms',
    title: 'Explain Shadow Paging recovery technique in DBMS.',
    difficulty: 'INTERMEDIATE',
    answer:
      'Shadow Paging is an alternative recovery scheme to log-based recovery. The database maintains two page tables during transaction execution: the Current Page Table and the Shadow Page Table. Reads use the current page table. When a page is modified, a copy is made into a new disk block, and the current page table pointer is updated to point to the new block, leaving the shadow page untouched. On commit, the shadow pointer is atomically switched to the current pointer. On abort, the current pointer simply reverts to the shadow table.',
    keyPoints: [
      'Eliminates the overhead of writing undo/redo logs.',
      'Causes high disk fragmentation and large page table memory overhead.',
    ],
    followUps: [
      {
        question: 'Why is WAL preferred over Shadow Paging in modern enterprise DBMS?',
        answer: 'Shadow paging causes high disk fragmentation and does not support concurrent transactions easily.',
      },
    ],
    companies: ['Infosys', 'Capgemini'],
    tags: ['Crash Recovery', 'Shadow Paging', 'Storage'],
  },
  {
    id: 'dbms-23',
    categoryId: 'db-dbms',
    title: 'What is Dynamic Hashing: Extendible vs Linear Hashing?',
    difficulty: 'ADVANCED',
    answer:
      'Dynamic hashing allows the hash directory/buckets to grow and shrink gracefully as records are inserted and deleted, avoiding costly rehashing of the entire table: 1. Extendible Hashing: Uses an in-memory directory of bucket pointers based on the first d bits (global depth) of the hash. When a bucket overflows, only that specific bucket splits and increases its local depth; the directory doubles only when local depth exceeds global depth. 2. Linear Hashing: Grows file size by splitting buckets in a fixed, linear order one-by-one without requiring an in-memory directory.',
    keyPoints: [
      'Extendible hashing has O(1) lookups via directory, but directory doubling can cause memory spikes.',
      'Linear hashing avoids directories entirely.',
    ],
    followUps: [
      {
        question: 'What is Global Depth vs Local Depth in Extendible Hashing?',
        answer: 'Global depth is the number of bits used by the directory; Local depth is the number of bits shared by keys in a specific bucket.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts'],
    tags: ['Dynamic Hashing', 'Extendible Hashing', 'Storage'],
  },
  {
    id: 'dbms-24',
    categoryId: 'db-dbms',
    title: 'What are Database Triggers and what are their advantages and pitfalls?',
    difficulty: 'BEGINNER',
    answer:
      'A Trigger is a procedural block of SQL code stored in the database that executes automatically in response to specified events (BEFORE / AFTER INSERT, UPDATE, or DELETE) on a table. Advantages: automatic audit logging, enforcing complex business rules, synchronizing denormalized cache tables. Pitfalls: invisible business logic hidden from application code, performance overhead on bulk inserts, and cascading triggers that can cause infinite loops or deadlocks.',
    keyPoints: [
      'Row-level triggers (FOR EACH ROW) fire for every affected row; Statement-level triggers fire once per SQL statement.',
      'NEW and OLD pseudo-records access pre-update and post-update column values.',
    ],
    followUps: [
      {
        question: 'Can a BEFORE INSERT trigger modify the data being inserted?',
        answer: 'Yes, it can sanitize or overwrite values in the NEW record before write.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro'],
    tags: ['Triggers', 'DML Events', 'Auditing'],
  },
  {
    id: 'dbms-25',
    categoryId: 'db-dbms',
    title: 'What is the difference between Star Schema and Snowflake Schema in Data Warehousing?',
    difficulty: 'INTERMEDIATE',
    answer:
      'In dimensional modeling: A Star Schema consists of a centralized Fact Table surrounded by completely denormalized Dimension Tables directly linked via foreign keys (forming a star). It simplifies reporting queries and maximizes query performance by requiring fewer joins. A Snowflake Schema normalizes dimension tables into sub-dimension hierarchies (e.g. Store -> City -> State -> Country). It reduces storage redundancy but requires complex multi-table joins, degrading analytical read performance.',
    keyPoints: [
      'Fact tables store numerical business metrics (sales, revenue, units).',
      'Dimension tables store descriptive context (time, store, customer, product).',
      'Star Schema is the preferred industry standard for fast OLAP and PowerBI/Tableau dashboards.',
    ],
    followUps: [
      {
        question: 'What is a Factless Fact Table?',
        answer: 'A fact table that contains no numerical measurements, only foreign keys tracking events (e.g., student attendance tracking).',
      },
    ],
    companies: ['InfoCepts', 'Deloitte'],
    tags: ['Data Warehousing', 'Star Schema', 'Snowflake Schema', 'OLAP'],
  },
  {
    id: 'dbms-26',
    categoryId: 'db-dbms',
    title: 'What is Optimistic vs Pessimistic Concurrency Control?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Pessimistic Concurrency Control assumes conflicts are frequent; it locks resources upfront (using SELECT ... FOR UPDATE or exclusive locks) preventing other transactions from accessing data until commit. Optimistic Concurrency Control (OCC) assumes conflicts are rare; it does not lock records during read/edit. Instead, each row carries a version number or timestamp. When updating, it checks WHERE version = expected_version; if mismatched, another transaction updated first and the transaction aborts and retries.',
    codeExample: `-- Optimistic Locking SQL pattern:
UPDATE Products 
SET stock = stock - 1, version = version + 1 
WHERE id = 42 AND version = 5;
-- If affected rows == 0, abort and retry!`,
    keyPoints: [
      'Optimistic locking provides superior throughput for read-heavy web apps.',
      'Pessimistic locking is necessary for high-contention flash sales or reservation engines.',
    ],
    followUps: [
      {
        question: 'Why is optimistic locking preferred in RESTful stateless web architectures?',
        answer: 'Because HTTP requests are disconnected; you cannot hold open database locks while a human user fills out a web form.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'InfoCepts'],
    tags: ['Concurrency', 'Optimistic Locking', 'Pessimistic Locking'],
  },
  {
    id: 'dbms-27',
    categoryId: 'db-dbms',
    title: 'What is Write Skew in Database Concurrency?',
    difficulty: 'ADVANCED',
    answer:
      'Write Skew is a subtle concurrency anomaly that occurs under Snapshot Isolation / Repeatable Read. It happens when two concurrent transactions read overlapping data sets, verify a common constraint, and make disjoint updates that individually satisfy the constraint but jointly violate it. Classic example: On-call doctors. Hospital rule: At least one doctor must be on-call. Two doctors (A and B) are on-call. Both submit leave requests concurrently. Both transactions check: "Is count > 1?" (Yes, 2). Both commit: A goes off-call, B goes off-call. Result: Zero doctors on-call!',
    keyPoints: [
      'Repeatable Read does NOT prevent write skew because transactions update different rows.',
      'Prevented by upgrading to true Serializable isolation or explicit SELECT ... FOR UPDATE locking.',
    ],
    followUps: [
      {
        question: 'Why doesn’t row-level locking on updated rows prevent write skew?',
        answer: 'Because the conflict arises from the rows that were read, not the disjoint rows that were updated.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts'],
    tags: ['Write Skew', 'Snapshot Isolation', 'Anomalies'],
  },
  {
    id: 'dbms-28',
    categoryId: 'db-dbms',
    title: 'What is Database Connection Pooling and why is it essential?',
    difficulty: 'BEGINNER',
    answer:
      'Opening and closing physical database TCP/IP connections involves heavy overhead: network handshakes, authentication, process spawning, and memory allocation (~10-50ms per connection). A Connection Pool maintains a cache of pre-established, idle database connections. When an application thread needs to run a query, it borrows a connection from the pool, executes the query, and returns it to the pool instead of closing it, keeping latency under 1ms.',
    keyPoints: [
      'Popular pools: HikariCP (Java standard), pgBouncer (PostgreSQL).',
      'Configured with minIdle, maxPoolSize, and connectionTimeout.',
    ],
    followUps: [
      {
        question: 'What happens if all connections in a pool are active and another request arrives?',
        answer: 'The request blocks and waits up to connectionTimeout; if no connection becomes free, it throws a connection timeout exception.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Deloitte'],
    tags: ['Connection Pooling', 'Performance', 'Networking'],
  },
  {
    id: 'dbms-29',
    categoryId: 'db-dbms',
    title: 'What is Database Normalization vs Denormalization and when is Denormalization justified?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Normalization decomposes tables to eliminate redundancy and update anomalies (optimized for writes). Denormalization intentionally adds redundant data or pre-aggregated summary columns to normalized schemas to eliminate costly multi-table JOINs and accelerate read performance. Justified when: 1. Read-to-write ratio is extremely high (>100:1), 2. High-frequency queries suffer from multi-table joins across massive tables, 3. Real-time dashboards require instant aggregated counts (e.g. storing comment_count on Posts).',
    keyPoints: [
      'Denormalization requires application triggers or background workers to maintain sync.',
      'Increases storage requirements and write latency in exchange for ultra-fast reads.',
    ],
    followUps: [
      {
        question: 'What is the biggest risk of denormalization?',
        answer: 'Data inconsistency when an update modifies one copy of the data but fails to update the redundant copy.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['Denormalization', 'Tradeoffs', 'Architecture'],
  },
  {
    id: 'dbms-30',
    categoryId: 'db-dbms',
    title: 'Explain the difference between OLTP and OLAP systems.',
    difficulty: 'BEGINNER',
    answer:
      'OLTP (Online Transaction Processing) manages real-time day-to-day transactional business operations (e.g. banking, e-commerce checkouts). Workloads feature high volume of short, atomic read/write queries on normalized schemas (3NF) indexed for fast single-row lookups. OLAP (Online Analytical Processing) manages historical business intelligence, reporting, and data mining. Workloads feature low volume of complex analytical queries aggregating millions of rows across denormalized columnar or dimensional schemas (Star/Snowflake).',
    keyPoints: [
      'OLTP: Normalized, row-oriented, fast writes, short transactions.',
      'OLAP: Denormalized, columnar storage, fast aggregations, read-heavy batch jobs.',
    ],
    followUps: [
      {
        question: 'Why are Columnar databases (Snowflake, ClickHouse, BigQuery) faster for OLAP than row-oriented databases?',
        answer: 'Because analytical queries touch only a few columns across millions of rows; columnar storage reads only the requested columns from disk, skipping irrelevant data.',
      },
    ],
    companies: ['InfoCepts', 'Deloitte', 'Infosys', 'Cognizant'],
    tags: ['OLTP', 'OLAP', 'Data Engineering'],
  },
];
