
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
import {
  useGetModules,
  useCreateModule,
  useUpdateModule,
  useDeleteModule,
  useReorderModules,
} from "../../../hooks/useModules";
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, ListOrdered, Layers } from "lucide-react";

export default function AdminModulesPage() {
  const toast = useToast();

  const { data: courses, isLoading: coursesLoading } = useGetCourses();
  const [selectedCourseId, setSelectedCourseId] = useState("");

  // Sync first course selection
  useEffect(() => {
    if (courses && courses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses[0].id);
    }
  }, [courses, selectedCourseId]);

  // React Query queries for chosen course
  const { data: modules, isLoading: modulesLoading, isError, refetch } = useGetModules(selectedCourseId);
  
  const createMutation = useCreateModule();
  const updateMutation = useUpdateModule();
  const deleteMutation = useDeleteModule();
  const reorderMutation = useReorderModules();

  // Search & Filters State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals visibility states
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Form input fields
  const [editingModule, setEditingModule] = useState(null);
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [pdfUrl, setPdfUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Submodule counts map from localStorage
  const [submoduleCounts, setSubmoduleCounts] = useState({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const submods = JSON.parse(localStorage.getItem("lms_submodules") || "[]");
      const counts = {};
      submods.forEach(s => {
        counts[s.moduleId] = (counts[s.moduleId] || 0) + 1;
      });
      setSubmoduleCounts(counts);
    }
  }, [modules, modalOpen]);

  const handleOpenCreate = () => {
    if (!selectedCourseId) {
      toast.addToast("Please select a course first", "warning");
      return;
    }
    setEditingModule(null);
    setTitle("");
    setOrder(modules ? modules.length + 1 : 1);
    setStatus("ACTIVE");
    setPdfUrl("");
    setVideoUrl("");
    setFormErrors({});
    setModalOpen(true);
  };

  const handleOpenEdit = (mod) => {
    setEditingModule(mod);
    setTitle(mod.title);
    setOrder(mod.order);
    setStatus(mod.status || "ACTIVE");
    setPdfUrl(mod.pdfUrl || "");
    setVideoUrl(mod.videoUrl || "");
    setFormErrors({});
    setModalOpen(true);
  };

  const handleOpenDelete = (id) => {
    setDeletingId(id);
    setDeleteOpen(true);
  };

  const validateForm = () => {
    const err = {};
    if (!title.trim()) err.title = "Module Title is required";
    setFormErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      title: title.trim(),
      courseId: selectedCourseId,
      order: Number(order) || 1,
      status,
      pdfUrl,
      videoUrl
    };

    if (editingModule) {
      updateMutation.mutate(
        { id: editingModule.id, data: payload },
        {
          onSuccess: () => {
            toast.addToast("Module updated successfully!", "success");
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
          toast.addToast("Module created successfully!", "success");
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
      { id: deletingId, courseId: selectedCourseId },
      {
        onSuccess: () => {
          toast.addToast("Module deleted successfully!", "success");
          setDeleteOpen(false);
        },
        onError: (err) => {
          toast.addToast(`Deletion failed: ${err.message}`, "error");
        },
      }
    );
  };

  const handleMove = (index, direction) => {
    if (!modules) return;
    const newModules = [...modules];
    
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= modules.length) return;

    const temp = newModules[index];
    newModules[index] = newModules[targetIdx];
    newModules[targetIdx] = temp;

    const orderedIds = newModules.map((m) => m.id);

    reorderMutation.mutate(
      { courseId: selectedCourseId, orderedIds },
      {
        onSuccess: () => {
          toast.addToast("Modules reordered successfully!", "success");
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

  // Filter modules
  const filteredModules = (modules || []).filter((mod) => {
    const matchesSearch = mod.title.toLowerCase().includes(search.toLowerCase());
    const modStatus = mod.status || "ACTIVE";
    const matchesStatus = statusFilter === "All" || modStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedCourseTitle = courses?.find(c => c.id === selectedCourseId)?.title || "Selected Course";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Syllabus Modules"
        description="Organize modules inside courses, track active status, and adjust sequencing."
        breadcrumbs={[
          { label: "Admin Console", href: "/admin" },
          { label: "Modules", href: "/admin/modules" }
        ]}
        actions={
          <Button
            variant="primary"
            size="md"
            className="flex items-center gap-1.5 shadow-sm"
            onClick={handleOpenCreate}
            disabled={!selectedCourseId}
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Add Module</span>
          </Button>
        }
      />

      {/* Filter Row: Course selector, search, and status filters */}
      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search modules..."
        filters={[
          {
            value: selectedCourseId,
            onChange: setSelectedCourseId,
            placeholder: "Select Course",
            options: courseOptions
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

      {/* Modules listing */}
      {!selectedCourseId ? (
        <EmptyState
          title="No course selected"
          description="Choose a course from the header dropdown menu to manage its syllabus modules."
        />
      ) : modulesLoading ? (
        <TableSkeleton rows={3} cols={3} />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : filteredModules.length === 0 ? (
        <EmptyState
          title="No modules match search criteria"
          description="Click 'Add Module' to outline this course's syllabus or clear your filters."
          actionText="Add Module"
          onActionClick={handleOpenCreate}
        />
      ) : (
        <div className="space-y-3 max-w-4xl">
          <div className="px-2 pb-2 border-b border-border flex items-center justify-between">
            <span className="text-[10px] font-black text-text-muted uppercase tracking-wider">
              Course: <strong className="text-primary font-black">{selectedCourseTitle}</strong>
            </span>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              {filteredModules.length} Modules listed
            </span>
          </div>
          
          {filteredModules.map((mod, index) => {
            const subCount = submoduleCounts[mod.id] || 0;
            return (
              <Card key={mod.id} className="hover:border-primary/45 transition-colors">
                <CardBody className="p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex flex-col items-center justify-center p-2 bg-gray-100 rounded-lg text-foreground font-extrabold text-sm w-12 h-12 flex-shrink-0">
                      <ListOrdered className="w-3.5 h-3.5 opacity-40 mb-0.5" />
                      <span>{mod.order}</span>
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <h3 className="text-sm font-bold text-foreground truncate">{mod.title}</h3>
                      <div className="flex items-center gap-2 text-[10px] text-text-muted font-semibold">
                        <span className="flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-foreground/30" />
                          <span>{subCount} lessons / submodules</span>
                        </span>
                        <span>&bull;</span>
                        <span>ID: {mod.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0">
                    <StatusBadge status={mod.status || "ACTIVE"} />
                    
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
                        disabled={index === modules.length - 1 || reorderMutation.isPending}
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </Button>

                      <div className="w-px h-6 bg-border mx-1" />

                      {/* CRUD actions */}
                      <Button variant="outline" size="sm" onClick={() => handleOpenEdit(mod)}>
                        <Edit2 className="w-3.5 h-3.5 text-foreground/75" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleOpenDelete(mod.id)}>
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

      {/* 1. Modal Form - Create / Edit Module */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingModule ? "Edit Module Details" : "Add Module to Syllabus"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Module Name / Title"
            placeholder="e.g. RSC (React Server Components) & Data Fetching"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={formErrors.title}
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Display Order Position"
              type="number"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              helperText="Order number in list."
              disabled={!!editingModule}
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
              label="Module Additional Document/PDF"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
              value={pdfUrl}
              onUploadSuccess={(url) => setPdfUrl(url)}
              onUploadError={(err) => toast.addToast(err, "error")}
            />
            <FileUpload
              label="Module Intro Video"
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
              Save Module
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
        title="Delete Syllabus Module?"
        message="Are you sure you want to delete this module? All child submodule lessons and content blocks will lose their parent module link."
      />
    </div>
  );
}
