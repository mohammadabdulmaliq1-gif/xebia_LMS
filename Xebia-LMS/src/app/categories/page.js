"use client";

import React from "react";
import Link from "next/link";
import Card, { CardBody } from "../../components/common/Card";
import Button from "../../components/common/Button";
import { useGetCategories } from "../../hooks/useCategories";
import { useGetCourses } from "../../hooks/useCourses";
import { SkeletonPulse, CourseCardSkeleton } from "../../components/common/Skeleton";
import EmptyState from "../../components/common/EmptyState";
import { ArrowRight, BookOpen, Layers } from "lucide-react";

export default function CategoriesPage() {
  const { data: categories, isLoading: catsLoading } = useGetCategories();
  const { data: courses, isLoading: coursesLoading } = useGetCourses();

  const getCoursesForCategory = (catId) => {
    if (!courses) return [];
    return courses.filter((c) => c.categoryId === catId);
  };

  return (
    <>
      <div className="space-y-3">
        <h1 className="text-2xl font-black text-primary">Technical Capabilities & Academies</h1>
        <p className="text-sm text-text-muted max-w-2xl">
          Browse through Xebia's core technical learning tracks. Drill down into specific tech stacks and certification syllabuses.
        </p>
      </div>

      {catsLoading || coursesLoading ? (
        <div className="space-y-8">
          <div>
            <SkeletonPulse className="h-6 w-1/4 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CourseCardSkeleton />
              <CourseCardSkeleton />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {categories?.filter((cat) => (cat.status || "ACTIVE") === "ACTIVE").map((cat) => {
            const catCourses = getCoursesForCategory(cat.id);
            return (
              <div key={cat.id} id={cat.slug} className="scroll-mt-20 space-y-6">
                {/* Category Header Card */}
                <div className="p-6 bg-gradient-to-br from-white to-gray-50 border border-border rounded-2xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-lg text-primary">{cat.name}</span>
                      <span className="px-2 py-0.5 text-[10px] bg-primary/10 rounded-full font-bold text-primary">
                        {catCourses.length} {catCourses.length === 1 ? "Course" : "Courses"}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted max-w-3xl leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </div>

                {/* Course Grid belonging to this Category */}
                {catCourses.length === 0 ? (
                  <EmptyState
                    title="No courses registered"
                    description={`There are currently no training courses mapped to the ${cat.name} domain.`}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {catCourses.map((course) => (
                      <Card key={course.id} className="h-full flex flex-col" hoverable>
                        {/* Thumbnail Image */}
                        <div className="h-44 overflow-hidden relative border-b border-border bg-gray-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-3 left-3 px-2 py-0.5 bg-white/90 border border-border rounded-md text-[10px] font-bold text-foreground uppercase tracking-wider shadow-xs">
                            {course.level}
                          </span>
                        </div>

                        {/* Card Details */}
                        <CardBody className="p-5 flex-1 flex flex-col justify-between gap-4">
                          <div className="space-y-2">
                            <h3 className="text-base font-extrabold text-foreground leading-snug line-clamp-1">
                              {course.title}
                            </h3>
                            <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                              {course.description}
                            </p>
                          </div>

                          <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                            <span className="text-xs font-semibold text-text-muted">{course.duration}</span>
                            <Link href={`/courses/${course.slug}`}>
                              <Button variant="outline" size="sm" className="group">
                                <span>View Syllabus</span>
                                <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-0.5" />
                              </Button>
                            </Link>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
