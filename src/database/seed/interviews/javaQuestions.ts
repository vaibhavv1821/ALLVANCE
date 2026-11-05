import { SeedInterviewQuestion } from './types';

export const JAVA_QUESTIONS: SeedInterviewQuestion[] = [
  {
    id: 'java-01',
    categoryId: 'prog-java',
    title: 'Explain the difference between JDK, JRE, and JVM.',
    difficulty: 'BEGINNER',
    answer:
      'JVM (Java Virtual Machine) is the abstract runtime engine that executes compiled Java bytecode. JRE (Java Runtime Environment) contains the JVM plus core libraries required to run Java applications. JDK (Java Development Kit) is the complete development suite containing JRE, JVM, compiler (javac), debugger, and documentation tools.',
    example: 'A user running a Minecraft game only needs JRE/JVM, but a programmer writing Minecraft mods requires JDK.',
    codeExample: `// Compiling with JDK:
javac HelloWorld.java // Produces HelloWorld.class (Bytecode)

// Running with JRE/JVM:
java HelloWorld`,
    keyPoints: [
      'JVM is platform-dependent (Windows, Linux, macOS have different JVM binaries).',
      'Java bytecode (.class) is platform-independent ("Write Once, Run Anywhere").',
      'JDK includes development tools like javac, jdb, and jar.',
    ],
    followUps: [
      {
        question: 'Is the JVM platform independent?',
        answer: 'No, JVM is platform-dependent because it translates bytecode into specific host OS machine code.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Wipro', 'Capgemini', 'Cognizant'],
    tags: ['JVM', 'JDK', 'JRE', 'Architecture'],
  },
  {
    id: 'java-02',
    categoryId: 'prog-java',
    title: 'Why is Java not considered 100% Object-Oriented?',
    difficulty: 'BEGINNER',
    answer:
      'Java is not 100% object-oriented because it supports primitive data types (byte, short, int, long, float, double, char, boolean) which are not objects and do not inherit from java.lang.Object. Pure OO languages like Smalltalk treat everything as an object.',
    example: 'int x = 10; does not allocate on the heap or have methods, unlike Integer x = Integer.valueOf(10);.',
    keyPoints: [
      'Primitive data types are stored directly on the stack for high performance.',
      'Java provides wrapper classes (Integer, Double) to use primitives inside Collections.',
    ],
    followUps: [
      {
        question: 'What is Autoboxing and Unboxing in Java?',
        answer: 'Automatic conversion of primitives to their wrapper class (autoboxing) and vice-versa (unboxing).',
      },
    ],
    companies: ['Infosys', 'Accenture', 'TCS'],
    tags: ['OOPs', 'Primitives', 'Architecture'],
  },
  {
    id: 'java-03',
    categoryId: 'prog-java',
    title: 'Why is String immutable in Java?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Strings in Java are immutable for three primary reasons: Security (parameters for network connections and database URLs cannot be maliciously modified), Caching & String Pool optimization (multiple references share the same heap literal saving memory), and Thread Safety (multiple threads can read string instances without synchronization locks).',
    example: 'When calling s.concat(" World"), the original string s is unchanged; a new string object is allocated in memory.',
    codeExample: `String s1 = "Hello";
String s2 = "Hello"; // s1 and s2 point to the same String Pool reference
s1 = s1 + " World"; // s1 points to a newly allocated string; "Hello" remains intact`,
    keyPoints: [
      'String class is marked final so its behavior cannot be overridden.',
      'Hash code of String is cached once computed, speeding up HashMap operations.',
      'String Pool resides in the Java Heap memory.',
    ],
    followUps: [
      {
        question: 'What is the difference between String, StringBuilder, and StringBuffer?',
        answer: 'String is immutable. StringBuffer is mutable and thread-safe (synchronized methods). StringBuilder is mutable and non-thread-safe but faster.',
      },
    ],
    companies: ['Infosys', 'Deloitte', 'TCS', 'Capgemini'],
    tags: ['String', 'Memory', 'Immutability'],
  },
  {
    id: 'java-04',
    categoryId: 'prog-java',
    title: 'How does HashMap work internally in Java 8+?',
    difficulty: 'ADVANCED',
    answer:
      'HashMap uses an array of Node<K,V> buckets. When put(key, value) is called, it computes key.hashCode(), hashes it using a bitwise spread function, and determines the bucket index via (n - 1) & hash. If a collision occurs, entries are chained in a LinkedList. In Java 8, when a bucket exceeds TREEIFY_THRESHOLD (8 entries) and the table capacity is at least 64, the linked list converts to a Red-Black Tree, improving lookup from O(n) to O(log n).',
    codeExample: `Map<String, Integer> map = new HashMap<>();
// Step 1: Compute hash("Apple")
// Step 2: Index = (capacity - 1) & hash
// Step 3: Check bucket: if empty, insert Node; if occupied, check .equals()
map.put("Apple", 50);`,
    keyPoints: [
      'Default initial capacity is 16; default load factor is 0.75.',
      'Threshold = capacity * load factor (16 * 0.75 = 12). Rehashes when size exceeds threshold.',
      'Converts from linked list to Red-Black tree when bucket length >= 8 and table capacity >= 64.',
      'Converts back to list when bucket length shrinks to 6 (UNTREEIFY_THRESHOLD).',
    ],
    followUps: [
      {
        question: 'What happens if two different keys have the same hash code?',
        answer: 'A collision occurs. HashMap stores both in the same bucket and uses key.equals() to distinguish them during get() and put().',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini', 'Cognizant', 'InfoCepts'],
    tags: ['Collections', 'HashMap', 'Internal Working'],
  },
  {
    id: 'java-05',
    categoryId: 'prog-java',
    title: 'Explain the contract between equals() and hashCode() in Java.',
    difficulty: 'INTERMEDIATE',
    answer:
      'The contract specifies: 1. If two objects are equal according to equals(), they MUST have the same hashCode(). 2. If two objects have the same hashCode(), they are NOT required to be equal according to equals() (hash collision). 3. If you override equals(), you MUST override hashCode() to prevent breaking hash-based collections like HashSet and HashMap.',
    codeExample: `@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    Employee employee = (Employee) o;
    return id == employee.id && Objects.equals(name, employee.name);
}

@Override
public int hashCode() {
    return Objects.hash(id, name);
}`,
    keyPoints: [
      'Breaking this contract causes HashMap to lose objects or store duplicate keys.',
      'Never use mutable fields in equals() or hashCode() when using objects as Map keys.',
    ],
    followUps: [
      {
        question: 'What happens if equals() is overridden but hashCode() is not?',
        answer: 'Two logically equal objects will produce different hash codes, ending up in different buckets in a HashSet/HashMap, causing duplicate entries.',
      },
    ],
    companies: ['TCS', 'Deloitte', 'Cognizant', 'HCL'],
    tags: ['Core Java', 'Collections', 'Object'],
  },
  {
    id: 'java-06',
    categoryId: 'prog-java',
    title: 'What is the difference between == and equals() in Java?',
    difficulty: 'BEGINNER',
    answer:
      '== is a reference equality operator that checks whether two object references point to the exact same physical memory address in the heap (or compares values for primitives). equals() is a method intended for logical value equality comparison, which can be overridden by classes like String and Integer.',
    codeExample: `String s1 = new String("Java");
String s2 = new String("Java");

System.out.println(s1 == s2);      // false (different heap references)
System.out.println(s1.equals(s2));  // true (same character content)`,
    keyPoints: [
      '== compares references; equals() compares content (if overridden).',
      'Object class default equals() implementation simply uses ==.',
    ],
    followUps: [
      {
        question: 'Why does "ABC" == "ABC" return true?',
        answer: 'Because string literals are placed in the String Pool and reused, pointing to the identical memory address.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Wipro', 'Capgemini'],
    tags: ['Core Java', 'Operators'],
  },
  {
    id: 'java-07',
    categoryId: 'prog-java',
    title: 'Explain Java Garbage Collection and the Generational Hypothesis.',
    difficulty: 'ADVANCED',
    answer:
      'Java Garbage Collection (GC) automatically frees heap memory occupied by unreachable objects. The Generational Hypothesis observes that most objects die young. Hence, the Java Heap is split into: Young Generation (Eden + 2 Survivor spaces S0, S1) and Old (Tenured) Generation. Minor GC collects dead objects in the Young Gen. Objects that survive multiple GC cycles are promoted to the Old Gen, collected via Major GC.',
    keyPoints: [
      'Stop-the-World (STW) pauses freeze application threads while GC determines live object graphs.',
      'Popular modern GC collectors: G1 (Garbage-First), ZGC (ultra-low latency <1ms STW), and Shenandoah.',
      'System.gc() requests garbage collection but does not guarantee immediate execution.',
    ],
    followUps: [
      {
        question: 'What are Strong, Soft, Weak, and Phantom references?',
        answer: 'Strong: never GCed if reachable. Soft: GCed only before OutOfMemoryError. Weak: GCed at next GC cycle. Phantom: used for post-mortem cleanup scheduling.',
      },
    ],
    companies: ['Infosys', 'Deloitte', 'HCL'],
    tags: ['JVM', 'Garbage Collection', 'Memory Management'],
  },
  {
    id: 'java-08',
    categoryId: 'prog-java',
    title: 'What is the difference between Stack and Heap memory in Java?',
    difficulty: 'BEGINNER',
    answer:
      'Stack memory is used for static memory allocation and execution of a thread. It stores primitive local variables and references to heap objects. Each thread has its own private stack. Heap memory is shared across all threads and stores all actual object instances and JRE classes. Stack is fast and LIFO; Heap is larger and managed by GC.',
    codeExample: `public void test() {
    int x = 10;                // Stored on the Stack
    Customer c = new Customer(); // 'c' reference is on Stack; Customer object is on Heap
}`,
    keyPoints: [
      'Stack overflow triggers java.lang.StackOverflowError (e.g., infinite recursion).',
      'Heap exhaustion triggers java.lang.OutOfMemoryError: Java heap space.',
      'Stack variables exist only during method execution scope.',
    ],
    followUps: [
      {
        question: 'What causes StackOverflowError in Java?',
        answer: 'Deep or infinite recursion where method call frames exceed the maximum call stack size allocated by JVM (-Xss).',
      },
    ],
    companies: ['TCS', 'Capgemini', 'Cognizant', 'Wipro'],
    tags: ['Memory', 'JVM', 'Stack vs Heap'],
  },
  {
    id: 'java-09',
    categoryId: 'prog-java',
    title: 'Explain the difference between final, finally, and finalize.',
    difficulty: 'BEGINNER',
    answer:
      'final is a keyword used as an access modifier (final variable cannot be reassigned, final method cannot be overridden, final class cannot be inherited). finally is a block used in exception handling that executes regardless of whether an exception is caught or thrown. finalize() was a method on java.lang.Object called by GC before destroying an object (deprecated in Java 9, removed in modern Java).',
    codeExample: `final int MAX = 100;

try {
    int res = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("Caught");
} finally {
    System.out.println("Always executed, e.g., closing file streams");
}`,
    keyPoints: [
      'finally block will NOT execute if System.exit(0) is called or if JVM crashes.',
      'try-with-resources (AutoCloseable) has largely replaced finally blocks for resource cleanup.',
    ],
    followUps: [
      {
        question: 'Does a finally block execute if there is a return statement inside the try block?',
        answer: 'Yes, the finally block will always execute before the method returns to the caller.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Accenture', 'Wipro'],
    tags: ['Keywords', 'Exception Handling'],
  },
  {
    id: 'java-10',
    categoryId: 'prog-java',
    title: 'What is the difference between Abstract Class and Interface in Java 8+?',
    difficulty: 'INTERMEDIATE',
    answer:
      'An abstract class can have instance state (fields), constructors, and any access modifiers (private, protected). A class can extend only one abstract class (single inheritance). An interface cannot hold instance state (only public static final constants), but since Java 8, it can contain default and static methods with bodies, and since Java 9, private methods. A class can implement multiple interfaces.',
    codeExample: `interface Vehicle {
    void start(); // abstract
    default void honk() { // default method Java 8+
        System.out.println("Beep Beep");
    }
}

abstract class MotorVehicle {
    protected int fuelLevel; // instance field
    public MotorVehicle(int fuel) { this.fuelLevel = fuel; }
    abstract void refuel();
}`,
    keyPoints: [
      'Use abstract class for code sharing among closely related classes (is-a relationship).',
      'Use interface to define a contract/capability across unrelated classes (can-do relationship).',
      'Java 8 introduced default methods to allow adding new methods to interfaces without breaking existing implementations.',
    ],
    followUps: [
      {
        question: 'How does Java resolve Diamond Problem if two interfaces have identical default methods?',
        answer: 'The implementing class MUST override the conflicting method and specify which interface to call via InterfaceName.super.methodName().',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini', 'Cognizant'],
    tags: ['OOPs', 'Interfaces', 'Java 8'],
  },
  {
    id: 'java-11',
    categoryId: 'prog-java',
    title: 'Explain Checked vs Unchecked Exceptions with examples.',
    difficulty: 'BEGINNER',
    answer:
      'Checked exceptions inherit from Exception (excluding RuntimeException) and are verified at compile time. The compiler forces you to handle them via try-catch or declare them using throws (e.g., IOException, SQLException). Unchecked exceptions inherit from RuntimeException and occur during program execution, representing programming bugs like NullPointerException or ArrayIndexOutOfBoundsException.',
    keyPoints: [
      'Checked exceptions represent recoverable external conditions (e.g., file not found).',
      'Unchecked exceptions represent logical programming bugs that should be fixed rather than caught.',
      'Errors (e.g., OutOfMemoryError) inherit from Throwable and should not be caught by applications.',
    ],
    followUps: [
      {
        question: 'Can we catch java.lang.Error?',
        answer: 'Syntactically yes, because Error inherits from Throwable, but it is bad practice because Errors indicate fatal system failures.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Wipro', 'HCL'],
    tags: ['Exceptions', 'Core Java'],
  },
  {
    id: 'java-12',
    categoryId: 'prog-java',
    title: 'How does try-with-resources work in Java 7+?',
    difficulty: 'INTERMEDIATE',
    answer:
      'try-with-resources is a statement that declares one or more resources (objects implementing java.lang.AutoCloseable or java.io.Closeable). When the try block finishes or an exception occurs, the JVM automatically calls close() on all opened resources in reverse order of declaration, eliminating boilerplate finally blocks.',
    codeExample: `try (BufferedReader br = new BufferedReader(new FileReader("data.txt"));
     Connection conn = DriverManager.getConnection(url)) {
    String line = br.readLine();
} catch (IOException | SQLException e) {
    e.printStackTrace();
} // br and conn are automatically and safely closed here`,
    keyPoints: [
      'Suppressed exceptions: If an exception occurs in the try block and during auto-close, the close exception is added to suppressed exceptions rather than masking the primary failure.',
      'Any custom class can be used if it implements AutoCloseable.',
    ],
    followUps: [
      {
        question: 'What interface must a resource implement to be used in try-with-resources?',
        answer: 'java.lang.AutoCloseable (or java.io.Closeable).',
      },
    ],
    companies: ['Infosys', 'Deloitte', 'Cognizant'],
    tags: ['Exception Handling', 'IO'],
  },
  {
    id: 'java-13',
    categoryId: 'prog-java',
    title: 'What is the difference between ArrayList and LinkedList in Java?',
    difficulty: 'INTERMEDIATE',
    answer:
      'ArrayList is backed by a dynamic resizable array. It offers fast O(1) random access by index via direct memory offset, but slow O(n) element insertion/deletion in the middle due to element shifting. LinkedList is backed by a doubly linked list. It provides O(1) insertion/deletion at pointers, but slow O(n) indexed access because it must traverse node by node. ArrayList also has better CPU cache locality.',
    keyPoints: [
      'ArrayList memory overhead is small (unused buffer capacity).',
      'LinkedList memory overhead is high (each node allocates prev, next pointers and object wrapper).',
      'In practical benchmarks, ArrayList usually outperforms LinkedList even for insertions due to CPU L1/L2 cache locality.',
    ],
    followUps: [
      {
        question: 'How does ArrayList increase its size when full?',
        answer: 'In Java 8+, it grows by 50% of its current capacity (newCapacity = oldCapacity + (oldCapacity >> 1)) using Arrays.copyOf.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro'],
    tags: ['Collections', 'ArrayList', 'LinkedList'],
  },
  {
    id: 'java-14',
    categoryId: 'prog-java',
    title: 'What is ConcurrentHashMap and how does it achieve thread safety?',
    difficulty: 'ADVANCED',
    answer:
      'ConcurrentHashMap provides high-concurrency access without locking the entire map like Hashtable or Collections.synchronizedMap. In Java 7, it used Segment Locking (16 independent ReentrantLocks). In Java 8+, it replaced segments with CAS (Compare-And-Swap) lock-free atomic instructions for insertions into empty buckets, and synchronized blocks locked strictly to the specific bucket head node for collisions, allowing concurrent reads and writes across separate buckets.',
    keyPoints: [
      'Reads (get) are completely non-blocking and do not acquire locks.',
      'Null keys and null values are NOT permitted (to avoid ambiguity in concurrent environments).',
      'Iterators are weakly consistent and never throw ConcurrentModificationException.',
    ],
    followUps: [
      {
        question: 'Why doesn’t ConcurrentHashMap allow null keys or values?',
        answer: 'In a multithreaded map, returning null from map.get(k) creates ambiguity: does the key not exist, or is its value null? You cannot call containsKey(k) reliably because another thread could have modified the map in between.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'InfoCepts'],
    tags: ['Concurrency', 'Collections', 'ConcurrentHashMap'],
  },
  {
    id: 'java-15',
    categoryId: 'prog-java',
    title: 'Explain the difference between Comparable and Comparator.',
    difficulty: 'INTERMEDIATE',
    answer:
      'Comparable interface provides natural ordering for a class by implementing compareTo(T o) inside the target class itself. Comparator provides custom/multiple ordering sequences by implementing compare(T o1, T o2) in separate classes or lambda expressions, without modifying the target class.',
    codeExample: `// Comparable: Natural sorting by ID
class Employee implements Comparable<Employee> {
    int id;
    public int compareTo(Employee o) { return this.id - o.id; }
}

// Comparator: Custom sorting by Name
Comparator<Employee> byName = (e1, e2) -> e1.name.compareTo(e2.name);
list.sort(byName);`,
    keyPoints: [
      'Comparable is in java.lang package; Comparator is in java.util package.',
      'Use Comparable for default sorting; use Comparator for multiple sort strategies (e.g. by salary, by date).',
    ],
    followUps: [
      {
        question: 'Can you sort a list of employees using multiple criteria with Java 8 Comparator?',
        answer: 'Yes, using Comparator.comparing(Employee::getDepartment).thenComparing(Employee::getSalary).',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini'],
    tags: ['Collections', 'Sorting'],
  },
  {
    id: 'java-16',
    categoryId: 'prog-java',
    title: 'What are Generics in Java and what is Type Erasure?',
    difficulty: 'ADVANCED',
    answer:
      'Generics provide compile-time type safety by allowing classes and methods to operate on parameterized types. Type Erasure is the compiler process where type parameters (e.g. <T>, <String>) are stripped during compilation and replaced with their raw bounds (Object or first bound), inserting explicit type casts where necessary. This ensures backward compatibility with pre-Java 5 bytecode.',
    codeExample: `List<String> list = new ArrayList<>();
list.add("Hello");
String s = list.get(0);

// After Type Erasure, bytecode looks like:
List list = new ArrayList();
list.add("Hello");
String s = (String) list.get(0);`,
    keyPoints: [
      'Generics exist only at compile time; at runtime, List<String> and List<Integer> are both just raw List.',
      'Cannot instantiate generic types directly: new T() is invalid.',
      'Cannot create generic arrays: new T[10] is disallowed.',
    ],
    followUps: [
      {
        question: 'What is the PECS rule in Java Generics?',
        answer: 'Producer Extends, Consumer Super. Use <? extends T> when reading data from a collection, and <? super T> when writing data into a collection.',
      },
    ],
    companies: ['Deloitte', 'Infosys'],
    tags: ['Generics', 'Type Erasure'],
  },
  {
    id: 'java-17',
    categoryId: 'prog-java',
    title: 'Explain the Thread Lifecycle in Java.',
    difficulty: 'INTERMEDIATE',
    answer:
      'A thread in Java transitions through 6 distinct states in Thread.State enum: 1. NEW (thread created, start() not yet called), 2. RUNNABLE (ready to run or executing on CPU), 3. BLOCKED (waiting to acquire a monitor lock), 4. WAITING (waiting indefinitely for another thread via wait() or join()), 5. TIMED_WAITING (waiting with a timeout like sleep(ms) or wait(ms)), 6. TERMINATED (execution completed or unhandled exception).',
    keyPoints: [
      'Calling start() allocates native OS thread resources and schedules run().',
      'Calling run() directly just executes the method sequentially in the current thread without creating a new thread.',
    ],
    followUps: [
      {
        question: 'What happens if you invoke thread.start() twice on the same thread instance?',
        answer: 'It throws java.lang.IllegalThreadStateException because a thread cannot be restarted once initiated.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro'],
    tags: ['Multithreading', 'Concurrency'],
  },
  {
    id: 'java-18',
    categoryId: 'prog-java',
    title: 'What does the volatile keyword do in Java?',
    difficulty: 'ADVANCED',
    answer:
      'The volatile keyword guarantees visibility and ordering across threads. When a variable is declared volatile, all reads and writes are performed directly to and from main memory (RAM) rather than CPU thread-local caches, preventing dirty reads. It also establishes a happens-before relationship, preventing compiler instruction reordering.',
    codeExample: `private volatile boolean keepRunning = true;

public void stop() { keepRunning = false; }
public void run() {
    while (keepRunning) { /* execute */ }
}`,
    keyPoints: [
      'volatile guarantees VISIBILITY, but NOT ATOMICITY (count++ is still not thread-safe).',
      'For compound atomic operations, use AtomicInteger or synchronized locks.',
    ],
    followUps: [
      {
        question: 'Why is volatile count++ not thread-safe?',
        answer: 'Because count++ consists of 3 distinct machine operations: read count, increment value, write count back. Two threads can interleave these operations.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Cognizant'],
    tags: ['Concurrency', 'Volatile', 'Memory Model'],
  },
  {
    id: 'java-19',
    categoryId: 'prog-java',
    title: 'Explain the difference between wait(), notify(), and Thread.sleep().',
    difficulty: 'INTERMEDIATE',
    answer:
      'Thread.sleep(ms) is a static method of Thread that pauses the current thread for a specified duration WITHOUT releasing any acquired monitor locks. wait() and notify() are methods of java.lang.Object used for inter-thread communication. wait() causes the thread to pause AND RELEASES the monitor lock on the target object, waiting until another thread calls notify() or notifyAll() on that same object.',
    keyPoints: [
      'wait() and notify() MUST be called inside a synchronized block or method, otherwise IllegalMonitorStateException is thrown.',
      'sleep() can be called anywhere and does not require synchronization.',
    ],
    followUps: [
      {
        question: 'Why are wait() and notify() defined in Object class instead of Thread class?',
        answer: 'Because locks in Java are associated with individual objects (monitors), not threads.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Wipro', 'HCL'],
    tags: ['Multithreading', 'Synchronization'],
  },
  {
    id: 'java-20',
    categoryId: 'prog-java',
    title: 'What is ExecutorService and what are the key thread pool implementations?',
    difficulty: 'INTERMEDIATE',
    answer:
      'ExecutorService is a higher-level framework in java.util.concurrent that manages thread pools and asynchronous task execution, decoupling task submission from thread management. Built-in pools via Executors: 1. newFixedThreadPool(n) (fixed size pool with unbounded queue), 2. newCachedThreadPool() (dynamic pool that creates new threads as needed and reclaims idle threads), 3. newSingleThreadExecutor() (sequential execution), 4. newScheduledThreadPool() (periodic tasks).',
    codeExample: `ExecutorService executor = Executors.newFixedThreadPool(4);
executor.submit(() -> {
    System.out.println("Executing task in pool: " + Thread.currentThread().getName());
});
executor.shutdown();`,
    keyPoints: [
      'Always shut down executors using shutdown() or shutdownNow() to allow the JVM process to terminate.',
      'In production, prefer constructing ThreadPoolExecutor directly to avoid OutOfMemoryError from unbounded LinkedBlockingQueue in newFixedThreadPool.',
    ],
    followUps: [
      {
        question: 'What are the 4 core parameters of ThreadPoolExecutor?',
        answer: 'corePoolSize, maximumPoolSize, keepAliveTime, and workQueue (BlockingQueue).',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Cognizant'],
    tags: ['Concurrency', 'ExecutorService'],
  },
  {
    id: 'java-21',
    categoryId: 'prog-java',
    title: 'What are Lambda Expressions and Functional Interfaces in Java 8?',
    difficulty: 'BEGINNER',
    answer:
      'A Functional Interface is an interface that contains exactly one abstract method (SAM - Single Abstract Method), optionally annotated with @FunctionalInterface (e.g. Runnable, Callable, Comparator). Lambda expressions provide a concise, anonymous syntax to instantiate functional interfaces without verbose anonymous inner classes.',
    codeExample: `// Before Java 8:
Runnable r1 = new Runnable() {
    @Override
    public void run() { System.out.println("Running"); }
};

// With Java 8 Lambda:
Runnable r2 = () -> System.out.println("Running");`,
    keyPoints: [
      'Standard java.util.function interfaces: Predicate<T> (boolean test), Function<T,R> (transform), Consumer<T> (accept, no return), Supplier<T> (supply, no input).',
      'Lambdas enable functional programming paradigms in Java.',
    ],
    followUps: [
      {
        question: 'Can a functional interface have default or static methods?',
        answer: 'Yes, it can have any number of default or static methods as long as it has exactly ONE abstract method.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Deloitte'],
    tags: ['Java 8', 'Lambdas', 'Functional'],
  },
  {
    id: 'java-22',
    categoryId: 'prog-java',
    title: 'Explain the Java 8 Stream API: Intermediate vs Terminal Operations.',
    difficulty: 'INTERMEDIATE',
    answer:
      'The Stream API processes sequences of elements declaratively. Intermediate operations (filter, map, sorted, distinct) transform a stream into another stream and are LAZY—they do not execute until a terminal operation is called. Terminal operations (collect, forEach, reduce, count, findFirst) trigger stream pipeline processing and produce a result or side-effect, closing the stream.',
    codeExample: `List<String> names = Arrays.asList("Alex", "Bob", "Alice", "David");
List<String> result = names.stream()
    .filter(n -> n.startsWith("A")) // Intermediate
    .map(String::toUpperCase)        // Intermediate
    .sorted()                       // Intermediate
    .collect(Collectors.toList());   // Terminal`,
    keyPoints: [
      'Streams cannot be reused once a terminal operation has been executed.',
      'Streams do not store data; they operate on existing collections or sources.',
      'parallelStream() utilizes the common ForkJoinPool for multicore processing.',
    ],
    followUps: [
      {
        question: 'What is short-circuiting in streams?',
        answer: 'Operations like findFirst(), anyMatch(), or limit(n) that terminate stream traversal early once the condition is satisfied without inspecting all elements.',
      },
    ],
    companies: ['Infosys', 'Deloitte', 'Cognizant', 'InfoCepts'],
    tags: ['Java 8', 'Streams', 'Functional'],
  },
  {
    id: 'java-23',
    categoryId: 'prog-java',
    title: 'What is Optional in Java 8 and when should you use it?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Optional<T> is a container object which may or may not contain a non-null value, designed to provide a clear, type-level representation of absence and prevent NullPointerExceptions. It should be used primarily as a method return type where null signifies the valid absence of a result.',
    codeExample: `public Optional<User> findUserById(String id) {
    User user = database.get(id);
    return Optional.ofNullable(user);
}

// Consuming:
String name = findUserById("123")
    .map(User::getName)
    .orElse("Guest User");`,
    keyPoints: [
      'Do NOT use Optional for class fields or method parameters (it is not Serializable and increases memory overhead).',
      'Never call optional.get() without checking isPresent(); prefer orElse(), orElseGet(), or orElseThrow().',
    ],
    followUps: [
      {
        question: 'What is the difference between orElse() and orElseGet()?',
        answer: 'orElse(defaultVal) evaluates the fallback value eagerly even if Optional has a value. orElseGet(supplier) evaluates lazily only when Optional is empty.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['Java 8', 'Optional', 'Null Safety'],
  },
  {
    id: 'java-24',
    categoryId: 'prog-java',
    title: 'What causes Memory Leaks in Java and how do you prevent them?',
    difficulty: 'ADVANCED',
    answer:
      'A memory leak occurs when unused objects remain reachable in the heap because obsolete references are unintentionally retained, preventing GC reclamation. Common causes: 1. Static fields holding collections that grow indefinitely, 2. Unclosed resources (connections, file streams), 3. Listeners/callbacks not un-registered, 4. Improper hashCode() or equals() implementations causing HashMap keys to multiply, 5. ThreadLocal variables not removed.',
    keyPoints: [
      'Use memory profilers like VisualVM, JProfiler, or Eclipse MAT to inspect heap dumps.',
      'Always call ThreadLocal.remove() when using thread pools to avoid thread-retained memory leaks.',
    ],
    followUps: [
      {
        question: 'How do you generate a heap dump when an OutOfMemoryError occurs?',
        answer: 'Pass the JVM flag: -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/dumps/heap.hprof.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'InfoCepts'],
    tags: ['JVM', 'Memory Leaks', 'Performance'],
  },
  {
    id: 'java-25',
    categoryId: 'prog-java',
    title: 'What is Serialization and what is the role of serialVersionUID?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Serialization is the mechanism of converting the state of an object into a byte stream to persist to disk or transmit across a network. Deserialization reverses this. serialVersionUID is a unique universal version identifier for a Serializable class. During deserialization, JVM verifies that the sender and receiver have loaded classes for that object that have compatible serialVersionUIDs. If mismatched, InvalidClassException is thrown.',
    codeExample: `public class Student implements Serializable {
    private static final long serialVersionUID = 1L;
    private String name;
    private transient String password; // Not serialized!
}`,
    keyPoints: [
      'Fields marked transient or static are NOT serialized.',
      'Always declare explicit serialVersionUID to avoid accidental deserialization failure after code recompilation.',
    ],
    followUps: [
      {
        question: 'What happens if a class implements Serializable but has a non-serializable member field?',
        answer: 'It throws NotSerializableException at runtime during ObjectOutputStream.writeObject().',
      },
    ],
    companies: ['TCS', 'Infosys', 'Wipro'],
    tags: ['Serialization', 'Core Java'],
  },
  {
    id: 'java-26',
    categoryId: 'prog-java',
    title: 'What are Virtual Threads introduced in Java 21 (Project Loom)?',
    difficulty: 'ADVANCED',
    answer:
      'Virtual Threads are lightweight threads managed entirely by the JVM rather than the host OS. While traditional platform threads map 1:1 to costly OS kernel threads (~1MB stack), millions of virtual threads can run concurrently on a handful of carrier OS threads. When a virtual thread blocks on I/O (network/disk), the JVM unmounts it from the carrier thread, freeing the OS thread to do other work.',
    codeExample: `// Spawning a virtual thread in Java 21:
Thread.startVirtualThread(() -> {
    System.out.println("Running on virtual thread: " + Thread.currentThread());
});

// Or using an Executor:
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    IntStream.range(0, 10_000).forEach(i -> executor.submit(() -> doNetworkCall()));
}`,
    keyPoints: [
      'Dramatic throughput improvement for I/O-bound web servers without rewriting code into complex reactive style.',
      'Virtual thread stacks are stored in the JVM heap and expand dynamically.',
      'Not beneficial for CPU-intensive tasks (number crunching).',
    ],
    followUps: [
      {
        question: 'What is "pinning" a virtual thread in Java 21?',
        answer: 'When a virtual thread executes inside a synchronized block or native method, it cannot unmount from its carrier thread, temporarily degrading scalability.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts', 'Infosys'],
    tags: ['Java 21', 'Virtual Threads', 'Concurrency'],
  },
  {
    id: 'java-27',
    categoryId: 'prog-java',
    title: 'What are Records in modern Java (Java 14+)?',
    difficulty: 'INTERMEDIATE',
    answer:
      'A Record is a special, immutable data carrier class in Java that eliminates boilerplate POJO code. By declaring a record, the compiler automatically generates private final fields, a canonical constructor, getter methods (without "get" prefix), equals(), hashCode(), and toString().',
    codeExample: `// Traditional POJO requires 40 lines of boilerplate.
// Record declaration in 1 line:
public record Person(String name, int age) {
    // Optional compact constructor for validation
    public Person {
        if (age < 0) throw new IllegalArgumentException("Age cannot be negative");
    }
}`,
    keyPoints: [
      'Records are implicitly final and cannot extend any class (they extend java.lang.Record).',
      'All component fields are final; records cannot have instance fields other than record components.',
      'Can implement interfaces.',
    ],
    followUps: [
      {
        question: 'Can you add custom methods inside a record?',
        answer: 'Yes, records can contain instance methods, static fields, and static methods.',
      },
    ],
    companies: ['Deloitte', 'Cognizant', 'Infosys'],
    tags: ['Modern Java', 'Records', 'OOPs'],
  },
  {
    id: 'java-28',
    categoryId: 'prog-java',
    title: 'Explain method overloading vs method overriding with rules.',
    difficulty: 'BEGINNER',
    answer:
      'Method Overloading occurs within the same class when methods share the same name but differ in parameter count, types, or order (compile-time polymorphism). Method Overriding occurs across a superclass and subclass where the subclass provides a specific implementation of a method with the exact same name, parameters, and return type (or covariant return type) (run-time polymorphism).',
    keyPoints: [
      'Overloading: return type alone cannot be used to distinguish overloaded methods.',
      'Overriding: cannot reduce method visibility (e.g., overriding a public method as protected is illegal).',
      'Overriding: cannot throw broader checked exceptions than the superclass method.',
      'private, static, and final methods cannot be overridden.',
    ],
    followUps: [
      {
        question: 'Can we override static methods in Java?',
        answer: 'No, static methods are resolved at compile-time by reference type. Defining the same static method in a subclass is Method Hiding, not overriding.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro', 'HCL'],
    tags: ['OOPs', 'Polymorphism'],
  },
  {
    id: 'java-29',
    categoryId: 'prog-java',
    title: 'What is the Reflection API in Java and what are its drawbacks?',
    difficulty: 'ADVANCED',
    answer:
      'Reflection is a Java feature (in java.lang.reflect) that allows an application to inspect and manipulate classes, interfaces, constructors, methods, and fields at runtime, even bypassing private access specifiers via setAccessible(true). It is heavily used by frameworks like Spring (dependency injection) and Hibernate (ORM).',
    keyPoints: [
      'Drawbacks: 1. Performance overhead (dynamic resolution bypasses JIT compiler optimizations), 2. Security restrictions, 3. Breaks encapsulation and OOP safety, 4. Loss of compile-time type checking.',
    ],
    followUps: [
      {
        question: 'How does Spring Framework use Reflection?',
        answer: 'Spring scans classes for annotations like @Autowired and @Component, reflects their fields/constructors, and injects dependencies at startup.',
      },
    ],
    companies: ['Deloitte', 'Infosys'],
    tags: ['Reflection', 'Frameworks'],
  },
  {
    id: 'java-30',
    categoryId: 'prog-java',
    title: 'What is the Diamond Problem and how does Java avoid it in multiple inheritance?',
    difficulty: 'BEGINNER',
    answer:
      'The Diamond Problem arises when a class inherits from two parent classes that both implement the same method, creating ambiguity about which parent method to invoke. Java avoids this for classes by disallowing multiple class inheritance (a class can only extend one class). For interfaces with default methods in Java 8+, Java forces the implementing class to explicitly override the conflicting method.',
    codeExample: `interface A { default void show() { System.out.println("A"); } }
interface B { default void show() { System.out.println("B"); } }

class C implements A, B {
    // Compiler error unless resolved explicitly:
    @Override
    public void show() {
        A.super.show(); // Explicit resolution
    }
}`,
    keyPoints: [
      'Java classes support single inheritance of state.',
      'Java interfaces support multiple inheritance of behavior with explicit compile-time resolution.',
    ],
    followUps: [
      {
        question: 'Why does C++ allow multiple inheritance while Java did not initially?',
        answer: 'To prevent complexity, virtual base table overhead, and ambiguity bugs inherent in C++ virtual inheritance.',
      },
    ],
    companies: ['TCS', 'Capgemini', 'Cognizant'],
    tags: ['OOPs', 'Inheritance'],
  },
  {
    id: 'java-31',
    categoryId: 'prog-java',
    title: 'Explain the difference between fail-fast and fail-safe iterators.',
    difficulty: 'INTERMEDIATE',
    answer:
      'Fail-fast iterators (e.g. in ArrayList, HashMap, HashSet) operate directly on the collection. They immediately throw ConcurrentModificationException if the collection is structurally modified during iteration (detected via modCount flag) other than through the iterator’s own remove() method. Fail-safe / Weakly-consistent iterators (e.g. in CopyOnWriteArrayList, ConcurrentHashMap) operate on a clone or snapshot of the collection and never throw ConcurrentModificationException.',
    keyPoints: [
      'Fail-fast: throws ConcurrentModificationException early to prevent unpredictable bugs.',
      'Fail-safe: does not throw exception, but may not reflect latest additions during iteration.',
    ],
    followUps: [
      {
        question: 'How do you safely remove elements during iteration with a fail-fast collection?',
        answer: 'Use iterator.remove() instead of collection.remove().',
      },
    ],
    companies: ['Infosys', 'Deloitte', 'Cognizant'],
    tags: ['Collections', 'Iterators'],
  },
  {
    id: 'java-32',
    categoryId: 'prog-java',
    title: 'What is CopyOnWriteArrayList and when should it be used?',
    difficulty: 'INTERMEDIATE',
    answer:
      'CopyOnWriteArrayList is a thread-safe variant of ArrayList where all mutative operations (add, set, remove) make a fresh copy of the underlying array. Read operations are extremely fast and never require locks or synchronization because they operate on an immutable snapshot. It is ideal for read-heavy, write-rare scenarios like event listener registries.',
    keyPoints: [
      'Very expensive for write operations due to full array cloning.',
      'Iterators do not support mutative remove() and never throw ConcurrentModificationException.',
    ],
    followUps: [
      {
        question: 'What is the performance implication if you perform 10,000 adds on CopyOnWriteArrayList?',
        answer: 'Severe performance degradation (O(n^2) total work) due to copying the array 10,000 times.',
      },
    ],
    companies: ['Deloitte', 'Infosys'],
    tags: ['Concurrency', 'Collections'],
  },
  {
    id: 'java-33',
    categoryId: 'prog-java',
    title: 'What is the difference between synchronized method and synchronized block?',
    difficulty: 'INTERMEDIATE',
    answer:
      'A synchronized method locks the entire object (this for instance methods, Class object for static methods) for the entire duration of the method execution. A synchronized block locks only a specific critical section of code on a designated object monitor, providing finer-grained concurrency and reducing thread contention.',
    codeExample: `// Synchronized block with custom lock object
private final Object lock = new Object();

public void updateData() {
    // Non-critical operations run concurrently
    prepareData();
    synchronized (lock) {
        // Only critical section is synchronized
        sharedCount++;
    }
}`,
    keyPoints: [
      'Prefer synchronized blocks over synchronized methods to reduce lock contention.',
      'Never synchronize on a String literal or boxed primitive because their pool instances are shared globally.',
    ],
    followUps: [
      {
        question: 'What happens if a thread holding a lock enters another synchronized method on the same object?',
        answer: 'It enters without deadlock because Java synchronized locks are reentrant.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini'],
    tags: ['Multithreading', 'Synchronization'],
  },
  {
    id: 'java-34',
    categoryId: 'prog-java',
    title: 'What is ReentrantLock and how does it compare to synchronized?',
    difficulty: 'ADVANCED',
    answer:
      'ReentrantLock is an implementation of Lock in java.util.concurrent.locks offering advanced capabilities over synchronized: 1. Fair locking option (grants lock to longest-waiting thread), 2. tryLock() (attempt lock without blocking indefinitely), 3. lockInterruptibly() (responsive to thread interruption), 4. Multiple Condition variables (await/signal). However, you must explicitly unlock inside a finally block.',
    codeExample: `ReentrantLock lock = new ReentrantLock();
lock.lock();
try {
    // Critical section
} finally {
    lock.unlock(); // Always release in finally block
}`,
    keyPoints: [
      'Synchronized is simpler and automatically releases locks on exceptions.',
      'ReentrantLock provides timed tryLock(timeout, unit) preventing deadlocks.',
    ],
    followUps: [
      {
        question: 'What is lock fairness in ReentrantLock?',
        answer: 'When set to true (new ReentrantLock(true)), threads acquire the lock in FIFO arrival order, avoiding thread starvation at the expense of lower throughput.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'InfoCepts'],
    tags: ['Concurrency', 'ReentrantLock'],
  },
  {
    id: 'java-35',
    categoryId: 'prog-java',
    title: 'What is Deadlock and how can it be detected and prevented in Java?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Deadlock is a condition where two or more threads are permanently blocked, each waiting for a lock held by the other (e.g. Thread 1 holds Lock A, wants Lock B; Thread 2 holds Lock B, wants Lock A). Prevention: 1. Always acquire locks in a globally consistent order, 2. Use tryLock() with timeouts instead of blocking locks, 3. Keep critical sections short. Detection: JConsole, jcmd, or ThreadMXBean.findDeadlockedThreads().',
    keyPoints: [
      'The four Coffman conditions for deadlock: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.',
      'Breaking any one condition prevents deadlock.',
    ],
    followUps: [
      {
        question: 'How do you detect deadlock in a running production JVM without restarting?',
        answer: 'Take a thread dump using jcmd <pid> Thread.print or kill -3 <pid> and look for "Found one Java-level deadlock:".',
      },
    ],
    companies: ['Infosys', 'Deloitte', 'TCS', 'HCL'],
    tags: ['Concurrency', 'Deadlock'],
  },
  {
    id: 'java-36',
    categoryId: 'prog-java',
    title: 'Explain the Java Collections Framework hierarchy.',
    difficulty: 'BEGINNER',
    answer:
      'The Java Collections Framework root interfaces: Iterable -> Collection -> List (ordered, indexed, duplicates allowed: ArrayList, LinkedList, Vector), Set (unique elements: HashSet, LinkedHashSet, TreeSet), Queue (FIFO processing: LinkedList, PriorityQueue, ArrayDeque). Map is an independent hierarchy not inheriting from Collection (key-value pairs: HashMap, LinkedHashMap, TreeMap, ConcurrentHashMap).',
    keyPoints: [
      'List allows duplicate elements and maintains insertion order.',
      'Set does not allow duplicates; TreeSet maintains sorted order via red-black tree.',
      'Map maps keys to values; keys must be unique.',
    ],
    followUps: [
      {
        question: 'Why doesn’t Map inherit from Collection interface?',
        answer: 'Because Collection deals with single elements, whereas Map deals with key-value pairs; method signatures like add(E) do not fit Map.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Wipro', 'Capgemini'],
    tags: ['Collections', 'Architecture'],
  },
  {
    id: 'java-37',
    categoryId: 'prog-java',
    title: 'What is the difference between HashSet, LinkedHashSet, and TreeSet?',
    difficulty: 'INTERMEDIATE',
    answer:
      'HashSet is backed by a HashMap; provides O(1) time complexity for add/contains/remove, but gives no ordering guarantees. LinkedHashSet is backed by a linked hash map; maintains insertion order with O(1) performance and slight memory overhead. TreeSet is backed by a Red-Black Tree (NavigableMap); elements are stored in sorted ascending order with O(log n) performance.',
    keyPoints: [
      'HashSet allows one null element; TreeSet does NOT allow null (throws NullPointerException on comparison).',
      'Use HashSet for fast unordered lookups, LinkedHashSet for insertion-order preservation, TreeSet for sorted traversal.',
    ],
    followUps: [
      {
        question: 'How does HashSet ensure uniqueness internally?',
        answer: 'It stores elements as keys in a backing HashMap with a dummy Object as the value.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Cognizant'],
    tags: ['Collections', 'Set'],
  },
  {
    id: 'java-38',
    categoryId: 'prog-java',
    title: 'What are CompletableFuture and asynchronous pipelines in Java 8+?',
    difficulty: 'ADVANCED',
    answer:
      'CompletableFuture implements Future and CompletionStage, allowing non-blocking asynchronous programming where tasks can be chained, composed, and combined without blocking thread execution. Methods like thenApply (transform), thenAccept (consume), and thenCompose (flat-map) attach callbacks executed when the upstream future completes.',
    codeExample: `CompletableFuture.supplyAsync(() -> fetchUserData(userId))
    .thenApply(user -> calculateRiskScore(user))
    .thenAccept(score -> sendAlert(score))
    .exceptionally(ex -> {
        log.error("Pipeline failed", ex);
        return null;
    });`,
    keyPoints: [
      'Runs tasks on ForkJoinPool.commonPool() by default, or an explicit Executor.',
      'CompletableFuture.allOf() coordinates multiple parallel futures before continuing.',
    ],
    followUps: [
      {
        question: 'What is the difference between thenApply() and thenCompose()?',
        answer: 'thenApply transforms the value (T -> U). thenCompose flattens another CompletableFuture (T -> CompletableFuture<U>), avoiding nested CompletableFuture<CompletableFuture<U>>.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts', 'Infosys'],
    tags: ['Concurrency', 'CompletableFuture', 'Java 8'],
  },
  {
    id: 'java-39',
    categoryId: 'prog-java',
    title: 'What is the static keyword in Java and how does class loading work?',
    difficulty: 'BEGINNER',
    answer:
      'The static keyword indicates that a member (variable, method, block, or nested class) belongs to the class itself rather than any specific instance. Static members are initialized when the class is loaded into memory by the ClassLoader. Static methods can only access other static members directly and cannot use this or super.',
    codeExample: `public class Counter {
    public static int count = 0; // Shared across all instances
    static {
        // Static initializer block executed once on class load
        count = 100;
    }
}`,
    keyPoints: [
      'Static variables are stored in Metaspace (formerly PermGen).',
      'Class loader hierarchy: Bootstrap ClassLoader -> Platform/Extension ClassLoader -> Application/System ClassLoader.',
    ],
    followUps: [
      {
        question: 'Can you override a private or static method in Java?',
        answer: 'No, static methods are hidden, and private methods are not visible to subclasses.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Wipro', 'Capgemini'],
    tags: ['Static', 'Class Loading', 'OOPs'],
  },
  {
    id: 'java-40',
    categoryId: 'prog-java',
    title: 'What are Java Annotations and how do custom annotations work?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Annotations are a form of metadata added to Java code that provide data about a program without being part of the program execution logic. They are declared with @interface and configured with meta-annotations: @Retention (SOURCE, CLASS, or RUNTIME) and @Target (METHOD, FIELD, TYPE, etc.). Runtime annotations are readable via Reflection.',
    codeExample: `@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface AuditLog {
    String action() default "DEFAULT_ACTION";
}`,
    keyPoints: [
      'RetentionPolicy.RUNTIME retains the annotation in bytecode for reflection at runtime.',
      'RetentionPolicy.SOURCE discards the annotation after compilation (e.g., @Override, @SuppressWarnings).',
    ],
    followUps: [
      {
        question: 'What does @Inherited do on an annotation?',
        answer: 'It marks that the annotation on a class should automatically be inherited by subclasses.',
      },
    ],
    companies: ['Infosys', 'Deloitte'],
    tags: ['Annotations', 'Metadata'],
  },
  {
    id: 'java-41',
    categoryId: 'prog-java',
    title: 'What is the difference between throw and throws in Java?',
    difficulty: 'BEGINNER',
    answer:
      'throw is a keyword used inside a method body to explicitly throw an exception object (e.g. throw new IllegalArgumentException("Invalid")). throws is a keyword used in a method signature to declare that this method may throw one or more checked exceptions, delegating handling to the caller.',
    codeExample: `public void readFile(String path) throws IOException { // throws in signature
    if (path == null) {
        throw new IllegalArgumentException("Path null"); // throw inside body
    }
}`,
    keyPoints: [
      'throw throws an instance; throws lists exception classes.',
      'throws is mandatory for unhandled checked exceptions.',
    ],
    followUps: [
      {
        question: 'Can you re-throw an exception caught in a catch block?',
        answer: 'Yes, inside a catch block you can write throw e; or wrap it in a custom exception.',
      },
    ],
    companies: ['TCS', 'Wipro', 'HCL'],
    tags: ['Exceptions', 'Keywords'],
  },
  {
    id: 'java-42',
    categoryId: 'prog-java',
    title: 'What is the JIT Compiler in JVM and how does HotSpot optimize code?',
    difficulty: 'ADVANCED',
    answer:
      'The JIT (Just-In-Time) compiler dynamically translates frequently executed bytecode ("hot spots") into native machine code at runtime. The JVM starts in interpreted mode for fast startup. When method call or loop counters exceed a threshold, JIT compiles the bytecode using C1 (Client compiler - fast compilation, basic optimizations) and C2 (Server compiler - aggressive optimizations like method inlining, loop unrolling, and escape analysis).',
    keyPoints: [
      'Tiered Compilation combines C1 and C2 for optimal startup and peak performance.',
      'Escape Analysis determines if an object is thread-confined, allowing scalar replacement on the stack instead of heap allocation.',
    ],
    followUps: [
      {
        question: 'What is dead code elimination in JIT compilation?',
        answer: 'Removing code that produces values never read or executing branches that can never be reached.',
      },
    ],
    companies: ['Infosys', 'Deloitte'],
    tags: ['JVM', 'JIT Compiler', 'Performance'],
  },
  {
    id: 'java-43',
    categoryId: 'prog-java',
    title: 'What is the difference between Shallow Copy and Deep Copy in Java?',
    difficulty: 'INTERMEDIATE',
    answer:
      'A Shallow copy copies the field values of an object; if a field is a reference to another object, only the memory reference address is copied, meaning both copies point to the same child object. A Deep copy recursively clones the parent object along with all referenced child objects, creating a completely independent object graph.',
    codeExample: `// Shallow copy via Object.clone():
Employee copy = (Employee) this.clone(); // Address reference is shared!

// Deep copy:
Employee copy = new Employee(this.id, new Address(this.address.getCity()));`,
    keyPoints: [
      'Default Object.clone() creates a shallow copy and requires Cloneable interface.',
      'Deep copy can be implemented via copy constructors, serialization/deserialization, or libraries like Jackson/Gson.',
    ],
    followUps: [
      {
        question: 'Why is Object.clone() considered flawed in Java?',
        answer: 'It bypasses constructor execution, requires casting from Object, throws CloneNotSupportedException, and performs only shallow copies by default.',
      },
    ],
    companies: ['HCL', 'Infosys', 'Capgemini'],
    tags: ['Cloning', 'Memory', 'OOPs'],
  },
  {
    id: 'java-44',
    categoryId: 'prog-java',
    title: 'What is ThreadLocal in Java and what precautions must be taken?',
    difficulty: 'ADVANCED',
    answer:
      'ThreadLocal provides thread-scoped variables where each thread has its own independently initialized copy of the variable. It is commonly used for storing per-thread context (such as transaction IDs, security tokens, or database connections). Precaution: In web servers with thread pools, threads are reused; you MUST call threadLocal.remove() in a finally block to prevent memory leaks and cross-request data contamination.',
    codeExample: `public class UserContext {
    private static final ThreadLocal<String> userHolder = new ThreadLocal<>();

    public static void set(String userId) { userHolder.set(userId); }
    public static String get() { return userHolder.get(); }
    public static void clear() { userHolder.remove(); } // Critical!
}`,
    keyPoints: [
      'Stored inside Thread.threadLocals (a ThreadLocalMap on the Thread object).',
      'ThreadLocalMap entries use WeakReferences for keys, but values remain strongly reachable until removed.',
    ],
    followUps: [
      {
        question: 'What is InheritableThreadLocal?',
        answer: 'A variant where child threads inherit thread-local values from their parent thread when created.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'InfoCepts'],
    tags: ['Concurrency', 'ThreadLocal'],
  },
  {
    id: 'java-45',
    categoryId: 'prog-java',
    title: 'What are Sealed Classes in Java 17?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Sealed classes and interfaces (introduced in Java 17) restrict which other classes or interfaces may extend or implement them. A sealed class declares permitted subclasses using the permits clause. Permitted subclasses must be marked final (cannot be extended), sealed (restricts its own subclasses), or non-sealed (open for general inheritance).',
    codeExample: `public sealed class Shape permits Circle, Rectangle, Square {}

public final class Circle extends Shape {}
public final class Rectangle extends Shape {}
public non-sealed class Square extends Shape {}`,
    keyPoints: [
      'Provides domain modeling boundaries (closed hierarchies).',
      'Enables exhaustive pattern matching in switch statements without needing a dummy default branch.',
    ],
    followUps: [
      {
        question: 'Must permitted subclasses be in the same package as the sealed class?',
        answer: 'Yes, permitted subclasses must belong to the same package (or same module in modular Java).',
      },
    ],
    companies: ['Deloitte', 'Cognizant'],
    tags: ['Java 17', 'Sealed Classes', 'Modern Java'],
  },
  {
    id: 'java-46',
    categoryId: 'prog-java',
    title: 'Explain the working of PriorityQueue in Java.',
    difficulty: 'INTERMEDIATE',
    answer:
      'PriorityQueue is an unbounded queue based on a binary min-heap (or max-heap with custom Comparator). Elements are ordered according to natural ordering or a Comparator. The head of the queue is always the least element. Insertion (offer/add) and removal (poll/remove) have O(log n) time complexity, while peek() is O(1).',
    keyPoints: [
      'PriorityQueue is NOT thread-safe; for concurrent access, use PriorityBlockingQueue.',
      'Does NOT allow null elements.',
      'Iterating through PriorityQueue does NOT guarantee sorted order; only poll() dequeues in order.',
    ],
    followUps: [
      {
        question: 'How do you create a Max-Heap PriorityQueue in Java?',
        answer: 'Pass Collections.reverseOrder() to the constructor: new PriorityQueue<>(Collections.reverseOrder()).',
      },
    ],
    companies: ['Infosys', 'Capgemini', 'TCS'],
    tags: ['Collections', 'PriorityQueue', 'Heap'],
  },
  {
    id: 'java-47',
    categoryId: 'prog-java',
    title: 'What is the difference between String.intern() and String literal?',
    difficulty: 'INTERMEDIATE',
    answer:
      'When you create a string using a literal (String s = "apple"), it is automatically retrieved from or added to the String Constant Pool. When created with new String("apple"), a new object is allocated in standard heap memory. Calling .intern() checks the pool: if the pool contains an equal string, the pool reference is returned; otherwise, this string is added to the pool and returned.',
    codeExample: `String s1 = new String("Java");
String s2 = s1.intern();
String s3 = "Java";

System.out.println(s1 == s2); // false (Heap vs Pool)
System.out.println(s2 == s3); // true (Both point to Pool)`,
    keyPoints: [
      'Helps deduplicate duplicate strings and save memory when parsing millions of JSON/XML tokens.',
      'String pool size can be adjusted with -XX:StringTableSize.',
    ],
    followUps: [
      {
        question: 'Where is the String Pool located in Java 8+?',
        answer: 'In the main Java Heap memory (prior to Java 7, it was in PermGen).',
      },
    ],
    companies: ['Infosys', 'Capgemini'],
    tags: ['String', 'Memory', 'JVM'],
  },
  {
    id: 'java-48',
    categoryId: 'prog-java',
    title: 'What is the purpose of the transient keyword in Java?',
    difficulty: 'BEGINNER',
    answer:
      'The transient keyword is used in serialization. When a member variable is marked transient, its value is not included in the serialized byte stream when writing the object to disk or transmitting over the network. Upon deserialization, transient fields are reset to their default values (null for objects, 0 for numbers, false for booleans).',
    codeExample: `class UserSession implements Serializable {
    private String username;
    private transient String sessionToken; // Never written to disk
}`,
    keyPoints: [
      'Used for sensitive data like passwords, encryption keys, or temporary state caches.',
      'Cannot be applied to static variables (static fields are not serialized anyway).',
    ],
    followUps: [
      {
        question: 'Can you initialize a transient field during deserialization?',
        answer: 'Yes, by implementing the private readObject(ObjectInputStream in) method and assigning custom logic.',
      },
    ],
    companies: ['TCS', 'Wipro', 'HCL'],
    tags: ['Keywords', 'Serialization'],
  },
  {
    id: 'java-49',
    categoryId: 'prog-java',
    title: 'What is the Fork/Join Framework in Java Concurrency?',
    difficulty: 'ADVANCED',
    answer:
      'The Fork/Join Framework (introduced in Java 7) is an implementation of ExecutorService designed for parallel divide-and-conquer workloads. It breaks large tasks into smaller subtasks recursively (fork), executes them asynchronously, and combines the results (join). It features Work-Stealing, where idle worker threads steal tasks from the tails of busy threads’ double-ended queues (deques).',
    keyPoints: [
      'Classes: ForkJoinPool, RecursiveTask<V> (returns a value), RecursiveAction (void).',
      'Forms the foundation of Java 8 parallel streams.',
    ],
    followUps: [
      {
        question: 'What is Work-Stealing in ForkJoinPool?',
        answer: 'Each thread has its own deque. Threads take tasks from the head of their own deque. When empty, an idle thread steals tasks from the tail of another thread’s deque, balancing workloads.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts'],
    tags: ['Concurrency', 'ForkJoin', 'Parallelism'],
  },
  {
    id: 'java-50',
    categoryId: 'prog-java',
    title: 'Explain the difference between StringBuffer and StringBuilder with benchmarks.',
    difficulty: 'BEGINNER',
    answer:
      'Both StringBuffer and StringBuilder represent mutable sequences of characters and have identical API methods (append, insert, delete, reverse). The crucial difference is thread safety: StringBuffer is synchronized on every method, making it thread-safe but slower. StringBuilder is unsynchronized and not thread-safe, making it significantly faster. Always prefer StringBuilder in single-threaded or local method contexts.',
    keyPoints: [
      'StringBuilder was introduced in Java 5 as a drop-in high-performance replacement for single-threaded StringBuffer use.',
      'Concatenating strings in a loop with + creates multiple garbage String instances; use StringBuilder instead.',
    ],
    followUps: [
      {
        question: 'Does the Java compiler automatically use StringBuilder for String concatenation?',
        answer: 'Yes, simple expressions like a + b are compiled into StringBuilder.append() calls, but loops require manual StringBuilder instantiation.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro'],
    tags: ['String', 'Performance', 'Core Java'],
  },
];
