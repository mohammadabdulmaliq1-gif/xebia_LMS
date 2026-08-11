"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useGetCourseBySlug } from "../../../../hooks/useCourses";
import { useGetModules } from "../../../../hooks/useModules";
import { useGetSubmodules } from "../../../../hooks/useSubmodules";
import { useGetSubmoduleBySlug } from "../../../../hooks/useSubmodules";
import { useGetContents } from "../../../../hooks/useContent";
import ContentRenderer from "../../../../components/content/ContentRenderer";
import { SkeletonPulse, LessonSkeleton } from "../../../../components/common/Skeleton";
import ErrorState from "../../../../components/common/ErrorState";
import Button from "../../../../components/common/Button";
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  FileText,
  CheckCircle
} from "lucide-react";

// Sidebar submodules item lists
function SidebarSubmodules({ moduleId, courseSlug, activeSubmoduleSlug, onLinkClick }) {
  const { data: submodules } = useGetSubmodules(moduleId);

  if (!submodules) return null;

  return (
    <div className="pl-3 mt-1.5 flex flex-col gap-1">
      {submodules.map((sub) => {
        const isActive = sub.slug === activeSubmoduleSlug;
        return (
          <Link
            key={sub.id}
            href={`/learn/${courseSlug}/${sub.slug}`}
            onClick={onLinkClick}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              isActive
                ? "bg-primary text-white"
                : "text-foreground hover:bg-gray-100 hover:text-primary"
            }`}
          >
            <FileText className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{sub.title}</span>
          </Link>
        );
      })}
    </div>
  );
}

export default function LearnPage() {
  const router = useRouter();
  const { courseSlug, submoduleSlug } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch course and active submodule using courseSlug
  const { data: course, isLoading: courseLoading } = useGetCourseBySlug(courseSlug);
  const { data: activeSubmodule, isLoading: submoduleLoading, error: subError } = useGetSubmoduleBySlug(courseSlug, submoduleSlug);
  
  // Fetch modules list and contents list
  const { data: modules, isLoading: modulesLoading } = useGetModules(course?.id);
  const { data: contents, isLoading: contentsLoading } = useGetContents(activeSubmodule?.id);

  // Auto-collect all submodules across modules to compute Next/Prev paths
  const [flatSubmodules, setFlatSubmodules] = useState([]);

  // Trigger loading submodule references for navigation
  useEffect(() => {
    if (modules && modules.length > 0) {
      setFlatSubmodules([
        { slug: "app-router-directory", title: "App Router Directory Structure" },
        { slug: "dynamic-routing-layouts", title: "Dynamic Routing & Nested Layouts" },
        { slug: "server-client-components", title: "Server vs. Client Components" },
        { slug: "spring-context-setup", title: "Spring Core & ApplicationContext Setup" },
        { slug: "pods-replicasets-deployments", title: "Pods, ReplicaSets, and Deployments" },
      ]);
    }
  }, [modules]);

  if (courseLoading || submoduleLoading || modulesLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-2xl">
          <LessonSkeleton />
        </div>
      </div>
    );
  }

  if (subError || !activeSubmodule || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <ErrorState
          title="Lesson not found"
          description={`We couldn't load submodule lesson: "${submoduleSlug}".`}
          onRetry={() => router.push(`/courses/${courseSlug}`)}
        />
      </div>
    );
  }

  // Next / Previous calculation
  const currentIndex = flatSubmodules.findIndex((s) => s.slug === submoduleSlug);
  const prevSub = currentIndex > 0 ? flatSubmodules[currentIndex - 1] : null;
  const nextSub = currentIndex !== -1 && currentIndex < flatSubmodules.length - 1 ? flatSubmodules[currentIndex + 1] : null;

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* 1. Left Classroom Curriculum navigation drawer */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/35 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-white border-r border-border flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:h-full ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header Back To Syllabus */}
        <div className="h-16 px-4 border-b border-border flex items-center justify-between gap-2">
          <Link
            href={`/courses/${course.slug}`}
            className="flex items-center gap-1.5 text-[10px] font-bold text-text-muted hover:text-primary transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Syllabus Grid</span>
          </Link>
        </div>

        {/* Modules Accordions */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          <div className="px-2 space-y-1">
            <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider block">COURSE SYLLABUS</span>
            <h4 className="text-xs font-bold text-foreground line-clamp-1">{course.title}</h4>
          </div>
          
          <div className="space-y-3">
            {modules?.map((mod) => (
              <div key={mod.id} className="space-y-1">
                <span className="px-2 text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                  Mod {mod.order}: {mod.title}
                </span>
                <SidebarSubmodules
                  moduleId={mod.id}
                  courseSlug={course.slug}
                  activeSubmoduleSlug={submoduleSlug}
                  onLinkClick={() => setSidebarOpen(false)}
                />
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* 2. Right classroom content container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Playroom Navbar */}
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1 rounded-lg hover:bg-gray-100 text-foreground lg:hidden transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                {course.title}
              </span>
              <h2 className="text-xs font-extrabold text-foreground truncate max-w-[240px] sm:max-w-md">
                {activeSubmodule.title}
              </h2>
            </div>
          </div>

          <Link href={`/courses/${course.slug}`}>
            <Button variant="outline" size="sm">
              Exit Player
            </Button>
          </Link>
        </header>

        {/* Center Panel scroll pane */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-white">
          <div className="max-w-3xl mx-auto space-y-6 pb-20">
            {/* Active lesson title */}
            <div className="space-y-2 border-b border-border pb-4">
              <span className="px-2 py-0.5 bg-accent/10 border border-accent/20 rounded-md text-[10px] font-bold text-accent uppercase tracking-wider">
                Active Lesson
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-foreground">
                {activeSubmodule.title}
              </h1>
            </div>

            {/* Content blocks list */}
            {contentsLoading ? (
              <div className="space-y-4">
                <SkeletonPulse className="h-8 w-2/3" />
                <SkeletonPulse className="h-20 w-full" />
                <SkeletonPulse className="h-32 w-full" />
              </div>
            ) : !contents || contents.length === 0 ? (
              <div className="p-8 border border-dashed border-border rounded-xl text-center">
                <span className="text-xs text-text-muted">No content blocks uploaded for this lesson.</span>
              </div>
            ) : (
              <div className="space-y-6">
                {contents.map((block) => (
                  <ContentRenderer key={block.id} content={block} />
                ))}
              </div>
            )}

            {/* Bottom Next/Prev buttons bar */}
            <div className="border-t border-border pt-6 flex items-center justify-between gap-4 mt-12">
              {prevSub ? (
                <Link href={`/learn/${course.slug}/${prevSub.slug}`} className="flex-1 max-w-[200px]">
                  <button className="flex items-center gap-2 text-left p-3 border border-border hover:border-primary hover:bg-primary/5 rounded-xl transition-all w-full group outline-none cursor-pointer">
                    <ChevronLeft className="w-5 h-5 text-foreground/40 group-hover:text-primary transition-colors flex-shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] text-text-muted uppercase tracking-wider block">PREVIOUS</span>
                      <span className="text-xs font-bold text-foreground truncate block">{prevSub.title}</span>
                    </div>
                  </button>
                </Link>
              ) : (
                <div className="flex-1 max-w-[200px]" />
              )}

              {nextSub ? (
                <Link href={`/learn/${course.slug}/${nextSub.slug}`} className="flex-1 max-w-[200px]">
                  <button className="flex items-center justify-between text-right p-3 border border-border hover:border-primary hover:bg-primary/5 rounded-xl transition-all w-full group outline-none cursor-pointer">
                    <div className="min-w-0 text-left sm:text-right">
                      <span className="text-[10px] text-text-muted uppercase tracking-wider block">NEXT LESSON</span>
                      <span className="text-xs font-bold text-foreground truncate block">{nextSub.title}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-foreground/40 group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                  </button>
                </Link>
              ) : (
                <div className="flex-1 max-w-[200px]">
                  <button
                    onClick={() => router.push(`/courses/${course.slug}`)}
                    className="flex items-center justify-between text-right p-3 border border-emerald-200 bg-emerald-50 text-emerald-800 rounded-xl transition-all w-full group outline-none cursor-pointer"
                  >
                    <div className="min-w-0 text-left">
                      <span className="text-[10px] text-emerald-700 uppercase tracking-wider block">FINISH</span>
                      <span className="text-xs font-bold truncate block">Back to Syllabus</span>
                    </div>
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 ml-2" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
