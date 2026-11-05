import { SeedInterviewQuestion } from './types';

export const SQL_QUESTIONS: SeedInterviewQuestion[] = [
  {
    id: 'sql-01',
    categoryId: 'db-sql',
    title: 'What is the logical order of execution in a SQL query?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Although written starting with SELECT, the SQL database engine evaluates query clauses in this exact logical order: 1. FROM & JOINs (identifies source tables and cartesian joins), 2. WHERE (filters raw rows), 3. GROUP BY (aggregates rows into groups), 4. HAVING (filters grouped aggregations), 5. SELECT (evaluates projected expressions and columns), 6. DISTINCT (removes duplicate rows), 7. ORDER BY (sorts the final dataset), 8. LIMIT / OFFSET (slices the output window).',
    keyPoints: [
      'This explains why column aliases defined in SELECT cannot be used in WHERE or GROUP BY clauses.',
      'HAVING runs after GROUP BY, whereas WHERE runs before grouping.',
      'ORDER BY runs after SELECT, so it CAN reference SELECT column aliases.',
    ],
    followUps: [
      {
        question: 'Why can’t you use a SELECT column alias in the WHERE clause?',
        answer: 'Because WHERE is evaluated at step 2, long before SELECT expressions are evaluated at step 5.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'TCS', 'InfoCepts', 'Cognizant'],
    tags: ['Execution Order', 'Core SQL'],
  },
  {
    id: 'sql-02',
    categoryId: 'db-sql',
    title: 'How do you find the Nth highest salary in SQL? (Explain 3 approaches)',
    difficulty: 'INTERMEDIATE',
    answer:
      'Approach 1 (Window function - Best practice): Use DENSE_RANK() OVER (ORDER BY salary DESC) in a CTE or subquery, then filter WHERE rank = N. Handles ties properly. Approach 2 (Subquery): SELECT salary FROM Employee e1 WHERE N-1 = (SELECT COUNT(DISTINCT e2.salary) FROM Employee e2 WHERE e2.salary > e1.salary). Approach 3 (LIMIT/OFFSET): SELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET N-1.',
    codeExample: `-- Approach 1: Window Function (Handles ties cleanly)
WITH RankedSalaries AS (
    SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
    FROM Employee
)
SELECT salary FROM RankedSalaries WHERE rnk = 2;

-- Approach 3: MySQL / SQLite LIMIT OFFSET
SELECT DISTINCT salary 
FROM Employee 
ORDER BY salary DESC 
LIMIT 1 OFFSET 1; -- 2nd highest`,
    keyPoints: [
      'Always use DISTINCT or DENSE_RANK to avoid duplicate salaries occupying ranks.',
      'Approach 1 with DENSE_RANK works universally across modern SQL databases.',
    ],
    followUps: [
      {
        question: 'Why use DENSE_RANK() instead of RANK() for the Nth highest salary?',
        answer: 'RANK() skips rank numbers after duplicate values (1, 1, 3), whereas DENSE_RANK() produces consecutive integers without gaps (1, 1, 2).',
      },
    ],
    companies: ['TCS', 'Infosys', 'Deloitte', 'Capgemini', 'Wipro', 'HCL', 'InfoCepts'],
    tags: ['Queries', 'Window Functions', 'Salary Queries'],
  },
  {
    id: 'sql-03',
    categoryId: 'db-sql',
    title: 'Explain the difference between ROW_NUMBER(), RANK(), and DENSE_RANK().',
    difficulty: 'INTERMEDIATE',
    answer:
      'All three assign integer ranks to rows partitioned and ordered over a window: 1. ROW_NUMBER() assigns a unique, strictly consecutive integer to every row (1, 2, 3, 4, 5) regardless of ties. 2. RANK() assigns the same rank to identical values, but leaves gaps in subsequent ranks corresponding to the count of duplicates (1, 2, 2, 4, 5). 3. DENSE_RANK() assigns the same rank to identical values without leaving gaps (1, 2, 2, 3, 4).',
    codeExample: `SELECT 
    name, salary,
    ROW_NUMBER() OVER (ORDER BY salary DESC) as row_num,
    RANK() OVER (ORDER BY salary DESC) as rnk,
    DENSE_RANK() OVER (ORDER BY salary DESC) as dense_rnk
FROM Employee;`,
    keyPoints: [
      'Use ROW_NUMBER() when you need pagination or a single tiebreaker.',
      'Use DENSE_RANK() for Olympic/leaderboard style rankings without skipped numbers.',
    ],
    followUps: [
      {
        question: 'What is the output for salaries 500, 400, 400, 300?',
        answer: 'ROW_NUMBER: 1, 2, 3, 4. RANK: 1, 2, 2, 4. DENSE_RANK: 1, 2, 2, 3.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts', 'Infosys', 'Cognizant'],
    tags: ['Window Functions', 'Ranking'],
  },
  {
    id: 'sql-04',
    categoryId: 'db-sql',
    title: 'Differentiate between INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN.',
    difficulty: 'BEGINNER',
    answer:
      'INNER JOIN returns only rows that have matching values in both tables. LEFT (OUTER) JOIN returns all rows from the left table and matched rows from the right table; unmatched right rows produce NULL. RIGHT (OUTER) JOIN returns all rows from the right table and matched rows from the left. FULL OUTER JOIN returns all rows when there is a match in either the left or right table, filling missing sides with NULL.',
    codeExample: `SELECT e.name, d.department_name
FROM Employee e
INNER JOIN Department d ON e.dept_id = d.id;

SELECT e.name, d.department_name
FROM Employee e
LEFT JOIN Department d ON e.dept_id = d.id;`,
    keyPoints: [
      'SQLite supports INNER, LEFT, and CROSS joins, but simulates FULL OUTER JOIN using LEFT JOIN UNION ALL with anti-join.',
      'CROSS JOIN produces a Cartesian product (M * N rows).',
    ],
    followUps: [
      {
        question: 'How do you find employees who do not belong to any department using a LEFT JOIN?',
        answer: 'SELECT e.* FROM Employee e LEFT JOIN Department d ON e.dept_id = d.id WHERE d.id IS NULL;',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro', 'Accenture'],
    tags: ['Joins', 'Relational Model'],
  },
  {
    id: 'sql-05',
    categoryId: 'db-sql',
    title: 'What is a Correlated Subquery and why can it be slow?',
    difficulty: 'ADVANCED',
    answer:
      'A Correlated Subquery is an inner subquery that references one or more columns from the outer query. Because of this dependency, the database engine cannot evaluate the inner query once upfront; it must re-evaluate the inner query row-by-row for every candidate row processed by the outer query, resulting in O(N * M) performance. In contrast, a non-correlated subquery is independent and executed only once.',
    codeExample: `-- Correlated subquery: Find employees earning more than their department average
SELECT e1.name, e1.salary, e1.dept_id
FROM Employee e1
WHERE e1.salary > (
    SELECT AVG(e2.salary) 
    FROM Employee e2 
    WHERE e2.dept_id = e1.dept_id -- References outer e1!
);`,
    keyPoints: [
      'Often replaceable with faster JOINs or Window Functions (AVG() OVER (PARTITION BY dept_id)).',
      'EXISTS and NOT EXISTS commonly use correlated subqueries.',
    ],
    followUps: [
      {
        question: 'How can you rewrite the correlated department average query using window functions?',
        answer: 'WITH AvgDept AS (SELECT name, salary, AVG(salary) OVER(PARTITION BY dept_id) as avg_sal FROM Employee) SELECT name, salary FROM AvgDept WHERE salary > avg_sal;',
      },
    ],
    companies: ['Deloitte', 'InfoCepts', 'Infosys'],
    tags: ['Subqueries', 'Performance', 'Query Optimization'],
  },
  {
    id: 'sql-06',
    categoryId: 'db-sql',
    title: 'What is the difference between WHERE and HAVING clauses in SQL?',
    difficulty: 'BEGINNER',
    answer:
      'WHERE filters individual rows before any grouping or aggregations take place. It cannot use aggregate functions (like SUM, COUNT, AVG). HAVING filters groups after the GROUP BY clause and aggregation have been evaluated. It is specifically designed to filter on aggregate conditions (e.g. HAVING COUNT(*) > 5).',
    codeExample: `SELECT dept_id, COUNT(*) AS emp_count
FROM Employee
WHERE salary > 30000        -- Filters raw rows BEFORE grouping
GROUP BY dept_id
HAVING COUNT(*) >= 5;       -- Filters groups AFTER aggregation`,
    keyPoints: [
      'WHERE applies to single records; HAVING applies to grouped summaries.',
      'WHERE improves performance by reducing the volume of rows before aggregation.',
    ],
    followUps: [
      {
        question: 'Can HAVING be used without a GROUP BY clause in SQL?',
        answer: 'Yes, if used without GROUP BY, the entire table is treated as a single group for the aggregate calculation.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Wipro', 'Capgemini'],
    tags: ['Where', 'Having', 'Aggregations'],
  },
  {
    id: 'sql-07',
    categoryId: 'db-sql',
    title: 'What is a Common Table Expression (CTE) and how does a Recursive CTE work?',
    difficulty: 'INTERMEDIATE',
    answer:
      'A CTE is a named temporary result set defined using the WITH clause, existing only within the execution scope of a single query. It improves query readability and modularity. A Recursive CTE references itself. It consists of two parts: an Anchor member (base query producing initial rows) and a Recursive member (joined to the CTE result and unioned with UNION ALL), continuing until the recursive member returns empty.',
    codeExample: `-- Recursive CTE generating numbers 1 to 10:
WITH RECURSIVE NumberSeries AS (
    SELECT 1 AS num             -- Anchor member
    UNION ALL
    SELECT num + 1 FROM NumberSeries WHERE num < 10 -- Recursive member
)
SELECT * FROM NumberSeries;`,
    keyPoints: [
      'Recursive CTEs are ideal for hierarchical data: org charts (manager-employee), category trees, graph paths.',
      'Must ensure a termination condition to avoid infinite recursion.',
    ],
    followUps: [
      {
        question: 'How do you query an organizational hierarchy using a recursive CTE?',
        answer: 'Anchor query selects the CEO (manager_id IS NULL), recursive query joins Employee table where employee.manager_id = CTE.emp_id.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts', 'Infosys'],
    tags: ['CTE', 'Recursive Queries', 'Hierarchical Data'],
  },
  {
    id: 'sql-08',
    categoryId: 'db-sql',
    title: 'Explain the difference between UNION and UNION ALL with performance implications.',
    difficulty: 'BEGINNER',
    answer:
      'Both UNION and UNION ALL combine the result sets of two or more SELECT queries with identical column structures. UNION removes all duplicate rows from the final result set by performing an internal distinct sort/hash operation. UNION ALL combines all rows including duplicates without sorting. Therefore, UNION ALL is significantly faster and uses less CPU/memory; use UNION ALL unless deduplication is strictly necessary.',
    keyPoints: [
      'Both queries must have the same number of columns with compatible data types.',
      'Column names in the final result are taken from the first SELECT query.',
    ],
    followUps: [
      {
        question: 'When should you always choose UNION ALL over UNION?',
        answer: 'Whenever you know the underlying result sets are disjoint (mutually exclusive) or when retaining duplicate counts is required.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro'],
    tags: ['Set Operations', 'Performance'],
  },
  {
    id: 'sql-09',
    categoryId: 'db-sql',
    title: 'How do you find and remove duplicate rows from a SQL table?',
    difficulty: 'INTERMEDIATE',
    answer:
      'To find duplicates: GROUP BY the unique key columns and filter HAVING COUNT(*) > 1. To delete duplicates: Use a CTE with ROW_NUMBER() partitioned by duplicate keys, and DELETE rows where row_num > 1.',
    codeExample: `-- Step 1: Find duplicates
SELECT email, COUNT(*) 
FROM Users 
GROUP BY email 
HAVING COUNT(*) > 1;

-- Step 2: Delete duplicates (keeping the lowest id)
DELETE FROM Users 
WHERE id NOT IN (
    SELECT MIN(id) 
    FROM Users 
    GROUP BY email
);`,
    keyPoints: [
      'In SQL Server/PostgreSQL: WITH RankedRows AS (SELECT id, ROW_NUMBER() OVER(PARTITION BY email ORDER BY id) as rn FROM Users) DELETE FROM RankedRows WHERE rn > 1;.',
      'Always test with SELECT before issuing DELETE.',
    ],
    followUps: [
      {
        question: 'How can you prevent duplicate entries from occurring in the first place?',
        answer: 'Add a UNIQUE constraint or unique index on the column(s).',
      },
    ],
    companies: ['TCS', 'Infosys', 'Deloitte', 'Capgemini'],
    tags: ['Data Cleaning', 'Duplicates', 'DML'],
  },
  {
    id: 'sql-10',
    categoryId: 'db-sql',
    title: 'What are SQL Window Functions LAG() and LEAD() and when are they used?',
    difficulty: 'INTERMEDIATE',
    answer:
      'LAG() and LEAD() are analytic window functions that access data from preceding or following rows in a result set without requiring a self-join. LAG(column, offset, default) fetches a value from N rows BEFORE the current row. LEAD(column, offset, default) fetches a value from N rows AFTER the current row. They are indispensable for calculating period-over-period growth, moving differences, and churn.',
    codeExample: `-- Month-over-month sales difference:
SELECT 
    sale_month, 
    revenue,
    LAG(revenue, 1, 0) OVER (ORDER BY sale_month) AS prev_revenue,
    revenue - LAG(revenue, 1, 0) OVER (ORDER BY sale_month) AS mom_growth
FROM MonthlySales;`,
    keyPoints: [
      'Requires OVER (ORDER BY ...) clause.',
      'Third parameter provides a fallback value when offset falls outside the partition boundary.',
    ],
    followUps: [
      {
        question: 'How do you calculate year-over-year percentage growth using LAG?',
        answer: '((revenue - LAG(revenue, 1) OVER (ORDER BY year)) / LAG(revenue, 1) OVER (ORDER BY year)) * 100.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts', 'Cognizant'],
    tags: ['Window Functions', 'Time Series', 'Analytics'],
  },
  {
    id: 'sql-11',
    categoryId: 'db-sql',
    title: 'Explain NULL in SQL and Three-Valued Logic (3VL).',
    difficulty: 'INTERMEDIATE',
    answer:
      'NULL represents a missing or unknown value, not zero or an empty string. Because NULL is unknown, comparisons with NULL (e.g., col = NULL or col != NULL) cannot evaluate to TRUE or FALSE; they evaluate to UNKNOWN. This is Three-Valued Logic (TRUE, FALSE, UNKNOWN). To check for NULL, you MUST use IS NULL or IS NOT NULL. In WHERE clauses, rows are only returned if the condition evaluates strictly to TRUE.',
    codeExample: `SELECT * FROM Employee WHERE bonus = NULL;   -- Returns 0 rows always!
SELECT * FROM Employee WHERE bonus IS NULL;  -- Correct!

-- NULL in NOT IN subqueries can return 0 rows:
SELECT * FROM Customers WHERE id NOT IN (SELECT customer_id FROM Orders);
-- If any customer_id in Orders is NULL, NOT IN evaluates to UNKNOWN for all rows!`,
    keyPoints: [
      'COALESCE(col, fallback) returns the first non-null argument.',
      'Aggregate functions (except COUNT(*)) ignore NULL values.',
      'NULL != NULL evaluates to UNKNOWN.',
    ],
    followUps: [
      {
        question: 'What is the danger of NULL in a NOT IN subquery?',
        answer: 'If the subquery returns even a single NULL, NOT IN evaluates to UNKNOWN for every outer row, returning zero rows. Use NOT EXISTS instead.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'InfoCepts'],
    tags: ['NULL', 'Logic', 'Edge Cases'],
  },
  {
    id: 'sql-12',
    categoryId: 'db-sql',
    title: 'Explain the difference between DELETE, TRUNCATE, and DROP.',
    difficulty: 'BEGINNER',
    answer:
      '1. DELETE is a DML command that removes specific rows matching a WHERE clause. It logs each deleted row in the transaction log, can be rolled back, and activates database triggers. 2. TRUNCATE is a DDL command that deallocates all data pages in the table, resetting identity/auto-increment counters. It is much faster than DELETE because it logs page deallocations rather than individual rows. 3. DROP is a DDL command that deletes the entire table structure, schema, data, and associated indexes permanently.',
    keyPoints: [
      'DELETE supports WHERE; TRUNCATE deletes everything.',
      'TRUNCATE cannot be run if the table is referenced by a FOREIGN KEY constraint.',
      'DROP removes table definition from data dictionary.',
    ],
    followUps: [
      {
        question: 'Can TRUNCATE be rolled back inside a transaction?',
        answer: 'Yes, in databases like PostgreSQL, SQL Server, and SQLite, TRUNCATE can be rolled back if executed within an explicit BEGIN TRANSACTION block (contrary to common myth for Oracle/MySQL).',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro', 'HCL'],
    tags: ['DDL', 'DML', 'Data Manipulation'],
  },
  {
    id: 'sql-13',
    categoryId: 'db-sql',
    title: 'Write a query to display employee name and their manager name (Self Join).',
    difficulty: 'BEGINNER',
    answer:
      'A Self Join joins a table to itself by creating two aliases. To show all employees including those without a manager (e.g. the CEO), use a LEFT JOIN linking e.manager_id to m.id.',
    codeExample: `SELECT 
    e.name AS employee_name,
    COALESCE(m.name, 'Top Executive / No Manager') AS manager_name
FROM Employee e
LEFT JOIN Employee m ON e.manager_id = m.id;`,
    keyPoints: [
      'Use LEFT JOIN to include top-level managers whose manager_id is NULL.',
      'Use INNER JOIN if you only want employees who have a manager.',
    ],
    followUps: [
      {
        question: 'How do you find managers who manage more than 5 direct reports?',
        answer: 'SELECT m.name, COUNT(e.id) FROM Employee e JOIN Employee m ON e.manager_id = m.id GROUP BY m.id, m.name HAVING COUNT(e.id) > 5;',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Cognizant'],
    tags: ['Self Join', 'Queries'],
  },
  {
    id: 'sql-14',
    categoryId: 'db-sql',
    title: 'What is the difference between COUNT(*), COUNT(1), and COUNT(column_name)?',
    difficulty: 'BEGINNER',
    answer:
      'COUNT(*) counts the total number of rows in the table or group, including rows with NULL values or duplicate fields. COUNT(1) passes the literal constant 1 for each row; modern SQL query optimizers treat COUNT(1) and COUNT(*) identically with the exact same performance. COUNT(column_name) counts only the rows where that specific column is NOT NULL.',
    codeExample: `-- Table: [id=1, bonus=100], [id=2, bonus=NULL], [id=3, bonus=200]
SELECT COUNT(*) FROM Emp;       -- 3
SELECT COUNT(1) FROM Emp;       -- 3
SELECT COUNT(bonus) FROM Emp;   -- 2 (NULL row skipped)`,
    keyPoints: [
      'COUNT(*) and COUNT(1) have identical execution plans in PostgreSQL, MySQL, and SQLite.',
      'Use COUNT(col) only when you specifically wish to exclude NULL values.',
    ],
    followUps: [
      {
        question: 'How do you count the number of unique departments in an employee table?',
        answer: 'SELECT COUNT(DISTINCT dept_id) FROM Employee;',
      },
    ],
    companies: ['TCS', 'Infosys', 'Wipro'],
    tags: ['Aggregations', 'Counting'],
  },
  {
    id: 'sql-15',
    categoryId: 'db-sql',
    title: 'How do you calculate a Running Total (Cumulative Sum) in SQL?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Use the SUM() window function with an OVER clause specifying ORDER BY. By default, specifying ORDER BY in a window defines the window frame as RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW, which accumulates values from the first row up to the current row.',
    codeExample: `SELECT 
    order_date,
    amount,
    SUM(amount) OVER (ORDER BY order_date) AS running_total
FROM Orders;

-- Running total partitioned by department:
SELECT 
    dept_id,
    emp_name,
    salary,
    SUM(salary) OVER (PARTITION BY dept_id ORDER BY hire_date) AS dept_running_salary
FROM Employee;`,
    keyPoints: [
      'ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW is faster and avoids duplicate row tie-merging issues.',
      'PARTITION BY resets the running total calculation for each partition group.',
    ],
    followUps: [
      {
        question: 'What is the difference between ROWS and RANGE in window frames?',
        answer: 'ROWS treats duplicate values as individual rows. RANGE groups rows with identical ORDER BY values together in the frame computation.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts', 'Infosys'],
    tags: ['Window Functions', 'Running Total', 'Cumulative'],
  },
  {
    id: 'sql-16',
    categoryId: 'db-sql',
    title: 'What is an Index and what is the difference between Clustered and Non-Clustered Indexes?',
    difficulty: 'INTERMEDIATE',
    answer:
      'An Index is a B-Tree data structure that speeds up data retrieval operations without scanning every row in a table. A Clustered Index dictates the physical storage order of the actual rows on disk; therefore, a table can have ONLY ONE clustered index (usually the Primary Key). The leaf nodes of a clustered index contain the actual data pages. A Non-Clustered Index stores sorted indexed column keys paired with row locator pointers (bookmark / clustered key) pointing to where the actual data resides; a table can have many non-clustered indexes.',
    keyPoints: [
      'Clustered index leaf node = actual data.',
      'Non-clustered index leaf node = pointer to data.',
      'Indexes speed up SELECT queries but add write overhead to INSERT, UPDATE, and DELETE.',
    ],
    followUps: [
      {
        question: 'What is a Covering Index?',
        answer: 'A non-clustered index that includes all columns referenced in a query (SELECT, WHERE, JOIN), allowing the query to be fulfilled entirely from index RAM without visiting table pages.',
      },
    ],
    companies: ['Infosys', 'Deloitte', 'TCS', 'Capgemini', 'InfoCepts'],
    tags: ['Indexing', 'B-Tree', 'Performance'],
  },
  {
    id: 'sql-17',
    categoryId: 'db-sql',
    title: 'Write a query to find the Top 3 highest earners in each department.',
    difficulty: 'INTERMEDIATE',
    answer:
      'Use DENSE_RANK() partitioned by department_id and ordered by salary descending in a CTE or derived table, and filter WHERE rank <= 3.',
    codeExample: `WITH DepartmentRanked AS (
    SELECT 
        dept_id,
        name,
        salary,
        DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) as rank_in_dept
    FROM Employee
)
SELECT dept_id, name, salary
FROM DepartmentRanked
WHERE rank_in_dept <= 3;`,
    keyPoints: [
      'PARTITION BY dept_id isolates the ranking calculation within each department.',
      'DENSE_RANK() ensures that if two people tie for 1st, they both get 1, and the next person gets 2.',
    ],
    followUps: [
      {
        question: 'What would happen if you used ROW_NUMBER() instead of DENSE_RANK()?',
        answer: 'Tied employees would receive arbitrary distinct ranks (1, 2, 3) rather than sharing the same earned position.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'InfoCepts', 'Cognizant'],
    tags: ['Window Functions', 'Top N Queries', 'Partition By'],
  },
  {
    id: 'sql-18',
    categoryId: 'db-sql',
    title: 'Explain Primary Key vs Unique Key vs Candidate Key.',
    difficulty: 'BEGINNER',
    answer:
      'Candidate Key is any minimal set of columns that uniquely identifies a row in a table. Primary Key is the specific candidate key chosen by the database architect as the primary identifier for the table; it strictly DOES NOT allow NULL values and automatically creates a clustered index by default. Unique Key enforces uniqueness across a column but allows NULL values (one NULL in SQL Server, multiple NULLs in PostgreSQL/SQLite).',
    keyPoints: [
      'A table can have only ONE Primary Key, but MULTIPLE Unique Keys.',
      'Primary Key columns must be declared NOT NULL.',
    ],
    followUps: [
      {
        question: 'Can a Primary Key consist of multiple columns?',
        answer: 'Yes, this is called a Composite Primary Key.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro'],
    tags: ['Constraints', 'Keys'],
  },
  {
    id: 'sql-19',
    categoryId: 'db-sql',
    title: 'What are SQL Constraints and what is ON DELETE CASCADE?',
    difficulty: 'BEGINNER',
    answer:
      'Constraints are rules enforced on data columns to ensure integrity: NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, CHECK, DEFAULT. ON DELETE CASCADE is a foreign key referential action: when a parent row is deleted, the database automatically deletes all referencing child rows in child tables, preventing orphan records.',
    codeExample: `CREATE TABLE Orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    FOREIGN KEY (customer_id) REFERENCES Customers(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);`,
    keyPoints: [
      'ON DELETE SET NULL sets foreign key in child rows to NULL when parent is deleted.',
      'ON DELETE RESTRICT / NO ACTION prevents deletion of parent if children exist.',
    ],
    followUps: [
      {
        question: 'What is the risk of excessive ON DELETE CASCADE triggers in large databases?',
        answer: 'Deleting a single top-level record can trigger massive cascading locks and delete millions of rows unexpectedly, locking tables.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini'],
    tags: ['Constraints', 'Foreign Key', 'Referential Integrity'],
  },
  {
    id: 'sql-20',
    categoryId: 'db-sql',
    title: 'What is a View and how does it differ from a Materialized View?',
    difficulty: 'INTERMEDIATE',
    answer:
      'A Standard View is a virtual table defined by a saved SQL query. It does NOT store data physically on disk; every time the view is queried, the database executes the underlying query on-the-fly. A Materialized View physically caches and stores the query results on disk like a real table. It drastically speeds up complex reporting aggregations but must be refreshed (manually or on a schedule) to stay updated with base table changes.',
    keyPoints: [
      'Views provide security (hiding sensitive columns) and simplify complex query reuse.',
      'Materialized views trade data freshness for ultra-fast read throughput in OLAP / BI systems.',
    ],
    followUps: [
      {
        question: 'Does SQLite support Materialized Views natively?',
        answer: 'No, SQLite only supports standard virtual views; developers simulate materialized views using CREATE TABLE AS SELECT.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts', 'Infosys'],
    tags: ['Views', 'Materialized Views', 'Architecture'],
  },
  {
    id: 'sql-21',
    categoryId: 'db-sql',
    title: 'How do you find consecutive active login streaks in SQL (Gaps and Islands problem)?',
    difficulty: 'ADVANCED',
    answer:
      'This classic problem is solved using the Gaps and Islands pattern. Subtracting a sequential row number (ROW_NUMBER() OVER (ORDER BY login_date)) from the date value produces a constant date anchor for consecutive days. Grouping by this anchor identifies the island (consecutive streak).',
    codeExample: `WITH RankedLogins AS (
    SELECT 
        user_id,
        login_date,
        -- Subtract row number days from login_date:
        DATE(login_date, '-' || (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date)) || ' day') AS streak_group
    FROM (SELECT DISTINCT user_id, login_date FROM UserLogins)
)
SELECT 
    user_id,
    MIN(login_date) AS streak_start,
    MAX(login_date) AS streak_end,
    COUNT(*) AS consecutive_days
FROM RankedLogins
GROUP BY user_id, streak_group
HAVING COUNT(*) >= 3;`,
    keyPoints: [
      'Deduplicate dates first using DISTINCT.',
      'The difference between a date and a consecutive integer sequence remains identical for consecutive dates.',
    ],
    followUps: [
      {
        question: 'What is the "Islands" vs "Gaps" distinction?',
        answer: 'Islands are contiguous sequences of data; Gaps are missing ranges between valid records.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts'],
    tags: ['Gaps and Islands', 'Advanced SQL', 'Window Functions'],
  },
  {
    id: 'sql-22',
    categoryId: 'db-sql',
    title: 'What does the EXPLAIN keyword do and what is a full table scan?',
    difficulty: 'INTERMEDIATE',
    answer:
      'EXPLAIN (or EXPLAIN QUERY PLAN) displays the database engine’s chosen execution plan for a SQL statement without running it. It details whether the engine will use index lookups (Index Scan / Index Seek) or scan every page of the table sequentially (Full Table Scan / Table Scan). Full table scans are expensive on large tables because every row must be read from disk into RAM.',
    keyPoints: [
      'Look for "SCAN TABLE" (full scan) vs "SEARCH TABLE ... USING INDEX" in SQLite EXPLAIN QUERY PLAN.',
      'Helps identify missing indexes and un-SARGable query predicates.',
    ],
    followUps: [
      {
        question: 'What makes a query predicate non-SARGable?',
        answer: 'Applying functions to indexed columns (e.g. WHERE YEAR(created_at) = 2024), which prevents the B-tree from seeking directly.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts', 'Infosys'],
    tags: ['Explain', 'Performance', 'Query Plan'],
  },
  {
    id: 'sql-23',
    categoryId: 'db-sql',
    title: 'What is the difference between EXISTS and IN in SQL?',
    difficulty: 'INTERMEDIATE',
    answer:
      'IN evaluates all values returned by the subquery into a list in memory and checks for membership; it can degrade if the subquery returns thousands of rows or contains NULL values. EXISTS tests whether the subquery returns at least one row, terminating evaluation immediately upon finding the first match (short-circuit boolean check). EXISTS is generally faster for large datasets and handles NULLs safely.',
    codeExample: `-- Using IN:
SELECT * FROM Customers WHERE id IN (SELECT customer_id FROM Orders);

-- Using EXISTS (Faster for large Orders table):
SELECT * FROM Customers c 
WHERE EXISTS (
    SELECT 1 FROM Orders o WHERE o.customer_id = c.id
);`,
    keyPoints: [
      'SELECT 1 is conventionally used in EXISTS because column selection is ignored.',
      'NOT EXISTS is much safer than NOT IN when NULLs exist.',
    ],
    followUps: [
      {
        question: 'Why doesn’t the column list in the EXISTS subquery matter?',
        answer: 'The optimizer checks only if a row exists in the buffer; it does not materialize or project columns.',
      },
    ],
    companies: ['Infosys', 'Deloitte', 'Capgemini'],
    tags: ['Subqueries', 'Exists vs In'],
  },
  {
    id: 'sql-24',
    categoryId: 'db-sql',
    title: 'What is a Cross Join and when is it practically useful?',
    difficulty: 'BEGINNER',
    answer:
      'A CROSS JOIN produces the Cartesian product of two tables, matching every row of Table A with every row of Table B (yielding Count(A) * Count(B) total rows). It does not have an ON condition. Practical uses: generating test data matrices, calendar date combinations (all products x all stores x all months for inventory forecasting), and calculating all pairwise combinations.',
    codeExample: `SELECT p.product_name, s.store_name
FROM Products p
CROSS JOIN Stores s;`,
    keyPoints: [
      'Danger: Large tables produce exponential row explosions (10k x 10k = 100 million rows).',
      'In SQLite, SELECT * FROM A, B is equivalent to CROSS JOIN.',
    ],
    followUps: [
      {
        question: 'How do you generate a report showing zero sales for store-product pairs with no activity?',
        answer: 'CROSS JOIN Products and Stores, then LEFT JOIN with Sales table, using COALESCE(sales.amount, 0).',
      },
    ],
    companies: ['Deloitte', 'InfoCepts'],
    tags: ['Cross Join', 'Cartesian Product'],
  },
  {
    id: 'sql-25',
    categoryId: 'db-sql',
    title: 'What are SQL Set operators INTERSECT and EXCEPT?',
    difficulty: 'INTERMEDIATE',
    answer:
      'INTERSECT combines two SELECT queries and returns only the rows that appear in BOTH result sets. EXCEPT (called MINUS in Oracle) returns distinct rows from the first query that DO NOT appear in the second query. Like UNION, both require compatible column structures and remove duplicate rows automatically.',
    codeExample: `-- Customers who bought in 2023 AND 2024:
SELECT customer_id FROM Orders2023
INTERSECT
SELECT customer_id FROM Orders2024;

-- Customers who bought in 2023 but NEVER in 2024:
SELECT customer_id FROM Orders2023
EXCEPT
SELECT customer_id FROM Orders2024;`,
    keyPoints: [
      'EXCEPT is order-dependent: A EXCEPT B is not equal to B EXCEPT A.',
      'Can also be modeled with LEFT JOIN ... WHERE ... IS NULL.',
    ],
    followUps: [
      {
        question: 'How does EXCEPT differ from NOT IN?',
        answer: 'EXCEPT compares entire row tuples across queries, whereas NOT IN compares a single column value.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts', 'Infosys'],
    tags: ['Set Operations', 'Intersect', 'Except'],
  },
  {
    id: 'sql-26',
    categoryId: 'db-sql',
    title: 'Write a query to find customers who placed orders on consecutive days.',
    difficulty: 'INTERMEDIATE',
    answer:
      'Join the Orders table to itself on customer_id matching where the second order date is exactly 1 day after the first order date, or use the LEAD() window function.',
    codeExample: `WITH OrderedDays AS (
    SELECT 
        customer_id, 
        order_date,
        LEAD(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) as next_date
    FROM (SELECT DISTINCT customer_id, order_date FROM Orders)
)
SELECT DISTINCT customer_id
FROM OrderedDays
WHERE julianday(next_date) - julianday(order_date) = 1;`,
    keyPoints: [
      'Deduplicate orders on the same day first with DISTINCT.',
      'Use date calculation functions appropriate to your dialect (e.g. DATEDIFF or julianday).',
    ],
    followUps: [
      {
        question: 'How do you write this using a self-join instead of LEAD?',
        answer: 'SELECT DISTINCT o1.customer_id FROM Orders o1 JOIN Orders o2 ON o1.customer_id = o2.customer_id AND date(o1.order_date, "+1 day") = o2.order_date;',
      },
    ],
    companies: ['Deloitte', 'InfoCepts'],
    tags: ['Queries', 'Window Functions', 'Date Calculations'],
  },
  {
    id: 'sql-27',
    categoryId: 'db-sql',
    title: 'What is a SARGable query and why does it matter for performance?',
    difficulty: 'ADVANCED',
    answer:
      'SARGable stands for "Search Argument Able". A query predicate is SARGable if the query engine can utilize an existing index to perform a direct B-tree seek rather than scanning the entire table. Queries become un-SARGable when functions, calculations, or leading wildcards are applied to the indexed column in the WHERE clause (e.g. WHERE SUBSTR(name, 1, 1) = "A" or WHERE amount + 10 > 100). Rewriting to WHERE name LIKE "A%" or WHERE amount > 90 restores SARGability.',
    keyPoints: [
      'Un-SARGable: WHERE UPPER(email) = "USER@EXAMPLE.COM" (forces full scan).',
      'SARGable: create functional index on UPPER(email) or store normalized lowercase.',
      'Leading wildcard LIKE "%term" is never SARGable on standard B-trees.',
    ],
    followUps: [
      {
        question: 'Is "WHERE date_col >= "2024-01-01" AND date_col < "2025-01-01"" SARGable?',
        answer: 'Yes, it provides a clean range boundary allowing a direct index range scan.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts'],
    tags: ['SARGable', 'Indexing', 'Query Optimization'],
  },
  {
    id: 'sql-28',
    categoryId: 'db-sql',
    title: 'Explain the difference between COALESCE, IFNULL, and NULLIF.',
    difficulty: 'BEGINNER',
    answer:
      'COALESCE(val1, val2, ..., valN) is an ANSI SQL standard function that returns the first non-null argument in its list (or NULL if all are null). IFNULL(val1, val2) is a 2-argument non-standard shorthand in SQLite/MySQL equivalent to COALESCE(val1, val2). NULLIF(val1, val2) compares two expressions; if they are equal, it returns NULL, otherwise it returns val1 (extremely useful for preventing division by zero: amount / NULLIF(total, 0)).',
    codeExample: `SELECT COALESCE(phone, mobile, 'No Contact') FROM Contacts;
SELECT 100.0 / NULLIF(total_items, 0) AS avg_price FROM Sales; -- Prevents div by zero!`,
    keyPoints: [
      'COALESCE is standard SQL and accepts arbitrary number of parameters.',
      'NULLIF converts target values (like 0 or empty strings) into NULL.',
    ],
    followUps: [
      {
        question: 'What does COALESCE evaluate if all arguments are NULL?',
        answer: 'It returns NULL.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini'],
    tags: ['Functions', 'NULL', 'Coalesce'],
  },
  {
    id: 'sql-29',
    categoryId: 'db-sql',
    title: 'What are SQL Transactions and what do COMMIT, ROLLBACK, and SAVEPOINT do?',
    difficulty: 'INTERMEDIATE',
    answer:
      'A Transaction is a logical unit of work comprising one or more SQL statements executed atomically. BEGIN / START TRANSACTION marks the start. COMMIT makes all changes made during the transaction permanent on disk. ROLLBACK undoes all changes since the start of the transaction. SAVEPOINT creates an intermediate rollback checkpoint within a transaction, allowing partial rollbacks via ROLLBACK TO savepoint_name without discarding the entire transaction.',
    codeExample: `BEGIN TRANSACTION;
UPDATE Account SET balance = balance - 500 WHERE id = 1;
SAVEPOINT Deducted;
UPDATE Account SET balance = balance + 500 WHERE id = 2;
-- If error occurs:
-- ROLLBACK TO Deducted;
COMMIT;`,
    keyPoints: [
      'Transactions enforce ACID properties in relational database systems.',
      'DDL statements in MySQL cause an implicit commit, ending the transaction.',
    ],
    followUps: [
      {
        question: 'Does SQLite support nested transactions?',
        answer: 'SQLite supports nested transactions via SAVEPOINT and RELEASE SAVEPOINT syntax.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro'],
    tags: ['Transactions', 'ACID', 'Commit', 'Rollback'],
  },
  {
    id: 'sql-30',
    categoryId: 'db-sql',
    title: 'Explain the difference between scalar subquery, column subquery, and row subquery.',
    difficulty: 'BEGINNER',
    answer:
      'A Scalar subquery returns exactly one single value (1 row, 1 column), and can be used anywhere an expression is expected (e.g. in SELECT list or comparison operators = , >). A Column subquery returns multiple rows of a single column, evaluated with IN, ANY, or ALL. A Row subquery returns a single row containing multiple columns (e.g. WHERE (col1, col2) = (SELECT a, b FROM table LIMIT 1)).',
    keyPoints: [
      'If a scalar subquery returns more than 1 row at runtime, the query aborts with a runtime error.',
      'Table subqueries return multiple rows and columns, used in FROM clauses as derived tables.',
    ],
    followUps: [
      {
        question: 'What error occurs if a scalar subquery in SELECT returns multiple rows?',
        answer: 'Subquery returns more than 1 row error.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini'],
    tags: ['Subqueries', 'Types'],
  },
  {
    id: 'sql-31',
    categoryId: 'db-sql',
    title: 'Write a query to find all departments that currently have NO employees.',
    difficulty: 'BEGINNER',
    answer:
      'Can be written using: 1. LEFT JOIN ... WHERE emp.id IS NULL, 2. NOT EXISTS subquery, or 3. NOT IN subquery.',
    codeExample: `-- Approach 1: LEFT JOIN (Fast & Readable)
SELECT d.department_name
FROM Department d
LEFT JOIN Employee e ON d.id = e.dept_id
WHERE e.id IS NULL;

-- Approach 2: NOT EXISTS
SELECT d.department_name
FROM Department d
WHERE NOT EXISTS (SELECT 1 FROM Employee e WHERE e.dept_id = d.id);`,
    keyPoints: [
      'Avoid NOT IN if dept_id in Employee can contain NULLs.',
      'Both LEFT JOIN anti-join and NOT EXISTS are optimized efficiently by modern engines.',
    ],
    followUps: [
      {
        question: 'Which is faster: LEFT JOIN with IS NULL or NOT EXISTS?',
        answer: 'They generally produce identical execution plans; NOT EXISTS is sometimes faster when indexes exist on foreign keys.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro'],
    tags: ['Queries', 'Anti-Join', 'Null Checking'],
  },
  {
    id: 'sql-32',
    categoryId: 'db-sql',
    title: 'What is a Composite Index and what is the Leftmost Prefix Rule?',
    difficulty: 'ADVANCED',
    answer:
      'A Composite Index is an index created on two or more columns (e.g., INDEX idx_name (colA, colB, colC)). The Leftmost Prefix Rule dictates that the query optimizer can only use the composite index for filtering if the query uses the leftmost column(s) in sequence. An index on (A, B, C) can satisfy queries filtering on: (A), (A, B), or (A, B, C). It CANNOT be used efficiently for queries filtering ONLY on (B) or (C) or (B, C).',
    keyPoints: [
      'Column order in index definition matters immensely: place high-cardinality equality columns first.',
      'Range predicates (<, >) stop index utilization for subsequent columns in the composite key.',
    ],
    followUps: [
      {
        question: 'Can an index on (A, B) be used for a query with "WHERE B = 5"?',
        answer: 'No direct index seek; the engine must scan the index leaf nodes or fall back to a full table scan.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts', 'Infosys'],
    tags: ['Indexing', 'Composite Index', 'Performance'],
  },
  {
    id: 'sql-33',
    categoryId: 'db-sql',
    title: 'What is NTILE() window function in SQL and when is it used?',
    difficulty: 'INTERMEDIATE',
    answer:
      'NTILE(n) divides an ordered partition into n roughly equal buckets (quartiles, deciles, percentiles) and assigns a bucket number (from 1 to n) to each row. If the row count is not evenly divisible, larger buckets come first. It is widely used in data analytics for customer segmentation (e.g. dividing users into 4 wealth quartiles or 10 activity deciles).',
    codeExample: `SELECT 
    name, salary,
    NTILE(4) OVER (ORDER BY salary DESC) as salary_quartile
FROM Employee;`,
    keyPoints: [
      'NTILE(4) creates quartiles; NTILE(100) creates percentiles.',
      'Bucket sizes differ by at most 1 row.',
    ],
    followUps: [
      {
        question: 'If you have 10 rows and use NTILE(3), how are rows distributed?',
        answer: 'Buckets 1, 2, and 3 will receive 4, 3, and 3 rows respectively.',
      },
    ],
    companies: ['InfoCepts', 'Deloitte'],
    tags: ['Window Functions', 'Ntile', 'Analytics'],
  },
  {
    id: 'sql-34',
    categoryId: 'db-sql',
    title: 'What is the difference between Natural Join and Inner Join?',
    difficulty: 'BEGINNER',
    answer:
      'An INNER JOIN explicitly specifies the joining columns using the ON clause (e.g., ON a.id = b.a_id). A NATURAL JOIN automatically joins two tables based on all columns that share the exact same column name and data type across both tables, without requiring an ON clause. In production, NATURAL JOIN is considered dangerous and an anti-pattern because adding a column with a common name (like created_at) to either table will silently alter the join condition.',
    keyPoints: [
      'Avoid NATURAL JOIN in enterprise software.',
      'Always prefer explicit INNER JOIN with ON conditions.',
    ],
    followUps: [
      {
        question: 'What is the USING clause in SQL joins?',
        answer: 'Shorthand for joining on common column names without duplicate columns in SELECT *: e.g. JOIN Orders USING (customer_id).',
      },
    ],
    companies: ['TCS', 'Wipro'],
    tags: ['Joins', 'Best Practices'],
  },
  {
    id: 'sql-35',
    categoryId: 'db-sql',
    title: 'How do you swap gender values in an Employee table in a single UPDATE statement?',
    difficulty: 'BEGINNER',
    answer:
      'Use a CASE statement inside the UPDATE statement to swap "M" to "F" and "F" to "M" atomically without temporary variables.',
    codeExample: `UPDATE Salary
SET sex = CASE sex
    WHEN 'm' THEN 'f'
    ELSE 'm'
END;`,
    keyPoints: [
      'Executes atomically row-by-row.',
      'Standard LeetCode SQL problem (#627).',
    ],
    followUps: [
      {
        question: 'Can you use IF() instead of CASE in MySQL?',
        answer: 'Yes: SET sex = IF(sex = "m", "f", "m"). CASE is preferred because it is ANSI SQL standard.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini'],
    tags: ['Update', 'Case When', 'Queries'],
  },
  {
    id: 'sql-36',
    categoryId: 'db-sql',
    title: 'What is the difference between FIRST_VALUE() and LAST_VALUE() window functions?',
    difficulty: 'INTERMEDIATE',
    answer:
      'FIRST_VALUE(col) returns the value from the first row of the window frame. LAST_VALUE(col) returns the value from the last row of the frame. Caution: By default, the window frame in SQL is RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW. Therefore, without an explicit frame clause, LAST_VALUE() simply returns the current row value! To get the true last value of the partition, you must specify ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING.',
    codeExample: `SELECT 
    dept_id, name, salary,
    FIRST_VALUE(name) OVER (PARTITION BY dept_id ORDER BY salary DESC) as highest_earner,
    LAST_VALUE(name) OVER (
        PARTITION BY dept_id ORDER BY salary DESC
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) as lowest_earner
FROM Employee;`,
    keyPoints: [
      'Always specify the explicit window frame when using LAST_VALUE().',
      'Both functions respect PARTITION BY boundaries.',
    ],
    followUps: [
      {
        question: 'Why does default LAST_VALUE() return the current row instead of the partition end?',
        answer: 'Because the default window frame ends at CURRENT ROW, not the end of the partition.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts'],
    tags: ['Window Functions', 'First Value', 'Last Value'],
  },
  {
    id: 'sql-37',
    categoryId: 'db-sql',
    title: 'Explain Database Deadlock in SQL and how to prevent it.',
    difficulty: 'ADVANCED',
    answer:
      'A database deadlock occurs when two concurrent transactions hold locks on separate resources and each waits to acquire a lock held by the other (e.g. Tx1 locks Row A and requests Row B; Tx2 locks Row B and requests Row A). The database deadlock detector automatically detects the cycle via a wait-for graph and terminates one transaction (the "deadlock victim") with an error. Prevention: 1. Always access tables and rows in a globally consistent order across all transactions, 2. Keep transactions short, 3. Use lower isolation levels or optimistic concurrency.',
    keyPoints: [
      'Deadlock victims receive error codes (e.g. ORA-00060, MySQL error 1213).',
      'Application code should retry deadlocked transactions with exponential backoff.',
    ],
    followUps: [
      {
        question: 'How does an RDBMS detect deadlocks?',
        answer: 'By maintaining a Wait-For Graph (WFG) where nodes are transactions and edges are lock requests; a cycle in the graph indicates deadlock.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts', 'Infosys'],
    tags: ['Transactions', 'Concurrency', 'Deadlocks'],
  },
  {
    id: 'sql-38',
    categoryId: 'db-sql',
    title: 'How do you handle pagination efficiently in SQL for millions of rows?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Traditional OFFSET pagination (LIMIT 20 OFFSET 100000) degrades drastically because the database must read and discard 100,000 rows before returning 20. The high-performance alternative is Keysets / Keyset Pagination (Seek Method): use the last seen record’s indexed ID/timestamp in the WHERE clause: WHERE id > last_seen_id ORDER BY id ASC LIMIT 20. This performs a direct B-tree seek in O(1) time regardless of page depth.',
    codeExample: `-- Inefficient at deep pages (O(N) scan):
SELECT * FROM ActivityLog ORDER BY id LIMIT 20 OFFSET 500000;

-- Efficient Keyset Seek (O(log N) direct B-Tree seek):
SELECT * FROM ActivityLog WHERE id > 500000 ORDER BY id LIMIT 20;`,
    keyPoints: [
      'Keyset pagination is immune to row drift when new records are inserted during scrolling.',
      'Requires a deterministic, ordered indexed column (like primary key id).',
    ],
    followUps: [
      {
        question: 'What is the limitation of keyset pagination?',
        answer: 'It does not easily allow jumping directly to arbitrary pages (e.g., jump to page 47); it is suited for "Next/Prev" or infinite scroll.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts', 'Infosys'],
    tags: ['Pagination', 'Performance', 'Keyset'],
  },
  {
    id: 'sql-39',
    categoryId: 'db-sql',
    title: 'What is the difference between CHAR, VARCHAR, and TEXT data types?',
    difficulty: 'BEGINNER',
    answer:
      'CHAR(n) is fixed-length; it always occupies n characters on disk, padding unused space with spaces. Best for fixed-size strings (e.g., country codes "US", "IN", UUIDs). VARCHAR(n) is variable-length; it stores only the actual characters plus 1-2 prefix length bytes. TEXT stores large variable-length text strings and is typically stored in separate overflow data pages outside the main table row.',
    keyPoints: [
      'In SQLite, all string types (CHAR, VARCHAR, TEXT) map to the TEXT storage class with dynamic typing.',
      'Over-allocating CHAR(255) wastes storage space due to padding.',
    ],
    followUps: [
      {
        question: 'Does SQLite enforce VARCHAR length limits by default?',
        answer: 'No, SQLite ignores type length limits unless strict tables are enabled in modern SQLite 3.37+.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini'],
    tags: ['Data Types', 'Storage'],
  },
  {
    id: 'sql-40',
    categoryId: 'db-sql',
    title: 'Explain SQL String Pattern Matching: LIKE, WILDCARDS, and REGEXP.',
    difficulty: 'BEGINNER',
    answer:
      'LIKE operator searches for patterns using two wildcards: % matches zero or more characters; _ (underscore) matches exactly one character. REGEXP (or ~ in PostgreSQL) provides full regular expression pattern matching. Searching with a leading wildcard (LIKE "%apple") cannot utilize standard B-tree indexes.',
    codeExample: `SELECT * FROM Users WHERE email LIKE '%@gmail.com';  -- Ends with @gmail.com
SELECT * FROM Users WHERE name LIKE '_a%';            -- 2nd letter is 'a'
SELECT * FROM Users WHERE code LIKE '[A-Z][0-9]%';    -- Regex/bracket syntax in SQL Server`,
    keyPoints: [
      'LIKE is case-insensitive in SQLite by default for ASCII characters.',
      'ESCAPE clause allows escaping literal % or _ characters (e.g. LIKE "%50$%%" ESCAPE "$").',
    ],
    followUps: [
      {
        question: 'How do you search for a literal "%" character in SQL?',
        answer: 'Use the ESCAPE keyword: WHERE discount LIKE "%!%%" ESCAPE "!".',
      },
    ],
    companies: ['TCS', 'Infosys', 'Wipro'],
    tags: ['Strings', 'Pattern Matching', 'Like'],
  },
  {
    id: 'sql-41',
    categoryId: 'db-sql',
    title: 'Write a query to calculate the percentage of total sales each product contributes.',
    difficulty: 'INTERMEDIATE',
    answer:
      'Use SUM(amount) OVER () with an empty OVER clause to compute the global grand total as a window, then divide the product sales by that total.',
    codeExample: `SELECT 
    product_name,
    SUM(sales_amount) AS product_sales,
    (SUM(sales_amount) * 100.0) / SUM(SUM(sales_amount)) OVER () AS sales_percentage
FROM Sales
GROUP BY product_name;`,
    keyPoints: [
      'SUM(SUM(x)) OVER() calculates the sum of all grouped sums.',
      'Multiply by 100.0 to prevent integer division truncation.',
    ],
    followUps: [
      {
        question: 'How do you round the percentage to 2 decimal places?',
        answer: 'Wrap the calculation in ROUND(..., 2).',
      },
    ],
    companies: ['Deloitte', 'InfoCepts'],
    tags: ['Window Functions', 'Percentages', 'Analytics'],
  },
  {
    id: 'sql-42',
    categoryId: 'db-sql',
    title: 'What is Database Normalization and why do we stop at 3NF in enterprise apps?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Normalization organizes database tables to eliminate data redundancy and prevent insertion, update, and deletion anomalies. 1NF: Atomic values, unique rows. 2NF: 1NF + no partial functional dependencies (all non-key attributes fully depend on candidate key). 3NF: 2NF + no transitive dependencies. Enterprise systems stop at 3NF because higher normal forms (BCNF, 4NF, 5NF) require breaking tables into too many small tables, requiring excessive multi-table JOINs that severely degrade read performance.',
    keyPoints: [
      'Denormalization is intentionally introducing controlled redundancy to optimize read queries.',
      'OLTP systems target 3NF; OLAP data warehouses use denormalized Star/Snowflake schemas.',
    ],
    followUps: [
      {
        question: 'What is a transitive dependency in 3NF?',
        answer: 'When a non-key attribute depends on another non-key attribute (A -> B and B -> C, where A is Primary Key).',
      },
    ],
    companies: ['TCS', 'Infosys', 'Deloitte', 'Capgemini'],
    tags: ['Normalization', 'DBMS', 'Schema Design'],
  },
  {
    id: 'sql-43',
    categoryId: 'db-sql',
    title: 'What is the difference between correlated subquery and JOIN in terms of performance?',
    difficulty: 'INTERMEDIATE',
    answer:
      'A correlated subquery executes row-by-row for every candidate row evaluated by the outer query (nested loop mechanism). An equivalent JOIN allows the database query planner to choose optimal join algorithms based on statistics: Hash Join, Merge Join, or Index Nested Loops Join. Consequently, JOINs usually exhibit vastly superior performance for large record sets.',
    keyPoints: [
      'Modern optimizers can sometimes unnest correlated subqueries into joins automatically.',
      'Always check the query execution plan with EXPLAIN.',
    ],
    followUps: [
      {
        question: 'What are the 3 fundamental join algorithms used by database query engines?',
        answer: 'Nested Loops Join, Hash Join, and Sort-Merge Join.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts'],
    tags: ['Joins', 'Subqueries', 'Query Optimizer'],
  },
  {
    id: 'sql-44',
    categoryId: 'db-sql',
    title: 'Write a query to find all users who bought product "A" and product "B" but NOT product "C".',
    difficulty: 'INTERMEDIATE',
    answer:
      'Use GROUP BY user_id and conditionally aggregate with HAVING.',
    codeExample: `SELECT user_id
FROM UserPurchases
GROUP BY user_id
HAVING 
    SUM(CASE WHEN product = 'A' THEN 1 ELSE 0 END) > 0
    AND SUM(CASE WHEN product = 'B' THEN 1 ELSE 0 END) > 0
    AND SUM(CASE WHEN product = 'C' THEN 1 ELSE 0 END) = 0;`,
    keyPoints: [
      'Conditional aggregation inside HAVING solves complex multi-condition relational division problems cleanly.',
      'Works in all ANSI-compliant databases.',
    ],
    followUps: [
      {
        question: 'Can this be written using INTERSECT and EXCEPT?',
        answer: 'Yes: (SELECT user_id FROM Orders WHERE p="A" INTERSECT SELECT user_id FROM Orders WHERE p="B") EXCEPT SELECT user_id FROM Orders WHERE p="C".',
      },
    ],
    companies: ['Deloitte', 'InfoCepts', 'Infosys'],
    tags: ['Relational Division', 'Aggregations', 'Queries'],
  },
  {
    id: 'sql-45',
    categoryId: 'db-sql',
    title: 'What is a Clustered Key vs Primary Key?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Primary Key is a logical constraint that enforces entity integrity and uniqueness with no nulls. Clustered Key is a physical storage attribute that determines the physical order of rows on disk in a clustered index. In most databases, defining a Primary Key automatically creates a clustered index on that column by default, but they are conceptually distinct: you can designate a different column or composite columns as the clustered key.',
    keyPoints: [
      'Primary Key is logical; Clustered Index is physical.',
      'Always choose a narrow, monotonic (auto-incrementing) key as the clustered key to avoid page splits.',
    ],
    followUps: [
      {
        question: 'Why is a random UUID bad as a Clustered Key in high-write tables?',
        answer: 'Random UUIDs cause frequent page splits and memory fragmentation because inserts occur at random disk locations rather than monotonically at the end.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts'],
    tags: ['Clustered Index', 'Storage', 'Architecture'],
  },
  {
    id: 'sql-46',
    categoryId: 'db-sql',
    title: 'Explain DDL, DML, DCL, and TCL in SQL with examples.',
    difficulty: 'BEGINNER',
    answer:
      '1. DDL (Data Definition Language): Defines and modifies database schema structure (CREATE, ALTER, DROP, TRUNCATE, RENAME). 2. DML (Data Manipulation Language): Manages data records within tables (SELECT, INSERT, UPDATE, DELETE). 3. DCL (Data Control Language): Manages permissions and access rights (GRANT, REVOKE). 4. TCL (Transaction Control Language): Manages transaction states (COMMIT, ROLLBACK, SAVEPOINT).',
    keyPoints: [
      'DDL operations auto-commit in databases like MySQL and Oracle.',
      'DML operations can be rolled back inside transactions.',
    ],
    followUps: [
      {
        question: 'Is TRUNCATE DDL or DML?',
        answer: 'TRUNCATE is DDL because it operates on the table storage pages directly, deallocating extents.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro'],
    tags: ['SQL Categories', 'DDL', 'DML'],
  },
  {
    id: 'sql-47',
    categoryId: 'db-sql',
    title: 'What is SQLite and how does its architecture differ from client-server databases?',
    difficulty: 'INTERMEDIATE',
    answer:
      'SQLite is a serverless, embedded, self-contained relational database engine. Unlike client-server databases (PostgreSQL, MySQL) where the client connects over TCP/IP sockets to a daemon process, SQLite is linked directly into the host application process and reads/writes directly to ordinary disk files. It supports ACID transactions, full SQL syntax, and zero-configuration local persistence.',
    keyPoints: [
      'ALLVANCE uses SQLite locally on the device with zero cloud dependency.',
      'WAL (Write-Ahead Logging) mode allows concurrent readers while a single writer writes.',
      'Supports dynamic type affinity (data type belongs to the value, not the column).',
    ],
    followUps: [
      {
        question: 'What is SQLite WAL mode?',
        answer: 'Write-Ahead Logging. Changes are appended to a separate .wal file, allowing readers to read uninterrupted while writes occur concurrently.',
      },
    ],
    companies: ['Infosys', 'Deloitte', 'InfoCepts'],
    tags: ['SQLite', 'Architecture', 'Embedded DB'],
  },
  {
    id: 'sql-48',
    categoryId: 'db-sql',
    title: 'How do you calculate median in SQL?',
    difficulty: 'ADVANCED',
    answer:
      'To calculate the median in standard SQL, order rows with ROW_NUMBER() and find the middle element(s) where row numbers match the middle indices.',
    codeExample: `WITH RankedValues AS (
    SELECT 
        val,
        ROW_NUMBER() OVER (ORDER BY val) as r_asc,
        ROW_NUMBER() OVER (ORDER BY val DESC) as r_desc
    FROM Dataset
)
SELECT AVG(val) AS median
FROM RankedValues
WHERE ABS(r_asc - r_desc) <= 1;`,
    keyPoints: [
      'For odd row count N, r_asc equals r_desc at the median.',
      'For even row count N, the two middle rows have ABS(r_asc - r_desc) = 1, and AVG(val) averages them.',
    ],
    followUps: [
      {
        question: 'Does PostgreSQL provide a built-in median function?',
        answer: 'Yes, via PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY val).',
      },
    ],
    companies: ['Deloitte', 'InfoCepts'],
    tags: ['Median', 'Analytics', 'Advanced Queries'],
  },
  {
    id: 'sql-49',
    categoryId: 'db-sql',
    title: 'What is the difference between Temporary Tables and Table Variables?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Temporary Tables (#temp) are physical tables created in tempdb memory/disk; they support indexes, statistics, alter statements, and can be used in large data sets with cost-based optimization. Table Variables (@table) exist primarily in memory with a limited local scope, do not have distribution statistics, and are suited strictly for small row sets (<100 rows).',
    keyPoints: [
      'In SQLite, TEMP tables exist for the lifetime of the database connection.',
      'Temp tables are dropped automatically when session disconnects.',
    ],
    followUps: [
      {
        question: 'When should you use CTEs instead of temporary tables?',
        answer: 'Use CTEs for single-use query readability; use temporary tables when intermediate results need to be queried multiple times or indexed.',
      },
    ],
    companies: ['Deloitte', 'Infosys'],
    tags: ['Temp Tables', 'Performance'],
  },
  {
    id: 'sql-50',
    categoryId: 'db-sql',
    title: 'Write a query to find the second earliest hire date in each department.',
    difficulty: 'INTERMEDIATE',
    answer:
      'Use DENSE_RANK() partitioned by department_id and ordered by hire_date ascending.',
    codeExample: `WITH HireRanked AS (
    SELECT 
        dept_id,
        name,
        hire_date,
        DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY hire_date ASC) as rnk
    FROM Employee
)
SELECT dept_id, name, hire_date
FROM HireRanked
WHERE rnk = 2;`,
    keyPoints: [
      'Ordering ASC finds earliest; DENSE_RANK handles multiple employees hired on the same date.',
    ],
    followUps: [
      {
        question: 'What if a department only has 1 employee?',
        answer: 'The department will have no row with rnk = 2 and will be omitted from the output.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['Queries', 'Window Functions', 'Ranking'],
  },
];
