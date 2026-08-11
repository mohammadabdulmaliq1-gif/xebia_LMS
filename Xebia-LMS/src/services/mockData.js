// Enterprise seed data for the 5 LMS modules: Category, Course, Module, Submodule, Content

export const seedCategories = [
  {
    id: "cat-cloud",
    name: "Cloud Engineering & DevOps",
    slug: "cloud-engineering-devops",
    description: "Master modern cloud infrastructures, continuous integration, Docker, Kubernetes, and AWS deployment strategies.",
    icon: "Cloud",
    coursesCount: 3,
  },
  {
    id: "cat-frontend",
    name: "Frontend Architecture",
    slug: "frontend-architecture",
    description: "Build scalable, accessible, and performant web applications using modern technologies like Next.js, React, and CSS architectures.",
    icon: "Layout",
    coursesCount: 2,
  },
  {
    id: "cat-backend",
    name: "Backend & Systems",
    slug: "backend-systems",
    description: "Architect secure and high-throughput backend services using Spring Boot, Java, microservices, and databases.",
    icon: "Database",
    coursesCount: 2,
  },
];

export const seedCourses = [
  {
    id: "course-nextjs",
    categoryId: "cat-frontend",
    title: "Next.js Production Architecture",
    slug: "nextjs-production-architecture",
    description: "Build robust frontend web portals using App Router, Server Components, advanced state management, and optimized caching layouts.",
    level: "Advanced",
    duration: "14 hours",
    language: "English",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    banner: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&auto=format&fit=crop&q=80",
    seoTitle: "Learn Next.js 15 App Router & Core Architecture | Xebia Academy",
    seoDescription: "An enterprise-grade training guide to React Server Components, server actions, route handlers, and deployment architectures with Next.js.",
  },
  {
    id: "course-springboot",
    categoryId: "cat-backend",
    title: "Enterprise Backend Architecture with Spring Boot",
    slug: "enterprise-backend-springboot",
    description: "Design reactive REST interfaces, security filters, data persistence layers, and cloud integrations with Java and Spring.",
    level: "Intermediate",
    duration: "18 hours",
    language: "English",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    banner: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&auto=format&fit=crop&q=80",
    seoTitle: "Advanced Spring Boot Microservices Training | Xebia",
    seoDescription: "Master spring boot REST API design, JPA caching strategies, security configurations, and dockerized microservice orchestration.",
  },
  {
    id: "course-k8s",
    categoryId: "cat-cloud",
    title: "Kubernetes in Production",
    slug: "kubernetes-production",
    description: "Deploy, manage, and scale production-ready microservices workloads using Kubernetes pods, ingress controllers, services, and helm charts.",
    level: "Advanced",
    duration: "20 hours",
    language: "English",
    thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    banner: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1600&auto=format&fit=crop&q=80",
    seoTitle: "Production Kubernetes & Service Mesh Deployments | Xebia",
    seoDescription: "Complete pipeline orchestration setup using helm, deployment controllers, network security rules, and Prometheus telemetry.",
  },
];

export const seedModules = [
  { id: "mod-next-1", courseId: "course-nextjs", title: "Introduction & File-Based Routing", order: 1 },
  { id: "mod-next-2", courseId: "course-nextjs", title: "RSC (React Server Components) & Data Fetching", order: 2 },
  { id: "mod-spring-1", courseId: "course-springboot", title: "Spring Ecosystem & Dependency Injection", order: 1 },
  { id: "mod-spring-2", courseId: "course-springboot", title: "Persistence, JPA, and Database Connections", order: 2 },
  { id: "mod-k8s-1", courseId: "course-k8s", title: "Container Orchestration & Core Concepts", order: 1 },
];

export const seedSubmodules = [
  { id: "submod-next-1-1", moduleId: "mod-next-1", title: "App Router Directory Structure", slug: "app-router-directory", order: 1, duration: "25 min" },
  { id: "submod-next-1-2", moduleId: "mod-next-1", title: "Dynamic Routing & Nested Layouts", slug: "dynamic-routing-layouts", order: 2, duration: "30 min" },
  { id: "submod-next-2-1", moduleId: "mod-next-2", title: "Server vs. Client Components", slug: "server-client-components", order: 1, duration: "45 min" },
  { id: "submod-spring-1-1", moduleId: "mod-spring-1", title: "Spring Core & ApplicationContext Setup", slug: "spring-context-setup", order: 1, duration: "35 min" },
  { id: "submod-k8s-1-1", moduleId: "mod-k8s-1", title: "Pods, ReplicaSets, and Deployments", slug: "pods-replicasets-deployments", order: 1, duration: "40 min" },
];

export const seedContents = [
  // Submodule: App Router Directory Structure
  {
    id: "cont-n1-1",
    submoduleId: "submod-next-1-1",
    title: "Understanding Next.js App Router Structure",
    type: "heading",
    body: JSON.stringify({ text: "Introduction to Next.js Folders", level: 2 }),
    order: 1,
  },
  {
    id: "cont-n1-2",
    submoduleId: "submod-next-1-1",
    title: "Intro Text Block",
    type: "text",
    body: JSON.stringify({ text: "Next.js App Router uses a file-system based router where folders are used to define routes.\n\nEach folder represents a route segment that maps to a URL segment. To create a public route, you must include a `page.js` file inside the segment folder." }),
    order: 2,
  },
  {
    id: "cont-n1-3",
    submoduleId: "submod-next-1-1",
    title: "Architecture Visual Callout",
    type: "callout",
    body: JSON.stringify({
      title: "Architecture Tip",
      text: "Keep page.js files lean. Extract complex business logic and state hooks to dedicated subfolders like `/components` or hooks to maintain modularity.",
      variant: "tip"
    }),
    order: 3,
  },
  {
    id: "cont-n1-4",
    submoduleId: "submod-next-1-1",
    title: "Basic Page Boilerplate",
    type: "code",
    body: JSON.stringify({
      code: `// src/app/dashboard/page.js
export default function DashboardPage() {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-border">
      <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
      <p className="mt-2 text-foreground">Welcome to the LMS Learner dashboard!</p>
    </div>
  );
}`,
      language: "javascript"
    }),
    order: 4,
  },
  {
    id: "cont-n1-5",
    submoduleId: "submod-next-1-1",
    title: "Next.js Routing File Roles",
    type: "table",
    body: JSON.stringify({
      headers: ["File name", "Purpose", "Component Type"],
      rows: [
        ["page.js", "Unique UI of a route and makes path publicly accessible", "Server/Client"],
        ["layout.js", "Shared UI for a segment and its children. Persists state on navigation", "Server Only by default"],
        ["loading.js", "Shared Loading UI built on Suspense boundaries", "Server Component"],
        ["error.js", "Shared Error boundary UI catches client/server exceptions", "Client Component"]
      ]
    }),
    order: 5,
  },
  {
    id: "cont-n1-6",
    submoduleId: "submod-next-1-1",
    title: "Course Overview Video",
    type: "video",
    body: JSON.stringify({
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
      caption: "Introduction to routing and component trees."
    }),
    order: 6,
  },
  {
    id: "cont-n1-7",
    submoduleId: "submod-next-1-1",
    title: "Visual Component Structure",
    type: "image",
    body: JSON.stringify({
      url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=60",
      caption: "Fig 1: Dynamic nested route layouts nested inside the root App layout."
    }),
    order: 7,
  },

  // Submodule: Dynamic Routing
  {
    id: "cont-n2-1",
    submoduleId: "submod-next-1-2",
    title: "Dynamic Segments Setup",
    type: "heading",
    body: JSON.stringify({ text: "Handling Dynamic Segments", level: 2 }),
    order: 1,
  },
  {
    id: "cont-n2-2",
    submoduleId: "submod-next-1-2",
    title: "Dynamic Segment Explainer",
    type: "text",
    body: JSON.stringify({ text: "When you do not know the exact segment names ahead of time and want to create routes from dynamic data (like courses slugs), you can use Dynamic Segments. Wrap a folder's name in square brackets: `[slug]` or `[id]`." }),
    order: 2,
  },
  {
    id: "cont-n2-3",
    submoduleId: "submod-next-1-2",
    title: "Dynamic Route Code Example",
    type: "code",
    body: JSON.stringify({
      code: `// src/app/courses/[slug]/page.js
export default async function CourseDetailPage({ params }) {
  const { slug } = await params;
  return (
    <div className="p-8">
      <h1 className="text-xl font-bold">Course slug: {slug}</h1>
    </div>
  );
}`,
      language: "javascript"
    }),
    order: 3,
  },

  // Submodule: Server vs Client Components
  {
    id: "cont-n3-1",
    submoduleId: "submod-next-2-1",
    title: "Server vs Client Components",
    type: "heading",
    body: JSON.stringify({ text: "React Server Components (RSC) vs Client Components", level: 2 }),
    order: 1,
  },
  {
    id: "cont-n3-2",
    submoduleId: "submod-next-2-1",
    title: "Comp Types Detail",
    type: "text",
    body: JSON.stringify({ text: "By default, Next.js uses React Server Components. This allows components to render on the server, resulting in faster initial page loads and reduced client bundle sizes.\n\nTo opt-in to Client Components, add the `'use client'` directive at the very top of your file, before any imports." }),
    order: 2,
  },
  {
    id: "cont-n3-3",
    submoduleId: "submod-next-2-1",
    title: "RSC Warning Callout",
    type: "callout",
    body: JSON.stringify({
      title: "RSC Restriction",
      text: "You cannot import React hooks like useState, useEffect, or useContext inside Server Components. Always place stateful interactions inside Client Components.",
      variant: "warning"
    }),
    order: 3,
  },
];

export const seedLearnerCredentials = [
  {
    id: "learner-demo",
    learnerName: "Demo Learner",
    email: "learner@xebia.com",
    username: "learner",
    role: "LEARNER",
    status: "ACTIVE",
    tenantId: "xebia-enterprise",
    batchId: "default-batch",
    forcePasswordReset: true,
    createdAt: "2026-06-21T09:00:00",
  },
];

// Helper to initialize and retrieve stateful localStorage collections
export const getLocalStorageData = (key, seedData) => {
  if (typeof window === "undefined") return seedData;
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(seedData));
    return seedData;
  }
  return JSON.parse(stored);
};

export const saveLocalStorageData = (key, data) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

export const resetMockDatabase = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("lms_categories");
    localStorage.removeItem("lms_courses");
    localStorage.removeItem("lms_modules");
    localStorage.removeItem("lms_submodules");
    localStorage.removeItem("lms_contents");
    localStorage.removeItem("lms_learner_credentials");
    localStorage.removeItem("lms_role_permissions");
    localStorage.removeItem("lms_tenant_name");
    localStorage.removeItem("lms_theme_accent");
    localStorage.removeItem("lms_use_mock_api");
    localStorage.removeItem("lms_support_email");
  }
};
