import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Domain from "../models/Domain.js";
import Topic from "../models/Topic.js";
import Resource from "../models/Resource.js";

dotenv.config();
if (!process.env.MONGO_URI) {
  dotenv.config({ path: new URL("../.env", import.meta.url).pathname });
}

const data = [
  {
    domain: {
      name: "DSA",
      slug: "dsa",
      description:
        "Data Structures & Algorithms — master interview patterns, problem-solving, and efficient system design.",
      icon: "code",
      color: "#C97A3D",
    },
    masterResources: [
      {
        title: "Striver's A2Z DSA Course (YouTube Playlist)",
        url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz",
        type: "playlist",
        description:
          "The premier full-length DSA curriculum covering everything from basics to advanced graphs and DP in systematic order.",
      },
      {
        title: "Striver's A2Z DSA Sheet",
        url: "https://takeuforward.org/dsa/strivers-a2z-sheet-learn-dsa-a-to-z",
        type: "sheet",
        description:
          "The companion 450+ question roadmap sheet with step-by-step problem links and editorial solutions.",
      },
      {
        title: "NeetCode 150 & Blind 75 Sheet",
        url: "https://neetcode.io/practice",
        type: "sheet",
        description:
          "Curated list of 150 most common LeetCode patterns for technical interview preparation.",
      },
    ],
    topics: [
      {
        title: "Time & Space Complexity (Asymptotic Analysis)",
        description:
          "Learn how to measure code performance using Big-O, Omega, and Theta notations before writing complex algorithms.",
        resources: [
          {
            title: "Abdul Bari: Algorithms Analysis & Big-O, Omega, Theta Notations",
            url: "https://www.youtube.com/watch?v=9TlHvipP5yA",
            type: "video",
            description: "The gold-standard visual explanation of asymptotic complexity and master theorem.",
          },
          {
            title: "Big-O Cheat Sheet: Time & Space Complexity Guide",
            url: "https://www.bigocheatsheet.com/",
            type: "sheet",
            description: "Visual quick-reference charts comparing Big-O runtimes across all major data structures and algorithms.",
          },
          {
            title: "GeeksforGeeks: Analysis of Algorithms & Asymptotic Notations",
            url: "https://www.geeksforgeeks.org/analysis-of-algorithms-set-1-asymptotic-analysis/",
            type: "doc",
            description: "Detailed documentation with mathematical proofs and examples of best, worst, and average cases.",
          },
        ],
      },
      {
        title: "Arrays, Strings & Two Pointers",
        description:
          "The foundational building blocks of interview problems — two pointers, sliding window, and prefix sums.",
        resources: [
          {
            title: "NeetCode: Arrays & Hashing Core Patterns Explained",
            url: "https://www.youtube.com/watch?v=KLlXCFG5TnA",
            type: "video",
            description: "In-depth walkthrough of array hashing, two pointers, and common interview patterns.",
          },
          {
            title: "GeeksforGeeks: Array Data Structure & Practice Problems",
            url: "https://www.geeksforgeeks.org/array-data-structure/",
            type: "doc",
            description: "Reference documentation covering 1D/2D arrays, matrix operations, and rotation algorithms.",
          },
          {
            title: "LeetCode Top 150: Array & String Interview Questions",
            url: "https://leetcode.com/problem-list/top-interview-questions/",
            type: "sheet",
            description: "Official curated practice set covering Kadane's algorithm, Dutch National Flag, and subarray sums.",
          },
        ],
      },
      {
        title: "Linked Lists (Singly, Doubly & Fast/Slow Pointers)",
        description:
          "Pointer manipulation, memory nodes, cycle detection with Floyd's algorithm, and list reversals.",
        resources: [
          {
            title: "Striver's Linked List Complete Series",
            url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0p4ozDR_kJJkONnb1wdx2Ma",
            type: "playlist",
            description: "Complete targeted video series from basic node structures to hard problems like LRU Cache and flattening.",
          },
          {
            title: "GeeksforGeeks: Linked List Implementation & Core Operations",
            url: "https://www.geeksforgeeks.org/data-structures/linked-list/",
            type: "doc",
            description: "Insertion, deletion, traversal, and memory representations in C++, Java, and Python.",
          },
        ],
      },
      {
        title: "Stacks & Queues (Monotonic Patterns)",
        description:
          "LIFO and FIFO mechanics, implementing queues via stacks, and the powerful monotonic stack pattern.",
        resources: [
          {
            title: "Striver: Monotonic Stack and Queue Problem Patterns",
            url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0pOd5zvVVSzgPoLzvQ797-0",
            type: "playlist",
            description: "Dedicated series tackling Next Greater Element, Trapping Rainwater, and Largest Rectangle in Histogram.",
          },
          {
            title: "GeeksforGeeks: Stack & Queue Data Structures",
            url: "https://www.geeksforgeeks.org/stack-data-structure/",
            type: "doc",
            description: "Core definitions, array and linked list implementations, and postfix expression evaluation.",
          },
        ],
      },
      {
        title: "Recursion & Backtracking",
        description:
          "Decompose problems into subproblems, construct recursion trees, and master backtracking with subsets and permutations.",
        resources: [
          {
            title: "Aditya Verma: Recursion Master Playlist",
            url: "https://www.youtube.com/playlist?list=PL_z_8CaSLPWeT1ffjiImo0sYTcnLzo-wY",
            type: "playlist",
            description: "Top-rated conceptual series on the Base Condition-Hypothesis-Induction approach to recursion.",
          },
          {
            title: "Striver: Recursion and Backtracking Series",
            url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0rGlzIn_7rsaR2FQ5e6ZOL9",
            type: "playlist",
            description: "N-Queens, Sudoku Solver, Rat in a Maze, and word search backtracking implementations.",
          },
          {
            title: "GeeksforGeeks: Recursion Fundamentals and Standard Problems",
            url: "https://www.geeksforgeeks.org/recursion/",
            type: "doc",
            description: "Comprehensive guide with stack traces and call frames.",
          },
        ],
      },
      {
        title: "Trees & Binary Search Trees (BST)",
        description:
          "Hierarchical structures, BFS/DFS tree traversals, height calculation, LCA, and BST validation.",
        resources: [
          {
            title: "Striver: Binary Tree & BST Series (Traversals, Views, Construction)",
            url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0q8Hkd7bK2Bpryj2xVJk8Vk",
            type: "playlist",
            description: "Over 40 structured lessons covering tree diameter, boundary traversals, and serialization.",
          },
          {
            title: "GeeksforGeeks: Binary Tree Data Structure Reference",
            url: "https://www.geeksforgeeks.org/binary-tree-data-structure/",
            type: "doc",
            description: "Code implementations for Inorder, Preorder, Postorder, and Level Order traversals.",
          },
        ],
      },
      {
        title: "Graphs (BFS, DFS, Shortest Path, Disjoint Set)",
        description:
          "Adjacency lists, cycle detection, topological sorting, Dijkstra, Bellman-Ford, and Union-Find.",
        resources: [
          {
            title: "Striver: Complete Graph Series",
            url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oE3gA41TKO2H5bHpPd7fzn",
            type: "playlist",
            description: "Step-by-step master class on graph traversals, Kahn's algorithm, bipartite matching, and MSTs.",
          },
          {
            title: "William Fiset: Graph Theory Algorithms & Visualizations",
            url: "https://www.youtube.com/playlist?list=PLDV1Zeh2NRsDGO4--qE8yH72HFL1Km93P",
            type: "playlist",
            description: "Beautiful visual intuition for network flow, bridge detection, and Tarjan's SCC algorithm.",
          },
          {
            title: "GeeksforGeeks: Graph Data Structure and Algorithms",
            url: "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/",
            type: "doc",
            description: "Reference code in C++, Java, and Python for standard graph algorithms.",
          },
        ],
      },
      {
        title: "Dynamic Programming (Knapsack, LCS, LIS, Grids)",
        description:
          "Overlapping subproblems, optimal substructure, memoization, tabulation, and space optimization.",
        resources: [
          {
            title: "Aditya Verma: Dynamic Programming Master Series",
            url: "https://www.youtube.com/playlist?list=PL_z_8CaSLPWekqh37zOR0L2CLG228RRTx",
            type: "playlist",
            description: "Parent problem identification (0/1 Knapsack, Unbounded Knapsack, LCS, MCM) made simple.",
          },
          {
            title: "Striver: DP Series (Memoization to Space Optimization)",
            url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0qUlt5H_kiKYaNSqJ81PMMY",
            type: "playlist",
            description: "Rigorous 1D and 2D DP problems: House Robber, Edit Distance, Matrix Chain Multiplication.",
          },
          {
            title: "GeeksforGeeks: Dynamic Programming Patterns & Top 50 Problems",
            url: "https://www.geeksforgeeks.org/dynamic-programming/",
            type: "doc",
            description: "Categorized DP cheat sheet with optimal subproblems and state transition equations.",
          },
        ],
      },
    ],
  },
  {
    domain: {
      name: "Web Development",
      slug: "web-development",
      description:
        "From semantic HTML and responsive modern CSS to full-stack JavaScript architectures with Node, React, and MongoDB.",
      icon: "layout",
      color: "#4C7A5E",
    },
    masterResources: [
      {
        title: "The Odin Project: Full Stack JavaScript Curriculum",
        url: "https://www.theodinproject.com/paths/full-stack-javascript",
        type: "doc",
        description:
          "Free, open-source full-stack curriculum designed to take you from total beginner to job-ready developer through building real projects.",
      },
      {
        title: "CodeWithHarry: Sigma Web Development Complete Course (YouTube Playlist)",
        url: "https://www.youtube.com/playlist?list=PLu0W_9lII9agiCUZYRsvtGTXdxkzPyItg",
        type: "playlist",
        description:
          "Comprehensive 130-video master series covering modern web dev from HTML/CSS to Node, Express, MongoDB, and React.",
      },
      {
        title: "Full Stack Open (University of Helsinki)",
        url: "https://fullstackopen.com/en/",
        type: "doc",
        description:
          "Deep dive into modern web development with React, Redux, Node.js, Express, MongoDB, and GraphQL.",
      },
      {
        title: "freeCodeCamp: Responsive Web Design & Full Stack Certification",
        url: "https://www.freecodecamp.org/learn",
        type: "doc",
        description:
          "Interactive, project-driven certifications in responsive design, frontend libraries, and backend APIs.",
      },
    ],
    topics: [
      {
        title: "HTML5, Modern CSS & Responsive Layouts",
        description:
          "Master semantic HTML elements, CSS Box Model, Flexbox, Grid, and mobile-first responsive design.",
        resources: [
          {
            title: "SuperSimpleDev: HTML & CSS Full Course for Beginners",
            url: "https://www.youtube.com/watch?v=G3e-cpL7ofc",
            type: "video",
            description: "Hands-on, highly visual 6-hour course covering practical HTML/CSS and YouTube clone design.",
          },
          {
            title: "MDN Web Docs: Learn HTML and CSS",
            url: "https://developer.mozilla.org/en-US/docs/Learn/HTML",
            type: "doc",
            description: "The official web standard documentation on semantics, accessibility, and modern responsive rules.",
          },
          {
            title: "Flexbox Froggy & Grid Garden: Interactive CSS Practice",
            url: "https://flexboxfroggy.com/",
            type: "article",
            description: "Gamified interactive exercises to solidify CSS Flexbox and Grid mental models.",
          },
        ],
      },
      {
        title: "Modern JavaScript (ES6+, DOM & Async Programming)",
        description:
          "Closures, scopes, promises, async/await, event bubbling, array methods, and browser DOM manipulation.",
        resources: [
          {
            title: "JavaScript.info: The Modern JavaScript Tutorial",
            url: "https://javascript.info/",
            type: "doc",
            description: "From the basics to advanced topics like prototypes, event loop, and generators.",
          },
          {
            title: "Namaste JavaScript by Akshay Saini",
            url: "https://www.youtube.com/playlist?list=PLlasXeu85E9cQ32gLCvAvr9vNaUccPVNP",
            type: "playlist",
            description: "Deep dive into JS execution context, call stack, hoisting, closures, and microtask queues.",
          },
          {
            title: "Chai aur Code: JavaScript in Depth (Hindi)",
            url: "https://www.youtube.com/playlist?list=PLu71SKxNbfoBuX3f4EOACle2y-tRC5Q37",
            type: "playlist",
            description: "Pragmatic, beginner-friendly complete JavaScript series covering real DOM projects.",
          },
        ],
      },
      {
        title: "Frontend UI with React & Tailwind CSS",
        description:
          "Component architecture, JSX, props, state hooks, useEffect, React Router, and utility-first Tailwind CSS.",
        resources: [
          {
            title: "React.dev: Official Interactive Tutorial & Guide",
            url: "https://react.dev/learn",
            type: "doc",
            description: "The modern React documentation focusing on function components, hooks, and clean state modeling.",
          },
          {
            title: "Dave Gray: React 18 Full Course (Components, Hooks, Router)",
            url: "https://www.youtube.com/playlist?list=PL0Zuz27SZ-6PrE9srvEn8nbhOOyxnWXfp",
            type: "playlist",
            description: "Comprehensive step-by-step React series with real mini-projects.",
          },
          {
            title: "Tailwind CSS: Official Documentation & Component Styling",
            url: "https://tailwindcss.com/docs",
            type: "doc",
            description: "Official guide to utility classes, responsive variants, and theme configuration.",
          },
        ],
      },
      {
        title: "Backend Architecture with Node.js & Express",
        description:
          "Build scalable RESTful APIs, handle HTTP request/response lifecycles, and write Express middleware.",
        resources: [
          {
            title: "John Smilga: Node.js and Express.js Full Course",
            url: "https://www.youtube.com/watch?v=Oe421EPjeBE",
            type: "video",
            description: "10-hour in-depth walkthrough building REST APIs, middleware, and backend controllers.",
          },
          {
            title: "Express.js Official Guide: Routing & Middleware",
            url: "https://expressjs.com/en/guide/routing.html",
            type: "doc",
            description: "Official guide to Express routing, parameter handling, and error-handling middleware.",
          },
        ],
      },
      {
        title: "Databases with MongoDB & Mongoose",
        description:
          "Document database schema design, CRUD operations, indexing, aggregation pipelines, and Mongoose ODM models.",
        resources: [
          {
            title: "MongoDB University: Free MongoDB Basics & Aggregation",
            url: "https://learn.mongodb.com/",
            type: "doc",
            description: "Official free interactive learning paths from the creators of MongoDB.",
          },
          {
            title: "Web Dev Simplified: Mongoose Crash Course & Schema Modeling",
            url: "https://www.youtube.com/watch?v=DZBGEExL2KU",
            type: "video",
            description: "Learn schema validation, population, middleware hooks, and custom methods in Mongoose.",
          },
        ],
      },
      {
        title: "Authentication, Security & Production Deployment",
        description:
          "JWT tokens in httpOnly cookies, password hashing with bcrypt, CORS whitelisting, and deploying on Vercel/Render.",
        resources: [
          {
            title: "Web Dev Simplified: JWT Authentication & httpOnly Cookies",
            url: "https://www.youtube.com/watch?v=mbsmsi7l3r4",
            type: "video",
            description: "Secure session management using jsonwebtoken and cookies to prevent XSS attacks.",
          },
          {
            title: "OWASP Web Security Cheat Sheets",
            url: "https://cheatsheetseries.owasp.org/",
            type: "doc",
            description: "Checklist for rate limiting, input sanitization, and security headers.",
          },
          {
            title: "Vercel & Render: Deploying Full-Stack Applications",
            url: "https://render.com/docs",
            type: "doc",
            description: "Step-by-step documentation for deploying frontend SPAs and Node backend servers.",
          },
        ],
      },
    ],
  },
  {
    domain: {
      name: "AI & Machine Learning",
      slug: "ai-ml",
      description:
        "From Python and linear algebra foundations to classical machine learning, PyTorch deep learning, and transformer LLMs.",
      icon: "brain",
      color: "#5B7EA8",
    },
    masterResources: [
      {
        title: "Andrew Ng: Machine Learning Specialization (DeepLearning.AI)",
        url: "https://www.youtube.com/playlist?list=PLkDaE6sCZn6FNC6YRfRQc_FbeQrF8BwGI",
        type: "playlist",
        description:
          "The most renowned entry point into machine learning, teaching core algorithms, gradient descent, and mathematical intuition.",
      },
      {
        title: "Fast.ai: Practical Deep Learning for Coders",
        url: "https://course.fast.ai/",
        type: "doc",
        description:
          "Top-down practical deep learning course designed for coders to build state-of-the-art models immediately.",
      },
      {
        title: "Harvard CS50's Introduction to Artificial Intelligence with Python",
        url: "https://www.youtube.com/playlist?list=PLhQjrBD2T382Nz7z1AEXmiocLBlrys51W",
        type: "playlist",
        description:
          "Comprehensive university curriculum on search algorithms, probability, optimization, neural networks, and reinforcement learning.",
      },
    ],
    topics: [
      {
        title: "Python, NumPy, Pandas & Math Foundations",
        description:
          "Vectorized computation, matrix operations, data frames, derivatives, gradient descent, and probability.",
        resources: [
          {
            title: "3Blue1Brown: Essence of Linear Algebra",
            url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab",
            type: "playlist",
            description: "Geometric intuition for vectors, matrices, dot products, eigenvalues, and transformations.",
          },
          {
            title: "Kaggle Learn: Python & Pandas Foundations",
            url: "https://www.kaggle.com/learn/python",
            type: "doc",
            description: "Interactive browser-based micro-courses to master NumPy indexing, Pandas filtering, and data cleaning.",
          },
          {
            title: "StatQuest: Statistics & Probability Fundamentals",
            url: "https://www.youtube.com/playlist?list=PLblh5JKOoLUK0FLuzwntyYI10UQFUhsY9",
            type: "playlist",
            description: "Visual breakdown of distributions, p-values, confidence intervals, and hypothesis testing.",
          },
        ],
      },
      {
        title: "Classical Machine Learning (Supervised & Unsupervised)",
        description:
          "Linear regression, logistic regression, decision trees, random forests, SVMs, and K-Means clustering.",
        resources: [
          {
            title: "StatQuest with Josh Starmer: Machine Learning Fundamentals",
            url: "https://www.youtube.com/playlist?list=PLblh5JKOoLUICTaGLRoHQDuF_7q2GfuJF",
            type: "playlist",
            description: "Clear visual intuition for regression, classification, bias-variance tradeoff, and ROC curves.",
          },
          {
            title: "Scikit-Learn: Official User Guide & Algorithms",
            url: "https://scikit-learn.org/stable/user_guide.html",
            type: "doc",
            description: "The definitive reference manual for model training, cross-validation, and hyperparameter tuning.",
          },
        ],
      },
      {
        title: "Deep Learning & Neural Networks with PyTorch",
        description:
          "Feedforward neural networks, backpropagation, activation functions, loss functions, optimizers (Adam), and PyTorch tensors.",
        resources: [
          {
            title: "Daniel Bourke: PyTorch for Deep Learning Bootcamp",
            url: "https://www.youtube.com/playlist?list=PL5-TkQAfAZFbzxjBHtzdVCWE0Zbhomg7r",
            type: "playlist",
            description: "25-hour complete hands-on PyTorch course building computer vision and NLP models from scratch.",
          },
          {
            title: "PyTorch.org: Official 60-Minute Deep Learning Blitz",
            url: "https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html",
            type: "doc",
            description: "Official interactive tutorial introducing Autograd, CUDA acceleration, and PyTorch nn modules.",
          },
        ],
      },
      {
        title: "Natural Language Processing (NLP) & Transformers",
        description:
          "Tokenization, word embeddings, attention mechanisms, self-attention, GPT architectures, and fine-tuning with Hugging Face.",
        resources: [
          {
            title: "Andrej Karpathy: Neural Networks - Zero to Hero",
            url: "https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ",
            type: "playlist",
            description: "Build micrograd, makemore, and a complete GPT from the ground up in Python.",
          },
          {
            title: "Hugging Face NLP Course: Transformers from Scratch",
            url: "https://huggingface.co/learn/nlp-course/chapter1/1",
            type: "doc",
            description: "Industry standard guide to using Transformers library, pipelines, datasets, and tokenizers.",
          },
        ],
      },
      {
        title: "Computer Vision Foundations (OpenCV & CNNs)",
        description:
          "Image filtering, convolution operations, pooling layers, ResNet architectures, and transfer learning.",
        resources: [
          {
            title: "freeCodeCamp: OpenCV & Computer Vision Course in Python",
            url: "https://www.youtube.com/watch?v=oXlwWbU8l2o",
            type: "video",
            description: "Learn image processing, contours, edge detection, and face recognition with OpenCV.",
          },
          {
            title: "PyTorch Vision: Image Classification & Object Detection",
            url: "https://pytorch.org/tutorials/intermediate/torchvision_tutorial.html",
            type: "doc",
            description: "Fine-tuning pre-trained TorchVision models for classification and bounding box detection.",
          },
        ],
      },
      {
        title: "Real-World Projects & Kaggle Competitions",
        description:
          "End-to-end ML pipelines, feature engineering, model evaluation, and competitive data science.",
        resources: [
          {
            title: "Kaggle Competitions: Getting Started with Titanic & House Prices",
            url: "https://www.kaggle.com/competitions",
            type: "doc",
            description: "Benchmark beginner competitions with community notebooks and public leaderboards.",
          },
          {
            title: "Papers with Code: State of the Art Machine Learning Models",
            url: "https://paperswithcode.com/",
            type: "doc",
            description: "Browse research papers alongside verified GitHub code implementations and benchmarks.",
          },
        ],
      },
    ],
  },
  {
    domain: {
      name: "Cybersecurity",
      slug: "cybersecurity",
      description:
        "Understand network defenses, ethical hacking methodologies, web application vulnerabilities, and defensive security.",
      icon: "shield",
      color: "#8B5A6B",
    },
    masterResources: [
      {
        title: "NetworkChuck: Complete Ethical Hacking & Networking Trail",
        url: "https://www.youtube.com/playlist?list=PLIhvC56v63IJVXv0GJkw9vO5WCS8944wy",
        type: "playlist",
        description:
          "Hands-on, accessible master playlist teaching practical networking, Linux, and penetration testing methodologies.",
      },
      {
        title: "TryHackMe: Complete Pre-Security & Junior Penetration Tester Paths",
        url: "https://tryhackme.com/path/outline/pre-security",
        type: "doc",
        description:
          "The gold-standard guided hands-on cybersecurity training platform with browser-based interactive labs.",
      },
      {
        title: "OverTheWire: Bandit (Hands-on Linux & Security Lab)",
        url: "https://overthewire.org/wargames/bandit/",
        type: "doc",
        description:
          "The legendary gamified wargame that teaches command-line skills and security concepts step by step.",
      },
    ],
    topics: [
      {
        title: "Computer Networking & Linux Fundamentals",
        description:
          "TCP/IP, OSI model, subnetting, DNS, ports/protocols, bash scripting, file permissions, and Linux administration.",
        resources: [
          {
            title: "Professor Messer: CompTIA Network+ Training Course",
            url: "https://www.youtube.com/playlist?list=PLG49S3nxzAnlCJiCrOYuRYb6cne864a7G",
            type: "playlist",
            description: "Comprehensive foundational video course covering routing, switching, IP addressing, and firewalls.",
          },
          {
            title: "Linux Journey: Interactive Linux Administration Fundamentals",
            url: "https://linuxjourney.com/",
            type: "doc",
            description: "Free interactive lessons covering file systems, processes, permissions, and network commands.",
          },
        ],
      },
      {
        title: "Web Application Security & OWASP Top 10",
        description:
          "SQL injection, Cross-Site Scripting (XSS), CSRF, broken authentication, IDOR, and SSRF vulnerabilities.",
        resources: [
          {
            title: "PortSwigger Web Security Academy (Free Interactive Labs)",
            url: "https://portswigger.net/web-security",
            type: "doc",
            description: "The industry standard free training platform created by the developers of Burp Suite.",
          },
          {
            title: "OWASP Top 10: Vulnerabilities & Mitigations Guide",
            url: "https://owasp.org/www-project-top-ten/",
            type: "doc",
            description: "Official guide to the ten most critical security risks facing modern web applications.",
          },
        ],
      },
      {
        title: "Network Reconnaissance & Traffic Analysis (Nmap & Wireshark)",
        description:
          "Port scanning, service enumeration, network sniffing, packet analysis, and identifying open attack vectors.",
        resources: [
          {
            title: "David Bombal & Hak5: Nmap Network Scanning Mastery",
            url: "https://www.youtube.com/playlist?list=PLhfrWIlLOoKM9c2p_7PZ_238S0_0w4d5b",
            type: "playlist",
            description: "Master SYN scans, NSE scripts, OS detection, and firewall evasion techniques with Nmap.",
          },
          {
            title: "freeCodeCamp: Wireshark Packet Analysis Full Course",
            url: "https://www.youtube.com/watch?v=lb1Dw0elw0Q",
            type: "video",
            description: "Deep dive into analyzing PCAP files, TCP handshakes, and spotting malicious traffic.",
          },
        ],
      },
      {
        title: "Penetration Testing & Exploitation Methodologies",
        description:
          "Reconnaissance, vulnerability scanning, exploitation, privilege escalation, and vulnerability reporting.",
        resources: [
          {
            title: "TCM Security: Practical Ethical Hacking Foundations",
            url: "https://www.youtube.com/watch?v=3Kq1MIfTWCE",
            type: "video",
            description: "High-yield introduction to ethical hacking methodology and practical attack surfaces.",
          },
          {
            title: "Hack The Box: Starting Point Guided Penetration Labs",
            url: "https://www.hackthebox.com/hacker/starting-point",
            type: "doc",
            description: "Tiered guided vulnerable machines teaching real-world exploitation in a legal sandbox.",
          },
        ],
      },
      {
        title: "Capture The Flag (CTF) Challenges & Defense",
        description:
          "Binary exploitation, reverse engineering, digital forensics, cryptography, and defensive Blue Team skills.",
        resources: [
          {
            title: "picoCTF: Free Hands-on Cybersecurity Challenges",
            url: "https://picoctf.org/",
            type: "doc",
            description: "Beginner-friendly gamified CTF created by Carnegie Mellon University cybersecurity experts.",
          },
          {
            title: "CyberDefenders: Blue Team & Security Operations Practice",
            url: "https://cyberdefenders.org/",
            type: "doc",
            description: "Defensive cybersecurity challenges covering incident response, threat hunting, and SIEM analysis.",
          },
        ],
      },
    ],
  },
];

const seed = async () => {
  await connectDB();
  try {
    console.log("Clearing existing data...");
    await Resource.deleteMany();
    await Topic.deleteMany();
    await Domain.deleteMany();

    for (const entry of data) {
      const createdDomain = await Domain.create(entry.domain);
      console.log(`Created domain: ${createdDomain.name}`);

      // 1. Insert Master Curricula / A-Z Courses
      if (entry.masterResources && entry.masterResources.length > 0) {
        for (const mr of entry.masterResources) {
          await Resource.create({
            domain: createdDomain._id,
            topic: null,
            isMasterCourse: true,
            title: mr.title,
            url: mr.url,
            type: mr.type,
            description: mr.description,
            addedBy: null,
          });
        }
        console.log(`  Added ${entry.masterResources.length} Master Courses`);
      }

      // 2. Insert Ordered Step-by-Step Waypoint Topics
      for (let i = 0; i < entry.topics.length; i++) {
        const t = entry.topics[i];
        const createdTopic = await Topic.create({
          domain: createdDomain._id,
          title: t.title,
          description: t.description,
          order: i + 1,
        });

        for (const r of t.resources) {
          await Resource.create({
            domain: createdDomain._id,
            topic: createdTopic._id,
            isMasterCourse: false,
            title: r.title,
            url: r.url,
            type: r.type,
            description: r.description,
            addedBy: null,
          });
        }
      }
      console.log(`  Added ${entry.topics.length} Waypoints with specific resources`);
    }

    console.log("\nDatabase seeded successfully with Master Curricula & accurate Waypoints!");
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seed();
