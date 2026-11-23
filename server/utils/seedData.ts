import CourseModel from "../models/courseModel";

export const initialCourses = [
  {
    name: "Full Stack Next.js 14, TypeScript & Redux Masterclass",
    description:
      "Learn how to build scalable, full-stack production-grade applications with Next.js 14, TypeScript, Tailwind, and Node.js. Build an industrial-level Learning Management System complete with user authentication, video streaming, dynamic course creation, and administrative analytics.",
    price: 49,
    estimatedPrice: 99,
    thumbnail: {
      public_id: "course_thumb_1",
      url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
    },
    tags: "Next.js, TypeScript, React, Redux, Full Stack, Node.js",
    level: "All Levels",
    demoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    benefits: [
      { title: "Master industrial architecture from scratch to deployment" },
      { title: "Implement production-grade authentication and session management" },
      { title: "Build responsive, high-performance user interfaces with dark mode" },
      { title: "Manage state cleanly using Redux Toolkit Query" },
    ],
    prerequisites: [
      { title: "Basic understanding of JavaScript and web fundamentals" },
      { title: "A computer with Node.js and an active internet connection" },
    ],
    ratings: 4.9,
    purchased: 1240,
    reviews: [
      {
        user: {
          name: "Hamza Tariq",
          avatar: {
            url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          },
        },
        rating: 5,
        comment:
          "This platform is an absolute game-changer for Pakistani developers. The Next.js 14, Redux Toolkit Query, and resilient Redis caching architecture matched the high standards we use in enterprise software engineering every day.",
      },
    ],
    courseData: [
      {
        title: "Course Introduction & Setup",
        description: "Overview of the LMS architecture, tech stack selection, and environment setup.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        videoSection: "Module 1: Foundations",
        videoLength: 15,
        links: [{ title: "Source Code & Docs", url: "https://github.com" }],
        suggestion: "Review TypeScript fundamentals before diving into complex generic types.",
        questions: [],
      },
      {
        title: "Frontend Architecture & Layouts",
        description: "Building responsive dark mode UI with Tailwind CSS and Next.js 14 App Router.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        videoSection: "Module 1: Foundations",
        videoLength: 45,
        links: [{ title: "Tailwind Component Cheatsheet", url: "https://tailwindcss.com" }],
        suggestion: "Practice structuring reusable layout primitives.",
        questions: [],
      },
    ],
  },
  {
    name: "Complete Python & AI Agent Engineering Bootcamp",
    description:
      "Master modern AI workflows, LLM tools, LangChain, autonomous agents, and Python backend engineering. Learn how to construct resilient multi-agent swarms, integrate vector embeddings, and automate complex developer tasks.",
    price: 39,
    estimatedPrice: 79,
    thumbnail: {
      public_id: "course_thumb_2",
      url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
    },
    tags: "Python, AI Agents, LangChain, FastAPI, LLM, Docker",
    level: "Intermediate",
    demoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    benefits: [
      { title: "Build autonomous AI agents with tools and memory" },
      { title: "Deploy FastAPI microservices with Docker" },
      { title: "Implement high-throughput caching and stream responses" },
    ],
    prerequisites: [
      { title: "Basic knowledge of Python syntax" },
      { title: "Curiosity for artificial intelligence and agents" },
    ],
    ratings: 5.0,
    purchased: 890,
    reviews: [
      {
        user: {
          name: "Ayesha Malik",
          avatar: {
            url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
          },
        },
        rating: 5,
        comment:
          "The FastAPI, Docker, and MongoDB backend modules are phenomenal. Learning token session invalidation and clean architecture directly helped me land remote engineering contracts with international clients.",
      },
    ],
    courseData: [
      {
        title: "Introduction to Agentic Architectures",
        description: "Understanding LLM agent loops, planning, tool schemas, and output validation.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        videoSection: "Module 1: Agentic Core",
        videoLength: 20,
        links: [{ title: "Python Agent Frameworks", url: "https://python.org" }],
        suggestion: "Test basic prompt templates with simple function calling.",
        questions: [],
      },
    ],
  },
  {
    name: "Advanced DevOps & Cloud Infrastructure with Docker & Kubernetes",
    description:
      "Deploy and orchestrate high-availability cloud applications using modern CI/CD pipelines, Docker containers, and Kubernetes clusters. Master production deployment strategies, automated canary testing, and zero-downtime upgrades.",
    price: 59,
    estimatedPrice: 120,
    thumbnail: {
      public_id: "course_thumb_3",
      url: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80",
    },
    tags: "DevOps, Kubernetes, Docker, CI/CD, Cloud, Linux",
    level: "Advanced",
    demoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    benefits: [
      { title: "Containerize modern microservices with Docker multi-stage builds" },
      { title: "Orchestrate high-availability workloads with Kubernetes and Helm" },
      { title: "Configure production CI/CD pipelines with GitHub Actions" },
    ],
    prerequisites: [
      { title: "Basic Linux terminal commands and networking fundamentals" },
      { title: "A computer capable of running Docker Desktop" },
    ],
    ratings: 4.8,
    purchased: 650,
    reviews: [
      {
        user: {
          name: "Bilal Ahmed",
          avatar: {
            url: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
          },
        },
        rating: 5,
        comment:
          "As a CS graduate from Karachi, transitioning from academic theory to building real-world dynamic course enrollment and live video streaming was effortless here. Secured my first role right after completing the capstone!",
      },
    ],
    courseData: [
      {
        title: "Docker Containerization Fundamentals",
        description: "Writing optimized Dockerfiles, managing multi-stage layers, and reducing image footprints.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        videoSection: "Module 1: Containerization",
        videoLength: 25,
        links: [{ title: "Official Docker Documentation", url: "https://docs.docker.com" }],
        suggestion: "Use alpine or slim base images to reduce vulnerability surface.",
        questions: [],
      },
    ],
  },
  {
    name: "Industrial React Native & Mobile App Development",
    description:
      "Create cross-platform iOS and Android applications with native device animations, offline caching, push notifications, and state synchronization.",
    price: 45,
    estimatedPrice: 85,
    thumbnail: {
      public_id: "course_thumb_4",
      url: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop&q=80",
    },
    tags: "React Native, Mobile, iOS, Android, TypeScript",
    level: "All Levels",
    demoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    benefits: [
      { title: "Develop native mobile apps for both iOS and Android" },
      { title: "Implement offline-first data caching and sync" },
      { title: "Publish apps to Google Play Store and Apple App Store" },
    ],
    prerequisites: [
      { title: "Basic knowledge of React and JavaScript" },
    ],
    ratings: 4.7,
    purchased: 430,
    reviews: [
      {
        user: {
          name: "Zainab Sheikh",
          avatar: {
            url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          },
        },
        rating: 5,
        comment:
          "Outstanding practical mobile curriculum with offline caching, push notifications, and native navigation. Enabled our team to ship our production mobile client in record time.",
      },
    ],
    courseData: [
      {
        title: "React Native Setup & Native Navigation",
        description: "Configuring Expo and bare React Native workflow with stack and tab navigators.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        videoSection: "Module 1: Mobile Architecture",
        videoLength: 30,
        links: [{ title: "React Navigation Guide", url: "https://reactnavigation.org" }],
        suggestion: "Test layout rendering on both iOS Simulator and Android Emulator early.",
        questions: [],
      },
    ],
  },
];

export const seedInitialCoursesIfEmpty = async () => {
  const count = await CourseModel.countDocuments();
  if (count === 0) {
    console.log("[seed] Seeding initial industrial courses and reviews into MongoDB...");
    await CourseModel.insertMany(initialCourses);
    console.log(`[seed] Successfully seeded ${initialCourses.length} courses with dynamic reviews into database!`);
  }
};
