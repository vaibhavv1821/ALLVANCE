import { SeedInterviewQuestion } from './types';

export const OOPS_QUESTIONS: SeedInterviewQuestion[] = [
  {
    id: 'oops-01',
    categoryId: 'cs-oops',
    title: 'Explain the 4 Core Pillars of Object-Oriented Programming with real-world examples.',
    difficulty: 'BEGINNER',
    answer:
      'The 4 fundamental pillars are: 1. Encapsulation: Bundling data (state) and methods (behavior) within a single class and restricting direct access to internal components using access specifiers (private/protected) with public getters/setters (e.g. a bank account hiding balance and requiring deposit/withdraw methods). 2. Abstraction: Hiding internal implementation complexities and exposing only essential functional interfaces (e.g. a car driver pressing the accelerator pedal without needing to know engine fuel-injection mechanics). 3. Inheritance: Mechanism where a child class acquires properties and behaviors from a parent class, promoting code reusability (e.g. ElectricCar inheriting from Vehicle). 4. Polymorphism: "Many forms"—ability of an entity (method or object) to behave differently based on context (e.g. a draw() method rendering differently for Circle, Rectangle, or Triangle).',
    keyPoints: [
      'Encapsulation = Data Hiding + Modular Protection.',
      'Abstraction = What it does; Implementation = How it does it.',
      'Inheritance models "is-a" relationships.',
      'Polymorphism enables interchangeable components and extensible code.',
    ],
    followUps: [
      {
        question: 'What is the key difference between Abstraction and Encapsulation?',
        answer: 'Abstraction focuses on hiding the complexity of WHAT an object does (design level via interfaces/abstract classes), while Encapsulation focuses on HOW data is protected and packaged internally (implementation level via private fields).',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro', 'Deloitte', 'Cognizant', 'HCL'],
    tags: ['OOPs', 'Core Pillars', 'Fundamentals'],
  },
  {
    id: 'oops-02',
    categoryId: 'cs-oops',
    title: 'What are the SOLID Principles? Explain each principle with a practical example.',
    difficulty: 'INTERMEDIATE',
    answer:
      'SOLID represents 5 architectural design principles for maintainable, scalable software: 1. S (Single Responsibility Principle - SRP): A class should have one, and only one, reason to change (e.g. separate invoice calculation from invoice PDF generation). 2. O (Open/Closed Principle - OCP): Software entities should be open for extension, but closed for modification (e.g. add new payment gateways by implementing a PaymentProcessor interface rather than modifying an existing switch statement). 3. L (Liskov Substitution Principle - LSP): Subtypes must be substitutable for their base types without altering program correctness (e.g. a Square extending Rectangle violates LSP if setting width unexpectedly alters height). 4. I (Interface Segregation Principle - ISP): Clients should not be forced to depend on methods they do not use (prefer small, role-specific interfaces like Printable and Serializable over one bloated Worker interface). 5. D (Dependency Inversion Principle - DIP): High-level modules should not depend on low-level modules; both should depend on abstractions (e.g. depend on DatabaseConnection interface rather than hardcoding MySQLConnection).',
    keyPoints: [
      'Violating LSP breaks polymorphism.',
      'DIP forms the foundation of Dependency Injection (DI) frameworks like Spring.',
      'ISP prevents "fat" interfaces.',
    ],
    followUps: [
      {
        question: 'Why does Square inheriting from Rectangle violate the Liskov Substitution Principle?',
        answer: 'Because a Rectangle allows setting width and height independently without changing area unexpectedly. Forcing Square to inherit forces side-effects (setting width changes height), violating caller assumptions.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini', 'Cognizant', 'InfoCepts'],
    tags: ['SOLID', 'Design Principles', 'Clean Code'],
  },
  {
    id: 'oops-03',
    categoryId: 'cs-oops',
    title: 'Explain Compile-Time vs Runtime Polymorphism and how Dynamic Dispatch works.',
    difficulty: 'INTERMEDIATE',
    answer:
      'Compile-Time Polymorphism (Static Binding / Early Binding) is resolved by the compiler at compile-time based on method signatures and reference types. Achieved via Method Overloading and Operator Overloading. Runtime Polymorphism (Dynamic Binding / Late Binding) is resolved at runtime based on the actual object instance stored in memory, not the reference type. Achieved via Method Overriding. Dynamic Method Dispatch uses a Virtual Method Table (vtable) created by the compiler for classes with virtual/overridden methods. Each object carries a vptr pointing to its class vtable, looking up the concrete function pointer at runtime.',
    codeExample: `class Animal { void sound() { System.out.println("Animal sound"); } }
class Dog extends Animal { void sound() { System.out.println("Bark"); } }

Animal a = new Dog(); // Reference of Animal, object of Dog
a.sound(); // Prints "Bark" at runtime via dynamic dispatch!`,
    keyPoints: [
      'Static methods, private methods, and final methods cannot participate in runtime polymorphism.',
      'Vtable lookups add a microscopic pointer indirection overhead, heavily optimized by JIT compiler inlining.',
    ],
    followUps: [
      {
        question: 'Can private methods be overridden in Java or C++?',
        answer: 'No, private methods are not visible to subclasses and are bound at compile time.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Deloitte'],
    tags: ['Polymorphism', 'Dynamic Dispatch', 'Vtable'],
  },
  {
    id: 'oops-04',
    categoryId: 'cs-oops',
    title: 'What is the difference between Association, Aggregation, and Composition?',
    difficulty: 'INTERMEDIATE',
    answer:
      'All three represent structural relationships between classes: 1. Association: A general "has-a" or "uses-a" relationship between two independent classes with no ownership (e.g. Teacher and Student; both can exist independently). 2. Aggregation: A specialized weak "has-a" relationship where one class owns another, but the child object can exist independently of the parent (e.g. Department and Professor; if the Department closes, Professors continue to exist). 3. Composition: A strong "part-of" ownership relationship where the child object’s lifecycle is strictly bound to the parent (e.g. House and Rooms; if the House is destroyed, the Rooms cease to exist).',
    keyPoints: [
      'Association: no lifecycle dependency.',
      'Aggregation: weak ownership (hollow diamond in UML).',
      'Composition: strong ownership and shared lifecycle (filled black diamond in UML).',
    ],
    followUps: [
      {
        question: 'Why should you generally "Favor Composition over Inheritance"?',
        answer: 'Inheritance creates tight compile-time coupling and breaks encapsulation (fragile base class problem). Composition allows changing behavior dynamically at runtime by swapping injected component instances.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Deloitte', 'Capgemini'],
    tags: ['Relationships', 'Composition', 'Aggregation', 'UML'],
  },
  {
    id: 'oops-05',
    categoryId: 'cs-oops',
    title: 'What is the Singleton Design Pattern and how do you implement a thread-safe Bill Pugh Singleton?',
    difficulty: 'INTERMEDIATE',
    answer:
      'The Singleton pattern restricts the instantiation of a class to one single object throughout the application lifecycle. The Bill Pugh Singleton (Initialization-on-demand holder idiom) is the industry standard for Java: it uses a static inner helper class. The inner helper class is NOT loaded into memory when the outer class is loaded; it is loaded only when getInstance() is called, providing thread-safe, lazy-initialized singleton creation without costly synchronization locks.',
    codeExample: `public class BillPughSingleton {
    private BillPughSingleton() {} // Private constructor prevents external instantiation

    // Static inner class loaded ONLY on demand:
    private static class HelperHolder {
        private static final BillPughSingleton INSTANCE = new BillPughSingleton();
    }

    public static BillPughSingleton getInstance() {
        return HelperHolder.INSTANCE;
    }
}`,
    keyPoints: [
      'Guaranteed thread-safe by JVM class loader specifications.',
      'Lazy initialized: zero memory allocation until first invocation.',
      'Does not require synchronized keywords or double-checked locking.',
    ],
    followUps: [
      {
        question: 'How can a Singleton be broken and how can you protect it?',
        answer: 'Broken via Reflection (throw exception in constructor if instance != null), Serialization (implement readResolve()), and Cloning (override clone() to throw CloneNotSupportedException). Alternatively, use an Enum Singleton.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini', 'TCS'],
    tags: ['Design Patterns', 'Singleton', 'Concurrency'],
  },
  {
    id: 'oops-06',
    categoryId: 'cs-oops',
    title: 'Explain the Factory Method vs Abstract Factory Design Pattern.',
    difficulty: 'INTERMEDIATE',
    answer:
      'Factory Method defines an interface for creating a single object, but lets subclasses decide which concrete class to instantiate (creates one product). Abstract Factory provides an interface for creating families of related or dependent objects without specifying their concrete classes (creates a factory of factories for multiple coordinated products, e.g. LightThemeUIFactory producing LightButton, LightTextBox vs DarkThemeUIFactory producing DarkButton, DarkTextBox).',
    codeExample: `// Factory Method: Creates a single Notification
interface NotificationFactory { Notification createNotification(); }

// Abstract Factory: Creates a family of related UI components
interface GUIFactory {
    Button createButton();
    Checkbox createCheckbox();
}`,
    keyPoints: [
      'Factory Method uses inheritance and creates one product.',
      'Abstract Factory uses composition and creates families of products.',
    ],
    followUps: [
      {
        question: 'When should you use Abstract Factory over Factory Method?',
        answer: 'When your system needs to be configured with one of multiple families of products that must be used together consistently (e.g. cross-platform GUI widgets for Windows vs Mac).',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Cognizant'],
    tags: ['Design Patterns', 'Factory Method', 'Abstract Factory'],
  },
  {
    id: 'oops-07',
    categoryId: 'cs-oops',
    title: 'What is the Observer Design Pattern and how does it power Event Listeners?',
    difficulty: 'INTERMEDIATE',
    answer:
      'The Observer pattern defines a one-to-many dependency between objects such that when one object (the Subject / Observable) changes its state, all its registered dependents (Observers) are automatically notified and updated. It is the architectural engine behind GUI event listeners (onClick), Node.js EventEmitter, and reactive state stores (Redux, Zustand).',
    codeExample: `interface Observer { void update(String news); }

class NewsChannel implements Observer {
    public void update(String news) { System.out.println("Breaking: " + news); }
}

class NewsAgency {
    private List<Observer> observers = new ArrayList<>();
    public void attach(Observer o) { observers.add(o); }
    public void notifyAllObservers(String news) {
        for (Observer o : observers) o.update(news);
    }
}`,
    keyPoints: [
      'Promotes loose coupling between Subject and Observers.',
      'Subject only knows that observers implement the Observer interface.',
    ],
    followUps: [
      {
        question: 'What is the memory leak risk associated with the Observer pattern ("Lapsed Listener Problem")?',
        answer: 'If observers register with a long-lived subject and forget to unregister, the subject retains strong references to them, preventing garbage collection.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['Design Patterns', 'Observer', 'Event Driven'],
  },
  {
    id: 'oops-08',
    categoryId: 'cs-oops',
    title: 'What is the Strategy Design Pattern and how does it eliminate long if-else / switch blocks?',
    difficulty: 'INTERMEDIATE',
    answer:
      'The Strategy pattern defines a family of algorithms, encapsulates each one into a separate class implementing a common interface, and makes them interchangeable at runtime. The client holds a reference to the strategy interface and delegates execution to it, eliminating long switch-case statements and adhering to the Open/Closed Principle.',
    codeExample: `interface PaymentStrategy { void pay(int amount); }

class CreditCardPayment implements PaymentStrategy {
    public void pay(int amount) { System.out.println("Paid " + amount + " via Card"); }
}

class UpiPayment implements PaymentStrategy {
    public void pay(int amount) { System.out.println("Paid " + amount + " via UPI"); }
}

class ShoppingCart {
    private PaymentStrategy strategy;
    public void setStrategy(PaymentStrategy s) { this.strategy = s; }
    public void checkout(int amount) { strategy.pay(amount); }
}`,
    keyPoints: [
      'Allows switching algorithms dynamically at runtime.',
      'Eliminates conditional branches (if-else if-else) for payment methods, sorting strategies, or compression types.',
    ],
    followUps: [
      {
        question: 'How do Java 8 lambdas simplify the Strategy pattern?',
        answer: 'Instead of creating separate concrete strategy classes, you can pass lambdas directly as functional strategy interfaces.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Cognizant'],
    tags: ['Design Patterns', 'Strategy', 'Refactoring'],
  },
  {
    id: 'oops-09',
    categoryId: 'cs-oops',
    title: 'Explain Coupling vs Cohesion with examples.',
    difficulty: 'BEGINNER',
    answer:
      'Cohesion refers to how focused and closely related the internal responsibilities of a single module/class are. High Cohesion is desirable: a class does one focused job well (e.g. a UserRepository handles only user persistence). Coupling refers to the degree of direct dependency between different classes. Low/Loose Coupling is desirable: classes interact through interfaces rather than concrete implementations, so changing one class does not break others. The ideal architecture exhibits High Cohesion and Low Coupling.',
    keyPoints: [
      'High Cohesion = easy to understand, test, and maintain.',
      'Loose Coupling = easy to swap, mock, and refactor without ripple effects.',
    ],
    followUps: [
      {
        question: 'What is "Tight Coupling"?',
        answer: 'When Class A directly instantiates and depends on private internal details of Class B, making both impossible to modify independently.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro'],
    tags: ['Coupling', 'Cohesion', 'Software Design'],
  },
  {
    id: 'oops-10',
    categoryId: 'cs-oops',
    title: 'What is the Builder Design Pattern and when is it preferred over constructors?',
    difficulty: 'INTERMEDIATE',
    answer:
      'The Builder pattern separates the construction of a complex object from its representation, allowing step-by-step construction. It is preferred over telescoping constructors (constructors with 6+ parameters) when an object has many optional attributes, immutable fields, and complex initialization logic, providing clear, fluent API readability.',
    codeExample: `User user = new User.Builder("Alex", "alex@example.com")
    .phone("+123456789")
    .age(24)
    .address("Bangalore, India")
    .build();`,
    keyPoints: [
      'Solves the Telescoping Constructor anti-pattern.',
      'Enforces immutability: the target object has no setters once built.',
      'Prevents parameter transposition bugs (e.g. passing email into phone string parameter).',
    ],
    followUps: [
      {
        question: 'How does Lombok @Builder work in Java?',
        answer: 'Lombok generates the static inner Builder class, fluent setter methods, and build() method at compile-time via annotation processing.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['Design Patterns', 'Builder', 'Clean Code'],
  },
  {
    id: 'oops-11',
    categoryId: 'cs-oops',
    title: 'What is the Adapter Design Pattern?',
    difficulty: 'INTERMEDIATE',
    answer:
      'The Adapter pattern (Wrapper) acts as a bridge between two incompatible interfaces, allowing classes with mismatched method signatures to collaborate. It wraps an existing class (Adaptee) and translates requests from a Client expecting a specific Target interface into calls the Adaptee understands (analogous to a physical plug adapter connecting a European laptop plug to an American wall outlet).',
    codeExample: `// Target expected by client:
interface MediaPlayer { void play(String audioType, String fileName); }

// Adaptee with incompatible interface:
class AdvancedVlcPlayer { void playVlc(String file) { /*...*/ } }

// Adapter implements Target and wraps Adaptee:
class MediaAdapter implements MediaPlayer {
    private AdvancedVlcPlayer vlc = new AdvancedVlcPlayer();
    public void play(String type, String file) { vlc.playVlc(file); }
}`,
    keyPoints: [
      'Enables integration of legacy code or 3rd-party vendor libraries without modifying original source code.',
      'Two variants: Class Adapter (inheritance) and Object Adapter (composition - preferred).',
    ],
    followUps: [
      {
        question: 'What is the difference between Adapter and Decorator pattern?',
        answer: 'Adapter CHANGES an interface to make it compatible; Decorator ENHANCES an object with new behavior while preserving the SAME interface.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['Design Patterns', 'Adapter', 'Structural'],
  },
  {
    id: 'oops-12',
    categoryId: 'cs-oops',
    title: 'What is the Decorator Design Pattern?',
    difficulty: 'INTERMEDIATE',
    answer:
      'The Decorator pattern attaches additional responsibilities and behaviors to an object dynamically at runtime without modifying the underlying class or using subclass inheritance. Decorators implement the same interface as the wrapped component and forward requests to it, wrapping new functionality before or after. Classic example: Java I/O streams (new BufferedReader(new FileReader("file.txt"))).',
    codeExample: `interface Coffee { double getCost(); }
class SimpleCoffee implements Coffee { public double getCost() { return 5.0; } }

abstract class CoffeeDecorator implements Coffee {
    protected Coffee decorated;
    public CoffeeDecorator(Coffee c) { this.decorated = c; }
    public double getCost() { return decorated.getCost(); }
}

class MilkDecorator extends CoffeeDecorator {
    public MilkDecorator(Coffee c) { super(c); }
    public double getCost() { return super.getCost() + 2.0; }
}

Coffee myCoffee = new MilkDecorator(new SimpleCoffee()); // Cost: 7.0`,
    keyPoints: [
      'Adheres to the Open/Closed Principle (extends functionality without altering existing classes).',
      'Avoids class explosion caused by creating subclasses for every possible feature combination.',
    ],
    followUps: [
      {
        question: 'How does Java I/O utilize the Decorator pattern?',
        answer: 'FileInputStream is wrapped in BufferedInputStream, which can be further wrapped in DataInputStream or GZIPInputStream.',
      },
    ],
    companies: ['Deloitte', 'Infosys'],
    tags: ['Design Patterns', 'Decorator', 'Structural'],
  },
  {
    id: 'oops-13',
    categoryId: 'cs-oops',
    title: 'What is the Facade Design Pattern?',
    difficulty: 'BEGINNER',
    answer:
      'The Facade pattern provides a simplified, higher-level unified interface to a complex subsystem composed of many interdependent classes. It shields the client from the intricate low-level details, configuration, and sequence of subsystem method calls (analogous to a single "Order Product" button on Amazon orchestrating payment, inventory, packaging, logistics, and notification subsystems behind the scenes).',
    keyPoints: [
      'Reduces complexity and decouples the client from internal subsystem implementations.',
      'Does not encapsulate subsystem classes; advanced clients can still access subsystem internals directly if needed.',
    ],
    followUps: [
      {
        question: 'How does a Facade differ from an Adapter?',
        answer: 'Facade defines a NEW, simplified interface for a whole subsystem; Adapter wraps an existing interface to match another SPECIFIC interface.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini'],
    tags: ['Design Patterns', 'Facade', 'Structural'],
  },
  {
    id: 'oops-14',
    categoryId: 'cs-oops',
    title: 'What is the Proxy Design Pattern and what are its common types?',
    difficulty: 'INTERMEDIATE',
    answer:
      'The Proxy pattern provides a surrogate or placeholder object to control, intercept, or manage access to a real target object. Both Proxy and RealSubject implement the same interface. Common types: 1. Remote Proxy (represents an object residing in a different address space/server, e.g. RMI/RPC), 2. Virtual Proxy (lazy loads expensive objects only when needed, e.g. high-resolution image rendering), 3. Protection Proxy (validates user permissions before forwarding calls), 4. Caching Proxy (caches responses to prevent redundant computations).',
    keyPoints: [
      'Spring Framework uses Dynamic Proxies for AOP (Aspect-Oriented Programming) like @Transactional and logging.',
      'Controls object lifecycle and access authorization seamlessly.',
    ],
    followUps: [
      {
        question: 'How does Hibernate use Virtual Proxies for Lazy Loading?',
        answer: 'Hibernate generates dynamic proxy subclasses for entities; accessing non-ID fields intercepts execution and fetches the actual database row on demand.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'InfoCepts'],
    tags: ['Design Patterns', 'Proxy', 'Structural'],
  },
  {
    id: 'oops-15',
    categoryId: 'cs-oops',
    title: 'What is the Law of Demeter (Principle of Least Knowledge)?',
    difficulty: 'ADVANCED',
    answer:
      'The Law of Demeter (LoD) states that a unit should have limited knowledge about other units and should only talk to its immediate "friends". Specifically, a method M of an object O should only call methods belonging to: 1. Object O itself, 2. Objects passed as parameters to M, 3. Any objects created/instantiated within M, 4. Direct component instance variables of O. Calling chains like a.getB().getC().getD().doSomething() violate LoD (train wreck code), exposing deep internal structures.',
    keyPoints: [
      'Prevents deep coupling across distant object graphs.',
      'Fix by delegating: a.doSomethingForD() hides the intermediate B and C objects.',
    ],
    followUps: [
      {
        question: 'Is method chaining in Fluent Builders or Streams a violation of Law of Demeter?',
        answer: 'No, because each call transforms or returns a self-reference or known pipeline stage, not navigating internal object identity hierarchies.',
      },
    ],
    companies: ['Deloitte', 'Infosys'],
    tags: ['Law of Demeter', 'Clean Code', 'Coupling'],
  },
  {
    id: 'oops-16',
    categoryId: 'cs-oops',
    title: 'Explain the Command Design Pattern.',
    difficulty: 'INTERMEDIATE',
    answer:
      'The Command pattern encapsulates a request as an object, complete with all information needed to perform the action (the receiver, the method, and arguments). This parameterizes clients with different requests, queues or logs requests, and provides built-in support for undoable/redoable operations by storing execution history stacks.',
    codeExample: `interface Command { void execute(); void undo(); }

class LightOnCommand implements Command {
    private Light light;
    public LightOnCommand(Light l) { this.light = l; }
    public void execute() { light.turnOn(); }
    public void undo() { light.turnOff(); }
}`,
    keyPoints: [
      'Decouples the object that invokes the command from the object that knows how to perform it.',
      'Essential for UI undo/redo systems, macro recording, and transaction queues.',
    ],
    followUps: [
      {
        question: 'How is an Undo operation implemented in the Command pattern?',
        answer: 'Maintain a history stack of executed Command objects. Calling undo() pops the last command and invokes its specific undo() method.',
      },
    ],
    companies: ['Deloitte', 'Infosys'],
    tags: ['Design Patterns', 'Command', 'Behavioral'],
  },
  {
    id: 'oops-17',
    categoryId: 'cs-oops',
    title: 'What is the State Design Pattern and how does it differ from Strategy?',
    difficulty: 'INTERMEDIATE',
    answer:
      'The State pattern allows an object to alter its behavior when its internal state changes; the object appears to change its class. State transitions are controlled either by the state classes themselves or by the context (e.g. an Order transitioning from Placed -> Paid -> Shipped -> Delivered). State differs from Strategy in intent: Strategy is chosen by the client to configure how an algorithm runs; State transitions dynamically and automatically as internal operations occur.',
    keyPoints: [
      'Eliminates massive switch-case statements based on object status.',
      'Each state is an encapsulated class implementing a common State interface.',
    ],
    followUps: [
      {
        question: 'Who is responsible for state transitions in the State pattern?',
        answer: 'Either the Context class or the individual concrete State classes themselves.',
      },
    ],
    companies: ['Deloitte', 'Infosys'],
    tags: ['Design Patterns', 'State', 'Behavioral'],
  },
  {
    id: 'oops-18',
    categoryId: 'cs-oops',
    title: 'What is the Template Method Design Pattern?',
    difficulty: 'BEGINNER',
    answer:
      'The Template Method pattern defines the skeleton/structure of an algorithm in a base class method (often marked final), deferring certain concrete steps to subclasses without allowing them to alter the overall algorithm’s sequence. Subclasses override specific hook or abstract steps (e.g. DataMiner base class defining mine(): openFile() -> extractData() -> parseData() -> closeFile(), where CSVDataMiner and PDFDataMiner implement parseData()).',
    keyPoints: [
      'Exemplifies the "Hollywood Principle": "Don’t call us, we’ll call you" (Inversion of Control).',
      'The invariant steps of the algorithm are written once in the superclass, eliminating code duplication.',
    ],
    followUps: [
      {
        question: 'What is a "Hook" in the Template Method pattern?',
        answer: 'A method in the base class with a default empty body that subclasses CAN optionally override to hook into specific execution points.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini'],
    tags: ['Design Patterns', 'Template Method', 'Behavioral'],
  },
  {
    id: 'oops-19',
    categoryId: 'cs-oops',
    title: 'What is the difference between an Entity and a Value Object in Domain-Driven Design (DDD)?',
    difficulty: 'INTERMEDIATE',
    answer:
      'An Entity is an object defined by its consistent unique identity (e.g. a User with id=101); two users with identical names are different entities if their IDs differ. A Value Object is defined solely by its attributes and has no conceptual identity; it is immutable and interchangeable (e.g. Money(amount=50, currency="USD") or Address). Two Value Objects with identical attributes are considered equal.',
    keyPoints: [
      'Entities have mutable state and lifetime identity.',
      'Value Objects are immutable; changing a value object returns a new instance.',
    ],
    followUps: [
      {
        question: 'Why should Value Objects be immutable?',
        answer: 'To prevent unexpected side-effects across components sharing the same value instance.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'InfoCepts'],
    tags: ['DDD', 'Entity vs Value Object', 'OOPs'],
  },
  {
    id: 'oops-20',
    categoryId: 'cs-oops',
    title: 'What is the Composite Design Pattern?',
    difficulty: 'INTERMEDIATE',
    answer:
      'The Composite pattern composes objects into tree structures to represent part-whole hierarchies. It allows clients to treat individual objects (leaves) and compositions of objects (containers) uniformly through a common component interface. Classic example: File System (a Directory contains Files and other Directories, both implementing a FileSystemNode interface with getSize()).',
    codeExample: `interface FileSystemItem { int getSize(); }
class File implements FileSystemItem {
    private int size;
    public int getSize() { return size; }
}
class Folder implements FileSystemItem {
    private List<FileSystemItem> items = new ArrayList<>();
    public int getSize() {
        return items.stream().mapToInt(FileSystemItem::getSize).sum();
    }
}`,
    keyPoints: [
      'Simplifies client code by eliminating recursive type checks (if folder vs if file).',
      'Easily extensible for new component types.',
    ],
    followUps: [
      {
        question: 'Where is the Composite pattern commonly used in UI frameworks?',
        answer: 'UI Component trees (e.g., View containing Buttons, Text, and nested Views in Android/React).',
      },
    ],
    companies: ['Deloitte', 'Infosys'],
    tags: ['Design Patterns', 'Composite', 'Tree Structures'],
  },
  {
    id: 'oops-21',
    categoryId: 'cs-oops',
    title: 'Explain the DRY, KISS, and YAGNI software design principles.',
    difficulty: 'BEGINNER',
    answer:
      '1. DRY (Don’t Repeat Yourself): Every piece of knowledge or business logic must have a single, unambiguous representation in a system; duplicate code creates maintenance nightmares when bugs must be fixed in multiple places. 2. KISS (Keep It Simple, Stupid): Systems work best if they are kept simple rather than made complicated; avoid unnecessary cleverness or over-engineering. 3. YAGNI (You Aren’t Gonna Need It): Do not write code or features for hypothetical future requirements; build only what is needed today.',
    keyPoints: [
      'Premature abstraction is a common violation of KISS and YAGNI.',
      'Balance DRY: "Duplication is far cheaper than the wrong abstraction" (Sandi Metz).',
    ],
    followUps: [
      {
        question: 'When can strict adherence to DRY become counterproductive?',
        answer: 'When two pieces of code look superficially identical but evolve for completely different business reasons, forcing them into a shared abstraction creates unnecessary coupling.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Deloitte'],
    tags: ['Design Principles', 'DRY', 'KISS', 'YAGNI'],
  },
  {
    id: 'oops-22',
    categoryId: 'cs-oops',
    title: 'What is the Fragile Base Class Problem in Object-Oriented Inheritance?',
    difficulty: 'ADVANCED',
    answer:
      'The Fragile Base Class problem occurs when seemingly safe modifications to a base class unintentionally break derived subclasses because subclasses depend on implicit, undocumented implementation details of the base class. For example, if a base class changes an internal method from calling methodA() to calling methodB(), an overriding subclass that intercepted methodA() will silently break. This is why language designers recommend favoring composition over inheritance.',
    keyPoints: [
      'Inheritance breaks encapsulation across class hierarchy boundaries.',
      'Marking classes or methods final prevents subclassing bugs.',
    ],
    followUps: [
      {
        question: 'How does composition avoid the fragile base class problem?',
        answer: 'With composition, the outer class interacts only with the public interface of the wrapped component, shielding it from internal implementation changes.',
      },
    ],
    companies: ['Deloitte', 'Infosys'],
    tags: ['Inheritance', 'Fragile Base Class', 'OOPs'],
  },
  {
    id: 'oops-23',
    categoryId: 'cs-oops',
    title: 'What is Inversion of Control (IoC) and Dependency Injection (DI)?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Inversion of Control (IoC) is a design principle where the custom-written portion of a program receives the flow of control from a framework (reversing traditional control). Dependency Injection (DI) is a specific design pattern implementing IoC: instead of a class instantiating its own dependencies internally using new Class(), dependencies are "injected" from the outside (via constructor, setter, or field) by an IoC container (like Spring, Dagger, or NestJS).',
    codeExample: `// Without DI (Tight coupling):
class OrderService {
    private PaymentGateway gateway = new StripeGateway(); // Hardcoded!
}

// With Constructor DI (Loose coupling, easy to test):
class OrderService {
    private final PaymentGateway gateway;
    public OrderService(PaymentGateway gateway) { // Injected!
        this.gateway = gateway;
    }
}`,
    keyPoints: [
      'Enables effortless unit testing via mock dependencies.',
      'Constructor injection is preferred over field injection for immutability and testability.',
    ],
    followUps: [
      {
        question: 'What are the 3 main types of Dependency Injection?',
        answer: 'Constructor Injection, Setter Injection, and Interface/Method Injection.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini', 'Cognizant'],
    tags: ['IoC', 'Dependency Injection', 'Architecture'],
  },
  {
    id: 'oops-24',
    categoryId: 'cs-oops',
    title: 'What is the Prototype Design Pattern?',
    difficulty: 'INTERMEDIATE',
    answer:
      'The Prototype pattern specifies the kind of objects to create using a prototypical instance, creating new objects by CLONING an existing prototype rather than instantiating via costly constructors or database fetches. Useful when object creation is computationally heavy (e.g. loading complex graphic models or pre-parsed trees).',
    keyPoints: [
      'Requires implementing a clone() or deep-copy mechanism.',
      'Allows adding or removing prototypes dynamically at runtime.',
    ],
    followUps: [
      {
        question: 'Should a prototype clone be a shallow copy or deep copy?',
        answer: 'Usually a deep copy, to ensure modifying the cloned instance does not alter the original prototype template.',
      },
    ],
    companies: ['Infosys', 'Capgemini'],
    tags: ['Design Patterns', 'Prototype', 'Creational'],
  },
  {
    id: 'oops-25',
    categoryId: 'cs-oops',
    title: 'What is an Abstract Class and can an Abstract Class have a Constructor?',
    difficulty: 'BEGINNER',
    answer:
      'An Abstract Class is a class declared with the abstract keyword that cannot be instantiated directly with new. It serves as a base blueprint and can contain both abstract methods (without bodies) and concrete methods (with bodies). YES, an abstract class CAN and often DOES have constructors; its constructor is invoked by subclass constructors via super() to initialize inherited base class state and fields.',
    codeExample: `abstract class Account {
    protected String accountNumber;
    public Account(String accNo) { // Abstract class constructor!
        this.accountNumber = accNo;
    }
}
class SavingsAccount extends Account {
    public SavingsAccount(String accNo) {
        super(accNo); // Calls abstract superclass constructor
    }
}`,
    keyPoints: [
      'Cannot instantiate an abstract class directly.',
      'Constructor initializes fields common to all derived subclasses.',
    ],
    followUps: [
      {
        question: 'Can an abstract class have zero abstract methods?',
        answer: 'Yes, declaring a class abstract simply prevents it from being instantiated directly.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Wipro', 'Capgemini'],
    tags: ['Abstract Class', 'Constructors', 'OOPs'],
  },
  {
    id: 'oops-26',
    categoryId: 'cs-oops',
    title: 'What is Multiple Dispatch vs Single Dispatch in OOPs?',
    difficulty: 'ADVANCED',
    answer:
      'Single Dispatch (used in Java, C++, Python) chooses which method to execute at runtime based solely on the runtime type of ONE object: the receiver (this). Method arguments are resolved at compile-time using static reference types. Multiple Dispatch (found in Julia or Common Lisp) chooses the method at runtime based on the dynamic runtime types of the receiver AND all method arguments. In single-dispatch languages, multiple dispatch is simulated using the Visitor Pattern (Double Dispatch).',
    keyPoints: [
      'Double Dispatch invokes two virtual method calls to resolve two dynamic types.',
      'Visitor pattern is the classic workaround for single dispatch.',
    ],
    followUps: [
      {
        question: 'How does the Visitor pattern achieve Double Dispatch in Java?',
        answer: 'Element accepts visitor: element.accept(visitor), which calls back visitor.visit(this), binding both dynamic types.',
      },
    ],
    companies: ['Deloitte', 'Infosys'],
    tags: ['Double Dispatch', 'Visitor Pattern', 'Advanced OOPs'],
  },
  {
    id: 'oops-27',
    categoryId: 'cs-oops',
    title: 'What is the Iterator Design Pattern?',
    difficulty: 'BEGINNER',
    answer:
      'The Iterator pattern provides a way to access elements of an aggregate collection sequentially without exposing its underlying internal data structure (array, linked list, tree, hash table). It standardizes traversal across different collections using hasNext() and next().',
    keyPoints: [
      'Decouples collection algorithms from underlying data structures.',
      'Supports multiple simultaneous traversals over the same collection.',
    ],
    followUps: [
      {
        question: 'What interface in Java enables the enhanced for-each loop?',
        answer: 'java.lang.Iterable (which returns an Iterator).',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini'],
    tags: ['Design Patterns', 'Iterator', 'Behavioral'],
  },
  {
    id: 'oops-28',
    categoryId: 'cs-oops',
    title: 'Explain Encapsulation: How does it protect data integrity?',
    difficulty: 'BEGINNER',
    answer:
      'Encapsulation protects data integrity by making member variables private and providing controlled public access through getter and setter methods. This allows the class to validate input parameters before updating state (e.g. rejecting negative age or negative account deposits), enforce business invariants, log state modifications, and change internal representations without impacting external callers.',
    codeExample: `public class BankAccount {
    private double balance; // Protected from external modification

    public void deposit(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Deposit must be positive");
        this.balance += amount;
    }
}`,
    keyPoints: [
      'Encapsulation prevents external code from putting an object into an invalid state.',
      'Enables read-only or write-only properties by exposing only getters or only setters.',
    ],
    followUps: [
      {
        question: 'Does providing public getters and setters for every private field truly achieve encapsulation?',
        answer: 'Not completely; indiscriminately exposing getters and setters for everything can lead to anemic domain models where callers manipulate internal state directly.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Wipro'],
    tags: ['Encapsulation', 'Data Integrity'],
  },
  {
    id: 'oops-29',
    categoryId: 'cs-oops',
    title: 'What is the Flyweight Design Pattern?',
    difficulty: 'ADVANCED',
    answer:
      'The Flyweight pattern minimizes memory usage by sharing common, immutable state (Intrinsic State) across a large number of fine-grained objects, while passing variable state (Extrinsic State) as method parameters. Classic example: A text processor rendering a document with 1,000,000 characters does not instantiate 1,000,000 Character objects; it shares 26 Flyweight character glyphs (font, shape) and passes (x, y coordinate) extrinsically.',
    keyPoints: [
      'Massive memory reduction for millions of similar objects (e.g. forest tree rendering in games).',
      'Intrinsic state = stored inside flyweight (shared, immutable).',
      'Extrinsic state = calculated or passed by client (context-dependent).',
    ],
    followUps: [
      {
        question: 'How does Java String Pool utilize the Flyweight pattern?',
        answer: 'Identical string literals share a single cached string instance in the heap pool.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts'],
    tags: ['Design Patterns', 'Flyweight', 'Memory Optimization'],
  },
  {
    id: 'oops-30',
    categoryId: 'cs-oops',
    title: 'What is the Bridge Design Pattern?',
    difficulty: 'ADVANCED',
    answer:
      'The Bridge pattern decouples an abstraction from its implementation so that the two can vary independently. Instead of using multi-level inheritance (which causes a combinatorial class explosion, e.g. RedCircle, BlueCircle, RedSquare, BlueSquare = 2 x 2 = 4 subclasses; adding a color doubles the classes), Bridge replaces inheritance with composition: Shape holds a reference to a Color interface.',
    keyPoints: [
      'Replaces N * M inheritance hierarchies with N + M composition hierarchies.',
      'Separates interface from implementation details.',
    ],
    followUps: [
      {
        question: 'How does JDBC Driver architecture use the Bridge pattern?',
        answer: 'JDBC API provides the abstraction (Connection, Statement); vendor drivers (MySQL, Oracle, SQLite) provide the concrete implementation.',
      },
    ],
    companies: ['Deloitte', 'Infosys'],
    tags: ['Design Patterns', 'Bridge', 'Structural'],
  },
  {
    id: 'oops-31',
    categoryId: 'cs-oops',
    title: 'What are Getters and Setters and what is an Anemic Domain Model?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Getters and setters are accessor and mutator methods used to inspect and update private object fields. An Anemic Domain Model is an anti-pattern where domain classes contain only fields with getters and setters and zero business logic (pure data bags), while all business logic is pushed into separate service classes. In rich domain models, business operations and validation live inside the domain entity itself.',
    keyPoints: [
      'Anemic models violate core OO principles by separating data from behavior.',
      'Prefer "Tell, Don’t Ask" over pulling state out with getters to make decisions.',
    ],
    followUps: [
      {
        question: 'What is the "Tell, Don’t Ask" principle?',
        answer: 'Tell objects what to do rather than asking for their state, making decisions outside, and setting state back.',
      },
    ],
    companies: ['Deloitte', 'Infosys'],
    tags: ['Encapsulation', 'Domain Models', 'Anti-Patterns'],
  },
  {
    id: 'oops-32',
    categoryId: 'cs-oops',
    title: 'Explain the difference between Overriding and Shadowing / Hiding in OOPs.',
    difficulty: 'BEGINNER',
    answer:
      'Method Overriding occurs when a subclass provides a specific implementation of an instance method defined in its superclass, resolved dynamically at runtime based on object type. Method Hiding occurs when a subclass defines a static method with the same signature as a static method in the superclass; it is resolved statically at compile-time based on reference type. Field Shadowing occurs when a subclass declares a variable with the same name as a superclass variable, hiding the parent field.',
    codeExample: `class Parent { static void show() { System.out.println("Parent"); } }
class Child extends Parent { static void show() { System.out.println("Child"); } }

Parent p = new Child();
p.show(); // Prints "Parent" because static methods are hidden, not overridden!`,
    keyPoints: [
      'Static methods cannot be overridden, only hidden.',
      'Variables are never polymorphic; fields are resolved by reference type.',
    ],
    followUps: [
      {
        question: 'Are instance variables overridden in Java subclasses?',
        answer: 'No, instance variables are shadowed/hidden, never overridden.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini'],
    tags: ['Overriding', 'Hiding', 'Polymorphism'],
  },
  {
    id: 'oops-33',
    categoryId: 'cs-oops',
    title: 'What is the Mediator Design Pattern?',
    difficulty: 'INTERMEDIATE',
    answer:
      'The Mediator pattern defines an object that encapsulates how a set of objects interact. It promotes loose coupling by preventing objects from referring to each other explicitly, allowing their interaction to vary independently. Classic real-world analogy: Air Traffic Control (ATC) tower—airplanes do not communicate directly with other airplanes; they communicate exclusively through the central ATC mediator.',
    keyPoints: [
      'Replaces many-to-many communication with one-to-many communication.',
      'Centralizes control logic, but mediator class can become a complex God Object if overloaded.',
    ],
    followUps: [
      {
        question: 'How is Mediator used in UI dialog design?',
        answer: 'A DialogController acts as mediator between Checkboxes, TextBoxes, and SubmitButtons, enabling/disabling controls without widgets referencing each other.',
      },
    ],
    companies: ['Deloitte', 'Infosys'],
    tags: ['Design Patterns', 'Mediator', 'Behavioral'],
  },
  {
    id: 'oops-34',
    categoryId: 'cs-oops',
    title: 'What is the Memento Design Pattern?',
    difficulty: 'INTERMEDIATE',
    answer:
      'The Memento pattern captures and externalizes an object’s internal state without violating encapsulation, allowing the object to be restored to this state later. Participants: 1. Originator (the object whose state is saved and restored), 2. Memento (the immutable snapshot of state), 3. Caretaker (manages the history of mementos, e.g. Undo/Redo manager, without inspecting their contents).',
    keyPoints: [
      'Provides clean undo/rollback capabilities without exposing private object fields.',
      'Can consume significant memory if snapshots store large full-state copies.',
    ],
    followUps: [
      {
        question: 'How do you optimize memory in the Memento pattern for large objects?',
        answer: 'Store state deltas (incremental changes) rather than full state snapshots.',
      },
    ],
    companies: ['Deloitte', 'Infosys'],
    tags: ['Design Patterns', 'Memento', 'Undo'],
  },
  {
    id: 'oops-35',
    categoryId: 'cs-oops',
    title: 'What is the difference between Aggregation and Inheritance?',
    difficulty: 'BEGINNER',
    answer:
      'Inheritance represents an "is-a" relationship where a subclass acquires features of a superclass at compile time (e.g. Dog is an Animal). It creates tight coupling. Aggregation represents a "has-a" relationship where a class contains a reference to another independent class (e.g. Car has an Engine). It creates loose coupling and allows swapping components at runtime.',
    keyPoints: [
      'Inheritance = "is-a" (white-box reuse; subclass sees internals).',
      'Aggregation = "has-a" (black-box reuse; interacts only via public API).',
    ],
    followUps: [
      {
        question: 'When is Inheritance strictly appropriate?',
        answer: 'When a genuine hierarchical "is-a" relationship exists, and the subclass is truly a specialized subtype that satisfies the Liskov Substitution Principle.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini'],
    tags: ['Inheritance', 'Aggregation', 'OOPs'],
  },
  {
    id: 'oops-36',
    categoryId: 'cs-oops',
    title: 'Explain Polymorphism in C++: Virtual Functions and Pure Virtual Functions.',
    difficulty: 'INTERMEDIATE',
    answer:
      'In C++, member functions are non-virtual by default (statically bound). Declaring a method virtual virtual void sound(); enables dynamic dispatch via vtable. A Pure Virtual Function is declared with = 0 (e.g. virtual void draw() = 0;). It has no body in the base class and makes the class an Abstract Class. Any concrete derived class MUST provide an implementation for all pure virtual functions to be instantiable.',
    keyPoints: [
      'Always declare base class destructors as virtual virtual ~Base() to ensure derived destructors are called on delete.',
      'Classes with pure virtual functions cannot be instantiated.',
    ],
    followUps: [
      {
        question: 'What happens if a base class destructor is NOT virtual in C++?',
        answer: 'Deleting a derived object through a base pointer causes undefined behavior; typically derived class memory/resources leak.',
      },
    ],
    companies: ['TCS', 'Capgemini', 'HCL'],
    tags: ['C++', 'Virtual Functions', 'Polymorphism'],
  },
  {
    id: 'oops-37',
    categoryId: 'cs-oops',
    title: 'What is the Chain of Responsibility Design Pattern?',
    difficulty: 'INTERMEDIATE',
    answer:
      'The Chain of Responsibility pattern passes a request along a chain of handler objects. Upon receiving a request, each handler decides either to process the request or pass it to the next handler in the chain. It decouples the sender from receivers. Classic examples: HTTP Middleware pipelines in Express.js / ASP.NET, exception handling try-catch blocks, and logging level filters.',
    keyPoints: [
      'Clients can assemble or reorder handler chains dynamically at runtime.',
      'A request can fall off the end of the chain if no handler accepts it.',
    ],
    followUps: [
      {
        question: 'How does Express.js middleware utilize Chain of Responsibility?',
        answer: 'Each middleware receives (req, res, next). It performs an action and either calls next() to pass to the next handler or sends a response terminating the chain.',
      },
    ],
    companies: ['Deloitte', 'Infosys'],
    tags: ['Design Patterns', 'Chain of Responsibility', 'Middleware'],
  },
  {
    id: 'oops-38',
    categoryId: 'cs-oops',
    title: 'What is the Copy Constructor in OOPs?',
    difficulty: 'BEGINNER',
    answer:
      'A Copy Constructor is a specialized constructor that initializes a new object using an existing object of the same class. In C++, it has the signature ClassName(const ClassName& other) and is automatically invoked during pass-by-value and return-by-value. In Java, copy constructors are explicitly defined (e.g. public Employee(Employee other)) as a clean, type-safe alternative to Object.clone().',
    keyPoints: [
      'Must perform deep copy of dynamically allocated heap pointers to prevent double-free bugs in C++.',
      'Java uses copy constructors as preferred idiom for cloning immutable object graphs.',
    ],
    followUps: [
      {
        question: 'Why must the parameter of a copy constructor in C++ be passed by reference (&)?',
        answer: 'Passing by value would require calling the copy constructor itself to pass the parameter, causing infinite recursive calls.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini'],
    tags: ['Constructors', 'Copy Constructor', 'C++'],
  },
  {
    id: 'oops-39',
    categoryId: 'cs-oops',
    title: 'What is the Open-Closed Principle and how do you achieve it?',
    difficulty: 'BEGINNER',
    answer:
      'The Open-Closed Principle (the "O" in SOLID) states that software artifacts (classes, modules, functions) should be open for extension, but closed for modification. You should be able to introduce new behavior without touching or editing existing, tested source code. Achieved primarily through Abstraction, Interfaces, and Polymorphism (such as Strategy Pattern or Plugin architectures).',
    keyPoints: [
      'Prevents regression bugs in existing production features when adding new requirements.',
      'Interfaces and abstract base classes act as extension points.',
    ],
    followUps: [
      {
        question: 'What is a code smell that indicates an OCP violation?',
        answer: 'Repeated switch statements or if-else ladders checking object types or enum codes across multiple methods.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Cognizant'],
    tags: ['SOLID', 'OCP', 'Clean Code'],
  },
  {
    id: 'oops-40',
    categoryId: 'cs-oops',
    title: 'What is Multiple Inheritance and why did Java replace it with Interfaces?',
    difficulty: 'BEGINNER',
    answer:
      'Multiple Inheritance allows a derived class to inherit directly from more than one base class (supported in C++ and Python). It introduces severe architectural complexities: the Diamond Problem (ambiguity when two parents define the same method/field), memory layout complications, and constructor chaining ambiguity. Java eliminated multiple class inheritance of state, allowing single class inheritance while permitting classes to implement multiple interfaces, achieving behavioral polymorphism cleanly.',
    keyPoints: [
      'Java classes: single inheritance of state.',
      'Java interfaces: multiple inheritance of behavior (with default methods in Java 8+ resolved at compile-time).',
    ],
    followUps: [
      {
        question: 'How does C++ solve the diamond problem?',
        answer: 'Using virtual base classes (class B : virtual public A), which forces only one shared instance of the common ancestor in memory.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro'],
    tags: ['Multiple Inheritance', 'Diamond Problem', 'Interfaces'],
  },
];
