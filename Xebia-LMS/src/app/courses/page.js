"use client";

import React, { useState } from "react";
import Link from "next/link";
import Card, { CardBody } from "../../components/common/Card";
import Button from "../../components/common/Button";
import SearchFilterBar from "../../components/common/SearchFilterBar";
import PageHeader from "../../components/common/PageHeader";
import { useGetCourses } from "../../hooks/useCourses";
import { useGetCategories } from "../../hooks/useCategories";
import { CourseCardSkeleton } from "../../components/common/Skeleton";
import EmptyState from "../../components/common/EmptyState";
import { ArrowRight } from "lucide-react";

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("All");
  const [level, setLevel] = useState("All");

  const { data: categories } = useGetCategories();
  
  // React Query queries
  const { data: courses, isLoading } = useGetCourses({
    search,
    categoryId: categoryId === "All" ? "" : categoryId,
    level: level === "All" ? "" : level,
  });

  const handleClearFilters = () => {
    setSearch("");
    setCategoryId("All");
    setLevel("All");
  };

  // Only display PUBLISHED courses to learners
  const publishedCourses = (courses || []).filter(
    (c) => (c.status || "PUBLISHED") === "PUBLISHED"
  );

  return (
    <>
      <PageHeader
        title="Academy Syllabus Catalog"
        description="Search across our library of enterprise-level courses. Refine your search by domain capabilities or experience levels."
      />

      {/* Reusable Search & Filter Bar */}
      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search courses..."
        filters={[
          {
            value: categoryId,
            onChange: setCategoryId,
            placeholder: "All Categories",
            options: (categories || []).map((cat) => ({ value: cat.id, label: cat.name }))
          },
          {
            value: level,
            onChange: setLevel,
            placeholder: "All Difficulties",
            options: [
              { value: "Beginner", label: "Beginner" },
              { value: "Intermediate", label: "Intermediate" },
              { value: "Advanced", label: "Advanced" }
            ]
          }
        ]}
        onClear={handleClearFilters}
      />

      {/* Results grid panel */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CourseCardSkeleton />
          <CourseCardSkeleton />
          <CourseCardSkeleton />
        </div>
      ) : publishedCourses.length === 0 ? (
        <EmptyState
          title="No courses match search criteria"
          description="Try broadening your search text or removing the selected category filters."
          actionText="Clear Search Filters"
          onActionClick={handleClearFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedCourses.map((course) => (
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
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wide">
                    {categories?.find((cat) => cat.id === course.categoryId)?.name || "Technology"}
                  </span>
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
    </>
  );
}
