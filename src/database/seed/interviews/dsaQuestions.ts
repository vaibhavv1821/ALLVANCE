import { SeedInterviewQuestion } from './types';

export const DSA_QUESTIONS: SeedInterviewQuestion[] = [
  {
    id: 'dsa-01',
    categoryId: 'cs-dsa',
    title: 'Explain Big-O, Big-Omega, and Big-Theta notation and their differences.',
    difficulty: 'BEGINNER',
    answer:
      'Asymptotic notations describe the limiting behavior of an algorithm’s time or space complexity as input size N grows toward infinity: 1. Big-O (O): Formal Upper Bound. Represents worst-case growth rate (f(n) <= c * g(n) for n >= n0). 2. Big-Omega (Ω): Formal Lower Bound. Represents best-case growth rate (f(n) >= c * g(n)). 3. Big-Theta (Θ): Asymptotically Tight Bound. Bounds the algorithm from both above and below (c1 * g(n) <= f(n) <= c2 * g(n)), meaning the algorithm grows at that exact rate.',
    keyPoints: [
      'Engineers commonly say "Big-O" when colloquially referring to tight Big-Theta bounds.',
      'Constants and lower-order terms are discarded (O(3n^2 + 5n + 10) = O(n^2)).',
    ],
    followUps: [
      {
        question: 'What is Little-o notation?',
        answer: 'Strict upper bound where the function grows strictly slower than g(n) (f(n) < c * g(n)), unlike Big-O which allows equality.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Deloitte', 'Cognizant'],
    tags: ['Complexity', 'Big-O', 'Algorithms'],
  },
  {
    id: 'dsa-02',
    categoryId: 'cs-dsa',
    title: 'What is Kadane’s Algorithm for Maximum Subarray Sum?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Kadane’s algorithm finds the contiguous subarray with the largest sum in an array of numbers in O(n) time and O(1) space. It maintains two variables: current_sum and max_so_far. As it iterates through the array, current_sum is updated to either current element alone or current element added to previous sum (max(arr[i], current_sum + arr[i])). If current_sum exceeds max_so_far, max_so_far is updated.',
    codeExample: `public static int maxSubArray(int[] nums) {
    int maxSoFar = nums[0];
    int currentSum = nums[0];
    for (int i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSoFar = Math.max(maxSoFar, currentSum);
    }
    return maxSoFar;
}`,
    keyPoints: [
      'Time Complexity: O(n) single pass; Space Complexity: O(1).',
      'Handles arrays with negative numbers properly.',
    ],
    followUps: [
      {
        question: 'How do you modify Kadane’s algorithm to return the starting and ending indices of the maximum subarray?',
        answer: 'Track a temp_start index whenever current_sum restarts at nums[i]; update start = temp_start and end = i whenever maxSoFar is updated.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Deloitte', 'Capgemini', 'HCL'],
    tags: ['Arrays', 'Dynamic Programming', 'Kadane'],
  },
  {
    id: 'dsa-03',
    categoryId: 'cs-dsa',
    title: 'How do you detect a cycle in a Linked List? (Floyd’s Cycle-Finding Algorithm)',
    difficulty: 'BEGINNER',
    answer:
      'Floyd’s Cycle-Finding Algorithm (Tortoise and Hare) uses two pointers moving at different speeds: slow moves 1 step at a time; fast moves 2 steps at a time. If there is no cycle, fast reaches null in O(n) time. If a cycle exists, fast will eventually enter the cycle and catch up to slow from behind, proving the cycle in O(n) time and O(1) auxiliary space.',
    codeExample: `public boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true; // Cycle detected!
    }
    return false;
}`,
    keyPoints: [
      'Time Complexity: O(n); Space Complexity: O(1).',
      'Avoids modifying node values or allocating HashSets of visited nodes.',
    ],
    followUps: [
      {
        question: 'How do you find the starting node of the cycle in the linked list?',
        answer: 'When slow and fast meet, reset slow to head. Move both slow and fast 1 step at a time; the node where they meet is the start of the cycle.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro', 'Cognizant'],
    tags: ['Linked List', 'Two Pointers', 'Floyd Cycle'],
  },
  {
    id: 'dsa-04',
    categoryId: 'cs-dsa',
    title: 'How is an LRU (Least Recently Used) Cache implemented in O(1) time?',
    difficulty: 'ADVANCED',
    answer:
      'An LRU Cache supports get(key) and put(key, value) in O(1) average time. It is implemented by combining two data structures: 1. HashMap<Key, Node>: Provides O(1) key lookups and direct memory node access. 2. Doubly Linked List (DLL): Maintains recency order. The head of the DLL stores the Most Recently Used (MRU) node, and the tail stores the Least Recently Used (LRU) node. Accessing or inserting an item moves its node to the head of the DLL in O(1) pointer updates. When capacity is exceeded, the tail node is evicted from both DLL and HashMap in O(1).',
    keyPoints: [
      'Using dummy head and dummy tail sentinel nodes eliminates null-pointer edge cases.',
      'Java’s LinkedHashMap provides built-in LRU support via removeEldestEntry().',
    ],
    followUps: [
      {
        question: 'Why is a singly linked list insufficient for O(1) LRU Cache?',
        answer: 'Deleting a node in a singly linked list requires finding its predecessor, which takes O(n) traversal; a doubly linked list provides node.prev in O(1).',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'InfoCepts'],
    tags: ['LRU Cache', 'Doubly Linked List', 'HashMap', 'Design'],
  },
  {
    id: 'dsa-05',
    categoryId: 'cs-dsa',
    title: 'Explain Two-Pointer vs Sliding Window techniques with examples.',
    difficulty: 'BEGINNER',
    answer:
      'Two-Pointer technique uses two pointers traversing an array/string (either moving inward from opposite ends or moving at different speeds) to solve problems like Two Sum on sorted arrays, Reversing arrays, or Palindrome checks in O(n) time. Sliding Window maintains a dynamic or fixed-size window subarray defined by left and right pointers that slide across the data, adding incoming elements on the right and shrinking invalid elements from the left. It solves problems like Longest Substring Without Repeating Characters or Max Sum Subarray of size K in O(n) without nested loops.',
    keyPoints: [
      'Reduces brute-force O(n^2) nested loops to single-pass O(n).',
      'Two-pointer requires sorted data for target-sum searches.',
    ],
    followUps: [
      {
        question: 'How does sliding window find the longest substring without repeating characters?',
        answer: 'Expand right pointer, storing character last-seen indices in a map. If a character is repeated inside the window, slide left pointer to map.get(char) + 1.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Deloitte', 'Capgemini'],
    tags: ['Two Pointers', 'Sliding Window', 'Techniques'],
  },
  {
    id: 'dsa-06',
    categoryId: 'cs-dsa',
    title: 'What is a Monotonic Stack and what problems does it solve?',
    difficulty: 'INTERMEDIATE',
    answer:
      'A Monotonic Stack is a stack whose elements are always ordered strictly monotonically (either strictly increasing or strictly decreasing). When pushing a new element, elements that violate the monotonic property are popped. It is the premier data structure for solving "Next Greater Element", "Previous Smaller Element", "Daily Temperatures", and "Largest Rectangle in Histogram" in O(n) linear time, because every element is pushed and popped at most once.',
    codeExample: `// Next Greater Element using Monotonic Decreasing Stack:
public int[] nextGreaterElements(int[] nums) {
    int n = nums.length;
    int[] res = new int[n];
    Stack<Integer> stack = new Stack<>(); // Stores indices
    for (int i = n - 1; i >= 0; i--) {
        while (!stack.isEmpty() && stack.peek() <= nums[i]) {
            stack.pop();
        }
        res[i] = stack.isEmpty() ? -1 : stack.peek();
        stack.push(nums[i]);
    }
    return res;
}`,
    keyPoints: [
      'Time Complexity: Amortized O(n) because each element enters and leaves stack at most once.',
      'Eliminates naive O(n^2) nested search loops.',
    ],
    followUps: [
      {
        question: 'How does Monotonic Stack solve "Trapping Rain Water"?',
        answer: 'Maintain a decreasing stack of bar indices. When a taller bar is found, it forms a bounded basin with previous bars; pop and calculate trapped water layer-by-layer.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['Monotonic Stack', 'Stacks', 'Next Greater'],
  },
  {
    id: 'dsa-07',
    categoryId: 'cs-dsa',
    title: 'Explain Quick Sort: Partitioning algorithms (Lomuto vs Hoare) and worst-case prevention.',
    difficulty: 'INTERMEDIATE',
    answer:
      'Quick Sort is a divide-and-conquer algorithm. It selects a pivot element, partitions the array such that all elements smaller than pivot are on the left and larger on the right, and recursively sorts sub-arrays. Lomuto partition chooses the last element as pivot and uses a single scanner (simpler, but performs ~3x more swaps). Hoare partition uses two pointers moving from opposite ends toward each other (faster, fewer swaps). Average time: O(n log n); Worst-case: O(n^2) when array is already sorted and pivot is always extreme. Prevented using Randomized Pivot selection or Median-of-Three.',
    keyPoints: [
      'In-place sorting: O(log n) auxiliary stack space.',
      'Unstable sort (relative order of equal elements not guaranteed).',
    ],
    followUps: [
      {
        question: 'Why is Quick Sort often faster than Merge Sort in practice despite worse worst-case?',
        answer: 'Quick Sort operates in-place with excellent CPU cache locality, whereas Merge Sort requires O(n) auxiliary memory allocation and copying.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro'],
    tags: ['Sorting', 'QuickSort', 'Divide and Conquer'],
  },
  {
    id: 'dsa-08',
    categoryId: 'cs-dsa',
    title: 'Explain Merge Sort: Working, complexity, and stability.',
    difficulty: 'BEGINNER',
    answer:
      'Merge Sort is a stable, divide-and-conquer algorithm. It divides the input array into two halves recursively until arrays of size 1 remain (base case), then merges the sorted halves back together in linear time using a two-pointer merge routine. Time Complexity: Guaranteed O(n log n) in all cases (Best, Average, Worst). Auxiliary Space: O(n) memory to hold the merged elements.',
    keyPoints: [
      'Merge Sort is Stable: preserves original relative order of duplicate elements.',
      'Preferred choice for sorting Linked Lists because linked lists allow O(1) node relinking without O(n) array copy overhead.',
    ],
    followUps: [
      {
        question: 'Why is Merge Sort preferred for Linked Lists over Quick Sort?',
        answer: 'Linked list nodes can be merged by rewiring pointers in O(1) space, avoiding the O(n) auxiliary buffer required for arrays.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Wipro', 'Capgemini'],
    tags: ['Sorting', 'MergeSort', 'Divide and Conquer'],
  },
  {
    id: 'dsa-09',
    categoryId: 'cs-dsa',
    title: 'How does Binary Search work and how do you handle search in a Rotated Sorted Array?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Binary Search finds a target in a sorted array in O(log n) time by repeatedly halving the search space: compare target with mid; adjust low or high. In a Rotated Sorted Array (e.g. [4, 5, 6, 7, 0, 1, 2]), at least one half (left or right) is ALWAYS strictly sorted. We identify which half is sorted: if nums[low] <= nums[mid], the left half is sorted. If target lies within the sorted half range, narrow search to that half; otherwise, search the other half. Achieves O(log n) time without finding the pivot first.',
    codeExample: `public int search(int[] nums, int target) {
    int low = 0, high = nums.length - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;

        // Left half is sorted:
        if (nums[low] <= nums[mid]) {
            if (nums[low] <= target && target < nums[mid]) high = mid - 1;
            else low = mid + 1;
        } else { // Right half is sorted:
            if (nums[mid] < target && target <= nums[high]) low = mid + 1;
            else high = mid - 1;
        }
    }
    return -1;
}`,
    keyPoints: [
      'Always calculate mid as low + (high - low) / 2 to prevent integer overflow bug.',
      'Time: O(log n); Space: O(1).',
    ],
    followUps: [
      {
        question: 'What happens if the rotated array contains duplicate elements?',
        answer: 'Worst-case degrades to O(n) when nums[low] == nums[mid] == nums[high] because you must increment low and decrement high.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini', 'Cognizant'],
    tags: ['Binary Search', 'Arrays', 'Rotated Array'],
  },
  {
    id: 'dsa-10',
    categoryId: 'cs-dsa',
    title: 'Explain Binary Tree Traversals: Inorder, Preorder, Postorder, and Level-Order (BFS).',
    difficulty: 'BEGINNER',
    answer:
      'Tree traversals visit all nodes systematically: 1. Inorder (Left -> Root -> Right): In a BST, produces values in strictly sorted ascending order. 2. Preorder (Root -> Left -> Right): Used for cloning trees or serializing prefix expressions. 3. Postorder (Left -> Right -> Root): Used for deleting/freeing tree nodes bottom-up and evaluating postfix expressions. 4. Level-Order (BFS): Visits nodes level-by-level horizontally using a Queue FIFO structure.',
    keyPoints: [
      'DFS traversals (Inorder, Preorder, Postorder) use recursion or explicit Stack (O(h) space where h is height).',
      'BFS traversal uses a Queue (O(w) space where w is maximum tree width).',
    ],
    followUps: [
      {
        question: 'Can you uniquely reconstruct a binary tree from Inorder and Preorder traversals?',
        answer: 'Yes: Preorder first element is root; find root in Inorder to split into left and right subtrees.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro'],
    tags: ['Trees', 'Traversals', 'BFS', 'DFS'],
  },
  {
    id: 'dsa-11',
    categoryId: 'cs-dsa',
    title: 'What is a Binary Search Tree (BST) and how do you validate if a tree is a valid BST?',
    difficulty: 'INTERMEDIATE',
    answer:
      'A Binary Search Tree (BST) is a binary tree where for every node: all keys in its left subtree are strictly LESS than the node’s key, and all keys in its right subtree are strictly GREATER than the node’s key. Common pitfall: only checking node.left < node < node.right is incorrect (subtree descendants must also respect the bound). Validated recursively by passing valid range boundaries (min, max): validate(node, minVal, maxVal). Alternatively, an Inorder traversal of a valid BST must produce a strictly increasing sequence.',
    codeExample: `public boolean isValidBST(TreeNode root) {
    return validate(root, Long.MIN_VALUE, Long.MAX_VALUE);
}
private boolean validate(TreeNode node, long min, long max) {
    if (node == null) return true;
    if (node.val <= min || node.val >= max) return false;
    return validate(node.left, min, node.val) && validate(node.right, node.val, max);
}`,
    keyPoints: [
      'Inorder traversal of BST gives sorted keys.',
      'Average search time is O(log n); worst-case is O(n) for skewed degenerate trees.',
    ],
    followUps: [
      {
        question: 'How do self-balancing trees like AVL or Red-Black trees prevent the O(n) skewed tree worst case?',
        answer: 'They perform tree rotations (Left/Right rotations) during insertion/deletion to keep height bounded to O(log n).',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['BST', 'Trees', 'Validation'],
  },
  {
    id: 'dsa-12',
    categoryId: 'cs-dsa',
    title: 'What is Lowest Common Ancestor (LCA) in a Binary Tree vs BST?',
    difficulty: 'INTERMEDIATE',
    answer:
      'The Lowest Common Ancestor (LCA) of two nodes p and q is the deepest node in the tree that has both p and q as descendants. In a BST: if both p and q are less than root, LCA is in the left subtree. If both are greater than root, LCA is in the right subtree. The split point (where p and q diverge on opposite sides, or root equals p or q) is the LCA, found in O(h) time. In a general Binary Tree: search left and right recursively; if left returns non-null and right returns non-null, current node is the LCA.',
    codeExample: `// For BST:
public TreeNode lowestCommonAncestorBST(TreeNode root, TreeNode p, TreeNode q) {
    if (p.val < root.val && q.val < root.val) return lowestCommonAncestorBST(root.left, p, q);
    if (p.val > root.val && q.val > root.val) return lowestCommonAncestorBST(root.right, p, q);
    return root; // Split point is LCA!
}`,
    keyPoints: [
      'BST LCA: O(h) time and O(1) iterative space.',
      'General Binary Tree LCA: O(n) time and O(h) recursion stack.',
    ],
    followUps: [
      {
        question: 'What is the time complexity of LCA in a balanced BST?',
        answer: 'O(log n).',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['LCA', 'Trees', 'BST'],
  },
  {
    id: 'dsa-13',
    categoryId: 'cs-dsa',
    title: 'What is a Binary Heap and how does Heapify construct a heap in O(n) time?',
    difficulty: 'INTERMEDIATE',
    answer:
      'A Binary Heap is a complete binary tree stored compactly in a flat array (parent at i, left child at 2i+1, right child at 2i+2) satisfying the heap property (in Min-Heap, parent <= children; in Max-Heap, parent >= children). Inserting an element takes O(log n); deleting the root takes O(log n). While inserting n elements sequentially takes O(n log n), building a heap from an arbitrary array using bottom-up Heapify (calling sift-down starting from last non-leaf node n/2 down to 0) takes linear O(n) time because nodes near the leaves have smaller heights to traverse (sum of h / 2^h converges to a constant).',
    keyPoints: [
      'Complete binary tree guarantee eliminates child pointer overhead.',
      'BuildHeap is O(n), NOT O(n log n).',
    ],
    followUps: [
      {
        question: 'Why does bottom-up Heapify take O(n) instead of O(n log n)?',
        answer: 'Most nodes reside near the bottom (leaves have height 0). Sift-down work is proportional to node height, yielding a convergent geometric series bounded by 2n.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'InfoCepts'],
    tags: ['Heaps', 'Priority Queue', 'Heapify'],
  },
  {
    id: 'dsa-14',
    categoryId: 'cs-dsa',
    title: 'Explain Graph Representations: Adjacency Matrix vs Adjacency List.',
    difficulty: 'BEGINNER',
    answer:
      '1. Adjacency Matrix: A 2D array V x V where matrix[u][v] = 1 indicates an edge. Space: O(V^2). Edge existence lookup is instantaneous O(1), but finding all neighbors of a node takes O(V) time. Inefficient for sparse graphs. 2. Adjacency List: An array of lists/vectors where list[u] stores all adjacent neighbors of vertex u. Space: O(V + E). Finding all neighbors of u takes O(deg(u)) time. Ideal for sparse graphs (most real-world graphs where E << V^2).',
    keyPoints: [
      'Most interview graph problems use Adjacency List (Map<Integer, List<Integer>> or ArrayList<Integer>[]).',
      'Adjacency matrix is suitable only for dense graphs where E is close to V^2.',
    ],
    followUps: [
      {
        question: 'What is the space complexity of an Adjacency Matrix for a graph with 100,000 vertices and 200,000 edges?',
        answer: '100,000^2 = 10 billion entries (~10GB RAM), while Adjacency List requires only ~300,000 entries (<10MB RAM).',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini'],
    tags: ['Graphs', 'Representations', 'Data Structures'],
  },
  {
    id: 'dsa-15',
    categoryId: 'cs-dsa',
    title: 'What is Topological Sort and Kahn’s Algorithm for Directed Acyclic Graphs (DAG)?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Topological Sort is a linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u -> v, vertex u comes before v. Used in build dependency resolution (like npm/gradle build tasks) and course prerequisite scheduling. Kahn’s Algorithm (BFS approach): 1. Compute in-degree (number of incoming edges) for all vertices. 2. Enqueue all vertices with in-degree = 0 into a Queue. 3. While queue is not empty: dequeue u, append to result list, decrement in-degree of all neighbors v. If v’s in-degree becomes 0, enqueue v. 4. If result list size < V, a CYCLE exists (cannot be topologically sorted).',
    keyPoints: [
      'Topological sort is possible IF AND ONLY IF the graph is a DAG (no cycles).',
      'Time Complexity: O(V + E); Space Complexity: O(V).',
    ],
    followUps: [
      {
        question: 'How does Kahn’s algorithm detect cycles in a directed graph?',
        answer: 'If the graph has a cycle, nodes in the cycle never reach an in-degree of 0, so the processed count will be strictly less than V.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['Graphs', 'Topological Sort', 'Kahns Algorithm', 'DAG'],
  },
  {
    id: 'dsa-16',
    categoryId: 'cs-dsa',
    title: 'What is Dijkstra’s Shortest Path Algorithm and why does it fail with negative weights?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Dijkstra’s algorithm finds the shortest path from a single source vertex to all other vertices in a weighted graph with NON-NEGATIVE edge weights. It uses a Min-Heap (Priority Queue) to greedily select the unvisited vertex with the minimum tentative distance, relaxes its outgoing edges, and marks it finalized. Time Complexity: O((V + E) log V). Failure with negative weights: Dijkstra operates on the greedy assumption that once a vertex is finalized, no shorter path to it can ever be found; negative edges can invalidate already finalized shortest distances. For negative weights, use the Bellman-Ford algorithm.',
    keyPoints: [
      'Edge weights must be non-negative (>= 0).',
      'Min-heap stores pairs of (distance, vertex).',
    ],
    followUps: [
      {
        question: 'What is the time complexity of Bellman-Ford algorithm and how does it detect negative weight cycles?',
        answer: 'O(V * E). It relaxes all edges V-1 times. A 10th relaxation that further reduces any distance proves the existence of a reachable negative cycle.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['Graphs', 'Dijkstra', 'Shortest Path'],
  },
  {
    id: 'dsa-17',
    categoryId: 'cs-dsa',
    title: 'What is Disjoint Set Union (DSU / Union-Find) with Path Compression and Union by Rank?',
    difficulty: 'ADVANCED',
    answer:
      'DSU is a data structure tracking elements partitioned into disjoint subsets, supporting two core operations: find(x) (finds the representative/root of the set containing x) and union(x, y) (merges the sets containing x and y). Optimizations: 1. Path Compression: During find(x), make every visited node point directly to the root, flattening the tree. 2. Union by Rank/Size: Always attach the shorter tree under the root of the taller tree. Combining both yields nearly constant amortized time complexity O(α(N)) per operation, where α is the Inverse Ackermann function (practically <= 4 for any universe size).',
    keyPoints: [
      'Used in Kruskal’s Minimum Spanning Tree algorithm and cycle detection in undirected graphs.',
      'Nearly O(1) amortized time per operation.',
    ],
    followUps: [
      {
        question: 'How do you detect a cycle in an undirected graph using DSU?',
        answer: 'For every edge (u, v): if find(u) == find(v), they are already connected in the same component, so adding (u, v) creates a cycle.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'InfoCepts'],
    tags: ['DSU', 'Union Find', 'Graphs'],
  },
  {
    id: 'dsa-18',
    categoryId: 'cs-dsa',
    title: 'Explain Dynamic Programming: Memoization (Top-Down) vs Tabulation (Bottom-Up).',
    difficulty: 'BEGINNER',
    answer:
      'Dynamic Programming (DP) solves complex problems by breaking them into overlapping subproblems and optimal substructure, caching intermediate results to avoid redundant recomputations. 1. Top-Down (Memoization): Uses recursion to solve the original problem, storing results in a hash table or array cache before returning. Easier to write, only computes subproblems needed, but incurs recursion stack overhead. 2. Bottom-Up (Tabulation): Solves smaller subproblems iteratively first, filling an iterative table from base cases up to the target answer. No recursion stack risk, faster execution, and often allows space optimization (rolling variables).',
    codeExample: `// Fibonacci Memoization (Top-down):
int fib(int n, int[] memo) {
    if (n <= 1) return n;
    if (memo[n] != 0) return memo[n];
    return memo[n] = fib(n-1, memo) + fib(n-2, memo);
}

// Fibonacci Tabulation with O(1) space (Bottom-up):
int fib(int n) {
    if (n <= 1) return n;
    int prev2 = 0, prev1 = 1;
    for (int i = 2; i <= n; i++) {
        int curr = prev1 + prev2;
        prev2 = prev1; prev1 = curr;
    }
    return prev1;
}`,
    keyPoints: [
      'Two prerequisites for DP: Overlapping Subproblems and Optimal Substructure.',
      'Bottom-up often permits reducing O(n) space to O(1) by keeping only previous states.',
    ],
    followUps: [
      {
        question: 'When is a problem NOT suitable for Dynamic Programming?',
        answer: 'When subproblems do not overlap (e.g. Merge Sort divide-and-conquer has completely disjoint subproblems).',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Deloitte'],
    tags: ['Dynamic Programming', 'Memoization', 'Tabulation'],
  },
  {
    id: 'dsa-19',
    categoryId: 'cs-dsa',
    title: 'Explain the 0/1 Knapsack Problem and its DP solution.',
    difficulty: 'INTERMEDIATE',
    answer:
      'Given weights and values of N items and a knapsack capacity W, determine the maximum total value such that total weight <= W. Each item can either be taken once (1) or left (0)—fractional parts are not allowed. Recurrence: dp[i][w] = max(dp[i-1][w], val[i-1] + dp[i-1][w - wt[i-1]]) if wt[i-1] <= w, else dp[i-1][w]. Time Complexity: O(N * W); Space Complexity: O(N * W), optimizable to O(W) 1D array by iterating weights backwards.',
    keyPoints: [
      'Pseudo-polynomial time complexity (dependent on numeric value of W).',
      'Fractional Knapsack can be solved greedily in O(n log n); 0/1 Knapsack requires DP.',
    ],
    followUps: [
      {
        question: 'Why must the 1D space-optimized DP array iterate weights backwards (from W down to wt[i])?',
        answer: 'To prevent using the same item multiple times in the same step (which would solve Unbounded Knapsack instead of 0/1).',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['Knapsack', 'Dynamic Programming'],
  },
  {
    id: 'dsa-20',
    categoryId: 'cs-dsa',
    title: 'What is Longest Common Subsequence (LCS) and Longest Increasing Subsequence (LIS)?',
    difficulty: 'INTERMEDIATE',
    answer:
      '1. Longest Common Subsequence (LCS): Finds the length of the longest subsequence present in both strings in the same relative order (not necessarily contiguous). Recurrence: if s1[i] == s2[j], dp[i][j] = 1 + dp[i-1][j-1]; else max(dp[i-1][j], dp[i][j-1]). Solved in O(M * N) time. 2. Longest Increasing Subsequence (LIS): Finds the length of the longest strictly increasing subsequence in an array. Solved in O(n^2) with standard DP, or O(n log n) using Patience Sorting / Binary Search (Arrays.binarySearch with tails array).',
    keyPoints: [
      'LCS powers diff tools (git diff) and DNA sequence alignment.',
      'LIS O(n log n) utilizes lower_bound binary search on tails array.',
    ],
    followUps: [
      {
        question: 'What is the difference between Substring and Subsequence?',
        answer: 'A Substring must be contiguous characters; a Subsequence does not need to be contiguous as long as relative order is preserved.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['LCS', 'LIS', 'Dynamic Programming'],
  },
  {
    id: 'dsa-21',
    categoryId: 'cs-dsa',
    title: 'Explain Dutch National Flag algorithm (Sort 0s, 1s, and 2s).',
    difficulty: 'BEGINNER',
    answer:
      'The Dutch National Flag algorithm sorts an array containing only 0s, 1s, and 2s in a single pass O(n) time and O(1) space. It maintains 3 pointers: low, mid, and high. Array is partitioned into 4 zones: [0 to low-1] contains 0s, [low to mid-1] contains 1s, [mid to high] is unexamined, and [high+1 to end] contains 2s. If nums[mid] == 0: swap(low, mid), low++, mid++. If nums[mid] == 1: mid++. If nums[mid] == 2: swap(mid, high), high-- (do not increment mid because swapped element is unexamined).',
    codeExample: `public void sortColors(int[] nums) {
    int low = 0, mid = 0, high = nums.length - 1;
    while (mid <= high) {
        if (nums[mid] == 0) {
            swap(nums, low++, mid++);
        } else if (nums[mid] == 1) {
            mid++;
        } else {
            swap(nums, mid, high--);
        }
    }
}`,
    keyPoints: [
      'Time Complexity: O(n) single pass; Space Complexity: O(1).',
      'Famous problem credited to Edsger Dijkstra.',
    ],
    followUps: [
      {
        question: 'Why doesn’t mid increment after swapping with high?',
        answer: 'Because the element swapped from high into mid has not been inspected yet; it must be evaluated in the next iteration.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro'],
    tags: ['Arrays', 'Two Pointers', 'Sorting'],
  },
  {
    id: 'dsa-22',
    categoryId: 'cs-dsa',
    title: 'How do you check for Balanced Parentheses in a string?',
    difficulty: 'BEGINNER',
    answer:
      'Iterate through the string using a Stack. When encountering an opening bracket ((, [, {), push it onto the stack. When encountering a closing bracket (), ], }), verify that the stack is NOT empty and that the popped top element matches the corresponding opening bracket type. After the entire string is processed, return true if the stack is completely empty, otherwise false.',
    codeExample: `public boolean isValid(String s) {
    Stack<Character> stack = new Stack<>();
    for (char c : s.toCharArray()) {
        if (c == '(') stack.push(')');
        else if (c == '{') stack.push('}');
        else if (c == '[') stack.push(']');
        else if (stack.isEmpty() || stack.pop() != c) return false;
    }
    return stack.isEmpty();
}`,
    keyPoints: [
      'Time: O(n); Space: O(n).',
      'Pushing the expected matching closing bracket simplifies the condition checks.',
    ],
    followUps: [
      {
        question: 'What is the space complexity if the string has no closing brackets (e.g. "(((((")?',
        answer: 'O(n) auxiliary space as all opening brackets reside on the stack.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro'],
    tags: ['Stack', 'Strings', 'Parentheses'],
  },
  {
    id: 'dsa-23',
    categoryId: 'cs-dsa',
    title: 'How do you implement a Min Stack that retrieves minimum element in O(1) time?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Approach 1: Use an auxiliary stack (minStack) that stores the minimum value seen so far for each corresponding entry in the main stack. Approach 2 (O(1) extra space): Store the difference or encoded value (2 * val - min) in a single stack whenever a new minimum is pushed, allowing the previous minimum to be reconstructed upon pop.',
    codeExample: `class MinStack {
    private Stack<Integer> stack = new Stack<>();
    private Stack<Integer> minStack = new Stack<>();

    public void push(int val) {
        stack.push(val);
        if (minStack.isEmpty() || val <= minStack.peek()) minStack.push(val);
    }
    public void pop() {
        if (stack.pop().equals(minStack.peek())) minStack.pop();
    }
    public int top() { return stack.peek(); }
    public int getMin() { return minStack.peek(); }
}`,
    keyPoints: [
      'All operations (push, pop, top, getMin) run in O(1) time.',
      'Use equals() instead of == when comparing popped wrapper Objects.',
    ],
    followUps: [
      {
        question: 'How does the single-stack mathematical formula (2 * val - min) recover the previous min?',
        answer: 'When a new min arrives, push (2 * val - oldMin), which is strictly less than val. Upon pop, oldMin = 2 * currentMin - poppedVal.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['Stack', 'MinStack', 'Design'],
  },
  {
    id: 'dsa-24',
    categoryId: 'cs-dsa',
    title: 'What is Backtracking and how does it solve the N-Queens problem?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Backtracking is an algorithmic paradigm that systematically explores potential candidate solutions by building incrementally and abandoning ("backtracking") as soon as a candidate violates problem constraints. In the N-Queens problem (placing N non-attacking queens on an N x N chessboard), we place queens row-by-row. For each column in row r, check if placing a queen attacks existing queens (check columns, main diagonals, and anti-diagonals using lookup sets). If safe, place queen and recurse to row r+1. If no valid column exists, backtrack by removing the queen from row r and try the next option.',
    keyPoints: [
      'Diagonals can be checked in O(1) using sets: (r - c) for main diagonals, (r + c) for anti-diagonals.',
      'Pruning invalid paths dramatically reduces search space compared to brute force O(N^N).',
    ],
    followUps: [
      {
        question: 'What is the time complexity of the N-Queens solver?',
        answer: 'O(N!) because the first queen has N choices, second has at most N-2, third N-4, etc.',
      },
    ],
    companies: ['Deloitte', 'Infosys'],
    tags: ['Backtracking', 'Recursion', 'N-Queens'],
  },
  {
    id: 'dsa-25',
    categoryId: 'cs-dsa',
    title: 'What is a Trie (Prefix Tree) and what are its applications?',
    difficulty: 'INTERMEDIATE',
    answer:
      'A Trie is a tree-like data structure used to efficiently store and retrieve keys in a dataset of strings. Each node represents a common character prefix and contains an array/map of child pointers (e.g. 26 pointers for lowercase English alphabet) and a boolean isEndOfWord flag. Insert, Search, and Prefix search (startsWith) all run in O(L) time, where L is the length of the string, completely independent of the number of words N stored in the Trie.',
    keyPoints: [
      'Search time O(L) is faster than hash tables for prefix searches.',
      'Primary applications: Autocomplete suggestions, spell checkers, IP routing (longest prefix match).',
    ],
    followUps: [
      {
        question: 'What is the memory trade-off of a standard Trie?',
        answer: 'High memory consumption because empty child pointers are allocated; optimized using Radix Trees or Compressed Tries.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['Trie', 'Prefix Tree', 'Strings'],
  },
  {
    id: 'dsa-26',
    categoryId: 'cs-dsa',
    title: 'How do you find the Diameter of a Binary Tree?',
    difficulty: 'INTERMEDIATE',
    answer:
      'The diameter (or width) of a binary tree is the length of the longest path between any two nodes. This path may or may not pass through the root. We compute the diameter during a postorder height calculation: for each node, the longest path passing THROUGH that node is left_height + right_height. We maintain a global maximum diameter variable and return 1 + max(left_height, right_height) as the node height to parent calls.',
    codeExample: `int maxDiameter = 0;
public int diameterOfBinaryTree(TreeNode root) {
    calculateHeight(root);
    return maxDiameter;
}
private int calculateHeight(TreeNode node) {
    if (node == null) return 0;
    int leftH = calculateHeight(node.left);
    int rightH = calculateHeight(node.right);
    maxDiameter = Math.max(maxDiameter, leftH + rightH);
    return 1 + Math.max(leftH, rightH);
}`,
    keyPoints: [
      'Time Complexity: O(n) single traversal; Space Complexity: O(h) recursion stack.',
      'Avoid naive O(n^2) approach where height is recalculated repeatedly at every node.',
    ],
    followUps: [
      {
        question: 'Can the diameter path skip the root node?',
        answer: 'Yes, if the tree is heavily skewed or has deep subtrees on one side, the longest path can reside entirely within a subtree.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini'],
    tags: ['Trees', 'Diameter', 'Recursion'],
  },
  {
    id: 'dsa-27',
    categoryId: 'cs-dsa',
    title: 'Explain the difference between BFS and DFS in graph traversal.',
    difficulty: 'BEGINNER',
    answer:
      'Breadth-First Search (BFS) explores all neighboring nodes at the present depth level before moving on to nodes at the next depth level. It uses a Queue (FIFO) and is guaranteed to find the shortest path in unweighted graphs. Depth-First Search (DFS) explores as deep as possible along each branch before backtracking. It uses a Stack (or recursion) and is ideal for topological sorting, cycle detection, and maze pathfinding.',
    keyPoints: [
      'Both run in O(V + E) time.',
      'BFS space: O(V) (queue can hold entire breadth); DFS space: O(V) (recursion stack up to depth).',
    ],
    followUps: [
      {
        question: 'Which traversal is used to find connected components in an undirected graph?',
        answer: 'Either BFS or DFS can be used to traverse and label connected components.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro'],
    tags: ['Graphs', 'BFS', 'DFS'],
  },
  {
    id: 'dsa-28',
    categoryId: 'cs-dsa',
    title: 'What is the Two Sum problem and how is it solved in O(n) time?',
    difficulty: 'BEGINNER',
    answer:
      'Given an array of integers and a target sum, find indices of the two numbers that add up to target. Brute force tests all pairs in O(n^2). The optimal O(n) solution uses a HashMap. For each number num at index i, compute complement = target - num. If complement exists in map, return [map.get(complement), i]. Otherwise, put num and its index i into the map. Achieves single-pass O(n) time and O(n) space.',
    codeExample: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[] { map.get(complement), i };
        }
        map.put(nums[i], i);
    }
    return new int[] {};
}`,
    keyPoints: [
      'Time Complexity: O(n); Space Complexity: O(n).',
      'If the array is pre-sorted, Two-Pointer approach achieves O(1) auxiliary space.',
    ],
    followUps: [
      {
        question: 'How do you solve Two Sum if the input array is already sorted?',
        answer: 'Use two pointers (left at 0, right at n-1). If sum < target, left++; if sum > target, right--; if equal, return indices. Space: O(1).',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro', 'Deloitte'],
    tags: ['Arrays', 'Two Sum', 'HashMap'],
  },
  {
    id: 'dsa-29',
    categoryId: 'cs-dsa',
    title: 'Explain the Coin Change Problem (Minimum coins vs Total ways).',
    difficulty: 'INTERMEDIATE',
    answer:
      '1. Coin Change 1 (Minimum Coins to make amount): Unbounded knapsack DP. dp[a] stores minimum coins for amount a. dp[a] = min(dp[a], 1 + dp[a - coin]). Initialize with amount + 1. Solved in O(amount * coins) time and O(amount) space. 2. Coin Change 2 (Total Number of Ways to make amount): dp[a] += dp[a - coin]. Must loop over coins in the outer loop to count combinations (ignoring order) rather than permutations.',
    keyPoints: [
      'Greedy choice fails for arbitrary coin denominations (e.g. coins [1, 3, 4] for amount 6: greedy gives 4+1+1=3 coins; DP gives 3+3=2 coins).',
      'Outer loop on coins = Combinations; outer loop on amounts = Permutations.',
    ],
    followUps: [
      {
        question: 'Why does outer loop order matter in Coin Change 2?',
        answer: 'Iterating coins in the outer loop ensures coin denominations are considered in fixed order, counting [1, 2] once and ignoring [2, 1].',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['Dynamic Programming', 'Coin Change'],
  },
  {
    id: 'dsa-30',
    categoryId: 'cs-dsa',
    title: 'How do you reverse a Singly Linked List iteratively and recursively?',
    difficulty: 'BEGINNER',
    answer:
      'Iterative approach: Maintain 3 pointers: prev (null), curr (head), and nextNode. While curr is not null: save nextNode = curr.next, reverse pointer curr.next = prev, advance prev = curr, and curr = nextNode. Returns prev as the new head. Time: O(n), Space: O(1). Recursive approach: reverse the rest of the list recursively: head.next.next = head, head.next = null. Time: O(n), Space: O(n) call stack.',
    codeExample: `// Iterative O(1) space:
public ListNode reverseList(ListNode head) {
    ListNode prev = null, curr = head;
    while (curr != null) {
        ListNode nextNode = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextNode;
    }
    return prev;
}`,
    keyPoints: [
      'Iterative is preferred in production to avoid StackOverflowError on long lists.',
      'Space: O(1) iterative vs O(n) recursive.',
    ],
    followUps: [
      {
        question: 'How do you reverse only a subsegment of a linked list from position m to n?',
        answer: 'Traverse to node m-1, preserve pointer, and reverse the subsegment of length (n - m + 1) using standard iterative pointer reversal.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro'],
    tags: ['Linked List', 'Pointers', 'Reversal'],
  },
  {
    id: 'dsa-31',
    categoryId: 'cs-dsa',
    title: 'What is Counting Sort and Radix Sort and when are they O(n)?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Counting Sort is a non-comparison sorting algorithm that counts the frequency of each distinct element in a frequency array and computes prefix sums to place elements in sorted order. It runs in O(n + k) time, where k is the range of values. When k = O(n), it runs in linear O(n) time. Radix Sort sorts numbers digit-by-digit from least significant to most significant digit using Counting Sort as a stable subroutine. It runs in O(d * (n + b)) time, where d is the number of digits and b is the base (e.g. 10).',
    keyPoints: [
      'Beats the theoretical comparison-sort lower bound Ω(n log n).',
      'Impractical when key range k is astronomically larger than n (e.g. sorting numbers up to 10^12).',
    ],
    followUps: [
      {
        question: 'Why must the subroutine sort in Radix Sort be stable?',
        answer: 'Stability ensures that sorting by higher-order digits preserves the relative ordering already established by lower-order digits.',
      },
    ],
    companies: ['Deloitte', 'Infosys'],
    tags: ['Sorting', 'Counting Sort', 'Radix Sort', 'Linear Time'],
  },
  {
    id: 'dsa-32',
    categoryId: 'cs-dsa',
    title: 'Explain KMP (Knuth-Morris-Pratt) String Matching Algorithm and LPS array.',
    difficulty: 'ADVANCED',
    answer:
      'KMP searches for occurrences of a pattern P (length m) within a text T (length n) in guaranteed O(n + m) time, avoiding naive O(n * m) backtracking. It precomputes a Longest Prefix Suffix (LPS) array for pattern P. LPS[i] stores the length of the longest proper prefix of P[0...i] that is also a suffix of P[0...i]. When a mismatch occurs during matching at text character T[i] and pattern P[j], the text pointer i never rolls back; instead, j falls back to LPS[j - 1], skipping characters already known to match.',
    keyPoints: [
      'Text pointer i advances monotonically without backtracking.',
      'Precomputing LPS array takes O(m) time and space.',
    ],
    followUps: [
      {
        question: 'What is the LPS array for string "AAABAAA"?',
        answer: '[0, 1, 2, 0, 1, 2, 3].',
      },
    ],
    companies: ['Deloitte', 'InfoCepts'],
    tags: ['Strings', 'KMP', 'Pattern Matching'],
  },
  {
    id: 'dsa-33',
    categoryId: 'cs-dsa',
    title: 'What is the Activity Selection (Interval Scheduling) Problem and Greedy Choice?',
    difficulty: 'BEGINNER',
    answer:
      'Given N activities with start and finish times, select the maximum number of mutually non-overlapping activities. Greedy strategy: Always pick the activity that FINISHES EARLIEST, leaving maximum remaining time for subsequent activities. Algorithm: 1. Sort activities by finish time ascending. 2. Select the first activity. 3. Iterate through sorted activities: if start_time >= finish_time of last chosen activity, select it. Time Complexity: O(n log n) due to sorting.',
    keyPoints: [
      'Sorting by start time or duration does NOT yield the optimal solution.',
      'Proved optimal by greedy-choice property and exchange arguments.',
    ],
    followUps: [
      {
        question: 'Why doesn’t sorting by shortest duration work?',
        answer: 'A short activity in the middle could conflict with two long activities on either side, whereas earliest finish time strictly maximizes remaining available time.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini'],
    tags: ['Greedy', 'Intervals', 'Scheduling'],
  },
  {
    id: 'dsa-34',
    categoryId: 'cs-dsa',
    title: 'What is the Master Theorem for solving recurrence relations?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Master Theorem solves divide-and-conquer recurrences of form T(n) = a * T(n / b) + f(n), where a >= 1, b > 1: 1. Case 1: If f(n) = O(n^(log_b(a) - ε)), then T(n) = Θ(n^log_b(a)). 2. Case 2: If f(n) = Θ(n^log_b(a) * log^k(n)), then T(n) = Θ(n^log_b(a) * log^(k+1)(n)). (e.g. Merge Sort: a=2, b=2, f(n)=O(n) -> Θ(n log n)). 3. Case 3: If f(n) = Ω(n^(log_b(a) + ε)) and regularity condition holds, then T(n) = Θ(f(n)).',
    keyPoints: [
      'Cannot be applied if a is not constant or if f(n) is not a polynomial.',
      'Binary Search: T(n) = T(n/2) + O(1) -> Case 2 with k=0 -> Θ(log n).',
    ],
    followUps: [
      {
        question: 'What is the recurrence relation and complexity of Karatsuba integer multiplication?',
        answer: 'T(n) = 3T(n/2) + O(n). By Master Theorem Case 1, T(n) = Θ(n^log_2(3)) ≈ Θ(n^1.585).',
      },
    ],
    companies: ['Deloitte', 'Infosys'],
    tags: ['Recurrence', 'Master Theorem', 'Complexity'],
  },
  {
    id: 'dsa-35',
    categoryId: 'cs-dsa',
    title: 'How do you find the Kth largest element in an unsorted array?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Approach 1 (Min-Heap): Maintain a Min-Heap of size K. Iterate through the array; add elements and pop the minimum if size > K. At the end, the heap root is the Kth largest element. Time: O(n log k), Space: O(k). Approach 2 (QuickSelect): Hoare’s selection algorithm based on QuickSort partitioning. Partition array around a pivot; if pivot index == n - k, return pivot; else recurse into the relevant half only. Average Time: O(n), Worst-case: O(n^2).',
    keyPoints: [
      'Min-Heap is preferred for stream data where total elements n is unknown or infinite.',
      'QuickSelect achieves linear O(n) average time in-place.',
    ],
    followUps: [
      {
        question: 'How does QuickSelect achieve O(n) average time while QuickSort is O(n log n)?',
        answer: 'QuickSort recurses into BOTH halves (T(n) = 2T(n/2) + n = n log n). QuickSelect recurses into ONLY ONE half (T(n) = T(n/2) + n = 2n = O(n)).',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['Heaps', 'QuickSelect', 'Kth Element'],
  },
  {
    id: 'dsa-36',
    categoryId: 'cs-dsa',
    title: 'How do you check if a graph is Bipartite?',
    difficulty: 'INTERMEDIATE',
    answer:
      'A graph is Bipartite if its vertices can be partitioned into two independent sets U and V such that every edge connects a vertex in U to a vertex in V (no edges within the same set), equivalent to saying the graph can be colored using 2 colors with no adjacent nodes having the same color. A graph is bipartite IF AND ONLY IF it contains NO ODD-LENGTH CYCLES. Algorithm: Run BFS or DFS. Assign color 0 to source. For every uncolored neighbor, assign color (1 - current_color). If a neighbor already has the same color, the graph is NOT bipartite.',
    keyPoints: [
      'Time Complexity: O(V + E); Space Complexity: O(V).',
      'Must run from all unvisited nodes to handle disconnected graph components.',
    ],
    followUps: [
      {
        question: 'Are all trees bipartite graphs?',
        answer: 'Yes, because trees have zero cycles, so they cannot contain odd-length cycles.',
      },
    ],
    companies: ['Deloitte', 'Infosys'],
    tags: ['Graphs', 'Bipartite', 'Coloring'],
  },
  {
    id: 'dsa-37',
    categoryId: 'cs-dsa',
    title: 'What is Minimum Spanning Tree (MST): Kruskal’s vs Prim’s Algorithm?',
    difficulty: 'INTERMEDIATE',
    answer:
      'An MST of a connected, undirected weighted graph is a spanning tree that connects all V vertices with V - 1 edges while minimizing total edge weight. 1. Kruskal’s Algorithm: Edge-centric greedy approach. Sort all edges by weight ascending. Iterate through edges and add to MST using Disjoint Set Union (DSU) to prevent cycles until V-1 edges are chosen. Time: O(E log E). Best for sparse graphs. 2. Prim’s Algorithm: Vertex-centric greedy approach. Start from an arbitrary root node, maintain a Min-Heap of edges connecting the visited cut to unvisited vertices, greedily pick minimum edge. Time: O((V + E) log V). Best for dense graphs.',
    keyPoints: [
      'Total edges in MST is always V - 1.',
      'Cut Property and Cycle Property govern greedy validity.',
    ],
    followUps: [
      {
        question: 'Is the Minimum Spanning Tree unique?',
        answer: 'If all edge weights in the graph are distinct, the MST is guaranteed to be unique.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['MST', 'Kruskal', 'Prims', 'Graphs'],
  },
  {
    id: 'dsa-38',
    categoryId: 'cs-dsa',
    title: 'How do you merge K sorted linked lists efficiently?',
    difficulty: 'ADVANCED',
    answer:
      'Approach 1 (Min-Heap / PriorityQueue): Insert the head node of all K lists into a Min-Heap. Poll the smallest node, attach it to the result list, and if its next pointer exists, insert next into the heap. Repeat until heap is empty. Time: O(N log K), where N is total nodes across all lists. Space: O(K) heap. Approach 2 (Divide and Conquer): Pairwise merge lists using standard 2-way sorted list merge, halving the number of lists in each round: K -> K/2 -> K/4 -> 1. Time: O(N log K), Space: O(1) iterative.',
    keyPoints: [
      'Divide and conquer achieves O(1) auxiliary space without heap allocation.',
      'Naive sequential merging takes O(K * N), which is much slower.',
    ],
    followUps: [
      {
        question: 'Why is pairwise divide-and-conquer merge faster than merging list 1 with list 2, then with list 3, etc.?',
        answer: 'Sequential merging compares each node up to K times, yielding O(K * N). Divide and conquer processes each node only log(K) times.',
      },
    ],
    companies: ['Deloitte', 'Infosys'],
    tags: ['Heaps', 'Linked List', 'Divide and Conquer'],
  },
  {
    id: 'dsa-39',
    categoryId: 'cs-dsa',
    title: 'What is the Subsets and Permutations backtracking pattern?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Both generate combinatorial configurations using depth-first backtracking. Subsets (Power Set): At each index i, you have two choices: include nums[i] or exclude nums[i]. Explores 2^N states. Permutations: Order matters. Maintain a visited boolean array or swap elements in-place. At each position, try placing every unvisited element and recurse. Explores N! states.',
    codeExample: `// Subsets Backtracking template:
void backtrack(int start, List<Integer> current, int[] nums) {
    result.add(new ArrayList<>(current)); // Capture state
    for (int i = start; i < nums.length; i++) {
        current.add(nums[i]);
        backtrack(i + 1, current, nums); // Move forward
        current.remove(current.size() - 1); // Undo/Backtrack
    }
}`,
    keyPoints: [
      'Subsets: 2^n configurations.',
      'Permutations: n! configurations.',
      'Always instantiate a new copy (new ArrayList<>(current)) when saving to results.',
    ],
    followUps: [
      {
        question: 'How do you handle duplicates in Subsets II (input array contains duplicates)?',
        answer: 'Sort the array first; inside the loop, skip duplicates: if (i > start && nums[i] == nums[i-1]) continue;.',
      },
    ],
    companies: ['Deloitte', 'Infosys'],
    tags: ['Backtracking', 'Combinatorics', 'Subsets'],
  },
  {
    id: 'dsa-40',
    categoryId: 'cs-dsa',
    title: 'How do you serialize and deserialize a Binary Tree?',
    difficulty: 'ADVANCED',
    answer:
      'Serialization encodes a tree structure and values into a string. Deserialization reconstructs the original tree. Using Preorder traversal: serialize the root value, recurse left, and recurse right, recording a sentinel symbol (like "#" or "null") for null nodes separated by commas. To deserialize, split the string into a Queue/token stream: dequeue token; if "#", return null; otherwise construct TreeNode(val), and recursively build left and right subtrees.',
    codeExample: `public String serialize(TreeNode root) {
    if (root == null) return "#,";
    return root.val + "," + serialize(root.left) + serialize(root.right);
}
public TreeNode deserialize(String data) {
    Queue<String> nodes = new LinkedList<>(Arrays.asList(data.split(",")));
    return buildTree(nodes);
}
private TreeNode buildTree(Queue<String> q) {
    String val = q.poll();
    if (val.equals("#")) return null;
    TreeNode node = new TreeNode(Integer.parseInt(val));
    node.left = buildTree(q);
    node.right = buildTree(q);
    return node;
}`,
    keyPoints: [
      'Time Complexity: O(n) for both serialization and deserialization.',
      'Can also be implemented using BFS Level-Order with queues.',
    ],
    followUps: [
      {
        question: 'Why do we need null markers for serialization?',
        answer: 'Without null markers, a preorder traversal alone is ambiguous and cannot distinguish between left-skewed and right-skewed trees.',
      },
    ],
    companies: ['Deloitte', 'Infosys'],
    tags: ['Trees', 'Serialization', 'Design'],
  },
  {
    id: 'dsa-41',
    categoryId: 'cs-dsa',
    title: 'What is Floyd-Warshall Algorithm for All-Pairs Shortest Paths?',
    difficulty: 'ADVANCED',
    answer:
      'Floyd-Warshall computes shortest paths between ALL pairs of vertices in a weighted directed graph (can handle negative weights, but no negative cycles). It uses 3 nested loops dynamic programming: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]), where k iterates over all intermediate vertices from 1 to V. Time Complexity: O(V^3); Space Complexity: O(V^2). A negative value on the main diagonal (dist[i][i] < 0) detects a negative cycle.',
    keyPoints: [
      'Outer loop MUST be the intermediate vertex k.',
      'Best for small dense graphs (V <= 400).',
    ],
    followUps: [
      {
        question: 'Why must the intermediate node k be the outermost loop?',
        answer: 'Because the subproblem definition requires shortest paths using only intermediate vertices {1...k} to be finalized before expanding to k+1.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts'],
    tags: ['Graphs', 'Floyd-Warshall', 'All-Pairs Shortest Path'],
  },
  {
    id: 'dsa-42',
    categoryId: 'cs-dsa',
    title: 'Explain Inorder Traversal without recursion using an explicit Stack.',
    difficulty: 'INTERMEDIATE',
    answer:
      'Maintain a pointer curr initialized to root and an explicit Stack. In a loop (while curr != null or !stack.isEmpty()): if curr is not null, push curr to stack and move left (curr = curr.left). If curr is null, pop from stack, process/print the popped node, and move right (curr = poppedNode.right). Mimics call stack execution in O(n) time and O(h) space.',
    keyPoints: [
      'Eliminates call stack overflow on deep trees.',
      'Morris Inorder Traversal can achieve O(1) space using threaded binary tree pointers.',
    ],
    followUps: [
      {
        question: 'What is Morris Traversal?',
        answer: 'An in-order tree traversal that uses temporarily modified leaf-to-predecessor pointers (threads) to achieve O(n) time with O(1) auxiliary space without a stack.',
      },
    ],
    companies: ['Infosys', 'Capgemini'],
    tags: ['Trees', 'Inorder', 'Stack'],
  },
  {
    id: 'dsa-43',
    categoryId: 'cs-dsa',
    title: 'What is an Anagram and how do you check if two strings are Anagrams?',
    difficulty: 'BEGINNER',
    answer:
      'Two strings are Anagrams if they contain the exact same characters with the exact same frequencies, rearranged in a different order (e.g. "listen" and "silent"). Approach 1: Sort both strings and compare for equality in O(n log n) time. Approach 2 (Optimal O(n)): Use a frequency count array of size 26 (for lowercase English). Increment counts for string 1 and decrement for string 2. If all counts are 0, they are anagrams.',
    codeExample: `public boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;
    int[] count = new int[26];
    for (int i = 0; i < s.length(); i++) {
        count[s.charAt(i) - 'a']++;
        count[t.charAt(i) - 'a']--;
    }
    for (int c : count) if (c != 0) return false;
    return true;
}`,
    keyPoints: [
      'Time Complexity: O(n); Space Complexity: O(1) (fixed 26-character array).',
      'For Unicode/UTF-8 characters, use HashMap<Character, Integer>.',
    ],
    followUps: [
      {
        question: 'How do you group an array of anagrams together (Group Anagrams)?',
        answer: 'Compute sorted string or frequency tuple as the HashMap key: Map<String, List<String>>. Append each word to its matching key list.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro'],
    tags: ['Strings', 'Anagrams', 'Hashing'],
  },
  {
    id: 'dsa-44',
    categoryId: 'cs-dsa',
    title: 'What is the Trapping Rain Water problem and how is it solved with Two Pointers?',
    difficulty: 'ADVANCED',
    answer:
      'Given an array of non-negative integers representing an elevation map where width of each bar is 1, compute how much water it can trap after raining. The water above bar i is determined by min(max_left, max_right) - height[i]. Two-Pointer approach: place left at 0, right at n-1, tracking left_max and right_max. If left_max < right_max, water trapped at left is bounded by left_max (left_max - height[left]), so accumulate and advance left++. Otherwise, accumulate right_max - height[right] and advance right--. Time: O(n), Space: O(1).',
    keyPoints: [
      'Eliminates precomputed prefix_max and suffix_max arrays, saving O(n) memory.',
      'Single pass O(n) time and O(1) auxiliary space.',
    ],
    followUps: [
      {
        question: 'Why is water at the left pointer strictly bounded by left_max when left_max < right_max?',
        answer: 'Because we know there exists a bar on the right that is at least right_max > left_max, guaranteeing that left_max is the limiting bottleneck.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['Two Pointers', 'Trapping Rain Water', 'Arrays'],
  },
  {
    id: 'dsa-45',
    categoryId: 'cs-dsa',
    title: 'How do you implement a Queue using two Stacks?',
    difficulty: 'BEGINNER',
    answer:
      'Use two stacks: inStack (for enqueue) and outStack (for dequeue/peek). Enqueue (push): push element onto inStack in O(1). Dequeue (pop): if outStack is empty, pop all elements from inStack and push them into outStack (reversing their order to FIFO). Then pop from outStack. Amortized time complexity for both push and pop is O(1) because each element is moved between stacks at most once.',
    keyPoints: [
      'Amortized O(1) time per operation.',
      'Classic interview question demonstrating LIFO to FIFO conversion.',
    ],
    followUps: [
      {
        question: 'What is the worst-case time for a single pop operation?',
        answer: 'O(n) when outStack is empty and must transfer all n elements from inStack; but amortized over n operations it is O(1).',
      },
    ],
    companies: ['TCS', 'Infosys', 'Wipro', 'Capgemini'],
    tags: ['Stack', 'Queue', 'Amortized Analysis'],
  },
  {
    id: 'dsa-46',
    categoryId: 'cs-dsa',
    title: 'What is the Word Ladder problem and how does Bidirectional BFS optimize it?',
    difficulty: 'ADVANCED',
    answer:
      'Word Ladder finds the shortest transformation sequence from beginWord to endWord by changing 1 character at a time such that each intermediate word exists in a dictionary. Standard BFS explores outward from beginWord with branching factor b up to depth d, visiting O(b^d) nodes. Bidirectional BFS runs two simultaneous BFS searches: one forward from beginWord and one backward from endWord. The search terminates when the two search frontiers intersect. Reduces time complexity from O(b^d) to O(b^(d/2)), a massive exponential speedup.',
    keyPoints: [
      'Each step replaces each character a-z and checks dictionary membership in O(1).',
      'Bidirectional search cuts search graph radius in half.',
    ],
    followUps: [
      {
        question: 'When can Bidirectional BFS be applied?',
        answer: 'Whenever the start state AND target goal state are both known and transitions are reversible.',
      },
    ],
    companies: ['Deloitte', 'Infosys'],
    tags: ['BFS', 'Bidirectional BFS', 'Graphs'],
  },
  {
    id: 'dsa-47',
    categoryId: 'cs-dsa',
    title: 'What is the Longest Palindromic Substring problem and Expand Around Center?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Find the longest contiguous substring that reads the same forwards and backwards. A palindrome mirrors around its center. There are 2n - 1 potential centers (n single characters for odd palindromes, n - 1 adjacent character pairs for even palindromes). Expand Around Center iterates through all 2n - 1 centers, expanding left and right as long as characters match. Time Complexity: O(n^2); Space Complexity: O(1). Manacher’s Algorithm can solve it in linear O(n) time by reusing previously computed palindrome radii.',
    keyPoints: [
      'O(n^2) time and O(1) space with Expand Around Center.',
      'Much simpler and uses less space than 2D DP table.',
    ],
    followUps: [
      {
        question: 'How does Manacher’s algorithm achieve O(n) linear time?',
        answer: 'By inserting dummy delimiter characters (#) to unify even/odd centers and maintaining the rightmost palindrome boundary to skip redundant center expansions.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['Strings', 'Palindromes', 'Expand Around Center'],
  },
  {
    id: 'dsa-48',
    categoryId: 'cs-dsa',
    title: 'How do you find the Duplicate Number in an array of n+1 integers (Floyd’s cycle applied to arrays)?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Given an array of n+1 integers where each integer is between 1 and n inclusive, exactly one duplicate exists. Because values are in range 1..n, we can treat the array as a Linked List where index i points to node nums[i]. Since there is a duplicate value, two indices point to the same next node, creating a cycle. We run Floyd’s Tortoise and Hare on the array pointers: slow = nums[slow], fast = nums[nums[fast]]. When they meet, reset slow to 0 and advance both 1 step at a time; the meeting point is the duplicate number. Time: O(n), Space: O(1), without modifying the input array.',
    keyPoints: [
      'Does not modify array (read-only).',
      'Uses O(1) auxiliary space (beats HashSet O(n) space and sorting O(n log n) time).',
    ],
    followUps: [
      {
        question: 'Why does value 0 never point to anything?',
        answer: 'Because values are strictly in range 1..n, index 0 is always outside the cycle and acts as the head.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['Arrays', 'Floyd Cycle', 'Pointers'],
  },
  {
    id: 'dsa-49',
    categoryId: 'cs-dsa',
    title: 'Explain Circular Queue and its array implementation.',
    difficulty: 'BEGINNER',
    answer:
      'A standard array queue wastes memory because after elements are dequeued from the front, those vacated array slots cannot be reused. A Circular Queue connects the last position back to the first position conceptually like a ring. Pointers front and rear advance using modulo arithmetic: rear = (rear + 1) % capacity. Full condition: (rear + 1) % capacity == front. Empty condition: front == -1.',
    keyPoints: [
      'Prevents memory wastage without shifting elements in memory.',
      'O(1) time for enqueue and dequeue.',
    ],
    followUps: [
      {
        question: 'Where is a Circular Queue used in Operating Systems?',
        answer: 'In circular ring buffers for audio/video streaming, OS keyboard input buffers, and CPU round-robin scheduling queues.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Wipro'],
    tags: ['Queue', 'Circular Queue', 'Arrays'],
  },
  {
    id: 'dsa-50',
    categoryId: 'cs-dsa',
    title: 'What is the Edit Distance (Levenshtein Distance) problem?',
    difficulty: 'ADVANCED',
    answer:
      'Given two strings word1 and word2, calculate the minimum number of single-character operations (insert, delete, replace) required to convert word1 into word2. DP relation: if word1[i-1] == word2[j-1], dp[i][j] = dp[i-1][j-1] (no cost). Otherwise, dp[i][j] = 1 + min(dp[i-1][j] (delete), dp[i][j-1] (insert), dp[i-1][j-1] (replace)). Base cases: dp[i][0] = i, dp[0][j] = j. Time Complexity: O(m * n); Space Complexity: O(m * n), reducible to O(min(m, n)).',
    keyPoints: [
      'Forms the backbone of spell-checkers, auto-correct algorithms, and DNA similarity analysis.',
      'Levenshtein distance cost can be customized with weighted operation penalties.',
    ],
    followUps: [
      {
        question: 'What is the space complexity if only the previous row is stored?',
        answer: 'O(n) auxiliary space because computing row i only requires values from row i-1.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'InfoCepts'],
    tags: ['Dynamic Programming', 'Edit Distance', 'Strings'],
  },
];
