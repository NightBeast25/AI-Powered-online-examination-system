USE exam_system;

-- Insert an Admin (password: admin123 hashed via bcrypt)
INSERT INTO admins (name, email, password_hash) VALUES 
('Super Admin', 'admin@example.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW');

-- Insert a Student (password: student123 hashed via bcrypt)
INSERT INTO students (name, email, password_hash) VALUES 
('Test Student', 'student@example.com', '$2b$12$e/aD.oRz9O3nU0c85B01/O6l9W8Q8x5u2rZ7e7R2Bxg7QZ7G3G6dK');

-- Create an Exam
INSERT INTO exams (title, subject, total_questions, time_limit_mins, passing_theta, created_by) VALUES
('Computer Science Fundamentals', 'Computer Science', 20, 30, 0.0, 1);

-- Insert 50 Questions (10 per topic for 5 topics: Data Structures, Algorithms, Databases, OS, Networking)

-- Topic 1: Data Structures
INSERT INTO questions (exam_id, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty_level, difficulty_b, discrimination_a, topic_tag, subtopic_tag) VALUES
(1, 'What is the time complexity of searching in a balanced BST?', 'O(1)', 'O(n)', 'O(log n)', 'O(n^2)', 'C', 'medium', 0.5, 1.2, 'Data Structures', 'Trees'),
(1, 'Which data structure uses LIFO principle?', 'Queue', 'Stack', 'Linked List', 'Array', 'B', 'easy', -1.5, 0.8, 'Data Structures', 'Stacks'),
(1, 'What is the worst-case space complexity of a standard Queue?', 'O(1)', 'O(log n)', 'O(n)', 'O(n^2)', 'C', 'easy', -1.0, 0.9, 'Data Structures', 'Queues'),
(1, 'What is a full binary tree?', 'A tree where every node has 0 or 2 children', 'A tree where all leaves are at same level', 'A tree with AVL properties', 'A complete binary tree', 'A', 'medium', 0.2, 1.0, 'Data Structures', 'Trees'),
(1, 'Which traversal gives a sorted sequence in BST?', 'Pre-order', 'In-order', 'Post-order', 'Level-order', 'B', 'easy', -0.5, 1.1, 'Data Structures', 'Trees'),
(1, 'What is an AVL tree?', 'A random binary tree', 'A completely unbalanced tree', 'A self-balancing search tree', 'A heap', 'C', 'medium', 0.4, 1.3, 'Data Structures', 'Trees'),
(1, 'Which data structure is best for implementing a priority queue?', 'Array', 'Linked List', 'Hash Table', 'Heap', 'D', 'hard', 1.0, 1.4, 'Data Structures', 'Heaps'),
(1, 'What is resolving collisions by chaining in hash tables?', 'Storing multiple items in same bucket using Linked List', 'Finding next empty bucket', 'Using double hashing', 'Resizing the array', 'A', 'medium', 0.6, 1.2, 'Data Structures', 'Hashing'),
(1, 'What is the time complexity of access in an Array?', 'O(1)', 'O(n)', 'O(log n)', 'O(n^2)', 'A', 'easy', -2.0, 1.0, 'Data Structures', 'Arrays'),
(1, 'A Graph with no cycles is called?', 'Tree', 'Bipartite', 'Dense', 'Directed', 'A', 'easy', -1.2, 1.0, 'Data Structures', 'Graphs');

-- Topic 2: Algorithms
INSERT INTO questions (exam_id, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty_level, difficulty_b, discrimination_a, topic_tag, subtopic_tag) VALUES
(1, 'What is the time complexity of Bubble Sort?', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n^2)', 'D', 'easy', -1.5, 0.9, 'Algorithms', 'Sorting'),
(1, 'Which algorithm uses divide and conquer?', 'Merge Sort', 'Insertion Sort', 'Selection Sort', 'Bubble Sort', 'A', 'medium', 0.1, 1.2, 'Algorithms', 'Sorting'),
(1, 'What is the worst-case time complexity of Quick Sort?', 'O(n log n)', 'O(n)', 'O(n^2)', 'O(1)', 'C', 'medium', 0.8, 1.3, 'Algorithms', 'Sorting'),
(1, 'Dijkstra shortest path algorithm applies to graphs with:', 'Negative edges', 'Non-negative edges', 'Unweighted edges only', 'Both A and B', 'B', 'hard', 1.5, 1.5, 'Algorithms', 'Graphs'),
(1, 'Binary search can be applied on:', 'Any array', 'Sorted arrays', 'Linked lists', 'Hash sets', 'B', 'easy', -1.8, 1.0, 'Algorithms', 'Searching'),
(1, 'Which algorithm is used to find MST?', 'Prim', 'Bellman-Ford', 'Floyd-Warshall', 'A* Search', 'A', 'medium', 0.7, 1.2, 'Algorithms', 'Graphs'),
(1, 'Knapsack problem can be solved using:', 'Greedy only', 'Dynamic Programming', 'Both A and B', 'None', 'C', 'hard', 1.2, 1.4, 'Algorithms', 'Dynamic Programming'),
(1, 'Time complexity of binary search?', 'O(1)', 'O(n)', 'O(n log n)', 'O(log n)', 'D', 'easy', -1.0, 1.1, 'Algorithms', 'Searching'),
(1, 'What is Memoization?', 'Top-down DP', 'Bottom-up DP', 'A sorting algorithm', 'Graph traversal', 'A', 'medium', 0.9, 1.3, 'Algorithms', 'Dynamic Programming'),
(1, 'Which sort is typically the fastest in practice for large arrays?', 'Merge Sort', 'Heap Sort', 'Quick Sort', 'Insertion Sort', 'C', 'medium', 0.3, 1.0, 'Algorithms', 'Sorting');

-- Topic 3: Databases
INSERT INTO questions (exam_id, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty_level, difficulty_b, discrimination_a, topic_tag, subtopic_tag) VALUES
(1, 'What does ACID stand for?', 'Atomicity, Consistency, Isolation, Durability', 'Active, Commit, Intro, Data', 'Atom, Condition, Isolate, Document', 'None', 'A', 'easy', -1.2, 1.1, 'Databases', 'Theory'),
(1, 'Which SQL command is DML?', 'CREATE', 'ALTER', 'SELECT', 'DROP', 'C', 'easy', -1.4, 1.0, 'Databases', 'SQL'),
(1, 'What is a clustered index?', 'An index where logical order matches physical order', 'A separate structure', 'A pointer index', 'None', 'A', 'hard', 1.4, 1.5, 'Databases', 'Indexing'),
(1, 'Which JOIN returns only matching rows?', 'LEFT JOIN', 'INNER JOIN', 'RIGHT JOIN', 'OUTER JOIN', 'B', 'medium', 0.2, 1.2, 'Databases', 'SQL'),
(1, 'What is 1NF?', 'No partial dependencies', 'Atomic values in columns', 'No transitive dependencies', 'Boyce-Codd', 'B', 'medium', 0.5, 1.1, 'Databases', 'Normalization'),
(1, 'What is an entity in ER model?', 'An object', 'An action', 'A link', 'A procedure', 'A', 'easy', -1.5, 0.9, 'Databases', 'ER Modeling'),
(1, 'What does GROUP BY do?', 'Groups rows with same values', 'Orders results', 'Filters rows', 'Joins tables', 'A', 'easy', -0.8, 1.0, 'Databases', 'SQL'),
(1, 'Which property ensures concurrent execution yields same result as serial execution?', 'Atomicity', 'Isolation', 'Durability', 'Serializability', 'D', 'hard', 1.6, 1.6, 'Databases', 'Transactions'),
(1, 'What is a Foreign Key?', 'A primary key in another table', 'A unique index', 'A clustered index', 'A text field', 'A', 'medium', 0.1, 1.2, 'Databases', 'Constraints'),
(1, 'What command revokes privileges?', 'GRANT', 'DROP', 'REVOKE', 'DELETE', 'C', 'easy', -1.6, 0.8, 'Databases', 'Security');

-- Topic 4: Operating Systems
INSERT INTO questions (exam_id, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty_level, difficulty_b, discrimination_a, topic_tag, subtopic_tag) VALUES
(1, 'What is a process?', 'A program in execution', 'A file', 'A script', 'A CPU cycle', 'A', 'easy', -1.7, 1.0, 'Operating Systems', 'Fundamentals'),
(1, 'What causes a deadlock?', 'Mutual Exclusion', 'Hold and Wait', 'No Preemption', 'All of the above', 'D', 'medium', 0.5, 1.2, 'Operating Systems', 'Deadlocks'),
(1, 'What is virtual memory?', 'A technique to extend RAM using Disk space', 'Fake RAM', 'Cloud storage', 'L1 Cache', 'A', 'easy', -0.5, 1.1, 'Operating Systems', 'Memory'),
(1, 'Which scheduling algorithm is preemptive?', 'FCFS', 'SJF', 'Round Robin', 'Batch', 'C', 'medium', 0.3, 1.0, 'Operating Systems', 'Scheduling'),
(1, 'What is a thread?', 'A heavy weight process', 'A lightweight process', 'A file', 'An interrupt', 'B', 'easy', -1.2, 0.9, 'Operating Systems', 'Threads'),
(1, 'What is thrashing?', 'High CPU utilization', 'Excessive paging operations', 'Disk failure', 'Network traffic', 'B', 'hard', 1.2, 1.4, 'Operating Systems', 'Memory'),
(1, 'What is a critical section?', 'Area of code accessing shared variables', 'A fast execution block', 'A boot module', 'Kernel mode', 'A', 'medium', 0.6, 1.3, 'Operating Systems', 'Synchronization'),
(1, 'Semaphore is used for:', 'Network routing', 'Synchronization', 'Disk scheduling', 'UI rendering', 'B', 'medium', 0.4, 1.1, 'Operating Systems', 'Synchronization'),
(1, 'Context switch takes place during?', 'Thread switch', 'Process switch', 'Interrupt', 'All of the above', 'D', 'hard', 1.0, 1.2, 'Operating Systems', 'CPU'),
(1, 'What is an OS kernel?', 'Core component of OS', 'A shell program', 'A compiler', 'A hardware device', 'A', 'easy', -1.8, 0.8, 'Operating Systems', 'Fundamentals');

-- Topic 5: Networking
INSERT INTO questions (exam_id, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty_level, difficulty_b, discrimination_a, topic_tag, subtopic_tag) VALUES
(1, 'Which protocol is used for secure web browsing?', 'HTTP', 'HTTPS', 'FTP', 'SMTP', 'B', 'easy', -1.9, 0.9, 'Networking', 'Protocols'),
(1, 'How many layers in OSI model?', '5', '6', '7', '4', 'C', 'easy', -2.0, 0.8, 'Networking', 'Models'),
(1, 'Which layer handles routing?', 'Transport', 'Network', 'Data Link', 'Physical', 'B', 'medium', 0.1, 1.1, 'Networking', 'Routing'),
(1, 'What is the size of an IPv4 address?', '16 bit', '32 bit', '64 bit', '128 bit', 'B', 'easy', -1.5, 1.0, 'Networking', 'IP Addressing'),
(1, 'TCP stands for:', 'Transmission Control Protocol', 'Transfer Command Protocol', 'Transmission Common Protocol', 'Transport Control Protocol', 'A', 'easy', -1.4, 0.9, 'Networking', 'Protocols'),
(1, 'What is a DNS used for?', 'Routing packets', 'Translating domain names to IP', 'Encrypting traffic', 'Switching layers', 'B', 'medium', 0.2, 1.2, 'Networking', 'DNS'),
(1, 'What protocol operates at the Transport layer?', 'IP', 'TCP', 'HTTP', 'Ethernet', 'B', 'medium', 0.3, 1.0, 'Networking', 'Models'),
(1, 'ARP stands for:', 'Address Routing Protocol', 'Address Resolution Protocol', 'Active Resolution Protocol', 'Advanced Routing Protocol', 'B', 'hard', 1.3, 1.5, 'Networking', 'Protocols'),
(1, 'Which is a private IP address?', '8.8.8.8', '192.168.1.1', '1.1.1.1', '172.217.1.14', 'B', 'medium', 0.4, 1.1, 'Networking', 'IP Addressing'),
(1, 'What device connects different networks?', 'Hub', 'Switch', 'Router', 'Repeater', 'C', 'medium', 0.0, 1.2, 'Networking', 'Hardware');
