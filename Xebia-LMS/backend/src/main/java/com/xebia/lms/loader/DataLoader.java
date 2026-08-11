package com.xebia.lms.loader;

import com.xebia.lms.model.*;
import com.xebia.lms.model.Module;
import com.xebia.lms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private ModuleRepository moduleRepository;

    @Autowired
    private SubmoduleRepository submoduleRepository;

    @Autowired
    private ContentRepository contentRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        if (categoryRepository.count() == 0) {
            seedDatabase();
        }
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            System.out.println("Seeding default IAM users...");

            User admin = User.builder()
                    .id("u-admin")
                    .learnerName("Enterprise Admin")
                    .email("admin@xebia.com")
                    .username("admin")
                    .password("admin123")
                    .role("admin")
                    .status("ACTIVE")
                    .tenantId("xebia-enterprise")
                    .batchId("default-batch")
                    .forcePasswordReset(false)
                    .createdAt("2026-06-21T09:00:00")
                    .build();

            User learner = User.builder()
                    .id("learner-demo")
                    .learnerName("Demo Learner")
                    .email("learner@xebia.com")
                    .username("learner")
                    .password("learner123")
                    .role("learner")
                    .status("ACTIVE")
                    .tenantId("xebia-enterprise")
                    .batchId("default-batch")
                    .forcePasswordReset(true)
                    .createdAt("2026-06-21T09:00:00")
                    .build();

            userRepository.saveAll(Arrays.asList(admin, learner));
        }
    }

    private void seedDatabase() {
        System.out.println("Seeding initial data into LMS database...");

        // 1. Seed Categories
        Category catCloud = Category.builder()
                .id("cat-cloud")
                .name("Cloud Engineering & DevOps")
                .slug("cloud-engineering-devops")
                .description("Master modern cloud infrastructures, continuous integration, Docker, Kubernetes, and AWS deployment strategies.")
                .icon("Cloud")
                .coursesCount(1)
                .build();

        Category catFrontend = Category.builder()
                .id("cat-frontend")
                .name("Frontend Architecture")
                .slug("frontend-architecture")
                .description("Build scalable, accessible, and performant web applications using modern technologies like Next.js, React, and CSS architectures.")
                .icon("Layout")
                .coursesCount(1)
                .build();

        Category catBackend = Category.builder()
                .id("cat-backend")
                .name("Backend & Systems")
                .slug("backend-systems")
                .description("Architect secure and high-throughput backend services using Spring Boot, Java, microservices, and databases.")
                .icon("Database")
                .coursesCount(1)
                .build();

        categoryRepository.saveAll(Arrays.asList(catCloud, catFrontend, catBackend));

        // 2. Seed Courses
        Course courseNext = Course.builder()
                .id("course-nextjs")
                .categoryId("cat-frontend")
                .title("Next.js Production Architecture")
                .slug("nextjs-production-architecture")
                .description("Build robust frontend web portals using App Router, Server Components, advanced state management, and optimized caching layouts.")
                .level("Advanced")
                .duration("14 hours")
                .language("English")
                .thumbnail("https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3")
                .banner("https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&auto=format&fit=crop&q=80")
                .seoTitle("Learn Next.js 15 App Router & Core Architecture | Xebia Academy")
                .seoDescription("An enterprise-grade training guide to React Server Components, server actions, route handlers, and deployment architectures with Next.js.")
                .build();

        Course courseSpring = Course.builder()
                .id("course-springboot")
                .categoryId("cat-backend")
                .title("Enterprise Backend Architecture with Spring Boot")
                .slug("enterprise-backend-springboot")
                .description("Design reactive REST interfaces, security filters, data persistence layers, and cloud integrations with Java and Spring.")
                .level("Intermediate")
                .duration("18 hours")
                .language("English")
                .thumbnail("https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3")
                .banner("https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&auto=format&fit=crop&q=80")
                .seoTitle("Advanced Spring Boot Microservices Training | Xebia")
                .seoDescription("Master spring boot REST API design, JPA caching strategies, security configurations, and dockerized microservice orchestration.")
                .build();

        Course courseK8s = Course.builder()
                .id("course-k8s")
                .categoryId("cat-cloud")
                .title("Kubernetes in Production")
                .slug("kubernetes-production")
                .description("Deploy, manage, and scale production-ready microservices workloads using Kubernetes pods, ingress controllers, services, and helm charts.")
                .level("Advanced")
                .duration("20 hours")
                .language("English")
                .thumbnail("https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3")
                .banner("https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1600&auto=format&fit=crop&q=80")
                .seoTitle("Production Kubernetes & Service Mesh Deployments | Xebia")
                .seoDescription("Complete pipeline orchestration setup using helm, deployment controllers, network security rules, and Prometheus telemetry.")
                .build();

        courseRepository.saveAll(Arrays.asList(courseNext, courseSpring, courseK8s));

        // 3. Seed Modules
        Module modNext1 = Module.builder().id("mod-next-1").courseId("course-nextjs").title("Introduction & File-Based Routing").order(1).build();
        Module modNext2 = Module.builder().id("mod-next-2").courseId("course-nextjs").title("RSC (React Server Components) & Data Fetching").order(2).build();
        Module modSpring1 = Module.builder().id("mod-spring-1").courseId("course-springboot").title("Spring Ecosystem & Dependency Injection").order(1).build();
        Module modSpring2 = Module.builder().id("mod-spring-2").courseId("course-springboot").title("Persistence, JPA, and Database Connections").order(2).build();
        Module modK8s1 = Module.builder().id("mod-k8s-1").courseId("course-k8s").title("Container Orchestration & Core Concepts").order(1).build();

        moduleRepository.saveAll(Arrays.asList(modNext1, modNext2, modSpring1, modSpring2, modK8s1));

        // 4. Seed Submodules
        Submodule subNext11 = Submodule.builder().id("submod-next-1-1").moduleId("mod-next-1").title("App Router Directory Structure").slug("app-router-directory").order(1).duration("25 min").build();
        Submodule subNext12 = Submodule.builder().id("submod-next-1-2").moduleId("mod-next-1").title("Dynamic Routing & Nested Layouts").slug("dynamic-routing-layouts").order(2).duration("30 min").build();
        Submodule subNext21 = Submodule.builder().id("submod-next-2-1").moduleId("mod-next-2").title("Server vs. Client Components").slug("server-client-components").order(1).duration("45 min").build();
        Submodule subSpring11 = Submodule.builder().id("submod-spring-1-1").moduleId("mod-spring-1").title("Spring Core & ApplicationContext Setup").slug("spring-context-setup").order(1).duration("35 min").build();
        Submodule subK8s11 = Submodule.builder().id("submod-k8s-1-1").moduleId("mod-k8s-1").title("Pods, ReplicaSets, and Deployments").slug("pods-replicasets-deployments").order(1).duration("40 min").build();

        submoduleRepository.saveAll(Arrays.asList(subNext11, subNext12, subNext21, subSpring11, subK8s11));

        // 5. Seed Content Blocks for App Router Directory Structure (submod-next-1-1)
        Content contN11 = Content.builder()
                .id("cont-n1-1")
                .submoduleId("submod-next-1-1")
                .title("Understanding Next.js App Router Structure")
                .type("heading")
                .body("{\"text\":\"Introduction to Next.js Folders\",\"level\":2}")
                .order(1)
                .build();

        Content contN12 = Content.builder()
                .id("cont-n1-2")
                .submoduleId("submod-next-1-1")
                .title("Intro Text Block")
                .type("text")
                .body("{\"text\":\"Next.js App Router uses a file-system based router where folders are used to define routes.\\n\\nEach folder represents a route segment that maps to a URL segment. To create a public route, you must include a `page.js` file inside the segment folder.\"}")
                .order(2)
                .build();

        Content contN13 = Content.builder()
                .id("cont-n1-3")
                .submoduleId("submod-next-1-1")
                .title("Architecture Visual Callout")
                .type("callout")
                .body("{\"title\":\"Architecture Tip\",\"text\":\"Keep page.js files lean. Extract complex business logic and state hooks to dedicated subfolders like `/components` or hooks to maintain modularity.\",\"variant\":\"tip\"}")
                .order(3)
                .build();

        Content contN14 = Content.builder()
                .id("cont-n1-4")
                .submoduleId("submod-next-1-1")
                .title("Basic Page Boilerplate")
                .type("code")
                .body("{\"code\":\"// src/app/dashboard/page.js\\nexport default function DashboardPage() {\\n  return (\\n    <div className=\\\"p-6 bg-white rounded-lg shadow-sm border border-border\\\">\\n      <h1 className=\\\"text-2xl font-bold text-primary\\\">Dashboard</h1>\\n      <p className=\\\"mt-2 text-foreground\\\">Welcome to the LMS Learner dashboard!</p>\\n    </div>\\n  );\\n}\",\"language\":\"javascript\"}")
                .order(4)
                .build();

        Content contN15 = Content.builder()
                .id("cont-n1-5")
                .submoduleId("submod-next-1-1")
                .title("Next.js Routing File Roles")
                .type("table")
                .body("{\"headers\":[\"File name\",\"Purpose\",\"Component Type\"],\"rows\":[[\"page.js\",\"Unique UI of a route and makes path publicly accessible\",\"Server/Client\"],[\"layout.js\",\"Shared UI for a segment and its children. Persists state on navigation\",\"Server Only by default\"],[\"loading.js\",\"Shared Loading UI built on Suspense boundaries\",\"Server Component\"],[\"error.js\",\"Shared Error boundary UI catches client/server exceptions\",\"Client Component\"]]}")
                .order(5)
                .build();

        Content contN16 = Content.builder()
                .id("cont-n1-6")
                .submoduleId("submod-next-1-1")
                .title("Course Overview Video")
                .type("video")
                .body("{\"url\":\"https://www.w3schools.com/html/mov_bbb.mp4\",\"caption\":\"Introduction to routing and component trees.\"}")
                .order(6)
                .build();

        Content contN17 = Content.builder()
                .id("cont-n1-7")
                .submoduleId("submod-next-1-1")
                .title("Visual Component Structure")
                .type("image")
                .body("{\"url\":\"https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=60\",\"caption\":\"Fig 1: Dynamic nested route layouts nested inside the root App layout.\"}")
                .order(7)
                .build();

        // Seed Content Blocks for Dynamic Routing (submod-next-1-2)
        Content contN21 = Content.builder()
                .id("cont-n2-1")
                .submoduleId("submod-next-1-2")
                .title("Dynamic Segments Setup")
                .type("heading")
                .body("{\"text\":\"Handling Dynamic Segments\",\"level\":2}")
                .order(1)
                .build();

        Content contN22 = Content.builder()
                .id("cont-n2-2")
                .submoduleId("submod-next-1-2")
                .title("Dynamic Segment Explainer")
                .type("text")
                .body("{\"text\":\"When you do not know the exact segment names ahead of time and want to create routes from dynamic data (like courses slugs), you can use Dynamic Segments. Wrap a folder's name in square brackets: `[slug]` or `[id]`.\"}")
                .order(2)
                .build();

        Content contN23 = Content.builder()
                .id("cont-n2-3")
                .submoduleId("submod-next-1-2")
                .title("Dynamic Route Code Example")
                .type("code")
                .body("{\"code\":\"// src/app/courses/[slug]/page.js\\nexport default async function CourseDetailPage({ params }) {\\n  const { slug } = await params;\\n  return (\\n    <div className=\\\"p-8\\\">\\n      <h1 className=\\\"text-xl font-bold\\\">Course slug: {slug}</h1>\\n    </div>\\n  );\\n}\",\"language\":\"javascript\"}")
                .order(3)
                .build();

        // Seed Content Blocks for Server vs Client Components (submod-next-2-1)
        Content contN31 = Content.builder()
                .id("cont-n3-1")
                .submoduleId("submod-next-2-1")
                .title("Server vs Client Components")
                .type("heading")
                .body("{\"text\":\"React Server Components (RSC) vs Client Components\",\"level\":2}")
                .order(1)
                .build();

        Content contN32 = Content.builder()
                .id("cont-n3-2")
                .submoduleId("submod-next-2-1")
                .title("Comp Types Detail")
                .type("text")
                .body("{\"text\":\"By default, Next.js uses React Server Components. This allows components to render on the server, resulting in faster initial page loads and reduced client bundle sizes.\\n\\nTo opt-in to Client Components, add the `'use client'` directive at the very top of your file, before any imports.\"}")
                .order(2)
                .build();

        Content contN33 = Content.builder()
                .id("cont-n3-3")
                .submoduleId("submod-next-2-1")
                .title("RSC Warning Callout")
                .type("callout")
                .body("{\"title\":\"RSC Restriction\",\"text\":\"You cannot import React hooks like useState, useEffect, or useContext inside Server Components. Always place stateful interactions inside Client Components.\",\"variant\":\"warning\"}")
                .order(3)
                .build();

        contentRepository.saveAll(Arrays.asList(
                contN11, contN12, contN13, contN14, contN15, contN16, contN17,
                contN21, contN22, contN23,
                contN31, contN32, contN33
        ));

        System.out.println("LMS database seeding completed successfully!");
    }
}
