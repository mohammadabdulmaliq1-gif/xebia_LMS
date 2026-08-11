
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import Modal, { ConfirmModal } from "../../../components/common/Modal";
import { TableSkeleton } from "../../../components/common/Skeleton";
import ErrorState from "../../../components/common/ErrorState";
import useToast from "../../../hooks/useToast";
import PageHeader from "../../../components/common/PageHeader";
import SearchFilterBar from "../../../components/common/SearchFilterBar";
import DataTable from "../../../components/common/DataTable";
import StatusBadge from "../../../components/common/StatusBadge";
import FileUpload from "../../../components/common/FileUpload";
import { useGetCategories } from "../../../hooks/useCategories";
import {
  useGetCourses,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
} from "../../../hooks/useCourses";
import { Plus, Edit2, Trash2, ShieldAlert } from "lucide-react";

export default function AdminCoursesPage() {
  const toast = useToast();

  const { data: categories } = useGetCategories();
  const { data: courses, isLoading, isError, refetch } = useGetCourses();
  const createMutation = useCreateCourse();
  const updateMutation = useUpdateCourse();
  const deleteMutation = useDeleteCourse();

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals visibility states
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Form fields
  const [editingCourse, setEditingCourse] = useState(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [duration, setDuration] = useState("");
  const [language, setLanguage] = useState("English");
  const [thumbnail, setThumbnail] = useState("");
  const [banner, setBanner] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoScore, setSeoScore] = useState(70);
  const [status, setStatus] = useState("PUBLISHED");
  const [featured, setFeatured] = useState("false");
  const [pdfUrl, setPdfUrl] = useState("");
  
  const [deletingId, setDeletingId] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const handleOpenCreate = () => {
    setEditingCourse(null);
    setTitle("");
    setSlug("");
    setDescription("");
    setCategoryId(categories?.[0]?.id || "");
    setLevel("Beginner");
    setDuration("");
    setLanguage("English");
    setThumbnail("https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60");
    setBanner("https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&auto=format&fit=crop&q=80");
    setSeoTitle("");
    setSeoDescription("");
    setSeoScore(75);
    setStatus("PUBLISHED");
    setFeatured("false");
    setPdfUrl("");
    setFormErrors({});
    setModalOpen(true);
  };

  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setTitle(course.title);
    setSlug(course.slug);
    setDescription(course.description);
    setCategoryId(course.categoryId);
    setLevel(course.level);
    setDuration(course.duration);
    setLanguage(course.language);
    setThumbnail(course.thumbnail);
    setBanner(course.banner || "");
    setSeoTitle(course.seoTitle || "");
    setSeoDescription(course.seoDescription || "");
    setSeoScore(course.seoScore || 80);
    setStatus(course.status || "PUBLISHED");
    setFeatured(String(course.featured || "false"));
    setPdfUrl(course.pdfUrl || "");
    setFormErrors({});
    setModalOpen(true);
  };

  const handleOpenDelete = (id) => {
    setDeletingId(id);
    setDeleteOpen(true);
  };

  const validateForm = () => {
    const err = {};
    if (!title.trim()) err.title = "Course Title is required";
    if (!description.trim()) err.description = "Description is required";
    if (!categoryId) err.categoryId = "Category selection is required";
    if (!duration.trim()) err.duration = "Duration (e.g. 15 hours) is required";
    if (!thumbnail.trim()) err.thumbnail = "Thumbnail URL is required";
    setFormErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      title: title.trim(),
      slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: description.trim(),
      categoryId,
      level,
      duration: duration.trim(),
      language,
      thumbnail: thumbnail.trim(),
      banner: banner.trim(),
      seoTitle: seoTitle.trim() || title.trim(),
      seoDescription: seoDescription.trim() || description.substring(0, 150),
      seoScore: Number(seoScore) || 75,
      status,
      featured: featured === "true",
      // Seed default telemetry
      views: editingCourse?.views || Math.floor(Math.random() * 500) + 100,
      clicks: editingCourse?.clicks || Math.floor(Math.random() * 100) + 20,
      ctr: editingCourse?.ctr || `${(Math.random() * 5 + 1).toFixed(1)}%`,
      pdfUrl
    };

    if (editingCourse) {
      updateMutation.mutate(
        { id: editingCourse.id, data: payload },
        {
          onSuccess: () => {
            toast.addToast("Course details updated successfully!", "success");
            setModalOpen(false);
          },
          onError: (err) => {
            toast.addToast(`Update failed: ${err.message}`, "error");
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.addToast("New course path published!", "success");
          setModalOpen(false);
        },
        onError: (err) => {
          toast.addToast(`Creation failed: ${err.message}`, "error");
        },
      });
    }
  };

  const handleDeleteConfirm = async () => {
    deleteMutation.mutate(deletingId, {
      onSuccess: () => {
        toast.addToast("Course path deleted successfully!", "success");
        setDeleteOpen(false);
      },
      onError: (err) => {
        toast.addToast(`Deletion failed: ${err.message}`, "error");
      },
    });
  };

  // Filter lists
  const filteredCourses = (courses || []).filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || course.categoryId === categoryFilter;
    const matchesLevel = levelFilter === "All" || course.level === levelFilter;
    const matchesStatus = statusFilter === "All" || (course.status || "PUBLISHED") === statusFilter;
    return matchesSearch && matchesCategory && matchesLevel && matchesStatus;
  });

  const columns = [
    {
      header: "Course details",
      key: "title",
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.thumbnail}
            alt={row.title}
            className="w-12 h-8 rounded object-cover bg-gray-100 flex-shrink-0"
          />
          <div className="min-w-0">
            <span className="font-bold text-foreground block truncate max-w-xs">{row.title}</span>
            <span className="text-[10px] text-text-muted font-bold block capitalize">
              {categories?.find((cat) => cat.id === row.categoryId)?.name || "Technical"} &middot; {row.level}
            </span>
          </div>
        </div>
      )
    },
    {
      header: "Duration / Lang",
      key: "duration",
      render: (row) => (
        <div>
          <span className="font-bold text-foreground block">{row.duration}</span>
          <span className="text-[10px] text-text-muted font-semibold block">{row.language}</span>
        </div>
      )
    },
    {
      header: "SEO Score",
      key: "seoScore",
      render: (row) => {
        const score = row.seoScore || 80;
        return (
          <div className="flex items-center gap-2">
            <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${score >= 80 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-rose-500"}`}
                style={{ width: `${score}%` }}
              />
            </div>
            <span className={`text-[10px] font-bold ${score >= 80 ? "text-emerald-600" : "text-amber-600"}`}>{score}%</span>
          </div>
        );
      }
    },
    {
      header: "Views / Clicks / CTR",
      key: "views",
      render: (row) => (
        <span className="font-semibold text-foreground/80 block text-[10px]">
          <strong>{row.views || 0}</strong> views &middot; <strong>{row.clicks || 0}</strong> clicks &middot; <strong>{row.ctr || "0%"}</strong> CTR
        </span>
      )
    },
    {
      header: "Status",
      key: "status",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <StatusBadge status={row.status || "PUBLISHED"} />
          {row.featured && (
            <span className="px-1.5 py-0.5 bg-purple-50 border border-purple-200 text-purple-700 font-black rounded-md text-[8px] tracking-wide uppercase">
              Featured
            </span>
          )}
        </div>
      )
    },
    {
      header: "Actions",
      key: "actions",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => handleOpenEdit(row)}>
            <Edit2 className="w-3.5 h-3.5 text-foreground/75" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleOpenDelete(row.id)}>
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Courses"
        description="Build curriculum structures, assign levels, and configure metadata templates."
        breadcrumbs={[
          { label: "Admin Console", href: "/admin" },
          { label: "Courses", href: "/admin/courses" }
        ]}
        actions={
          <Button variant="primary" size="md" className="flex items-center gap-1.5 shadow-sm" onClick={handleOpenCreate}>
            <Plus className="w-4.5 h-4.5" />
            <span>New Course</span>
          </Button>
        }
      />

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search courses..."
        filters={[
          {
            value: categoryFilter,
            onChange: setCategoryFilter,
            placeholder: "All Categories",
            options: (categories || []).map((cat) => ({ value: cat.id, label: cat.name }))
          },
          {
            value: levelFilter,
            onChange: setLevelFilter,
            placeholder: "All Levels",
            options: [
              { value: "Beginner", label: "Beginner" },
              { value: "Intermediate", label: "Intermediate" },
              { value: "Advanced", label: "Advanced" }
            ]
          },
          {
            value: statusFilter,
            onChange: setStatusFilter,
            placeholder: "All Statuses",
            options: [
              { value: "PUBLISHED", label: "Published" },
              { value: "DRAFT", label: "Draft" },
              { value: "PENDING_APPROVAL", label: "Pending" }
            ]
          }
        ]}
        onClear={() => {
          setSearch("");
          setCategoryFilter("All");
          setLevelFilter("All");
          setStatusFilter("All");
        }}
      />

      {isLoading ? (
        <TableSkeleton rows={4} cols={6} />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <DataTable
          columns={columns}
          data={filteredCourses}
          emptyTitle="No courses registered"
          emptyDescription="Click 'New Course' to create your first educational curriculum pathway."
        />
      )}

      {/* 1. Modal Form - Create / Edit Course */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCourse ? "Edit Course Parameters" : "Publish New Course Pathway"}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Course Title"
              placeholder="e.g. Next.js Production Architecture"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={formErrors.title}
            />

            <Input
              label="Custom URL Slug (Optional)"
              placeholder="e.g. nextjs-production-architecture"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Capability Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 border border-border bg-white rounded-xl text-sm focus:outline-none focus:border-primary/50 cursor-pointer"
              >
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Syllabus Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2 border border-border bg-white rounded-xl text-sm focus:outline-none focus:border-primary/50 cursor-pointer"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <Input
              label="Duration Frame"
              placeholder="e.g. 14 hours"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              error={formErrors.duration}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Language"
              placeholder="e.g. English"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            />

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Publishing Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-border bg-white rounded-xl text-sm focus:outline-none focus:border-primary/50 cursor-pointer"
              >
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft / Unlisted</option>
                <option value="PENDING_APPROVAL">Pending Review</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Highlight Option</label>
              <select
                value={featured}
                onChange={(e) => setFeatured(e.target.value)}
                className="w-full px-3 py-2 border border-border bg-white rounded-xl text-sm focus:outline-none focus:border-primary/50 cursor-pointer"
              >
                <option value="false">Standard Course</option>
                <option value="true">Featured Ribbon</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FileUpload
              label="Cover Thumbnail (Required)"
              accept="image/*"
              onUploadSuccess={(url) => {
                setThumbnail(url);
                setFormErrors(prev => ({ ...prev, thumbnail: null }));
              }}
              onUploadError={(err) => toast.addToast(err, "error")}
            />

            <FileUpload
              label="Banner Cover URL (Optional)"
              accept="image/*"
              onUploadSuccess={(url) => setBanner(url)}
              onUploadError={(err) => toast.addToast(err, "error")}
            />
            
            <FileUpload
              label="Course Syllabus (PDF)"
              accept=".pdf"
              onUploadSuccess={(url) => setPdfUrl(url)}
              onUploadError={(err) => toast.addToast(err, "error")}
            />
          </div>

          {/* SEO parameters collapsible headers */}
          <div className="p-4 border border-border bg-gray-50/20 rounded-xl space-y-3">
            <span className="text-[10px] font-black text-primary uppercase tracking-wider block">
              Search Engine Optimization (SEO Metadata)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Meta Title Tag"
                  placeholder="Optimal header length (50-60 characters)"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">SEO Index Score</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={seoScore}
                  onChange={(e) => setSeoScore(e.target.value)}
                  className="w-full px-3 py-2 border border-border bg-white rounded-xl text-sm focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>
            <Input
              label="Meta Description Tag"
              placeholder="Write a snippet summarize course outlines (150-160 characters)..."
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              textarea
              rows={2}
            />
          </div>

          <Input
            label="Course Syllabus Outline Description"
            placeholder="Introduce the subject matter and learning tracks..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={formErrors.description}
            textarea
            rows={4}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={createMutation.isPending || updateMutation.isPending}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={createMutation.isPending || updateMutation.isPending}>
              Save Course
            </Button>
          </div>
        </form>
      </Modal>

      {/* 2. Confirm Delete Modal */}
      <ConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteMutation.isPending}
        title="Delete Course Syllabus?"
        message="Are you sure you want to delete this course? All modules, submodules, and lesson content blocks mapped to this course will be deleted or unlinked."
      />
    </div>
  );
}
