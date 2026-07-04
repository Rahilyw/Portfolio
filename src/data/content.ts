export const site = {
  name: "Rahil Wijeyesekera",
  tagline: "Computer Science @ UVic · AI agents, systems & the web",
  github: "https://github.com/Rahilyw",
  linkedin: "https://linkedin.com/in/rahil-wijeyesekera",
  email: "rahilwijeyesekera@uvic.ca",
};

export type Island = {
  slug: string;
  label: string;
  blurb: string;
  /** percentage position inside the ocean band */
  x: number;
  y: number;
  variant: "palm" | "mountain" | "lighthouse" | "volcano" | "hut" | "bottle";
};

export const islands: Island[] = [
  { slug: "projects", label: "Projects", blurb: "Things I've built", x: 16, y: 30, variant: "volcano" },
  { slug: "experience", label: "Experience", blurb: "Where I've worked", x: 40, y: 14, variant: "lighthouse" },
  { slug: "skills", label: "Skills", blurb: "My toolbox", x: 66, y: 26, variant: "palm" },
  { slug: "education", label: "Education", blurb: "Where I've studied", x: 86, y: 12, variant: "mountain" },
  { slug: "achievements", label: "Achievements", blurb: "Buoys & trophies", x: 30, y: 62, variant: "hut" },
  { slug: "contact", label: "Contact", blurb: "Message in a bottle", x: 72, y: 66, variant: "bottle" },
];

export type Project = {
  name: string;
  repo: string;
  description: string;
  stack: string[];
  highlights?: string[];
};

export const featuredProjects: Project[] = [
  {
    name: "Lost-in-SF — Autonomous AI Quest Agent",
    repo: "https://github.com/Rahilyw/lost-in-sf-agent",
    description:
      "An AI agent that plays a live city quest game end-to-end using specialist sub-agents.",
    stack: ["Python", "Microsoft Agent Framework", "Azure OpenAI", "MCP", "A2A", "RAG"],
    highlights: [
      "Specialist sub-agents coordinate over agent-to-agent (A2A) protocols, grounded by RAG over Azure AI Search",
      "Cross-session memory plus logging middleware that records every model call and tool use",
    ],
  },
  {
    name: "FAQ Assistant — RAG Knowledge Bot",
    repo: "https://github.com/Rahilyw/FAQ-assistant",
    description:
      "A RAG-powered assistant that grounds every answer in retrieved FAQ context.",
    stack: ["Python", "Azure SQL", "Vector Search", "GPT-4o", "MCP"],
    highlights: [
      "Vector semantic search in Azure SQL Hyperscale feeding GPT-4o",
      "Zero out-of-scope answers in testing — responses are grounded exclusively in retrieved context",
    ],
  },
  {
    name: "Review Moderation Agent",
    repo: "https://github.com/Rahilyw/review-moderation-agent",
    description:
      "A cloud-hosted content classifier for product reviews, deployed as a managed agent.",
    stack: ["Python", "Microsoft Foundry", "Agent Framework", "OpenAI SDK"],
    highlights: [
      "Classifies reviews as SAFE / NEEDS_REVIEW / UNSAFE",
      "Routes each review to approve, block, or human review based on confidence",
    ],
  },
  {
    name: "LEGO Set Browser",
    repo: "https://github.com/Rahilyw/lego-set-browser",
    description:
      "A full-stack web app for browsing, searching, and filtering thousands of LEGO sets.",
    stack: ["Python", "Flask", "Azure Container Apps", "Cosmos DB", "Azure Functions", "Docker", "Bicep"],
    highlights: [
      "Containerized Flask app on Azure Container Apps with serverless ingest via Azure Functions",
      "Pagination, full-text search, and theme / year / part-count filtering",
    ],
  },
];

export const otherProjects: Project[] = [
  {
    name: "Quest",
    repo: "https://github.com/Rahilyw/Quest",
    description:
      "City exploration app that turns your neighbourhood into a game — real-world challenges, photo proof on location, XP, badges, and leaderboards.",
    stack: ["Expo", "React Native", "TypeScript"],
  },
  {
    name: "FlockIn",
    repo: "https://github.com/Rahilyw/FlockIn",
    description:
      "Web/mobile platform that recommends campus events, clubs, and resources to students based on interests and past activity.",
    stack: ["TypeScript"],
  },
  {
    name: "traceroute_analyzer",
    repo: "https://github.com/Rahilyw/traceroute_analyzer",
    description:
      "Zero-dependency Python CLI that parses raw .pcap traceroute captures, auto-detecting Linux (UDP) and Windows (ICMP Echo) modes and matching replies to probes.",
    stack: ["Python", "pcap", "TCP/IP"],
  },
  {
    name: "TCP-Traffic-Analyzer",
    repo: "https://github.com/Rahilyw/TCP-Traffic-Analyzer",
    description:
      "Pure-Python engine that reconstructs TCP connection state machines and extracts performance metrics from raw .cap captures — zero external dependencies.",
    stack: ["Python", "TCP", "RTT analysis"],
  },
  {
    name: "WebTester",
    repo: "https://github.com/Rahilyw/WebTester-HTTPS-Server-Analysis-Tool",
    description:
      "Low-level network diagnostic tool that analyzes web servers using raw sockets and TLS directly — no high-level HTTP libraries.",
    stack: ["Python", "Raw sockets", "TLS/SSL"],
  },
  {
    name: "PMan",
    repo: "https://github.com/Rahilyw/PMan-Custom-Process-Manager",
    description:
      "Linux process manager in C that mimics an OS shell — manages background processes through system calls.",
    stack: ["C", "Linux", "System calls"],
  },
  {
    name: "Airline Check-in Simulator",
    repo: "https://github.com/Rahilyw/Airline-Checkin-Simulator",
    description:
      "Multi-threaded task scheduler and airline check-in simulation using POSIX threads, mutexes, and condition variables.",
    stack: ["C", "POSIX threads"],
  },
  {
    name: "Simple File System Utility",
    repo: "https://github.com/Rahilyw/Simple-File-System-Utility",
    description:
      "Command-line utilities to read, list, and write files on MS-DOS FAT12 disk images — built from scratch with a focus on binary data integrity.",
    stack: ["C", "FAT12", "Manual memory management"],
  },
  {
    name: "learning-buddy",
    repo: "https://github.com/Rahilyw/learning-buddy",
    description:
      "A published Claude Code skill that acts as a personal code learning partner, using Socratic questioning and the 4Ds methodology — it never just hands you the answer.",
    stack: ["Claude Code", "AI tooling"],
  },
];

export const education = [
  {
    school: "University of Victoria",
    degree: "B.Sc. Computer Science",
    location: "Victoria, BC, Canada",
    period: "Sep 2023 – Dec 2027 (expected)",
    details:
      "Relevant coursework: Data Structures & Algorithms, Operating Systems, Computer Networks, Database Systems, Computer Architecture.",
  },
  {
    school: "National University of Singapore",
    degree: "International Exchange — Computer Science",
    location: "Singapore",
    period: "Jan – May 2025",
    details:
      "Semester abroad at one of Asia's top CS programs.",
  },
];

export const experience = [
  {
    role: "Technical Co-founder",
    company: "Serendira",
    location: "Remote (San Francisco, USA)",
    period: "Dec 2025 – Present",
    points: [
      "Lead all engineering for a talent platform connecting enterprises with remote professionals across Asia.",
      "Shipped the platform end-to-end as a developer: design, build, deployment, support.",
      "Designing an AI recommendation system matching candidates to clients on skills, culture fit, and goals.",
    ],
  },
  {
    role: "Business Design Intern",
    company: "Innovation Quotient",
    location: "Sri Lanka",
    period: "Jun 2024 – Sep 2024",
    points: [
      "Conducted market and competitor research for enterprise clients (DFCC Bank, SLT-Mobitel, UFS Auto).",
      "Turned research into data-driven growth recommendations presented to and approved by client boards.",
    ],
  },
];

export const skillGroups = [
  {
    title: "Languages",
    skills: ["Python", "TypeScript", "JavaScript", "C", "SQL"],
  },
  {
    title: "AI / ML & LLMs",
    skills: [
      "RAG",
      "Vector search",
      "Recommender systems",
      "MCP",
      "Multi-agent (A2A) systems",
      "Agent Framework",
      "Microsoft Foundry",
      "Azure OpenAI (GPT-4o)",
      "Claude API",
      "Ollama",
    ],
  },
  {
    title: "Web & Cloud",
    skills: ["React", "Flask", "Firebase", "Docker", "CI/CD", "Azure Container Apps", "Azure Functions", "Azure AI Search"],
  },
  {
    title: "Databases",
    skills: ["Azure SQL", "Cloud Firestore (NoSQL)", "Cosmos DB (NoSQL)", "Vector databases"],
  },
  {
    title: "Systems & Networking",
    skills: ["Linux", "POSIX threads", "Shell scripting", "TCP/IP", "Raw sockets", "TLS/SSL", "Git"],
  },
];

export const achievements = [
  {
    title: "UVEC Hackathon 2025 — 3rd Place",
    detail:
      "SecureUSB: a secure USB drive protection system with AES-256-GCM encryption and real-time USB detection. Role: UI & CLI developer.",
    link: "https://github.com/Popfizz013/SecureUSB",
  },
  {
    title: "Director of Sport — UVic ECSS",
    detail:
      "Engineering & Computer Science Society leadership: organizing sport events and community for engineering students.",
  },
  {
    title: "GitHub Developer Program Member",
    detail: "Member of the GitHub Developer Program, building on the GitHub platform.",
  },
];

export const githubBadges = ["Pull Shark", "YOLO", "Pair Extraordinaire"];
