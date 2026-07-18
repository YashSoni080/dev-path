import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Domain from "../models/Domain.js";
import Topic from "../models/Topic.js";
import Resource from "../models/Resource.js";

dotenv.config();

const data = [
  {
    domain: {
      name: "DSA",
      slug: "dsa",
      description: "Data Structures & Algorithms — the core trail every placement-ready developer walks.",
      icon: "map",
      color: "#C97A3D",
    },
    topics: [
      {
        title: "Basics & Time Complexity",
        description: "Understand how to measure and reason about code efficiency before diving into structures.",
        resources: [
          {
            title: "Striver's A2Z DSA Course (YouTube Playlist)",
            url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz",
            type: "playlist",
            description: "Free, complete DSA course from basics to advanced, in a structured order.",
          },
          {
            title: "Striver's A2Z DSA Sheet",
            url: "https://takeuforward.org/dsa/strivers-a2z-sheet-learn-dsa-a-to-z",
            type: "sheet",
            description: "The companion problem sheet that maps to the video course above.",
          },
        ],
      },
      {
        title: "Arrays & Strings",
        description: "The most fundamental building blocks — master these before anything else.",
        resources: [
          {
            title: "GeeksforGeeks: Array Data Structure",
            url: "https://www.geeksforgeeks.org/array-data-structure/",
            type: "doc",
            description: "Reference documentation and practice problems on arrays.",
          },
        ],
      },
      {
        title: "Recursion & Backtracking",
        description: "Think in terms of smaller subproblems — the gateway to trees, graphs, and DP.",
        resources: [
          {
            title: "GeeksforGeeks: Recursion",
            url: "https://www.geeksforgeeks.org/recursion/",
            type: "doc",
            description: "Concepts, patterns, and practice problems for recursion and backtracking.",
          },
        ],
      },
      {
        title: "Trees & Graphs",
        description: "Non-linear structures that power everything from file systems to social networks.",
        resources: [
          {
            title: "GeeksforGeeks: Binary Tree Data Structure",
            url: "https://www.geeksforgeeks.org/binary-tree-data-structure/",
            type: "doc",
            description: "Core tree concepts, traversals, and common interview problems.",
          },
        ],
      },
      {
        title: "Dynamic Programming",
        description: "The topic most students fear — break it into patterns and it clicks.",
        resources: [
          {
            title: "GeeksforGeeks: Dynamic Programming",
            url: "https://www.geeksforgeeks.org/dynamic-programming/",
            type: "doc",
            description: "DP fundamentals with categorized problems by pattern.",
          },
        ],
      },
    ],
  },
  {
    domain: {
      name: "Web Development",
      slug: "web-development",
      description: "From your first HTML tag to a deployed full-stack app.",
      icon: "layout",
      color: "#4C7A5E",
    },
    topics: [
      {
        title: "HTML, CSS & JavaScript Basics",
        description: "The three languages every website is built on.",
        resources: [
          {
            title: "CodeWithHarry: Web Development Course (YouTube Playlist)",
            url: "https://www.youtube.com/playlist?list=PLu0W_9lII9agiCUZYRsvtGTXdxkzPyItg",
            type: "playlist",
            description: "Beginner-friendly, in-depth playlist covering HTML, CSS, JS, and beyond.",
          },
          {
            title: "MDN Web Docs",
            url: "https://developer.mozilla.org/en-US/docs/Web",
            type: "doc",
            description: "The definitive reference for HTML, CSS, and JavaScript.",
          },
        ],
      },
      {
        title: "Frontend with React",
        description: "Build interactive, component-based user interfaces.",
        resources: [
          {
            title: "React Official Docs",
            url: "https://react.dev/learn",
            type: "doc",
            description: "Official, up-to-date guide to learning React from the ground up.",
          },
        ],
      },
      {
        title: "Backend with Node & Express",
        description: "Build APIs and server-side logic with JavaScript.",
        resources: [
          {
            title: "Express.js Documentation",
            url: "https://expressjs.com/",
            type: "doc",
            description: "Official docs for the most widely used Node.js web framework.",
          },
        ],
      },
      {
        title: "Databases (MongoDB)",
        description: "Persist and query your application's data.",
        resources: [
          {
            title: "MongoDB Official Manual",
            url: "https://www.mongodb.com/docs/manual/",
            type: "doc",
            description: "Comprehensive documentation for MongoDB, from basics to aggregation.",
          },
        ],
      },
      {
        title: "Full Stack Projects & Deployment",
        description: "Tie it all together into a real, deployed application.",
        resources: [
          {
            title: "freeCodeCamp Curriculum",
            url: "https://www.freecodecamp.org/learn",
            type: "doc",
            description: "Free, project-based curriculum covering full-stack development end to end.",
          },
        ],
      },
    ],
  },
  {
    domain: {
      name: "AI & Machine Learning",
      slug: "ai-ml",
      description: "From Python foundations to training your first neural network.",
      icon: "brain",
      color: "#5B7EA8",
    },
    topics: [
      {
        title: "Python & Math Foundations",
        description: "The language and math (linear algebra, stats) ML is built on.",
        resources: [
          {
            title: "Kaggle Learn",
            url: "https://www.kaggle.com/learn",
            type: "doc",
            description: "Free, hands-on micro-courses on Python, pandas, and ML foundations.",
          },
        ],
      },
      {
        title: "Core ML Algorithms",
        description: "Regression, classification, clustering — the workhorses of ML.",
        resources: [
          {
            title: "freeCodeCamp: Machine Learning with Python",
            url: "https://www.freecodecamp.org/learn/machine-learning-with-python",
            type: "doc",
            description: "Free certification curriculum covering core ML concepts with TensorFlow.",
          },
          {
            title: "freeCodeCamp AI/ML Videos (YouTube Playlist)",
            url: "https://www.youtube.com/playlist?list=PLdvRS3dZP77LZAU2YcwoX1yNmMpNtlpkR",
            type: "playlist",
            description: "A growing collection of full-length ML and AI courses.",
          },
        ],
      },
      {
        title: "Deep Learning & Neural Networks",
        description: "Move from classical ML into neural networks and deep learning.",
        resources: [
          {
            title: "PyTorch Tutorials",
            url: "https://pytorch.org/tutorials/",
            type: "doc",
            description: "Official tutorials for one of the most widely used deep learning frameworks.",
          },
        ],
      },
      {
        title: "Practice & Projects",
        description: "Apply what you've learned on real datasets and competitions.",
        resources: [
          {
            title: "Kaggle Competitions",
            url: "https://www.kaggle.com/competitions",
            type: "doc",
            description: "Real-world datasets and competitions to build a project portfolio.",
          },
        ],
      },
    ],
  },
  {
    domain: {
      name: "Cybersecurity",
      slug: "cybersecurity",
      description: "Think like an attacker to build stronger defenses.",
      icon: "shield",
      color: "#8B5A6B",
    },
    topics: [
      {
        title: "Networking & Linux Basics",
        description: "Every security skill is built on solid networking and Linux fundamentals.",
        resources: [
          {
            title: "Linux for Ethical Hackers (freeCodeCamp article + course)",
            url: "https://www.freecodecamp.org/news/linux-essentials-for-hackers/",
            type: "article",
            description: "A practical, Pareto-principle approach to the Linux skills hackers actually use.",
          },
        ],
      },
      {
        title: "Web App Security",
        description: "The most common vulnerabilities found in real-world applications.",
        resources: [
          {
            title: "OWASP Top 10",
            url: "https://owasp.org/www-project-top-ten/",
            type: "doc",
            description: "The industry-standard reference for the most critical web app security risks.",
          },
        ],
      },
      {
        title: "Penetration Testing",
        description: "Legally and ethically test systems for weaknesses.",
        resources: [
          {
            title: "Full Ethical Hacking Course (freeCodeCamp, YouTube Playlist)",
            url: "https://www.youtube.com/playlist?list=PLSPQu-Cm6qEl_bCvGB0cYK6Ejrb0bT-R6",
            type: "playlist",
            description: "A complete, free course on network penetration testing for beginners.",
          },
        ],
      },
      {
        title: "CTF Practice & Career Path",
        description: "Practice in safe, legal environments and plan your next steps.",
        resources: [
          {
            title: "TryHackMe",
            url: "https://tryhackme.com/",
            type: "github",
            description: "Guided, hands-on cybersecurity labs and rooms for all skill levels.",
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
            topic: createdTopic._id,
            title: r.title,
            url: r.url,
            type: r.type,
            description: r.description,
            addedBy: null,
          });
        }
      }
    }

    console.log("Seed data inserted successfully.");
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seed();
