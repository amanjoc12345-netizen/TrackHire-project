/**
 * Smart Fallback Data Generator
 * Provides role-tailored fallback structured data when AI API daily limits (429 Rate Limit Exceeded) are reached.
 */

export function getFallbackInsights(company = "Target Company", role = "Software Engineer", experience = "Intermediate") {
  const isFrontend = role.toLowerCase().includes("frontend") || role.toLowerCase().includes("react");
  const isBackend = role.toLowerCase().includes("backend") || role.toLowerCase().includes("node");
  const isAI = role.toLowerCase().includes("ai") || role.toLowerCase().includes("ml") || role.toLowerCase().includes("data");

  return {
    rounds: 4,
    difficulty: "Medium",
    culture: `${company} values engineering excellence, clear technical communication, and fast iterative delivery.`,
    stages: [
      "Initial Recruiter Screen & Resume Walkthrough",
      "Technical Coding & Fundamentals Assessment",
      "System Design & Architecture Deep Dive",
      "Behavioral & Culture Fit Interview"
    ],
    frequentlyAskedTopics: isFrontend 
      ? ["JavaScript ES6+", "React Hooks & State", "Performance & Web Vitals", "CSS & Responsive Layouts", "Frontend System Design"]
      : isBackend 
      ? ["REST & GraphQL APIs", "Database Indexing & Queries", "Caching Strategies (Redis)", "Async I/O & Microservices", "System Scaling"]
      : isAI
      ? ["Machine Learning Fundamentals", "Model Evaluation Metrics", "Python & Data Structures", "Deep Learning Architectures", "ML System Design"]
      : ["Data Structures & Algorithms", "System Design", "Database Design", "Code Review & Refactoring", "Object Oriented Design"],
    salaryExpectations: experience.toLowerCase().includes("senior") ? "$140,000 - $190,000 / year" : "$95,000 - $140,000 / year",
    preparationTips: [
      "Review core language fundamentals and common data structures.",
      "Practice explaining technical decisions aloud during problem solving.",
      "Prepare STAR-format stories for past project challenges and conflict resolution."
    ],
    recentTechnologies: isFrontend 
      ? ["React", "TypeScript", "Next.js", "Tailwind CSS", "Vite"]
      : isBackend 
      ? ["Node.js", "Express", "PostgreSQL", "Redis", "Docker"]
      : ["Python", "PyTorch", "TensorFlow", "Pandas", "Scikit-Learn"],
    expectations: `Candidates interviewing for ${role} at ${company} are expected to write clean, maintainable code, demonstrate solid problem-solving skills, and articulate design choices effectively.`,
    tips: [
      "Clarify constraints before jumping into solutions.",
      "Consider edge cases and performance trade-offs.",
      "Demonstrate enthusiasm for the company's product and engineering culture."
    ],
    experiences: [
      {
        "role": `${role}`,
        "outcome": "Offer",
        "summary": `Process consisted of 4 rounds focusing on practical coding and system design. Clear communication was key.`
      }
    ]
  };
}

export function getFallbackQuestions(company = "Target Company", role = "Software Engineer", experience = "Intermediate") {
  const isFrontend = role.toLowerCase().includes("frontend") || role.toLowerCase().includes("react");
  const isBackend = role.toLowerCase().includes("backend") || role.toLowerCase().includes("node");

  if (isFrontend) {
    return [
      {
        id: "q-1",
        difficulty: "Easy",
        question: "What is the difference between state and props in React?",
        answer: "Props are read-only data passed down from a parent component, whereas state is local data managed within the component itself.",
        explanation: "State causes re-renders when updated via setState or state updater functions. Props allow parent components to configure child components.",
        followUp: ["When should you lift state up?", "How does React React.memo prevent unnecessary re-renders?"]
      },
      {
        id: "q-2",
        difficulty: "Medium",
        question: "Explain the JavaScript Event Loop, Call Stack, and Task Queue.",
        answer: "The Call Stack executes synchronous code. Asynchronous operations are delegated to Web APIs, placing callbacks into the Microtask or Macrotask Queue.",
        explanation: "The Event Loop continuously checks if the Call Stack is empty. If empty, it pushes callbacks from the Microtask queue first (Promises), then Macrotasks (setTimeout).",
        followUp: ["Why do Promises execute before setTimeout(fn, 0)?", "How do async/await interact with the event loop?"]
      },
      {
        id: "q-3",
        difficulty: "Hard",
        question: "How would you optimize the loading performance and Core Web Vitals of a React web app?",
        answer: "Key optimizations include code splitting with React.lazy, image optimization, tree shaking, caching static assets, and minimizing main thread work.",
        explanation: "Improving LCP involves prioritizing critical assets and fonts. FID/INP is reduced by breaking up long tasks using requestAnimationFrame or web workers.",
        followUp: ["How do you analyze bundle size bottlenecks?", "What is the role of SSR and SSG in web vitals?"]
      }
    ];
  }

  if (isBackend) {
    return [
      {
        id: "q-1",
        difficulty: "Easy",
        question: "What is the difference between SQL and NoSQL databases?",
        answer: "SQL databases are relational with structured schemas (ACID compliant). NoSQL databases are non-relational, flexible, and scale horizontally.",
        explanation: "SQL (PostgreSQL, MySQL) uses predefined tables and foreign keys. NoSQL (MongoDB, Redis, Cassandra) stores key-value pairs, documents, or wide-columns.",
        followUp: ["When would you choose PostgreSQL over MongoDB?", "What is database indexing and how does it speed up queries?"]
      },
      {
        id: "q-2",
        difficulty: "Medium",
        question: "How does Redis caching improve API performance and reduce database load?",
        answer: "Redis operates in-memory with sub-millisecond latency. Storing frequently read query results in Redis prevents hitting disk-bound databases.",
        explanation: "Common caching strategies include Cache-Aside (Read-Through) and Write-Through. Expiration policies (TTL) ensure stale data is evicted.",
        followUp: ["What is a cache stampede or thundering herd problem?", "How do you handle cache invalidation?"]
      },
      {
        id: "q-3",
        difficulty: "Hard",
        question: "How would you design a distributed rate-limiting system for a high-traffic REST API?",
        answer: "Use algorithms like Token Bucket or Leaky Bucket backed by Redis atomic operations (INCR or Lua scripts) to count requests per client IP or API key.",
        explanation: "In distributed environments, rate limit counters must be stored in a centralized cache (Redis) or decentralized sliding window counters to prevent race conditions.",
        followUp: ["How do you handle sliding window log vs sliding window counter?", "What HTTP response headers should a rate limiter return?"]
      }
    ];
  }

  return [
    {
      id: "q-1",
      difficulty: "Easy",
      question: `What are key software engineering principles for building maintainable applications?`,
      answer: "SOLID principles, DRY (Don't Repeat Yourself), KISS (Keep It Simple), and writing self-documenting code with unit tests.",
      explanation: "Following modular design and clear separation of concerns ensures software scales well and minimizes bug propagation.",
      followUp: ["How do you approach code reviews?", "What is your approach to technical debt?"]
    },
    {
      id: "q-2",
      difficulty: "Medium",
      question: `Explain how you would design a scalable architecture for ${role} tasks.`,
      answer: "Break system into decoupled components, implement proper error handling, use caching, and adopt asynchronous processing for long operations.",
      explanation: "Layered architecture separates presentation, business logic, and data access, ensuring components can be tested and scaled independently.",
      followUp: ["How do you monitor application performance?", "What strategies do you use for zero-downtime deployment?"]
    }
  ];
}

export function getFallbackRoadmap(company = "Target Company", role = "Software Engineer") {
  return {
    steps: [
      {
        id: "step-1",
        name: "Role & Language Fundamentals",
        description: `Deep dive into core syntax, data structures, and foundational principles required for ${role}.`,
        estimatedTime: "2-3 days",
        resourceLink: "https://developer.mozilla.org",
        completed: false
      },
      {
        id: "step-2",
        name: "Framework & Ecosystem Mastery",
        description: "Study key frameworks, state management patterns, and standard APIs widely used in industry.",
        estimatedTime: "3-4 days",
        resourceLink: "https://react.dev",
        completed: false
      },
      {
        id: "step-3",
        name: "System Design & Architecture",
        description: "Practice designing scalable systems, API contracts, caching, and component architecture.",
        estimatedTime: "3-5 days",
        resourceLink: "https://bytebytego.com",
        completed: false
      },
      {
        id: "step-4",
        name: "Company Insights & Behavioral Prep",
        description: `Review ${company} interview rounds, company culture values, and prepare STAR format behavioral responses.`,
        estimatedTime: "2 days",
        resourceLink: "https://www.glassdoor.com",
        completed: false
      }
    ]
  };
}

export function getFallbackResources(company = "Target Company", role = "Software Engineer") {
  return {
    categories: [
      {
        category: "Official Documentation & Core Guides",
        items: [
          {
            id: "res-1",
            name: "MDN Web Docs",
            url: "https://developer.mozilla.org",
            time: "3 hours",
            type: "doc"
          },
          {
            id: "res-2",
            name: "React & Modern Web Architecture",
            url: "https://react.dev",
            time: "4 hours",
            type: "article"
          }
        ]
      },
      {
        category: "Coding & System Design Practice",
        items: [
          {
            id: "res-3",
            name: "LeetCode Interview Preparation",
            url: "https://leetcode.com",
            time: "10 hours",
            type: "course"
          },
          {
            id: "res-4",
            name: "System Design Primer",
            url: "https://github.com/donnemartin/system-design-primer",
            time: "6 hours",
            type: "doc"
          }
        ]
      }
    ]
  };
}
