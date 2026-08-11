
import React, { useState } from "react";
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
import {
  useGetCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "../../../hooks/useCategories";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default function AdminCategoriesPage() {
  const toast = useToast();
  
  const { data: categories, isLoading, isError, refetch } = useGetCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modal display states
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  
  // Form input states
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [icon, setIcon] = useState("Layout");
  const [color, setColor] = useState("primary");
  const [status, setStatus] = useState("ACTIVE");
  const [imageUrl, setImageUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName("");
    setDescription("");
    setSlug("");
    setIcon("Layout");
    setColor("primary");
    setStatus("ACTIVE");
    setImageUrl("");
    setPdfUrl("");
    setFormErrors({});
    setModalOpen(true);
  };

  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description);
    setSlug(category.slug);
    setIcon(category.icon || "Layout");
    setColor(category.color || "primary");
    setStatus(category.status || "ACTIVE");
    setImageUrl(category.imageUrl || "");
    setPdfUrl(category.pdfUrl || "");
    setFormErrors({});
    setModalOpen(true);
  };

  const handleOpenDelete = (id) => {
    setDeletingId(id);
    setDeleteOpen(true);
  };

  const validateForm = () => {
    const err = {};
    if (!name.trim()) err.name = "Category Name is required";
    if (!description.trim()) err.description = "Description is required";
    setFormErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      name: name.trim(),
      description: description.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      icon,
      color,
      status,
      imageUrl,
      pdfUrl
    };

    if (editingCategory) {
      updateMutation.mutate(
        { id: editingCategory.id, data: payload },
        {
          onSuccess: () => {
            toast.addToast("Category updated successfully!", "success");
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
          toast.addToast("Category created successfully!", "success");
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
        toast.addToast("Category deleted successfully!", "success");
        setDeleteOpen(false);
      },
      onError: (err) => {
        toast.addToast(`Deletion failed: ${err.message}`, "error");
      },
    });
  };

  // Filter logic
  const filteredCategories = (categories || []).filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.description.toLowerCase().includes(search.toLowerCase());
    const catStatus = cat.status || "ACTIVE";
    const matchesStatus = statusFilter === "All" || catStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      header: "Category Name",
      key: "name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs uppercase
            ${row.color === "primary" ? "bg-primary/10 text-primary border border-primary/20" : ""}
            ${row.color === "secondary" ? "bg-gray-100 text-gray-700 border border-gray-200" : ""}
            ${row.color === "accent" ? "bg-accent/10 text-accent border border-accent/20" : ""}
            ${row.color === "cta" ? "bg-cta/10 text-cta border border-cta/20" : ""}
            ${row.color === "danger" ? "bg-rose-50 text-rose-700 border border-rose-200" : ""}
            ${row.color === "emerald" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : ""}
          `}>
            {(row.icon || "LA").substring(0, 2)}
          </div>
          <div>
            <span className="font-bold text-foreground block">{row.name}</span>
            <span className="text-[10px] text-text-muted font-semibold block">{row.slug}</span>
          </div>
        </div>
      )
    },
    {
      header: "Description",
      key: "description",
      render: (row) => (
        <span className="text-text-muted block max-w-sm truncate font-medium">
          {row.description}
        </span>
      )
    },
    {
      header: "Active Courses",
      key: "coursesCount",
      render: (row) => (
        <span className="font-bold text-foreground block">
          {row.coursesCount || 0} courses
        </span>
      )
    },
    {
      header: "Status",
      key: "status",
      render: (row) => <StatusBadge status={row.status || "ACTIVE"} />
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
        title="Manage Categories"
        description="Configure higher-level capability tracks and educational academies."
        breadcrumbs={[
          { label: "Admin Console", href: "/admin" },
          { label: "Categories", href: "/admin/categories" }
        ]}
        actions={
          <Button variant="primary" size="md" className="flex items-center gap-1.5 shadow-sm" onClick={handleOpenCreate}>
            <Plus className="w-4.5 h-4.5" />
            <span>New Category</span>
          </Button>
        }
      />

      {/* Filter Control Row */}
      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search categories..."
        filters={[
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
        }}
      />

      {/* Categories Content block */}
      {isLoading ? (
        <TableSkeleton rows={4} cols={5} />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <DataTable
          columns={columns}
          data={filteredCategories}
          emptyTitle="No categories registered"
          emptyDescription="Click 'New Category' to create your first capability track."
        />
      )}

      {/* Modal form */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? "Edit Category Details" : "Create New Category"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Category Name"
            placeholder="e.g. Frontend Architecture"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={formErrors.name}
          />

          <Input
            label="Custom URL Slug (Optional)"
            placeholder="e.g. frontend-architecture"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            helperText="Leave empty to auto-generate from category name."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Icon Symbol</label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full px-3 py-2 border border-border bg-white rounded-xl text-sm focus:outline-none focus:border-primary/50"
              >
                <option value="Layout">Layout Panel</option>
                <option value="Cloud">Cloud Server</option>
                <option value="Database">Database System</option>
                <option value="Award">Certification Badge</option>
                <option value="Book">Curriculum Syllabus</option>
                <option value="FileCode">Content Developer</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Brand Accent Color</label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full px-3 py-2 border border-border bg-white rounded-xl text-sm focus:outline-none focus:border-primary/50"
              >
                <option value="primary">Purple (Xebia Brand)</option>
                <option value="accent">Orange (Xebia Highlight)</option>
                <option value="cta">Blue (Interactive Accent)</option>
                <option value="emerald">Green (Success)</option>
                <option value="danger">Red (Alert)</option>
                <option value="secondary">Gray (Neutral)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Active Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-border bg-white rounded-xl text-sm focus:outline-none focus:border-primary/50"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <Input
            label="Description Summary"
            placeholder="Explain what skills this category covers..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={formErrors.description}
            textarea
            rows={4}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FileUpload
              label="Category Image"
              accept="image/*"
              onUploadSuccess={(url) => setImageUrl(url)}
              onUploadError={(err) => toast.addToast(err, "error")}
            />
            <FileUpload
              label="Additional Resources (PDF)"
              accept=".pdf"
              onUploadSuccess={(url) => setPdfUrl(url)}
              onUploadError={(err) => toast.addToast(err, "error")}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={createMutation.isPending || updateMutation.isPending}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={createMutation.isPending || updateMutation.isPending}>
              Save Category
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteMutation.isPending}
        title="Delete Capability Category?"
        message="Are you sure you want to delete this category? All courses matching this category will lose their capability link."
      />
    </div>
  );
}
