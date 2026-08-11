"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Card, { CardBody } from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import Accordion from "../../../components/common/Accordion";
import { useGetCourseBySlug } from "../../../hooks/useCourses";
import { useGetModules } from "../../../hooks/useModules";
import { useGetSubmodules } from "../../../hooks/useSubmodules";
import { SkeletonPulse, LessonSkeleton } from "../../../components/common/Skeleton";
import ErrorState from "../../../components/common/ErrorState";
import { BookOpen, Clock, Globe, ArrowLeft, Play, FileText, CheckCircle2 } from "lucide-react";

// Sub-component to fetch and render submodules for a specific module
function ModuleSubmoduleList({ moduleId, courseSlug }) {
  const { data: submodules, isLoading } = useGetSubmodules(moduleId);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <SkeletonPulse className="h-6 w-full" />
        <SkeletonPulse className="h-6 w-full" />
      </div>
    );
  }

  if (!submodules || submodules.length === 0) {
    return <span className="text-xs text-text-muted">No submodule lessons created for this section.</span>;
  }

  return (
    <div className="flex flex-col gap-2.5">
      {submodules.map((sub) => (
        <Link
          key={sub.id}
          href={`/learn/${courseSlug}/${sub.slug}`}
          className="flex items-center justify-between p-3 rounded-lg border border-border bg-white hover:border-primary hover:bg-primary/5 transition-all group"
        >
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="p-1.5 bg-gray-100 rounded text-foreground/50 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
              {sub.title}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[10px] text-text-muted font-semibold">{sub.duration}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function CourseDetailPage() {
  const router = useRouter();
  const { slug } = useParams();

  const { data: course, isLoading: courseLoading, error: courseError } = useGetCourseBySlug(slug);
  const { data: modules, isLoading: modulesLoading } = useGetModules(course?.id);

  // Dynamically resolve the first module and its submodules to determine the start lesson
  const sortedModules = modules ? [...modules].sort((a, b) => a.order - b.order) : [];
  const firstModuleId = sortedModules.length > 0 ? sortedModules[0].id : null;
  const { data: firstSubmodules } = useGetSubmodules(firstModuleId);

  if (courseLoading) {
    return (
      <>
        <div className="space-y-6">
          <SkeletonPulse className="h-10 w-1/4" />
          <SkeletonPulse className="h-64 w-full" />
          <LessonSkeleton />
        </div>
      </>
    );
  }

  if (courseError || !course) {
    return (
      <>
        <div className="py-12">
          <ErrorState
            title="Course not found"
            description={`We couldn't locate a course matching the slug: "${slug}".`}
            onRetry={() => router.push("/courses")}
          />
        </div>
      </>
    );
  }

  // Determine the first lesson slug dynamically with a safe fallback
  const sortedSubmodules = firstSubmodules ? [...firstSubmodules].sort((a, b) => a.order - b.order) : [];
  const firstLessonSlug = sortedSubmodules.length > 0 ? sortedSubmodules[0].slug : "app-router-directory"; 

  return (
    <>
      {/* Back to Catalog route */}
      <Link
        href="/courses"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-primary transition-colors uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to catalog</span>
      </Link>

      {/* Hero Banner Grid Card */}
      <div className="relative rounded-2xl overflow-hidden border border-border shadow-sm bg-gradient-to-br from-primary-dark via-primary to-secondary text-white p-6 md:p-8">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial from-accent/20 to-transparent blur-3xl" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Metadata content */}
          <div className="lg:col-span-2 space-y-4">
            <span className="px-2.5 py-1 bg-white/10 border border-white/20 rounded-md text-[10px] font-bold uppercase tracking-wider">
              {course.level} Track
            </span>
            <h1 className="text-2xl md:text-4xl font-black leading-tight tracking-tight">
              {course.title}
            </h1>
            <p className="text-xs md:text-sm text-white/80 max-w-2xl leading-relaxed">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold pt-2">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{course.duration}</span>
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                <span>{course.language}</span>
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{modules?.length || 0} Modules</span>
              </span>
            </div>
          </div>

          {/* Action CTA Box */}
          <div className="flex justify-center lg:justify-end">
            <Card className="w-full max-w-xs border border-white/10 bg-white/10 backdrop-blur-md rounded-2xl text-white">
              <CardBody className="p-6 space-y-4">
                <div className="aspect-video rounded-xl overflow-hidden relative bg-black/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Link href={`/learn/${course.slug}/${firstLessonSlug}`} className="block">
                  <Button variant="cta" className="w-full justify-center shadow-lg shadow-cta/20">
                    <Play className="w-4 h-4 mr-2 fill-current" />
                    <span>Start Learning</span>
                  </Button>
                </Link>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      {/* Curriculum Outline Accordions */}
      <div className="space-y-6 max-w-4xl">
        <div className="space-y-1">
          <h2 className="text-lg font-extrabold text-primary">Course Syllabus Matrix</h2>
          <p className="text-xs text-text-muted">
            Expand the accordion items to browse through submodule lessons and estimated time frames.
          </p>
        </div>

        {modulesLoading ? (
          <div className="space-y-4">
            <SkeletonPulse className="h-12 w-full" />
            <SkeletonPulse className="h-12 w-full" />
          </div>
        ) : !modules || modules.length === 0 ? (
          <EmptyState
            title="Curriculum empty"
            description="The author hasn't added any learning modules to this syllabus yet."
          />
        ) : (
          <div className="space-y-4">
            {modules.map((mod) => (
              <Accordion
                key={mod.id}
                title={`Module ${mod.order}: ${mod.title}`}
                subtitle="Expand to view submodule lessons"
                defaultOpen={mod.order === 1}
              >
                <ModuleSubmoduleList moduleId={mod.id} courseSlug={course.slug} />
              </Accordion>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
