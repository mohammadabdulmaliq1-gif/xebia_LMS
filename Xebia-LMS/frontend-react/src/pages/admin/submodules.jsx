
import React, { useState, useEffect } from "react";
import Card, { CardBody } from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import Modal, { ConfirmModal } from "../../../components/common/Modal";
import { TableSkeleton } from "../../../components/common/Skeleton";
import EmptyState from "../../../components/common/EmptyState";
import ErrorState from "../../../components/common/ErrorState";
import useToast from "../../../hooks/useToast";
import PageHeader from "../../../components/common/PageHeader";
import SearchFilterBar from "../../../components/common/SearchFilterBar";
import StatusBadge from "../../../components/common/StatusBadge";
import FileUpload from "../../../components/common/FileUpload";
import { useGetCourses } from "../../../hooks/useCourses";
import { useGetModules } from "../../../hooks/useModules";
import {
  useGetSubmodules,
  useCreateSubmodule,
  useUpdateSubmodule,
  useDeleteSubmodule,
  useReorderSubmodules,
} from "../../../hooks/useSubmodules";
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, FileText, Link2, BookOpen } from "lucide-react";

export default function AdminSubmodulesPage() {
  const toast = useToast();

  const { data: courses } = useGetCourses();
  const [selectedCourseId, setSelectedCourseId] = useState("");
  
  // Modules list dependent on chosen course
  const { data: modules, isLoading: modulesLoading } = useGetModules(selectedCourseId);
  const [selectedModuleId, setSelectedModuleId] = useState("");

  // Submodules list dependent on chosen module
  const { data: submodules, isLoading: submodulesLoading, isError, refetch } = useGetSubmodules(selectedModuleId);

  const createMutation = useCreateSubmodule();
  const updateMutation = useUpdateSubmodule();
  const deleteMutation = useDeleteSubmodule();
  const reorderMutation = useReorderSubmodules();

  // Search & Filters State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals visibility states
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Form input fields
  const [editingSubmodule, setEditingSubmodule] = useState(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [duration, setDuration] = useState("");
  const [order, setOrder] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [pdfUrl, setPdfUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  
  const [deletingId, setDeletingId] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Content counts state
  const [contentCounts, setContentCounts] = useState({});

  // Sync first course
  useEffect(() => {
    if (courses && courses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses[0].id);
    }
  }, [courses, selectedCourseId]);

  // Sync first module when course changes
  useEffect(() => {
    if (modules && modules.length > 0) {
      setSelectedModuleId(modules[0].id);
    } else {
      setSelectedModuleId("");
    }
  }, [modules]);

  // Count contents from localStorage fallback
  useEffect(() => {
    if (typeof window !== "undefined") {
      const conts = JSON.parse(localStorage.getItem("lms_contents") || "[]");
      const counts = {};
      conts.forEach(c => {
        counts[c.submoduleId] = (counts[c.submoduleId] || 0) + 1;
      });
      setContentCounts(counts);
    }
  }, [submodules, modalOpen]);

  const handleOpenCreate = () => {
    if (!selectedModuleId) {
      toast.addToast("Please select a module first", "warning");
      return;
    }
    setEditingSubmodule(null);
    setTitle("");
    setSlug("");
    setDuration("20 min");
    setStatus("ACTIVE");
    setOrder(submodules ? submodules.length + 1 : 1);
    setPdfUrl("");
    setVideoUrl("");
    setFormErrors({});
    setModalOpen(true);
  };

  const handleOpenEdit = (sub) => {
    setEditingSubmodule(sub);
    setTitle(sub.title);
    setSlug(sub.slug);
    setDuration(sub.duration);
    setStatus(sub.status || "ACTIVE");
    setOrder(sub.order);
    setPdfUrl(sub.pdfUrl || "");
    setVideoUrl(sub.videoUrl || "");
    setFormErrors({});
    setModalOpen(true);
  };

  const handleOpenDelete = (id) => {
    setDeletingId(id);
    setDeleteOpen(true);
  };

  const validateForm = () => {
    const err = {};
    if (!title.trim()) err.title = "Submodule Title is required";
    if (!duration.trim()) err.duration = "Duration is required";
    setFormErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      title: title.trim(),
      slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      duration: duration.trim(),
      moduleId: selectedModuleId,
      order: Number(order) || 1,
      status,
      pdfUrl,
      videoUrl
    };

    if (editingSubmodule) {
      updateMutation.mutate(
        { id: editingSubmodule.id, data: payload },
        {
          onSuccess: () => {
            toast.addToast("Submodule updated successfully!", "success");
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
          toast.addToast("Submodule created successfully!", "success");
          setModalOpen(false);
        },
        onError: (err) => {
          toast.addToast(`Creation failed: ${err.message}`, "error");
        },
      });
    }
  };

  const handleDeleteConfirm = async () => {
    deleteMutation.mutate(
      { id: deletingId, moduleId: selectedModuleId },
      {
        onSuccess: () => {
          toast.addToast("Submodule deleted successfully!", "success");
          setDeleteOpen(false);
        },
        onError: (err) => {
          toast.addToast(`Deletion failed: ${err.message}`, "error");
        },
      }
    );
  };

  const handleMove = (index, direction) => {
    if (!submodules) return;
    const newSubs = [...submodules];

    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= submodules.length) return;

    const temp = newSubs[index];
    newSubs[index] = newSubs[targetIdx];
    newSubs[targetIdx] = temp;

    const orderedIds = newSubs.map((s) => s.id);

    reorderMutation.mutate(
      { moduleId: selectedModuleId, orderedIds },
      {
        onSuccess: () => {
          toast.addToast("Submodules reordered successfully!", "success");
        },
        onError: (err) => {
          toast.addToast(`Reorder failed: ${err.message}`, "error");
        },
      }
    );
  };

  const courseOptions = courses?.map((c) => ({
    value: c.id,
    label: c.title,
  })) || [];

  const moduleOptions = modules?.map((m) => ({
    value: m.id,
    label: `Mod ${m.order}: ${m.title}`,
  })) || [];

  // Filter logic
  const filteredSubmodules = (submodules || []).filter((sub) => {
    const matchesSearch = sub.title.toLowerCase().includes(search.toLowerCase());
    const subStatus = sub.status || "ACTIVE";
    const matchesStatus = statusFilter === "All" || subStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedCourseTitle = courses?.find(c => c.id === selectedCourseId)?.title || "Selected Course";
  const selectedModuleTitle = modules?.find(m => m.id === selectedModuleId)?.title || "Selected Module";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Lessons (Submodules)"
        description="Configure submodule lessons, dependency prerequisites, and map visual assets inside outline segments."
        breadcrumbs={[
          { label: "Admin Console", href: "/admin" },
          { label: "Submodules", href: "/admin/submodules" }
        ]}
        actions={
          <Button
            variant="primary"
            size="md"
            className="flex items-center gap-1.5 shadow-sm"
            onClick={handleOpenCreate}
            disabled={!selectedModuleId}
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Add Lesson</span>
          </Button>
        }
      />

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search lessons..."
        filters={[
          {
            value: selectedCourseId,
            onChange: setSelectedCourseId,
            placeholder: "Select Course",
            options: courseOptions
          },
          {
            value: selectedModuleId,
            onChange: setSelectedModuleId,
            placeholder: "Select Module",
            options: moduleOptions
          },
          {
            value: statusFilter,
            onChange: setStatusFilter,
            placeholder: "All Statuses",
            options: [
              { value: "ACTIVE", label: "Active" },
              { value: "INACTIVE", label: "Inactive" }
            ]
          }
        ]}
        onClear={() => {
          setSearch("");
          setStatusFilter("All");
          if (courses && courses.length > 0) {
            setSelectedCourseId(courses[0].id);
          }
        }}
      />

      {!selectedModuleId ? (
        <EmptyState
          title="No module selected"
          description="Select a course and parent syllabus module from the headers to manage lesson nodes."
        />
      ) : submodulesLoading ? (
        <TableSkeleton rows={3} cols={3} />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : filteredSubmodules.length === 0 ? (
        <EmptyState
          title="No lessons match criteria"
          description="Click 'Add Lesson' to insert your first learning node or clear filter parameters."
          actionText="Add Lesson"
          onActionClick={handleOpenCreate}
        />
      ) : (
        <div className="space-y-3 max-w-4xl">
          <div className="px-2 pb-2 border-b border-border flex items-center justify-between">
            <span className="text-[10px] font-black text-text-muted uppercase tracking-wider">
              Module: <strong className="text-primary font-black">{selectedModuleTitle}</strong> &middot; <span className="font-medium">{selectedCourseTitle}</span>
            </span>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              {filteredSubmodules.length} Lessons outlined
            </span>
          </div>

          {filteredSubmodules.map((sub, index) => {
            const count = contentCounts[sub.id] || 0;
            // Prerequisite sequence mapping
            const previousSubmodule = index > 0 ? filteredSubmodules[index - 1] : null;

            return (
              <Card key={sub.id} className="hover:border-primary/45 transition-colors">
                <CardBody className="p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex flex-col items-center justify-center p-2.5 bg-gray-100 rounded-lg text-foreground font-extrabold text-sm w-12 h-12 flex-shrink-0">
                      <FileText className="w-4.5 h-4.5 text-foreground/45 mb-0.5" />
                      <span className="text-[10px] opacity-75">{sub.order}</span>
                    </div>
                    <div className="min-w-0 space-y-1">
                      <h3 className="text-sm font-bold text-foreground truncate">{sub.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-[10px] text-text-muted font-semibold">
                        <span className="px-2 py-0.5 bg-sky-50 border border-sky-100 rounded text-sky-700 font-bold">
                          {sub.duration}
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-foreground/30" />
                          <span>{count} content elements</span>
                        </span>
                        {previousSubmodule && (
                          <>
                            <span>&bull;</span>
                            <span className="flex items-center gap-1 text-accent font-bold">
                              <Link2 className="w-3 h-3 text-accent/50" />
                              <span>Prereq: Lesson {previousSubmodule.order}</span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0">
                    <StatusBadge status={sub.status || "ACTIVE"} />

                    <div className="flex items-center gap-1.5">
                      {/* Reorder actions */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMove(index, "up")}
                        disabled={index === 0 || reorderMutation.isPending}
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMove(index, "down")}
                        disabled={index === submodules.length - 1 || reorderMutation.isPending}
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </Button>

                      <div className="w-px h-6 bg-border mx-1" />

                      {/* CRUD actions */}
                      <Button variant="outline" size="sm" onClick={() => handleOpenEdit(sub)}>
                        <Edit2 className="w-3.5 h-3.5 text-foreground/75" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleOpenDelete(sub.id)}>
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      {/* 1. Modal Form - Create / Edit Submodule */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSubmodule ? "Edit Lesson Details" : "Add Lesson Node"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Lesson Name / Title"
            placeholder="e.g. Server vs. Client Components"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={formErrors.title}
          />
          <Input
            label="Custom URL Slug (Optional)"
            placeholder="e.g. server-client-components"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            helperText="Leave empty to auto-generate from title."
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Duration (e.g. 20 min)"
              placeholder="20 min"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              error={formErrors.duration}
            />
            <Input
              label="Display Order Position"
              type="number"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              disabled={!!editingSubmodule}
            />

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Active Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-border bg-white rounded-xl text-sm focus:outline-none focus:border-primary/50 cursor-pointer"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FileUpload
              label="Lesson Additional Document/PDF"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
              value={pdfUrl}
              onUploadSuccess={(url) => setPdfUrl(url)}
              onUploadError={(err) => toast.addToast(err, "error")}
            />
            <FileUpload
              label="Lesson Intro Video"
              accept="video/*"
              value={videoUrl}
              onUploadSuccess={(url) => setVideoUrl(url)}
              onUploadError={(err) => toast.addToast(err, "error")}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={createMutation.isPending || updateMutation.isPending}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={createMutation.isPending || updateMutation.isPending}>
              Save Lesson
            </Button>
          </div>
        </form>
      </Modal>

      {/* 2. Modal dialog - Confirm Delete */}
      <ConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteMutation.isPending}
        title="Delete Lesson Node?"
        message="Are you sure you want to delete this lesson? All custom content blocks uploaded inside will be permanently deleted."
      />
    </div>
  );
}
