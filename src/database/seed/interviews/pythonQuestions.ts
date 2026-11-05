import { SeedInterviewQuestion } from './types';

export const PYTHON_QUESTIONS: SeedInterviewQuestion[] = [
  {
    id: 'py-01',
    categoryId: 'prog-python',
    title: 'What is the Global Interpreter Lock (GIL) and how does it affect concurrency?',
    difficulty: 'ADVANCED',
    answer:
      'The GIL is a mutex lock used by CPython (the reference implementation of Python) to prevent multiple native OS threads from executing Python bytecode simultaneously. It exists because CPython’s memory management is not thread-safe and relies on reference counting. Consequently, multithreading in Python does NOT speed up CPU-bound tasks on multicore processors; however, multithreading is effective for I/O-bound tasks (network, disk) because I/O operations release the GIL while waiting.',
    keyPoints: [
      'GIL affects only CPython; alternatives like Jython and IronPython do not have a GIL.',
      'For CPU-bound tasks, use the `multiprocessing` module or native C extensions to bypass GIL.',
      'PEP 703 (Python 3.13+) introduces free-threaded Python with an optional build that disables GIL.',
    ],
    followUps: [
      {
        question: 'When does a thread release the GIL during execution?',
        answer: 'During I/O operations, during long-running C extension operations, or after a certain number of bytecode instructions (sys.getswitchinterval()).',
      },
    ],
    companies: ['Infosys', 'Deloitte', 'TCS', 'InfoCepts'],
    tags: ['GIL', 'Concurrency', 'CPython', 'Multithreading'],
  },
  {
    id: 'py-02',
    categoryId: 'prog-python',
    title: 'How does Memory Management and Garbage Collection work in Python?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Python memory management uses two complementary mechanisms: 1. Reference Counting: Every object maintains a counter (ob_refcnt). When a reference is created, count increments; when deleted or out of scope, count decrements. When count hits 0, memory is immediately deallocated. 2. Generational Cyclic Garbage Collector (gc module): Reference counting cannot reclaim reference cycles (e.g., A references B and B references A). The cyclic GC inspects three generations (Gen 0, Gen 1, Gen 2) using heuristic thresholds to detect and collect cyclic isolated graphs.',
    codeExample: `import gc
# Force immediate cyclic collection:
gc.collect()`,
    keyPoints: [
      'Reference counting handles the vast majority (>95%) of memory cleanup instantly.',
      'Cyclic GC detects self-referential objects and collections.',
      'PyMalloc is Python’s internal small-object memory allocator (<512 bytes).',
    ],
    followUps: [
      {
        question: 'How do you create a reference cycle in Python?',
        answer: 'a = []; b = []; a.append(b); b.append(a); del a; del b;',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'InfoCepts'],
    tags: ['Memory', 'Garbage Collection', 'Internals'],
  },
  {
    id: 'py-03',
    categoryId: 'prog-python',
    title: 'What is the difference between mutable and immutable types in Python?',
    difficulty: 'BEGINNER',
    answer:
      'Mutable objects can have their state or contents modified in-place after creation without changing their memory address (id). Examples: list, dict, set, bytearray. Immutable objects cannot be modified after creation; any operation that appears to modify them actually creates a new object in memory. Examples: int, float, bool, str, tuple, frozenset.',
    codeExample: `a = [1, 2, 3]
print(id(a))
a.append(4)
print(id(a)) # Same id! Mutated in-place

s = "hello"
print(id(s))
s += " world"
print(id(s)) # Different id! New string allocated`,
    keyPoints: [
      'Only immutable objects (or tuples containing solely immutable elements) can be used as dictionary keys or set elements.',
      'Default parameter values in functions should NEVER be mutable objects (like def f(x=[]):).',
    ],
    followUps: [
      {
        question: 'What is the danger of using a mutable default argument in a Python function?',
        answer: 'Default arguments are evaluated ONCE at function definition time, so the same mutable instance is shared across all subsequent invocations.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro'],
    tags: ['Mutability', 'Data Types', 'Core Python'],
  },
  {
    id: 'py-04',
    categoryId: 'prog-python',
    title: 'What are Generators and the yield keyword, and how do they save memory?',
    difficulty: 'INTERMEDIATE',
    answer:
      'A Generator is a special type of function that returns an iterator object producing a sequence of values lazily on-demand. When a function contains the yield keyword, calling it does not execute the body immediately; instead, it returns a generator object. When next() is called, execution proceeds until it encounters yield, which emits the value and pauses execution state (stack frame preserved). This saves massive RAM because values are not computed or stored in memory simultaneously.',
    codeExample: `def read_large_file(file_path):
    with open(file_path, 'r') as f:
        for line in f:
            yield line.strip() # Emits 1 line at a time, O(1) memory usage!

# Generator comprehension:
gen = (x * x for x in range(10_000_000)) # Zero memory allocation upfront`,
    keyPoints: [
      'Generators implement the Iterator protocol (__iter__ and __next__).',
      'When exhausted, generators raise StopIteration.',
      'Generator comprehensions use parentheses () instead of brackets [].',
    ],
    followUps: [
      {
        question: 'What is the difference between return and yield?',
        answer: 'return terminates the function and destroys the local stack frame. yield suspends the function, returning a value while retaining local variable state for resumption.',
      },
    ],
    companies: ['Infosys', 'Deloitte', 'Cognizant', 'InfoCepts'],
    tags: ['Generators', 'Yield', 'Memory Optimization'],
  },
  {
    id: 'py-05',
    categoryId: 'prog-python',
    title: 'What are Decorators in Python and how do you write a custom decorator?',
    difficulty: 'INTERMEDIATE',
    answer:
      'A Decorator is a higher-order function that takes another function as an argument, extends or modifies its behavior without modifying its source code, and returns the wrapped function. It is syntactic sugar for wrapper = decorator(func). Using @functools.wraps preserves original function metadata (name, docstring).',
    codeExample: `import time
from functools import wraps

def timing_decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        duration = time.perf_counter() - start
        print(f"{func.__name__} took {duration:.4f}s")
        return result
    return wrapper

@timing_decorator
def calculate():
    time.sleep(0.1)

calculate()`,
    keyPoints: [
      'Always use @functools.wraps(func) inside the decorator wrapper to retain __name__ and __doc__.',
      'Decorators can be chained from bottom to top: @dec1 then @dec2 executes dec1(dec2(func)).',
      'Decorators with arguments require 3 nested function levels.',
    ],
    followUps: [
      {
        question: 'How do you write a decorator that accepts arguments (e.g., @repeat(num_times=3))?',
        answer: 'Create an outer function that accepts the decorator arguments and returns the actual decorator function.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['Decorators', 'Functional', 'Metaprogramming'],
  },
  {
    id: 'py-06',
    categoryId: 'prog-python',
    title: 'Explain the LEGB rule for variable scope in Python.',
    difficulty: 'BEGINNER',
    answer:
      'LEGB defines the order of namespaces Python searches to resolve a variable name: 1. Local (L): Names assigned inside the current function/lambda, 2. Enclosing (E): Names in outer enclosing functions (closures), 3. Global (G): Names assigned at the top-level of the module file or declared via global, 4. Built-in (B): Pre-assigned names in the builtins module (e.g. len, range, print).',
    codeExample: `x = "global"

def outer():
    x = "enclosing"
    def inner():
        nonlocal x # Modifies outer enclosing x
        x = "modified enclosing"
    inner()
    print(x) # prints 'modified enclosing'`,
    keyPoints: [
      'global keyword binds a local variable to module-level global scope.',
      'nonlocal keyword binds a variable to the nearest enclosing non-global scope (used in closures).',
    ],
    followUps: [
      {
        question: 'What error occurs if you read a global variable and then assign to it in the same function without declaring global?',
        answer: 'UnboundLocalError: local variable referenced before assignment.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro'],
    tags: ['Scope', 'LEGB', 'Closures'],
  },
  {
    id: 'py-07',
    categoryId: 'prog-python',
    title: 'What is the difference between *args and **kwargs in function definitions?',
    difficulty: 'BEGINNER',
    answer:
      '*args allows a function to accept any number of positional arguments, collected into a tuple. **kwargs allows a function to accept any number of keyword (named) arguments, collected into a dictionary. The names args and kwargs are conventional; the actual syntax is the asterisk (*) and double asterisk (**).',
    codeExample: `def configure(name, *args, **kwargs):
    print(f"Name: {name}")
    print(f"Extra positional: {args}")   # tuple
    print(f"Extra keyword: {kwargs}")     # dict

configure("App", 1, 2, timeout=30, debug=True)`,
    keyPoints: [
      'Order in signature: def func(pos_only, /, standard, *args, kw_only, **kwargs):',
      '* and ** can also be used as unpacking operators when calling functions.',
    ],
    followUps: [
      {
        question: 'What is keyword-only argument syntax in Python 3?',
        answer: 'Any parameter declared after a bare * or *args can only be passed as a keyword argument (e.g., def f(a, *, b):).',
      },
    ],
    companies: ['TCS', 'Infosys', 'Cognizant'],
    tags: ['Functions', 'Args', 'Kwargs'],
  },
  {
    id: 'py-08',
    categoryId: 'prog-python',
    title: 'What are Context Managers and how does the with statement work?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Context Managers guarantee that resources are cleanly acquired and released (like closing file handles, database connections, or mutex locks). The with statement executes the __enter__() method of the context manager on entry and guarantees execution of the __exit__(exc_type, exc_val, exc_tb) method upon exiting the block, even if an exception is raised.',
    codeExample: `class DatabaseSession:
    def __enter__(self):
        print("Connected to DB")
        return self
    def __exit__(self, exc_type, exc_val, exc_tb):
        print("Closed DB Connection")
        return False # propagate exceptions if any

with DatabaseSession() as db:
    print("Executing queries...")`,
    keyPoints: [
      'Can also be implemented using the @contextlib.contextmanager generator decorator with try-finally.',
      'If __exit__ returns True, any exception raised in the with block is suppressed.',
    ],
    followUps: [
      {
        question: 'How do you create a context manager using @contextmanager?',
        answer: 'Define a generator with a single yield; setup code goes before yield, cleanup code goes in finally after yield.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['Context Manager', 'With', 'OOPs'],
  },
  {
    id: 'py-09',
    categoryId: 'prog-python',
    title: 'What is Method Resolution Order (MRO) and C3 Linearization in Python?',
    difficulty: 'ADVANCED',
    answer:
      'In multiple inheritance, MRO is the deterministic order in which Python searches parent classes for a method or attribute. Python uses the C3 Linearization algorithm to compute the MRO, guaranteeing three properties: 1. Children precede parents, 2. Order of parents in class definition is preserved, 3. Monotonicity (a class always appears in the same relative order in every subclass). Inspect via ClassName.__mro__ or ClassName.mro().',
    codeExample: `class A: pass
class B(A): pass
class C(A): pass
class D(B, C): pass

print(D.__mro__) # (D, B, C, A, object)`,
    keyPoints: [
      'super() uses the MRO of the calling instance to determine the next class, not just the immediate parent.',
      'Prevents duplicate method execution in diamond inheritance graphs.',
    ],
    followUps: [
      {
        question: 'What error occurs if an inheritance hierarchy violates C3 linearization?',
        answer: 'TypeError: Cannot create a consistent method resolution order (MRO).',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'InfoCepts'],
    tags: ['MRO', 'Inheritance', 'OOPs'],
  },
  {
    id: 'py-10',
    categoryId: 'prog-python',
    title: 'What is the difference between @staticmethod, @classmethod, and instance methods?',
    difficulty: 'INTERMEDIATE',
    answer:
      '1. Instance methods receive the instance (self) as the first argument, allowing access and modification of object instance state. 2. @classmethod receives the class object (cls) as the first argument, allowing access to class-level state and serving as alternative factory constructors. 3. @staticmethod receives neither self nor cls; it acts like a plain function placed inside the class namespace for logical grouping.',
    codeExample: `class Date:
    def __init__(self, year, month, day):
        self.year = year
        self.month = month
        self.day = day

    @classmethod
    def from_string(cls, date_str): # Factory constructor
        y, m, d = map(int, date_str.split('-'))
        return cls(y, m, d)

    @staticmethod
    def is_valid_year(year): # Independent utility
        return 1900 <= year <= 2100`,
    keyPoints: [
      '@classmethod is often used for polymorphic factory constructors.',
      '@staticmethod can be overridden by subclasses.',
    ],
    followUps: [
      {
        question: 'Can a classmethod be called on an instance?',
        answer: 'Yes, date_instance.from_string(...) works; Python passes the instance’s __class__ as cls.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Deloitte', 'Capgemini'],
    tags: ['OOPs', 'Classmethod', 'Staticmethod'],
  },
  {
    id: 'py-11',
    categoryId: 'prog-python',
    title: 'What is __slots__ in Python and how does it optimize memory?',
    difficulty: 'ADVANCED',
    answer:
      'By default, Python stores an object’s instance attributes in a dynamic dictionary (__dict__). This allows adding arbitrary attributes at runtime, but each __dict__ consumes significant RAM overhead (~100-150 bytes per instance). Specifying __slots__ = ("attr1", "attr2") instructs Python to allocate a fixed-size C-array of attribute pointers instead of __dict__, saving 40-70% memory when instantiating millions of small objects.',
    codeExample: `class Point:
    __slots__ = ('x', 'y') # No __dict__ allocated!
    def __init__(self, x, y):
        self.x = x
        self.y = y

p = Point(1, 2)
# p.z = 3 raises AttributeError: 'Point' object has no attribute 'z'`,
    keyPoints: [
      'Subclasses must also declare __slots__, otherwise they will have a __dict__.',
      'Slightly faster attribute access speed in addition to RAM savings.',
    ],
    followUps: [
      {
        question: 'Can you use weak references with a class that defines __slots__?',
        answer: 'Only if "__weakref__" is explicitly included in the __slots__ tuple.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts'],
    tags: ['Slots', 'Memory Optimization', 'Internals'],
  },
  {
    id: 'py-12',
    categoryId: 'prog-python',
    title: 'How does asyncio and the async/await syntax work in Python?',
    difficulty: 'ADVANCED',
    answer:
      'asyncio is a library for concurrent single-threaded asynchronous I/O execution using an Event Loop. Functions defined with async def are coroutines. When an async operation is called with await, execution of the current coroutine is paused, yielding control back to the event loop to execute other ready tasks until the awaited I/O completes. This enables thousands of concurrent network connections without thread OS overhead.',
    codeExample: `import asyncio

async def fetch_data(id):
    await asyncio.sleep(1) # Simulates network I/O
    return f"Data {id}"

async def main():
    results = await asyncio.gather(fetch_data(1), fetch_data(2), fetch_data(3))
    print(results)

asyncio.run(main())`,
    keyPoints: [
      'Never run blocking CPU code or synchronous time.sleep() inside async coroutines (it blocks the whole event loop).',
      'Use loop.run_in_executor() for running legacy synchronous or CPU-heavy code.',
    ],
    followUps: [
      {
        question: 'What is the difference between asyncio.gather() and asyncio.as_completed()?',
        answer: 'gather() waits for all futures and returns results in submitted order. as_completed() yields an iterator of futures as they finish, regardless of order.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'InfoCepts'],
    tags: ['Asyncio', 'Async/Await', 'Concurrency'],
  },
  {
    id: 'py-13',
    categoryId: 'prog-python',
    title: 'What is the difference between copy() and deepcopy() in Python?',
    difficulty: 'BEGINNER',
    answer:
      'copy.copy() creates a shallow copy: a new outer container object is constructed, but its inner elements are references to the original object’s child elements. copy.deepcopy() recursively clones the entire object hierarchy, creating independent duplicate copies of all nested objects. Modifying nested data in a shallow copy affects the original; deepcopy does not.',
    codeExample: `import copy
orig = [[1, 2], [3, 4]]
shallow = copy.copy(orig)
deep = copy.deepcopy(orig)

orig[0][0] = 99
print(shallow[0][0]) # 99 (Shared nested list!)
print(deep[0][0])    # 1 (Independent copy)`,
    keyPoints: [
      'Slice notation list[:] and dict.copy() perform shallow copies.',
      'deepcopy handles circular references safely via an internal memo dictionary.',
    ],
    followUps: [
      {
        question: 'How does deepcopy handle recursive/circular data structures without infinite loops?',
        answer: 'It maintains a memo dictionary mapping the id of already copied objects to their duplicates.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro'],
    tags: ['Copy', 'Memory', 'Collections'],
  },
  {
    id: 'py-14',
    categoryId: 'prog-python',
    title: 'Explain Python list comprehensions vs map() and filter().',
    difficulty: 'BEGINNER',
    answer:
      'List comprehensions offer a readable, declarative syntax for filtering and transforming iterables into lists ([expr for x in iterable if condition]). map(func, iterable) and filter(pred, iterable) are functional built-ins that return lazy iterator objects. List comprehensions are generally more readable, preferred by PEP 8, and often faster than map with lambda because lambda calls incur Python bytecode stack frame overhead.',
    codeExample: `# List comprehension:
squares = [x * x for x in range(10) if x % 2 == 0]

# Equivalent functional approach:
squares_map = list(map(lambda x: x * x, filter(lambda x: x % 2 == 0, range(10))))`,
    keyPoints: [
      'List comprehensions evaluate eagerly into memory.',
      'Generator expressions (x for x in ...) evaluate lazily on iteration.',
    ],
    followUps: [
      {
        question: 'Can you have nested loops in a list comprehension?',
        answer: 'Yes: [x for row in matrix for x in row] flattens a 2D matrix in order.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Accenture'],
    tags: ['Comprehensions', 'Functional'],
  },
  {
    id: 'py-15',
    categoryId: 'prog-python',
    title: 'What are Dunder (Magic) Methods in Python?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Dunder (Double Underscore) methods are special predefined methods in Python prefixed and suffixed with double underscores (e.g. __init__, __str__, __len__, __getitem__). They allow user-defined classes to emulate built-in types and hook into operator overloading and language protocols (such as iteration, indexing, string representation, and arithmetic).',
    codeExample: `class Vector:
    def __init__(self, x, y):
        self.x, self.y = x, y
    def __add__(self, other): # Overloads + operator
        return Vector(self.x + other.x, self.y + other.y)
    def __repr__(self):
        return f"Vector({self.x}, {self.y})"

v1 = Vector(1, 2)
v2 = Vector(3, 4)
print(v1 + v2) # Vector(4, 6)`,
    keyPoints: [
      '__repr__ is for developers (unambiguous, machine-readable); __str__ is for end-users (pretty).',
      '__len__ must return a non-negative integer.',
      '__getitem__ and __setitem__ enable dictionary/list indexing syntax.',
    ],
    followUps: [
      {
        question: 'What is the fallback if __str__ is not defined on a class?',
        answer: 'Python falls back to calling __repr__.',
      },
    ],
    companies: ['Infosys', 'Deloitte', 'Capgemini'],
    tags: ['Dunder Methods', 'OOPs', 'Operator Overloading'],
  },
  {
    id: 'py-16',
    categoryId: 'prog-python',
    title: 'What is Duck Typing and the EAFP principle in Python?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Duck Typing originates from the phrase: "If it walks like a duck and quacks like a duck, it’s a duck." Python does not check an object’s explicit type, only whether it provides the required methods/attributes. EAFP stands for "Easier to Ask for Forgiveness than Permission"—the Pythonic style of assuming attributes/keys exist and handling exceptions (try-except) rather than pre-checking conditions (if-else), which avoids race conditions (TOCTOU).',
    codeExample: `# LBYL (Look Before You Leap) style:
if "key" in my_dict:
    val = my_dict["key"]

# EAFP (Pythonic) style:
try:
    val = my_dict["key"]
except KeyError:
    val = default_val`,
    keyPoints: [
      'EAFP is faster when the expected case succeeds most of the time.',
      'Prevents race conditions in multithreaded and filesystem operations.',
    ],
    followUps: [
      {
        question: 'Why is EAFP safer for file checking than os.path.exists()?',
        answer: 'Another process could delete the file between the os.path.exists() check and the open() call (Time-of-Check to Time-of-Use race condition).',
      },
    ],
    companies: ['Infosys', 'Deloitte'],
    tags: ['Duck Typing', 'EAFP', 'Pythonic'],
  },
  {
    id: 'py-17',
    categoryId: 'prog-python',
    title: 'How does Python implement Dictionaries internally?',
    difficulty: 'ADVANCED',
    answer:
      'Python dictionaries (dict) are hash tables. Since Python 3.6+, dicts use a compact, insertion-ordered layout. Instead of a sparse hash table array holding keys and values, it maintains a dense entries array storing [hash, key, value] in insertion order, and an indices array holding integer offsets. Hash collisions are resolved using Open Addressing with Pseudo-Random Probing (perturbation formula: (5 * j + 1 + perturb) & mask).',
    keyPoints: [
      'Average time complexity: O(1) lookup, insertion, and deletion.',
      'Dictionaries maintain insertion order by default in Python 3.7+ language specification.',
      'Keys must be hashable (__hash__ and __eq__).',
    ],
    followUps: [
      {
        question: 'What happens when a dict becomes too full?',
        answer: 'When the load factor exceeds 2/3 (~66%), the table resizes to double or quadruple capacity, reindexing all entries.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts', 'Infosys'],
    tags: ['Dictionaries', 'Hash Table', 'Internals'],
  },
  {
    id: 'py-18',
    categoryId: 'prog-python',
    title: 'What is the difference between is and == in Python?',
    difficulty: 'BEGINNER',
    answer:
      '== is the equality operator; it checks whether the values/contents of two objects are equal by calling the __eq__() dunder method. is is the identity operator; it checks whether two references point to the exact same object in memory by comparing their memory addresses (id(a) == id(b)).',
    codeExample: `a = [1, 2, 3]
b = [1, 2, 3]

print(a == b) # True (Same content)
print(a is b) # False (Different objects in memory)

c = a
print(c is a) # True (Same memory address)`,
    keyPoints: [
      'Always use "is" or "is not" when checking for None: if val is None:.',
      'Small integers (-5 to 256) and short strings are interned by CPython, so a = 100; b = 100; a is b returns True.',
    ],
    followUps: [
      {
        question: 'Why does "a = 256; b = 256; a is b" evaluate to True, but for 257 it might evaluate to False in the interactive REPL?',
        answer: 'CPython pre-allocates an integer cache for numbers from -5 to 256 at startup.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro'],
    tags: ['Operators', 'Identity', 'Equality'],
  },
  {
    id: 'py-19',
    categoryId: 'prog-python',
    title: 'What are Metaclasses in Python and how are they used?',
    difficulty: 'ADVANCED',
    answer:
      'In Python, classes are themselves objects created by metaclasses. The default metaclass for all classes is type. A custom metaclass is a class that inherits from type and intercepts class creation, allowing modification of class attributes, enforcing API constraints, or auto-registering plugins before the class is constructed.',
    codeExample: `class EnforceUppercaseMeta(type):
    def __new__(cls, name, bases, attrs):
        # Enforce that all methods must be lowercase
        for attr_name in attrs:
            if not attr_name.startswith('__') and not attr_name.islower():
                raise TypeError(f"Method {attr_name} must be all lowercase")
        return super().__new__(cls, name, bases, attrs)

class MyService(metaclass=EnforceUppercaseMeta):
    def valid_method(self): pass`,
    keyPoints: [
      'Metaclass hierarchy: object is an instance of type; type is a subclass of object.',
      'Metaclasses power ORMs like Django and validation libraries like Pydantic.',
    ],
    followUps: [
      {
        question: 'What is __init_subclass__ introduced in Python 3.6 as an alternative to metaclasses?',
        answer: 'A simpler hook method called when a class is subclassed, allowing validation without needing full metaclass machinery.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts'],
    tags: ['Metaclasses', 'Advanced Python', 'OOPs'],
  },
  {
    id: 'py-20',
    categoryId: 'prog-python',
    title: 'Explain Lambda Functions in Python with limitations.',
    difficulty: 'BEGINNER',
    answer:
      'A lambda function is an anonymous, inline function defined using the lambda keyword: lambda arguments: expression. It can take any number of arguments but can only contain a SINGLE expression that is implicitly returned. It cannot contain statements, assignments, loops (while/for), or docstrings.',
    codeExample: `add = lambda x, y: x + y
print(add(5, 3)) # 8

# Common usage: sorting by dictionary key
data = [{'name': 'Bob', 'age': 25}, {'name': 'Alice', 'age': 22}]
data.sort(key=lambda item: item['age'])`,
    keyPoints: [
      'PEP 8 recommends against assigning a lambda to a variable name (use standard def instead).',
      'Best used for short throwaway functions passed into sort(key=), map(), or filter().',
    ],
    followUps: [
      {
        question: 'Can you write a multi-line lambda function in Python?',
        answer: 'No, Python syntax restricts lambda bodies strictly to a single expression.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini'],
    tags: ['Lambda', 'Functions'],
  },
  {
    id: 'py-21',
    categoryId: 'prog-python',
    title: 'What is the difference between append() and extend() on a Python list?',
    difficulty: 'BEGINNER',
    answer:
      'append(element) adds its argument as a single element to the end of the list (e.g., appending a list adds the entire sublist as one nested item). extend(iterable) iterates over the argument and appends each element individually to the end of the list, flattening one level.',
    codeExample: `list1 = [1, 2]
list1.append([3, 4])
print(list1) # [1, 2, [3, 4]]

list2 = [1, 2]
list2.extend([3, 4])
print(list2) # [1, 2, 3, 4]`,
    keyPoints: [
      'list.extend(iter) is equivalent to list += iter in-place.',
      'Both modify the original list in-place and return None.',
    ],
    followUps: [
      {
        question: 'What is the time complexity of list.append()?',
        answer: 'Amortized O(1) time complexity.',
      },
    ],
    companies: ['TCS', 'Wipro', 'Cognizant'],
    tags: ['Lists', 'Data Structures'],
  },
  {
    id: 'py-22',
    categoryId: 'prog-python',
    title: 'How does string formatting work in Python? (%, format, f-strings)',
    difficulty: 'BEGINNER',
    answer:
      'Python supports 3 formatting styles: 1. %-formatting (printf style, e.g. "%s is %d" % (name, age) - legacy), 2. str.format() (e.g. "{} is {}".format(name, age) - Python 2.7/3.0), 3. f-strings (Formatted string literals, e.g. f"{name} is {age}" - Python 3.6+). f-strings are evaluated at runtime, support inline arbitrary expressions, and are substantially faster because they compile into optimized BUILD_STRING bytecode.',
    codeExample: `name = "Antigravity"
score = 98.456
print(f"Agent {name.upper()}: Score = {score:.2f}") # Agent ANTIGRAVITY: Score = 98.46`,
    keyPoints: [
      'f-strings are evaluated at runtime, not constant string interpolation.',
      'Support format specifiers like :.2f, :>10 (padding), and = (debugging: f"{x=}").',
    ],
    followUps: [
      {
        question: 'What does f"{val=}" do in Python 3.8+?',
        answer: 'It prints both the variable expression name and its evaluated value, e.g. "val=42", useful for quick debugging.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini'],
    tags: ['Strings', 'F-Strings'],
  },
  {
    id: 'py-23',
    categoryId: 'prog-python',
    title: 'Explain Python try-except-else-finally blocks.',
    difficulty: 'INTERMEDIATE',
    answer:
      'try: Contains code that may raise an exception. except: Catches and handles specific exception types. else: Executes ONLY IF no exception was raised in the try block. finally: Executes ALWAYS, regardless of whether exceptions were raised, caught, or unhandled (ideal for resource deallocation like closing sockets).',
    codeExample: `try:
    f = open("data.txt", "r")
except FileNotFoundError:
    print("File not found")
else:
    print("File opened successfully; reading content...")
    content = f.read()
finally:
    print("Cleanup block executed")`,
    keyPoints: [
      'The else block prevents accidentally catching unintended exceptions in error-handling code.',
      'finally always runs even if return, break, or continue is executed inside try or except.',
    ],
    followUps: [
      {
        question: 'Does the finally block execute if sys.exit() is called in the try block?',
        answer: 'Yes, because sys.exit() raises SystemExit which is caught by finally; only os._exit() prevents finally execution.',
      },
    ],
    companies: ['Infosys', 'Deloitte', 'HCL'],
    tags: ['Exceptions', 'Control Flow'],
  },
  {
    id: 'py-24',
    categoryId: 'prog-python',
    title: 'What is the purpose of if __name__ == "__main__": in Python?',
    difficulty: 'BEGINNER',
    answer:
      '__name__ is a special built-in variable. When a Python file is executed directly from the terminal (e.g. python script.py), the interpreter sets __name__ = "__main__". When the file is imported as a module into another script (e.g. import script), __name__ is set to the module name. This boilerplate allows code inside the block to run only when invoked directly as a standalone script.',
    keyPoints: [
      'Prevents executable code, CLI handlers, or test suites from running inadvertently upon import.',
      'Enables modular and reusable code design.',
    ],
    followUps: [
      {
        question: 'Can you access functions defined in a module if they are outside the if __name__ == "__main__" block?',
        answer: 'Yes, all functions and classes defined in the module can be imported and utilized normally.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Wipro', 'Capgemini'],
    tags: ['Modules', 'Core Python'],
  },
  {
    id: 'py-25',
    categoryId: 'prog-python',
    title: 'What are Python Closures and how are they created?',
    difficulty: 'INTERMEDIATE',
    answer:
      'A Closure is a nested function that retains access to variables in its outer enclosing scope even after the outer function has finished executing and returned. Requirements: 1. A nested function, 2. The nested function references a variable from the enclosing function, 3. The enclosing function returns the nested function object.',
    codeExample: `def make_multiplier(factor):
    # 'factor' is enclosed in the closure environment:
    def multiply(x):
        return x * factor
    return multiply

double = make_multiplier(2)
print(double(5)) # 10`,
    keyPoints: [
      'Captured free variables are stored in the inner function’s __closure__ attribute as cell objects.',
      'Closures are the foundational mechanism behind Python decorators.',
    ],
    followUps: [
      {
        question: 'How do you inspect the captured variables of a closure in Python?',
        answer: 'Using func.__closure__[i].cell_contents.',
      },
    ],
    companies: ['Deloitte', 'Infosys'],
    tags: ['Closures', 'Functional', 'Scope'],
  },
  {
    id: 'py-26',
    categoryId: 'prog-python',
    title: 'What is the difference between range() and xrange() in Python?',
    difficulty: 'BEGINNER',
    answer:
      'In Python 2, range() generated an entire list of numbers in memory, while xrange() was a generator-like sequence object that computed numbers on demand. In Python 3, xrange() was removed and range() was redesigned to behave like xrange(): it is an immutable sequence type that computes elements lazily with O(1) memory overhead, regardless of sequence size.',
    keyPoints: [
      'In Python 3, sys.getsizeof(range(10)) == sys.getsizeof(range(10_000_000)).',
      'Python 3 range supports O(1) membership testing: 5000 in range(1_000_000).',
    ],
    followUps: [
      {
        question: 'Why is "x in range(1000000)" O(1) in Python 3?',
        answer: 'Because range uses arithmetic boundary checking (start <= x < stop and (x - start) % step == 0) rather than scanning elements.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Wipro'],
    tags: ['Range', 'Python 3', 'Sequences'],
  },
  {
    id: 'py-27',
    categoryId: 'prog-python',
    title: 'What are Type Hints and the typing module in modern Python (PEP 484)?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Type hints (introduced in Python 3.5) allow annotating function signatures and variables with expected types. Python remains a dynamically typed language and ignores type hints at runtime, but static analysis tools (mypy, Pyright, IDEs) use them to catch type errors before execution. In modern Python 3.9+, built-in generics like list[str] and dict[str, int] replace typing.List and typing.Dict.',
    codeExample: `from typing import Optional

def get_user_email(user_id: int) -> Optional[str]:
    if user_id > 0:
        return "user@example.com"
    return None`,
    keyPoints: [
      'Union types: int | str in Python 3.10+ replaces Union[int, str].',
      'Type hints improve code documentation, autocompletion, and refactoring safety.',
    ],
    followUps: [
      {
        question: 'Does Python raise a TypeError at runtime if you pass an incorrect type to an annotated function?',
        answer: 'No, type hints are purely metadata and do not enforce types at runtime without external libraries like Pydantic.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'InfoCepts'],
    tags: ['Type Hints', 'Typing', 'Modern Python'],
  },
  {
    id: 'py-28',
    categoryId: 'prog-python',
    title: 'Explain the difference between Multiprocessing and Multithreading in Python.',
    difficulty: 'INTERMEDIATE',
    answer:
      'Multithreading uses multiple threads within a single operating system process. Because all threads share the same memory space and CPython GIL, only one thread executes Python bytecode at any moment; it is best suited for I/O-bound tasks. Multiprocessing spawns separate OS processes, each with its own independent Python interpreter and GIL. It achieves true parallelism across CPU cores and is ideal for CPU-bound computations.',
    keyPoints: [
      'Multiprocessing has higher IPC (Inter-Process Communication) and memory overhead.',
      'Multithreading shares memory easily but is vulnerable to race conditions.',
    ],
    followUps: [
      {
        question: 'How do separate processes share data in Python multiprocessing?',
        answer: 'Using IPC mechanisms like multiprocessing.Queue, multiprocessing.Pipe, or Value/Array shared memory buffers.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'InfoCepts'],
    tags: ['Multiprocessing', 'Multithreading', 'Concurrency'],
  },
  {
    id: 'py-29',
    categoryId: 'prog-python',
    title: 'What are Python Sets and what is the difference between set and frozenset?',
    difficulty: 'BEGINNER',
    answer:
      'A set is an unordered, mutable collection of unique, hashable elements implemented using a hash table. It provides O(1) average time complexity for addition, deletion, and membership lookups. A frozenset is an immutable version of a set; once created, its elements cannot be modified, which makes frozenset hashable and suitable as dictionary keys or elements of other sets.',
    codeExample: `s = {1, 2, 3}
s.add(4) # Valid

fs = frozenset([1, 2, 3])
# fs.add(4) raises AttributeError

# frozenset can be used as a dict key:
lookup = {fs: "Group A"}`,
    keyPoints: [
      'Set elements must be hashable (__hash__ implemented).',
      'Supports mathematical set operations: union (|), intersection (&), difference (-), symmetric difference (^).',
    ],
    followUps: [
      {
        question: 'How do you create an empty set in Python?',
        answer: 'Use s = set(); writing s = {} creates an empty dictionary.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini'],
    tags: ['Sets', 'Collections'],
  },
  {
    id: 'py-30',
    categoryId: 'prog-python',
    title: 'How does zip() and enumerate() work in Python?',
    difficulty: 'BEGINNER',
    answer:
      'enumerate(iterable, start=0) yields pairs containing a running index and the corresponding element, eliminating manual index tracking variables. zip(*iterables) takes multiple iterables and aggregates their elements into tuples, stopping when the shortest iterable is exhausted (or use itertools.zip_longest() to fill missing values).',
    codeExample: `fruits = ['apple', 'banana', 'cherry']
for i, fruit in enumerate(fruits, start=1):
    print(f"{i}: {fruit}")

prices = [10, 20, 30]
for fruit, price in zip(fruits, prices):
    print(f"{fruit} costs {price}")`,
    keyPoints: [
      'Both enumerate and zip return lazy iterator objects in Python 3.',
      'Unzipping: list(zip(*paired_list)) separates pairs back into tuples.',
    ],
    followUps: [
      {
        question: 'What happens if iterables passed to zip() have different lengths?',
        answer: 'By default, zip stops at the shortest iterable; in Python 3.10+, zip(..., strict=True) raises ValueError if lengths differ.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Wipro', 'Capgemini'],
    tags: ['Iterators', 'Built-ins'],
  },
  {
    id: 'py-31',
    categoryId: 'prog-python',
    title: 'What is a Singleton pattern in Python and how do you implement it?',
    difficulty: 'INTERMEDIATE',
    answer:
      'The Singleton pattern ensures that a class has only one instance and provides a global access point to it. In Python, the most Pythonic singleton is simply a module (modules are loaded once and cached in sys.modules). Alternatively, it can be implemented by overriding the __new__() dunder method.',
    codeExample: `class Singleton:
    _instance = None
    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

s1 = Singleton()
s2 = Singleton()
print(s1 is s2) # True`,
    keyPoints: [
      'Overriding __new__ controls object creation before __init__ is called.',
      'A module file in Python is implicitly a thread-safe singleton.',
    ],
    followUps: [
      {
        question: 'Why can __init__ be called multiple times in an overridden __new__ singleton?',
        answer: 'Because Python calls __init__ whenever __new__ returns an instance of that class; you must guard __init__ with an initialized flag.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['Design Patterns', 'Singleton', 'OOPs'],
  },
  {
    id: 'py-32',
    categoryId: 'prog-python',
    title: 'What is the collections module and what are its key data structures?',
    difficulty: 'INTERMEDIATE',
    answer:
      'The collections module provides specialized container datatypes beyond built-in dict, list, set, and tuple: 1. namedtuple (tuple with named fields), 2. deque (double-ended queue with O(1) appends and pops at both ends), 3. Counter (dict subclass for counting hashable objects), 4. OrderedDict (dict that remembered order in Python 2/3.6), 5. defaultdict (dict that returns a default value for missing keys via a callable factory).',
    codeExample: `from collections import Counter, defaultdict

# Counter:
counts = Counter("banana") # Counter({'a': 3, 'n': 2, 'b': 1})

# defaultdict:
groups = defaultdict(list)
groups['fruits'].append('apple') # No KeyError! Automatically initializes list`,
    keyPoints: [
      'deque is thread-safe for appends/pops from opposite ends.',
      'defaultdict factory can be list, int, set, or custom lambda.',
    ],
    followUps: [
      {
        question: 'Why is deque faster than list for queue operations (pop(0))?',
        answer: 'list.pop(0) is O(n) because all subsequent elements must shift left in memory. deque.popleft() is O(1) via doubly linked blocks.',
      },
    ],
    companies: ['Infosys', 'Deloitte', 'Cognizant'],
    tags: ['Collections', 'Data Structures'],
  },
  {
    id: 'py-33',
    categoryId: 'prog-python',
    title: 'How does pass, break, and continue work in Python loops?',
    difficulty: 'BEGINNER',
    answer:
      'pass is a null statement; it acts as a syntactic placeholder where code is required but no action is taken. break terminates the innermost enclosing loop immediately, skipping any loop else clause. continue skips the remainder of the current loop iteration and jumps to the next iteration.',
    keyPoints: [
      'Loops can have an else clause: it executes ONLY IF the loop completes without encountering a break.',
      'pass has zero effect on loop execution flow.',
    ],
    followUps: [
      {
        question: 'When does a for-else block execute?',
        answer: 'When the loop finishes iterating naturally without being interrupted by a break statement.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Wipro'],
    tags: ['Control Flow', 'Loops'],
  },
  {
    id: 'py-34',
    categoryId: 'prog-python',
    title: 'What is itertools and what are useful functions in it?',
    difficulty: 'INTERMEDIATE',
    answer:
      'The itertools module provides building blocks for creating memory-efficient iterators. Key functions: 1. Infinite iterators: count(), cycle(), repeat(), 2. Combinatorics: permutations(), combinations(), product() (Cartesian product), 3. Terminating iterators: chain() (link iterables), islice() (slice iterators), groupby() (group consecutive keys), zip_longest().',
    codeExample: `import itertools

# Cartesian product:
cards = list(itertools.product(['A', 'K'], ['Spades', 'Hearts']))

# Infinite counter:
for i in itertools.islice(itertools.count(10, 2), 5):
    print(i) # 10, 12, 14, 16, 18`,
    keyPoints: [
      'All itertools functions operate lazily and consume O(1) auxiliary memory.',
      'groupby() requires the input sequence to be pre-sorted on the grouping key.',
    ],
    followUps: [
      {
        question: 'What is the difference between combinations() and permutations()?',
        answer: 'permutations considers order ((A, B) != (B, A)); combinations ignores order ((A, B) is identical to (B, A)).',
      },
    ],
    companies: ['Deloitte', 'InfoCepts'],
    tags: ['Itertools', 'Functional'],
  },
  {
    id: 'py-35',
    categoryId: 'prog-python',
    title: 'What is the difference between __new__ and __init__ in Python classes?',
    difficulty: 'ADVANCED',
    answer:
      '__new__ is a static method responsible for CREATING and returning a new instance of the class (allocates memory). It takes cls as its first argument. __init__ is an instance method responsible for INITIALIZING the newly created instance (sets up attributes). It takes self as its first argument and must return None. __new__ runs first; if it returns an instance of cls, __init__ is subsequently invoked.',
    keyPoints: [
      'Override __new__ when creating Singletons or subclassing immutable types like int or tuple.',
      'Override __init__ for standard attribute initialization.',
    ],
    followUps: [
      {
        question: 'What happens if __new__ returns an instance of a different class?',
        answer: 'Python will NOT call __init__ on that object.',
      },
    ],
    companies: ['Deloitte', 'Infosys'],
    tags: ['OOPs', 'Object Creation', 'Internals'],
  },
  {
    id: 'py-36',
    categoryId: 'prog-python',
    title: 'How do you handle circular imports in Python?',
    difficulty: 'INTERMEDIATE',
    answer:
      'A circular import occurs when Module A imports Module B, and Module B imports Module A before either module has finished initializing, resulting in AttributeError or ImportError. Solutions: 1. Refactor shared dependencies into a separate third module (e.g. models.py or common.py), 2. Move import statements inside functions (deferred/lazy import), 3. Use typing.TYPE_CHECKING guard for type hints.',
    codeExample: `from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from service import MyService # Only imported during static analysis!`,
    keyPoints: [
      'Python caches partially initialized modules in sys.modules, which is why top-level code cannot access uninitialized attributes.',
      'Refactoring into clean acyclic architectural layers is the best practice.',
    ],
    followUps: [
      {
        question: 'What does "from __future__ import annotations" do for circular typing imports?',
        answer: 'It stores type annotations as raw string literals at runtime, avoiding runtime import execution.',
      },
    ],
    companies: ['Deloitte', 'Infosys'],
    tags: ['Modules', 'Imports', 'Architecture'],
  },
  {
    id: 'py-37',
    categoryId: 'prog-python',
    title: 'What are Property Decorators (@property, @setter, @deleter) in Python?',
    difficulty: 'INTERMEDIATE',
    answer:
      'The @property decorator allows defining methods that can be accessed like standard class attributes while allowing getter, setter, and deleter encapsulation logic behind the scenes. This enables data validation and computed attributes without breaking the class public interface.',
    codeExample: `class Temperature:
    def __init__(self, celsius):
        self._celsius = celsius

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("Below absolute zero!")
        self._celsius = value`,
    keyPoints: [
      'Preserves backward compatibility when migrating from public attributes to validated getters/setters.',
      'Follows Python’s philosophy: "Uniform Access Principle".',
    ],
    followUps: [
      {
        question: 'Can you have a read-only property in Python?',
        answer: 'Yes, simply omit the @setter method.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini'],
    tags: ['Properties', 'OOPs', 'Encapsulation'],
  },
  {
    id: 'py-38',
    categoryId: 'prog-python',
    title: 'What is the difference between deep and shallow equality in Python?',
    difficulty: 'BEGINNER',
    answer:
      'In Python, == performs deep value equality comparison for standard collection types (lists, dicts, tuples). When comparing two lists list1 == list2, Python recursively compares every element using ==. Shallow equality (reference identity) is tested using the is operator, verifying whether two variables reference the exact same memory pointer.',
    keyPoints: [
      'Custom classes must override __eq__ to support custom value equality; otherwise, Object defaults to is.',
      'Tuples compare element-by-element lexicographically.',
    ],
    followUps: [
      {
        question: 'How do you make instances of a custom class comparable with ==?',
        answer: 'Implement the __eq__(self, other) dunder method.',
      },
    ],
    companies: ['TCS', 'Wipro'],
    tags: ['Equality', 'Data Models'],
  },
  {
    id: 'py-39',
    categoryId: 'prog-python',
    title: 'What is Pickling and Unpickling in Python and what are its security risks?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Pickling (via the pickle module) is the process of serializing a Python object hierarchy into a byte stream, and unpickling deserializes it back into an object. Security Risk: The pickle byte stream is essentially an executable bytecode program. Unpickling untrusted data can execute arbitrary malicious code via the __reduce__() method. Never unpickle data received from untrusted network sources; use JSON or Protocol Buffers instead.',
    keyPoints: [
      'pickle is specific to Python (not language-interoperable like JSON).',
      'Can serialize functions, classes, and recursive objects.',
    ],
    followUps: [
      {
        question: 'What dunder method is exploited in pickle remote code execution attacks?',
        answer: '__reduce__() allows specifying a callable and arguments (like os.system) executed during unpickling.',
      },
    ],
    companies: ['Deloitte', 'Infosys'],
    tags: ['Pickle', 'Serialization', 'Security'],
  },
  {
    id: 'py-40',
    categoryId: 'prog-python',
    title: 'What are Python Descriptors and how do they power ORMs and properties?',
    difficulty: 'ADVANCED',
    answer:
      'A Descriptor is an object attribute whose binding behavior is overridden by methods in the descriptor protocol: __get__(), __set__(), and __delete__(). If an object defines at least one of these methods, it is a descriptor. Descriptors are the underlying engine powering Python properties (@property), methods (bound methods), class methods, static methods, and fields in ORMs like Django and SQLAlchemy.',
    codeExample: `class NonNegative:
    def __init__(self, name):
        self.name = name
    def __get__(self, instance, owner):
        return instance.__dict__.get(self.name, 0)
    def __set__(self, instance, value):
        if value < 0:
            raise ValueError("Must be non-negative")
        instance.__dict__[self.name] = value

class Account:
    balance = NonNegative('balance')`,
    keyPoints: [
      'Data Descriptors implement both __get__ and __set__ (takes precedence over instance __dict__).',
      'Non-data Descriptors implement only __get__ (e.g. normal methods).',
    ],
    followUps: [
      {
        question: 'What is the lookup precedence between instance __dict__ and descriptors?',
        answer: 'Data descriptors take precedence over instance __dict__; instance __dict__ takes precedence over non-data descriptors.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts'],
    tags: ['Descriptors', 'Advanced Python', 'Internals'],
  },
];
