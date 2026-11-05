import { SeedInterviewQuestion } from './types';

export const OS_QUESTIONS: SeedInterviewQuestion[] = [
  {
    id: 'os-01',
    categoryId: 'cs-os',
    title: 'Explain the difference between a Process and a Thread.',
    difficulty: 'BEGINNER',
    answer:
      'A Process is an executing instance of a computer program with its own isolated address space (code, data, heap, stack, file descriptors, security tokens) managed by the OS kernel via a Process Control Block (PCB). A Thread (lightweight process) is the smallest unit of CPU execution within a process. Multiple threads within the same process share the process address space, heap, global variables, and open files, but each thread has its own private Stack, Program Counter (PC), and CPU Register state.',
    keyPoints: [
      'Creating/terminating a thread is ~10-100x faster than creating a process.',
      'Context switching between threads within the same process is faster because it does not require flushing the TLB (Translation Lookaside Buffer).',
      'Crash isolation: A crash in one thread typically terminates the entire host process; a crash in one process does not affect others.',
    ],
    followUps: [
      {
        question: 'What is shared between threads of the same process?',
        answer: 'Heap memory, global variables, static variables, open file descriptors, and code segment.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro', 'Deloitte', 'HCL'],
    tags: ['Process', 'Thread', 'Concurrency'],
  },
  {
    id: 'os-02',
    categoryId: 'cs-os',
    title: 'What are the 4 Coffman Conditions necessary for Deadlock to occur?',
    difficulty: 'BEGINNER',
    answer:
      'A deadlock can occur if and only if all four Coffman conditions hold simultaneously: 1. Mutual Exclusion: At least one resource must be held in a non-shareable mode (only one process can use it at a time). 2. Hold and Wait: A process holding at least one resource is actively waiting to acquire additional resources held by other processes. 3. No Preemption: Resources cannot be forcibly confiscated from a process; they can only be released voluntarily after task completion. 4. Circular Wait: A closed chain of processes exists where P0 waits for P1, P1 waits for P2, ..., and Pn waits for P0.',
    keyPoints: [
      'Invalidating any ONE of these four conditions guarantees that deadlock cannot occur.',
      'Deadlock prevention protocols focus primarily on eliminating Circular Wait by ordering resource acquisitions globally.',
    ],
    followUps: [
      {
        question: 'How do you eliminate the Circular Wait condition in practice?',
        answer: 'Assign a global numeric ordering to all resources; require processes to request resources strictly in increasing numerical order.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Deloitte', 'HCL'],
    tags: ['Deadlocks', 'Coffman Conditions', 'Resource Management'],
  },
  {
    id: 'os-03',
    categoryId: 'cs-os',
    title: 'Explain CPU Scheduling Algorithms: FCFS, SJF, Round Robin, and Priority Scheduling.',
    difficulty: 'INTERMEDIATE',
    answer:
      '1. FCFS (First-Come, First-Served): Non-preemptive. Simple queue; suffers from the Convoy Effect (short jobs wait behind a massive CPU-bound job). 2. SJF (Shortest Job First): Provably optimal average waiting time. Non-preemptive or Preemptive (SRTF - Shortest Remaining Time First). Hard to predict next burst time; causes starvation for long jobs. 3. Round Robin (RR): Preemptive. Each process gets a small fixed slice of CPU time (Time Quantum / Time Slice). If quantum is too large, it degrades to FCFS; if too small, excessive context switching overhead degrades throughput. 4. Priority Scheduling: CPU assigned to highest priority process. Suffers from starvation, solved using Aging (gradually increasing priority of waiting processes).',
    keyPoints: [
      'Convoy Effect: Low CPU/device utilization caused by short processes queued behind a long one in FCFS.',
      'Aging solves process starvation in priority queues.',
      'Round Robin is the foundation of interactive time-sharing OS scheduling.',
    ],
    followUps: [
      {
        question: 'What is a Multi-Level Feedback Queue (MLFQ)?',
        answer: 'A dynamic scheduling algorithm with multiple priority queues where processes move between queues based on their CPU burst history (I/O-bound jobs stay at high priority, CPU hogs drop to lower priority).',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro', 'HCL'],
    tags: ['CPU Scheduling', 'Round Robin', 'Algorithms'],
  },
  {
    id: 'os-04',
    categoryId: 'cs-os',
    title: 'What is the difference between Mutex and Semaphore?',
    difficulty: 'BEGINNER',
    answer:
      'A Mutex (Mutual Exclusion object) is a locking mechanism with OWNERSHIP: only the specific thread that locked the mutex can unlock it. It is strictly binary (0 or 1) and protects shared critical sections. A Semaphore is a signaling mechanism without ownership: any thread can post/signal a semaphore. A Counting Semaphore has an integer counter used to control access to a pool of N identical resources (e.g. max 10 concurrent database connections). A Binary Semaphore has values 0 and 1, used for synchronization across threads.',
    keyPoints: [
      'Mutex has ownership; Semaphore does not.',
      'Mutex provides mutual exclusion; Semaphore provides signaling and rate-limiting.',
      'Semaphore operations: wait() / P() (decrements) and signal() / V() (increments).',
    ],
    followUps: [
      {
        question: 'Can a thread be unlocked by a different thread with a Mutex?',
        answer: 'No, attempting to unlock a mutex from another thread results in undefined behavior or an error.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'HCL'],
    tags: ['Synchronization', 'Mutex', 'Semaphore'],
  },
  {
    id: 'os-05',
    categoryId: 'cs-os',
    title: 'Explain Paging, Page Tables, and the Translation Lookaside Buffer (TLB).',
    difficulty: 'INTERMEDIATE',
    answer:
      'Paging is a memory management scheme where physical memory is divided into fixed-size blocks called Frames, and logical address space into equal-sized blocks called Pages (typically 4KB). This eliminates external fragmentation. A Page Table maps a process’s virtual page number (VPN) to a physical frame number (PFN). Because every memory access would require two lookups (one for the page table and one for data), the CPU uses the TLB (Translation Lookaside Buffer)—a fast hardware associative cache storing recent VPN-to-PFN mappings. If TLB Hit, translation is instantaneous; if TLB Miss, the MMU walks the page table in RAM.',
    keyPoints: [
      'Paging eliminates External Fragmentation, but leaves small Internal Fragmentation on the last page.',
      'Multi-Level Page Tables prevent allocating gigabytes of unused page table entries for sparse address spaces.',
    ],
    followUps: [
      {
        question: 'What is a TLB Shootdown in multicore systems?',
        answer: 'When a page table entry is updated on one core, an inter-processor interrupt (IPI) invalidates the stale TLB entry across all other CPU cores.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'HCL'],
    tags: ['Paging', 'TLB', 'Virtual Memory', 'Hardware'],
  },
  {
    id: 'os-06',
    categoryId: 'cs-os',
    title: 'What is Virtual Memory and what happens during a Page Fault?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Virtual Memory is an OS abstraction that provides each process with the illusion of a vast, contiguous address space larger than physical RAM by paging inactive data out to disk (swap space). A Page Fault occurs when a program attempts to access a virtual page not currently mapped in physical RAM (valid bit in page table is 0): 1. MMU traps to OS kernel (Page Fault handler). 2. OS checks if address is valid; if invalid, throws Segmentation Fault. 3. OS finds a free physical frame in RAM (or evicts an existing page using page replacement). 4. OS schedules disk I/O to read the required page from swap space into the frame. 5. Page table updated (valid bit = 1), and the faulting instruction is restarted.',
    keyPoints: [
      'Demand Paging loads pages into RAM only when accessed.',
      'Excessive page faulting causes system Thrashing.',
    ],
    followUps: [
      {
        question: 'What happens to the executing process during a page fault disk read?',
        answer: 'The process is placed in the WAITING / BLOCKED state while disk I/O completes, allowing the CPU to schedule other ready processes.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['Virtual Memory', 'Page Fault', 'Swap Space'],
  },
  {
    id: 'os-07',
    categoryId: 'cs-os',
    title: 'What is Thrashing in Operating Systems and how is it resolved?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Thrashing is a state of severe performance collapse where the operating system spends more time swapping pages in and out of disk than executing instructions. It occurs when the sum of the Working Sets of all active processes exceeds available physical RAM. As page faults multiply, processes queue for disk I/O, CPU utilization plummets, and the OS mistakenly increases degree of multiprogramming, worsening the crisis. Resolution: 1. Reduce degree of multiprogramming (suspend/swap out some processes), 2. Working Set Model (guarantee a process has its working set in RAM before running it), 3. Add more physical RAM.',
    keyPoints: [
      'Working Set: The set of pages actively referenced by a process in the most recent time window Δ.',
      'Page Fault Frequency (PFF) dynamically adjusts allocated frames based on fault rates.',
    ],
    followUps: [
      {
        question: 'How does the Working Set Model prevent thrashing?',
        answer: 'If the total working set size of all processes exceeds total physical frames, the OS suspends an entire process and frees all its frames.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'HCL'],
    tags: ['Thrashing', 'Working Set', 'Virtual Memory'],
  },
  {
    id: 'os-08',
    categoryId: 'cs-os',
    title: 'What is Belady’s Anomaly in Page Replacement Algorithms?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Belady’s Anomaly is the counter-intuitive phenomenon where increasing the number of physical page frames allocated to a process results in MORE page faults (rather than fewer) for certain page reference strings. It occurs in algorithms that do NOT belong to the class of Stack Algorithms, most notably FIFO (First-In, First-Out) page replacement. Stack algorithms like LRU (Least Recently Used) and Optimal Replacement are mathematically immune to Belady’s anomaly because the set of pages in N frames is always a strict subset of pages in N+1 frames.',
    keyPoints: [
      'FIFO suffers from Belady’s Anomaly.',
      'LRU and Optimal are Stack algorithms and are immune to Belady’s Anomaly.',
    ],
    followUps: [
      {
        question: 'Why is Optimal Page Replacement (Belady’s Min algorithm) impossible to implement in practice?',
        answer: 'Because it requires future knowledge of which pages will be referenced furthest in time.',
      },
    ],
    companies: ['Infosys', 'Deloitte', 'Capgemini'],
    tags: ['Belady Anomaly', 'Page Replacement', 'FIFO'],
  },
  {
    id: 'os-09',
    categoryId: 'cs-os',
    title: 'What is a Context Switch and what causes context switching overhead?',
    difficulty: 'BEGINNER',
    answer:
      'A Context Switch is the procedure where the CPU stops executing one process/thread, saves its current execution state (Program Counter, CPU registers, stack pointer) into its PCB/TCB, and loads the saved state of another process/thread to resume execution. Overhead arises from: 1. Direct overhead: Saving and restoring registers, flushing CPU pipeline, switching memory management page directory pointers (CR3 register). 2. Indirect overhead (heavier): CPU Cache (L1/L2/L3) invalidation and TLB cache invalidation, causing cache misses when the new process begins executing.',
    keyPoints: [
      'Context switching is pure CPU overhead (no useful work performed during the switch).',
      'Thread context switch within the same process skips TLB flush, making it much faster.',
    ],
    followUps: [
      {
        question: 'Why does a process context switch invalidate the TLB?',
        answer: 'Because virtual addresses map to completely different physical frames in different processes, unless tagged with an Address Space ID (PCID/ASID).',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'HCL'],
    tags: ['Context Switch', 'CPU', 'Overhead'],
  },
  {
    id: 'os-10',
    categoryId: 'cs-os',
    title: 'Explain Zombie Process vs Orphan Process in Unix/Linux.',
    difficulty: 'BEGINNER',
    answer:
      '1. Zombie Process: A child process that has terminated its execution (called exit()), but its entry still remains in the OS Process Table because its parent process has not yet read its exit status via wait() or waitpid(). It consumes zero CPU or RAM, but wastes a Process ID (PID). 2. Orphan Process: A child process whose parent process terminated or crashed before the child finished. In Unix, orphan processes are immediately adopted by the root init process (PID 1) or systemd, which periodically calls wait() to reap their exit statuses upon termination.',
    keyPoints: [
      'A zombie process cannot be killed with kill -9 because it is already dead.',
      'Too many zombies exhaust the system PID table (/proc/sys/kernel/pid_max).',
    ],
    followUps: [
      {
        question: 'How do you clean up a Zombie Process?',
        answer: 'Kill the parent process; the zombie is adopted by init (PID 1), which reaps it immediately.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Deloitte', 'HCL'],
    tags: ['Zombie', 'Orphan', 'Unix', 'Processes'],
  },
  {
    id: 'os-11',
    categoryId: 'cs-os',
    title: 'What happens when fork() is called in Unix/Linux and what is Copy-On-Write (COW)?',
    difficulty: 'INTERMEDIATE',
    answer:
      'The fork() system call creates an exact duplicate child process of the calling parent process. Both processes continue execution from the instruction immediately following fork(). In parent, fork() returns child’s PID; in child, it returns 0. Copy-On-Write (COW) is an optimization: instead of copying all memory pages of the parent (~megabytes/gigabytes), the child shares the parent’s exact physical frames marked READ-ONLY. If either process attempts to write/modify a page, a CPU trap occurs, and the OS duplicates only that specific modified 4KB page, making fork() virtually instantaneous.',
    keyPoints: [
      'COW allows fork() followed by exec() to execute with negligible memory copy overhead.',
      'Pointers and file descriptors are duplicated in the child.',
    ],
    followUps: [
      {
        question: 'What is the return value of fork() if process creation fails?',
        answer: '-1 is returned to the parent process and errno is set.',
      },
    ],
    companies: ['Infosys', 'Deloitte', 'HCL'],
    tags: ['Fork', 'COW', 'Unix', 'Virtual Memory'],
  },
  {
    id: 'os-12',
    categoryId: 'cs-os',
    title: 'What is User Mode vs Kernel Mode and how does a System Call transition between them?',
    difficulty: 'BEGINNER',
    answer:
      'To protect system security and stability, CPUs enforce Dual-Mode Operation using a Mode Bit: 1. User Mode (Ring 3): User applications run here. Direct access to hardware (disk, network, memory controllers) and privileged CPU instructions is prohibited. 2. Kernel Mode / Supervisor Mode (Ring 0): Operating system kernel runs here with unrestricted access to all CPU instructions and physical hardware. A System Call (e.g. read, write, open) triggers a Software Interrupt / Trap instruction (e.g. syscall / sysenter). The CPU switches mode bit from 1 (User) to 0 (Kernel), saves registers, and jumps to a predefined kernel interrupt vector table handler.',
    keyPoints: [
      'Dual-mode operation prevents rogue user apps from crashing the OS or reading other apps’ memory.',
      'System calls bridge the gap between user space and kernel space.',
    ],
    followUps: [
      {
        question: 'What happens if a user-mode program executes a privileged instruction (like CLI - Clear Interrupts)?',
        answer: 'The CPU traps and fires a General Protection Fault, terminating the process.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro'],
    tags: ['Dual Mode', 'Kernel', 'System Calls'],
  },
  {
    id: 'os-13',
    categoryId: 'cs-os',
    title: 'Explain Banker’s Algorithm for Deadlock Avoidance.',
    difficulty: 'INTERMEDIATE',
    answer:
      'Banker’s Algorithm (by Edsger Dijkstra) is a deadlock avoidance algorithm tested before granting resource allocations. It tests for Safety: can the system allocate requested resources and still guarantee that every process can finish in some sequence without deadlocking (Safe State)? Data structures: Available vector, Max matrix, Allocation matrix, and Need matrix (Need = Max - Allocation). When a process requests resources, the OS simulates the allocation; if the resulting state is Safe, resources are granted; if Unsafe, the process must wait.',
    keyPoints: [
      'Safe State != Deadlock free right now; Safe State guarantees a path exists where ALL processes can complete.',
      'Requires processes to state their maximum resource needs in advance (rare in general-purpose OS).',
    ],
    followUps: [
      {
        question: 'Is an Unsafe State always a Deadlock?',
        answer: 'No, an unsafe state is not necessarily deadlocked yet, but the OS cannot prevent processes from eventually deadlocking if they request their maximum needs.',
      },
    ],
    companies: ['Infosys', 'Capgemini', 'HCL'],
    tags: ['Bankers Algorithm', 'Deadlocks', 'Avoidance'],
  },
  {
    id: 'os-14',
    categoryId: 'cs-os',
    title: 'What are Inodes and what is the difference between Hard Links and Soft Links (Symlinks)?',
    difficulty: 'INTERMEDIATE',
    answer:
      'An Inode (Index Node) is a data structure on Unix filesystems storing file metadata: file size, permissions, owner, timestamps, and pointers to disk blocks containing file data (file names are stored in directory tables, not inodes). Hard Link: A directory entry pointing directly to the existing file’s Inode number. Both links share the same inode and disk blocks; deleting one file does not delete the data until the inode link count drops to 0. Cannot cross filesystem partitions. Soft Link (Symbolic Link / Symlink): An independent file with its own unique Inode whose content is a string path to another file. Can cross filesystems; if the target file is deleted, the symlink breaks ("dangling link").',
    keyPoints: [
      'Hard links share the same inode number: ls -i shows identical numbers.',
      'Soft links can link directories and span across mounted drives.',
    ],
    followUps: [
      {
        question: 'Can you create a hard link to a directory in modern Linux?',
        answer: 'No, to prevent infinite directory recursion loops in filesystem traversal algorithms.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['Inodes', 'Hard Links', 'Soft Links', 'Filesystem'],
  },
  {
    id: 'os-15',
    categoryId: 'cs-os',
    title: 'Explain Inter-Process Communication (IPC) mechanisms: Pipes, Shared Memory, and Sockets.',
    difficulty: 'INTERMEDIATE',
    answer:
      'Because processes have isolated memory address spaces, they must use OS IPC mechanisms to communicate: 1. Pipes: Half-duplex unidirectional byte streams for related processes (parent-child). Named Pipes (FIFOs) allow unrelated processes to communicate via a filesystem path. 2. Shared Memory: Fastest IPC mechanism because the OS maps the same physical RAM frame into the virtual address spaces of both processes. Processes read and write at memory speeds without kernel copy overhead, but require synchronization (Semaphores) to prevent race conditions. 3. Message Queues: Stored linked lists of messages maintained by the kernel. 4. Sockets: Bidirectional byte streams over network or Unix domain sockets, supporting IPC across different machines.',
    keyPoints: [
      'Shared memory is the fastest IPC because data is not copied through kernel space.',
      'Sockets provide network transparency (local vs remote machine).',
    ],
    followUps: [
      {
        question: 'Why are Unix Domain Sockets faster than TCP/IP loopback (127.0.0.1) for local IPC?',
        answer: 'Unix domain sockets bypass the network stack, TCP checksumming, packet fragmentation, and routing overhead.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini', 'HCL'],
    tags: ['IPC', 'Pipes', 'Shared Memory', 'Sockets'],
  },
  {
    id: 'os-16',
    categoryId: 'cs-os',
    title: 'What is the Critical Section Problem and the 3 Requirements for its solution?',
    difficulty: 'BEGINNER',
    answer:
      'The Critical Section is a segment of code where shared resources (shared variables, files) are accessed and updated by concurrent processes. If multiple processes execute their critical sections concurrently, race conditions corrupt data. Any valid solution MUST satisfy 3 requirements: 1. Mutual Exclusion: If process Pi is executing in its critical section, no other process can execute in their critical section. 2. Progress: If no process is in its critical section and some wish to enter, only processes not in their remainder sections can participate in deciding who enters next, and this selection cannot be postponed indefinitely. 3. Bounded Waiting: There must be a limit/bound on the number of times other processes are allowed to enter their critical sections after a process has made a request to enter.',
    keyPoints: [
      'Bounded waiting prevents process starvation.',
      'Peterson’s algorithm satisfies all 3 requirements for 2 processes in software.',
    ],
    followUps: [
      {
        question: 'What hardware instruction provides atomic test-and-set for spinlocks?',
        answer: 'TestAndSet or CompareAndSwap (CAS) instructions provided by modern CPUs.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini'],
    tags: ['Critical Section', 'Synchronization', 'Concurrency'],
  },
  {
    id: 'os-17',
    categoryId: 'cs-os',
    title: 'Explain Disk Scheduling Algorithms: FCFS, SSTF, SCAN (Elevator), and C-LOOK.',
    difficulty: 'INTERMEDIATE',
    answer:
      'Disk scheduling determines the service order of pending disk read/write requests to minimize total head movement seek time: 1. FCFS: Serves requests in arrival order (large head swings). 2. SSTF (Shortest Seek Time First): Serves the request closest to the current head position. Minimizes seek time, but can cause starvation for distant requests. 3. SCAN (Elevator Algorithm): Head moves in one direction servicing requests until reaching the end of the disk, then reverses direction servicing requests. 4. C-LOOK (Circular LOOK): Head moves in one direction servicing requests until the last request in that direction, then immediately jumps back to the furthest request at the other end without servicing on the return trip, providing uniform waiting times.',
    keyPoints: [
      'C-LOOK and LOOK do not travel to the physical end of the disk platter (unlike SCAN/C-SCAN).',
      'SSDs do not have mechanical seek latency, rendering traditional disk scheduling obsolete for NVMe drives.',
    ],
    followUps: [
      {
        question: 'Do SSDs use traditional disk scheduling algorithms like SCAN?',
        answer: 'No, SSDs have flash memory with uniform random access times and use wear-leveling and I/O submission queues instead.',
      },
    ],
    companies: ['Infosys', 'Capgemini', 'Wipro'],
    tags: ['Disk Scheduling', 'SCAN', 'Storage'],
  },
  {
    id: 'os-18',
    categoryId: 'cs-os',
    title: 'What is Internal vs External Fragmentation in Memory Management?',
    difficulty: 'BEGINNER',
    answer:
      'Internal Fragmentation occurs when memory is allocated in fixed-size blocks (like 4KB pages) and a process requests less memory than the block size (e.g. process requests 1KB; the remaining 3KB within the allocated frame is wasted and cannot be used by other processes). External Fragmentation occurs when free memory is broken into many small scattered holes throughout physical memory such that total free space is sufficient for a new process, but no single contiguous block is large enough. Paging eliminates external fragmentation.',
    keyPoints: [
      'Paging eliminates external fragmentation, but suffers from minor internal fragmentation.',
      'Compaction (defragmentation) resolves external fragmentation by shifting occupied memory blocks.',
    ],
    followUps: [
      {
        question: 'What is Compaction in OS memory management?',
        answer: 'Moving allocated memory blocks to one side of physical RAM to coalesce all scattered free holes into one large contiguous block.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini'],
    tags: ['Fragmentation', 'Memory Management'],
  },
  {
    id: 'os-19',
    categoryId: 'cs-os',
    title: 'What is Priority Inversion and how does Priority Inheritance resolve it?',
    difficulty: 'ADVANCED',
    answer:
      'Priority Inversion is a concurrency hazard where a high-priority task H is indirectly preempted and delayed by a medium-priority task M, because H is waiting for a shared lock held by a low-priority task L, and M preempts L. (L holds lock -> H requests lock and blocks -> M preempts L because M > L -> H waits indefinitely for M!). Famous for freezing the Mars Pathfinder spacecraft in 1997. Priority Inheritance resolves it: whenever high-priority task H blocks waiting for a lock held by low-priority task L, task L temporarily inherits the high priority of H until L releases the lock, preventing medium tasks from preempting it.',
    keyPoints: [
      'Priority Inheritance temporarily boosts the priority of lock holders.',
      'Essential for real-time operating systems (RTOS).',
    ],
    followUps: [
      {
        question: 'What is Priority Ceiling Protocol?',
        answer: 'Each resource is assigned a priority ceiling equal to the highest priority of any task that can lock it; a task acquires a lock only if its priority exceeds all currently held ceilings.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts'],
    tags: ['Priority Inversion', 'Real Time OS', 'Synchronization'],
  },
  {
    id: 'os-20',
    categoryId: 'cs-os',
    title: 'What is a Spinlock and when is it preferred over a Mutex?',
    difficulty: 'INTERMEDIATE',
    answer:
      'A Spinlock is a lock where a thread waiting to acquire the lock repeatedly loops ("spins" in a busy-wait loop using atomic test-and-set) checking if the lock is free, without putting the thread to sleep or yielding CPU. A Mutex puts the waiting thread to sleep and initiates a context switch. Spinlocks are preferred when: 1. The lock is held for extremely short durations (fewer CPU cycles than the overhead of two context switches ~2000 cycles), 2. In OS kernel interrupt handlers where sleeping is strictly prohibited.',
    keyPoints: [
      'Spinlocks waste CPU cycles on single-core systems (must never be used on uniprocessors).',
      'Ideal for low-latency multicore kernel primitives.',
    ],
    followUps: [
      {
        question: 'Why are spinlocks never used on single-core uniprocessor systems?',
        answer: 'Because the spinning thread starves the lock-holding thread from ever running to release the lock unless preempted.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'HCL'],
    tags: ['Spinlock', 'Locks', 'Kernel'],
  },
  {
    id: 'os-21',
    categoryId: 'cs-os',
    title: 'Explain Segmentation vs Paging in Memory Management.',
    difficulty: 'BEGINNER',
    answer:
      'Paging divides memory into fixed-size physical blocks (Frames/Pages) invisible to the programmer. It is purely physical and avoids external fragmentation. Segmentation divides memory into variable-length logical segments corresponding to the programmer’s view of the program (e.g. Code segment, Stack segment, Heap segment, Symbol Table). Segments have base addresses and limit registers. Segmentation provides natural protection and sharing boundaries, but suffers from external fragmentation.',
    keyPoints: [
      'Paging = fixed-size, physical view.',
      'Segmentation = variable-size, logical/programmer view.',
      'Modern x86_64 uses Segmented Paging (paging within flat memory segments).',
    ],
    followUps: [
      {
        question: 'How is a logical address structured in Segmentation?',
        answer: 'Two parts: Segment Number (s) and Segment Offset (d). The MMU checks that d < Limit before adding Base.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini'],
    tags: ['Segmentation', 'Paging', 'Memory'],
  },
  {
    id: 'os-22',
    categoryId: 'cs-os',
    title: 'What is the Role of the OS Kernel and its Subsystems?',
    difficulty: 'BEGINNER',
    answer:
      'The Kernel is the core, resident component of the operating system that runs with supreme hardware privileges. Key subsystems: 1. Process Management: Process creation, scheduling, inter-process communication, synchronization. 2. Memory Management: Virtual memory, paging, allocation/deallocation of physical RAM. 3. File System Management: Inodes, directories, access permissions, file caching. 4. Device / I/O Drivers: Device controllers, interrupts, DMA (Direct Memory Access). 5. Protection and Security: Dual-mode enforcement, privilege rings, authentication.',
    keyPoints: [
      'Monolithic Kernel (Linux): all subsystems run in supervisor ring 0 for high performance.',
      'Microkernel (Mach, QNX): only bare essentials (IPC, scheduling) in ring 0; drivers and file systems run as user-space daemons.',
    ],
    followUps: [
      {
        question: 'What is the main advantage of a Microkernel over a Monolithic kernel?',
        answer: 'High fault tolerance and security: a crash in a device driver or file system does not bring down the core kernel.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Wipro'],
    tags: ['Kernel', 'Architecture', 'Subsystems'],
  },
  {
    id: 'os-23',
    categoryId: 'cs-os',
    title: 'What is Direct Memory Access (DMA) and why is it used?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Direct Memory Access (DMA) is a hardware feature allowing high-speed I/O peripheral devices (disk controllers, network cards, GPUs) to transfer data directly to and from main RAM without passing through the CPU. Without DMA (Programmed I/O), the CPU must read every byte from device registers and write it to RAM, pegging CPU at 100%. With DMA, the CPU delegates the transfer to a DMA Controller (specifying source, destination, and byte count) and continues executing other tasks. The DMA controller fires a single Interrupt when the entire block transfer completes.',
    keyPoints: [
      'Frees the CPU from handling byte-by-byte data transfers.',
      'Cycle Stealing: DMA controller borrows memory bus cycles from the CPU during transfers.',
    ],
    followUps: [
      {
        question: 'What is Scatter-Gather DMA?',
        answer: 'The ability of a DMA controller to transfer data to or from multiple non-contiguous physical memory pages in a single transaction.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'HCL'],
    tags: ['DMA', 'Hardware', 'IO'],
  },
  {
    id: 'os-24',
    categoryId: 'cs-os',
    title: 'Explain the difference between Preemptive and Non-Preemptive Scheduling.',
    difficulty: 'BEGINNER',
    answer:
      'In Non-Preemptive scheduling, once a process is allocated the CPU, it keeps the CPU until it terminates or voluntarily yields by waiting for an I/O event. The OS cannot force it off the CPU (e.g. traditional FCFS, basic SJF). In Preemptive scheduling, the OS can interrupt and evict an executing process in the RUNNING state to assign the CPU to a higher-priority or newly arrived process (e.g. Round Robin, SRTF, Multi-Level Feedback Queue). Preemption requires hardware timer interrupts.',
    keyPoints: [
      'Preemptive scheduling is required for interactive desktop and mobile operating systems.',
      'Non-preemptive scheduling is simpler but prone to starvation and long response times.',
    ],
    followUps: [
      {
        question: 'What hardware component enables preemptive scheduling?',
        answer: 'The programmable hardware Timer Interrupt, which periodically yields control back to the OS scheduler.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini'],
    tags: ['Scheduling', 'Preemptive', 'CPU'],
  },
  {
    id: 'os-25',
    categoryId: 'cs-os',
    title: 'What is Journaling in File Systems (ext4, NTFS)?',
    difficulty: 'INTERMEDIATE',
    answer:
      'A Journaling File System protects against data corruption caused by power failures or sudden system crashes. Before modifying the actual filesystem structures on disk, metadata changes are written sequentially to a dedicated circular buffer called the Journal. If the system crashes mid-operation, the OS reads the journal during reboot (replay log) and recovers consistency in seconds, eliminating the hours-long full disk scan (fsck / chkdsk) required by legacy filesystems.',
    keyPoints: [
      'Journal modes in ext4: Journal (metadata + data), Ordered (default: metadata journaled after data flushed), Writeback (metadata only).',
      'Guarantees filesystem metadata integrity across unexpected power outages.',
    ],
    followUps: [
      {
        question: 'What is the SQLite equivalent of filesystem journaling?',
        answer: 'SQLite Rollback Journal (.journal file) and Write-Ahead Log (.wal file).',
      },
    ],
    companies: ['Deloitte', 'Infosys'],
    tags: ['File Systems', 'Journaling', 'Crash Consistency'],
  },
];
