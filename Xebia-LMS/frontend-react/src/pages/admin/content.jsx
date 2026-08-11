
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
import { useGetSubmodules } from "../../../hooks/useSubmodules";
import {
  useGetContents,
  useCreateContent,
  useUpdateContent,
  useDeleteContent,
  useReorderContents,
} from "../../../hooks/useContent";
import {
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  FileText,
  Code,
  Video,
  Image,
  HelpCircle,
  Eye,
  History,
  Lock,
  Clock
} from "lucide-react";

export default function AdminContentBuilderPage() {
  const toast = useToast();

  const { data: courses } = useGetCourses();
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const { data: modules } = useGetModules(selectedCourseId);
  const [selectedModuleId, setSelectedModuleId] = useState("");

  const { data: submodules } = useGetSubmodules(selectedModuleId);
  const [selectedSubmoduleId, setSelectedSubmoduleId] = useState("");

  // Content blocks query dependent on submodule
  const { data: contents, isLoading: contentsLoading, isError, refetch } = useGetContents(selectedSubmoduleId);

  const createMutation = useCreateContent();
  const updateMutation = useUpdateContent();
  const deleteMutation = useDeleteContent();
  const reorderMutation = useReorderContents();

  // Sync first items on load
  useEffect(() => {
    if (courses && courses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses[0].id);
    }
  }, [courses, selectedCourseId]);

  useEffect(() => {
    if (modules && modules.length > 0) {
      setSelectedModuleId(modules[0].id);
    } else {
      setSelectedModuleId("");
    }
  }, [modules]);

  useEffect(() => {
    if (submodules && submodules.length > 0) {
      setSelectedSubmoduleId(submodules[0].id);
    } else {
      setSelectedSubmoduleId("");
    }
  }, [submodules]);

  // Modals visibility states
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Form fields
  const [editingContent, setEditingContent] = useState(null);
  const [title, setTitle] = useState("");
  const [contentType, setContentType] = useState("text");
  const [order, setOrder] = useState("");
  const [status, setStatus] = useState("PUBLISHED");
  const [allowedRoles, setAllowedRoles] = useState("LEARNER,EDITOR,ADMIN");
  const [version, setVersion] = useState(1);
  const [versionHistory, setVersionHistory] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  // Content payload states
  const [headingText, setHeadingText] = useState("");
  const [headingLevel, setHeadingLevel] = useState("2");
  const [plainText, setPlainText] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("javascript");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaCaption, setMediaCaption] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [calloutTitle, setCalloutTitle] = useState("");
  const [calloutText, setCalloutText] = useState("");
  const [calloutVariant, setCalloutVariant] = useState("info");
  const [tableHeaders, setTableHeaders] = useState("");
  const [tableRows, setTableRows] = useState("");

  const [formErrors, setFormErrors] = useState({});

  const handleOpenCreate = () => {
    if (!selectedSubmoduleId) {
      toast.addToast("Please select a lesson first", "warning");
      return;
    }
    setEditingContent(null);
    setTitle("");
    setContentType("text");
    setOrder(contents ? contents.length + 1 : 1);
    setStatus("PUBLISHED");
    setAllowedRoles("LEARNER,EDITOR,ADMIN");
    setVersion(1);
    setVersionHistory([]);
    
    // Clear payloads
    setHeadingText("");
    setHeadingLevel("2");
    setPlainText("");
    setCodeSnippet("");
    setCodeLanguage("javascript");
    setMediaUrl("");
    setMediaCaption("");
    setFileUrl("");
    setCalloutTitle("");
    setCalloutText("");
    setCalloutVariant("info");
    setTableHeaders("");
    setTableRows("");

    setFormErrors({});
    setModalOpen(true);
  };

  const handleOpenEdit = (block) => {
    setEditingContent(block);
    setTitle(block.title);
    setContentType(block.type);
    setOrder(block.order);
    setStatus(block.status || "PUBLISHED");
    setAllowedRoles(block.allowedRoles || "LEARNER,EDITOR,ADMIN");
    setVersion(block.version || 1);
    
    let history = [];
    try {
      history = typeof block.versionHistory === "string" ? JSON.parse(block.versionHistory) : block.versionHistory || [];
    } catch (e) {
      history = [];
    }
    setVersionHistory(history);
    setFormErrors({});

    let body = {};
    try {
      body = typeof block.body === "string" ? JSON.parse(block.body) : block.body || {};
    } catch (e) {
      body = {};
    }

    // Populate type-specific states
    if (block.type === "heading") {
      setHeadingText(body.text || "");
      setHeadingLevel(String(body.level || 2));
    } else if (block.type === "text") {
      setPlainText(body.text || "");
    } else if (block.type === "code") {
      setCodeSnippet(body.code || "");
      setCodeLanguage(body.language || "javascript");
    } else if (block.type === "media") {
      setMediaUrl(body.url || "");
      setMediaCaption(body.caption || "");
    } else if (block.type === "file") {
      setFileUrl(body.url || "");
    } else if (block.type === "callout") {
      setCalloutTitle(body.title || "");
      setCalloutText(body.text || "");
      setCalloutVariant(body.variant || "info");
    } else if (block.type === "table") {
      setTableHeaders(body.headers ? body.headers.join(", ") : "");
      setTableRows(body.rows ? body.rows.map((r) => r.join(", ")).join("\n") : "");
    }

    setModalOpen(true);
  };

  const handleOpenDelete = (id) => {
    setDeletingId(id);
    setDeleteOpen(true);
  };

  const validateForm = () => {
    const err = {};
    if (!title.trim()) err.title = "Block Title is required";
    
    if (contentType === "heading" && !headingText.trim()) err.headingText = "Heading text is required";
    if (contentType === "text" && !plainText.trim()) err.plainText = "Text content is required";
    if (contentType === "code" && !codeSnippet.trim()) err.codeSnippet = "Code snippet is required";
    if (contentType === "media" && !mediaUrl.trim()) err.mediaUrl = "Media asset URL is required";
    if (contentType === "file" && !fileUrl.trim()) err.fileUrl = "File URL is required";
    
    setFormErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Build specific body contents depending on type selected
    let bodyObj = {};
    if (contentType === "heading") {
      bodyObj = { text: headingText.trim(), level: Number(headingLevel) };
    } else if (contentType === "text") {
      bodyObj = { text: plainText.trim() };
    } else if (contentType === "code") {
      bodyObj = { code: codeSnippet.trim(), language: codeLanguage };
    } else if (contentType === "media") {
      bodyObj = { url: mediaUrl.trim(), caption: mediaCaption.trim() };
    } else if (contentType === "file") {
      bodyObj = { url: fileUrl.trim() };
    } else if (contentType === "callout") {
      bodyObj = { title: calloutTitle.trim(), text: calloutText.trim(), variant: calloutVariant };
    } else if (contentType === "table") {
      const headersArr = tableHeaders.split(",").map((h) => h.trim()).filter(Boolean);
      const rowsArr = tableRows.split("\n").map((line) => line.split(",").map((cell) => cell.trim()).filter(Boolean)).filter((r) => r.length > 0);
      bodyObj = { headers: headersArr, rows: rowsArr };
    }

    // Version controls
    const nextVersion = editingContent ? (editingContent.version || 1) + 1 : 1;
    const dateStr = new Date().toLocaleString();
    const updatedHistory = [
      { version: nextVersion, editedAt: dateStr, editedBy: "admin@xebia.com" },
      ...versionHistory
    ];

    const payload = {
      title: title.trim(),
      type: contentType,
      order: Number(order) || 1,
      submoduleId: selectedSubmoduleId,
      body: JSON.stringify(bodyObj),
      status,
      allowedRoles,
      version: nextVersion,
      versionHistory: JSON.stringify(updatedHistory)
    };

    if (editingContent) {
      updateMutation.mutate(
        { id: editingContent.id, data: payload },
        {
          onSuccess: () => {
            toast.addToast("Content block updated successfully!", "success");
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
          toast.addToast("Content block added!", "success");
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
      { id: deletingId, submoduleId: selectedSubmoduleId },
      {
        onSuccess: () => {
          toast.addToast("Content block deleted successfully!", "success");
          setDeleteOpen(false);
        },
        onError: (err) => {
          toast.addToast(`Deletion failed: ${err.message}`, "error");
        },
      }
    );
  };

  const handleMove = (index, direction) => {
    if (!contents) return;
    const newContents = [...contents];
    
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= contents.length) return;

    const temp = newContents[index];
    newContents[index] = newContents[targetIdx];
    newContents[targetIdx] = temp;

    const orderedIds = newContents.map((m) => m.id);

    reorderMutation.mutate(
      { submoduleId: selectedSubmoduleId, orderedIds },
      {
        onSuccess: () => {
          toast.addToast("Blocks reordered successfully!", "success");
        },
        onError: (err) => {
          toast.addToast(`Reorder failed: ${err.message}`, "error");
        },
      }
    );
  };

  const getBlockIcon = (type) => {
    switch (type) {
      case "heading":
        return <FileText className="w-4 h-4 text-primary" />;
      case "code":
        return <Code className="w-4 h-4 text-emerald-600" />;
      case "media":
        return <Video className="w-4 h-4 text-sky-600" />;
      case "file":
        return <FileText className="w-4 h-4 text-purple-600" />;
      case "callout":
        return <HelpCircle className="w-4 h-4 text-amber-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const courseOptions = courses?.map((c) => ({ value: c.id, label: c.title })) || [];
  const moduleOptions = modules?.map((m) => ({ value: m.id, label: `Mod ${m.order}: ${m.title}` })) || [];
  const submoduleOptions = submodules?.map((s) => ({ value: s.id, label: `Lesson ${s.order}: ${s.title}` })) || [];
  const typeOptions = [
    { value: "heading", label: "Heading text block" },
    { value: "text", label: "Markdown / Plain paragraph text" },
    { value: "code", label: "Syntax Highlighted Code Snippet" },
    { value: "media", label: "Video player / Graphic cover URL" },
    { value: "file", label: "Document / PDF File Upload" },
    { value: "callout", label: "Warning or Info Callout Box" },
    { value: "table", label: "Structured Table Grid" }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Curriculum Content Builder"
        description="Assemble multi-type lesson pages, preview student views in real time, and manage access controls."
        breadcrumbs={[
          { label: "Admin Console", href: "/admin" },
          { label: "Content Builder", href: "/admin/content" }
        ]}
        actions={
          <Button
            variant="primary"
            size="md"
            className="flex items-center gap-1.5 shadow-sm"
            onClick={handleOpenCreate}
            disabled={!selectedSubmoduleId}
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Add Block</span>
          </Button>
        }
      />

      {/* Interactive hierarchy filter bar */}
      <SearchFilterBar
        search=""
        onSearchChange={() => {}}
        placeholder="Filter blocks..."
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
            value: selectedSubmoduleId,
            onChange: setSelectedSubmoduleId,
            placeholder: "Select Lesson",
            options: submoduleOptions
          }
        ]}
      />

      {/* Side-by-Side Builder vs Preview Layout */}
      {!selectedSubmoduleId ? (
        <EmptyState
          title="No lesson selected"
          description="Choose a course, module, and submodule lesson from the filters to start editing content blocks."
        />
      ) : contentsLoading ? (
        <TableSkeleton rows={4} cols={3} />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* LEFT: Builder list */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-xs font-black text-primary uppercase tracking-wider">
                Outline Blocks List
              </span>
              <span className="text-[10px] text-text-muted font-bold">
                {contents?.length || 0} blocks mapped
              </span>
            </div>

            {(!contents || contents.length === 0) ? (
              <EmptyState
                title="No content blocks mapped"
                description="Click 'Add Block' to begin building this syllabus page."
                actionText="Add Block"
                onActionClick={handleOpenCreate}
              />
            ) : (
              <div className="space-y-3">
                {contents.map((block, index) => (
                  <Card key={block.id} className="hover:border-primary/45 transition-colors">
                    <CardBody className="p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2.5 bg-gray-100 rounded-lg flex items-center justify-center font-extrabold text-xs w-10 h-10 flex-shrink-0">
                          {block.order}
                        </div>
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground text-sm truncate max-w-[160px]">{block.title}</span>
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 border border-border rounded text-[8px] font-bold text-foreground uppercase tracking-wide">
                              {getBlockIcon(block.type)}
                              <span>{block.type}</span>
                            </span>
                            <StatusBadge status={block.status || "PUBLISHED"} />
                          </div>
                          
                          <div className="flex items-center gap-2 text-[9px] text-text-muted font-semibold">
                            <span className="flex items-center gap-0.5">
                              <Lock className="w-2.5 h-2.5 opacity-40" />
                              <span>Roles: {block.allowedRoles || "LEARNER"}</span>
                            </span>
                            <span>&bull;</span>
                            <span className="flex items-center gap-0.5">
                              <History className="w-2.5 h-2.5 opacity-40" />
                              <span>v{block.version || 1}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMove(index, "up")}
                            disabled={index === 0 || reorderMutation.isPending}
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMove(index, "down")}
                            disabled={index === contents.length - 1 || reorderMutation.isPending}
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                        
                        <div className="w-px h-6 bg-border mx-1" />

                        <Button variant="outline" size="sm" onClick={() => handleOpenEdit(block)}>
                          <Edit2 className="w-3.5 h-3.5 text-foreground/75" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleOpenDelete(block.id)}>
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Live Preview Panel */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-xs font-black text-primary flex items-center gap-1.5 uppercase tracking-wider">
                <Eye className="w-4 h-4 text-accent" />
                <span>Live Curriculum Preview</span>
              </span>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 rounded text-[9px] uppercase tracking-wide animate-pulse">
                Responsive View
              </span>
            </div>

            <Card className="border-2 border-primary/20 bg-gray-50/50 min-h-[500px] overflow-hidden max-h-[700px] overflow-y-auto custom-scrollbar shadow-xs">
              <CardBody className="p-6 space-y-6 bg-white">
                
                {/* Simulated top bar */}
                <div className="border-b border-border pb-4 mb-2">
                  <span className="text-[9px] font-black text-accent uppercase tracking-wider block">
                    Curriculum Content Simulator
                  </span>
                  <h2 className="text-lg font-black text-foreground">
                    {submodules?.find((s) => s.id === selectedSubmoduleId)?.title || "Outline Title"}
                  </h2>
                  <span className="text-[10px] text-text-muted">Estimated duration: {submodules?.find((s) => s.id === selectedSubmoduleId)?.duration || "15 mins"}</span>
                </div>

                {(!contents || contents.length === 0) ? (
                  <div className="p-12 text-center text-xs text-text-muted italic">
                    Add content blocks on the left to simulate course progression rendering.
                  </div>
                ) : (
                  contents.map((block) => {
                    let body = {};
                    try {
                      body = typeof block.body === "string" ? JSON.parse(block.body) : block.body || {};
                    } catch (e) {
                      body = {};
                    }

                    if ((block.status || "PUBLISHED") !== "PUBLISHED") {
                      return (
                        <div key={block.id} className="p-3 border border-dashed border-gray-200 bg-gray-50/20 text-[10px] text-text-muted flex items-center gap-2 rounded">
                          <Eye className="w-3.5 h-3.5 opacity-40" />
                          <span>Block <strong>"{block.title}"</strong> is hidden in preview because status is set to {block.status}.</span>
                        </div>
                      );
                    }

                    return (
                      <div key={block.id} className="space-y-2 border-l-2 border-primary/5 pl-3 hover:border-accent/40 transition-colors">
                        
                        {/* Rendering: Heading */}
                        {block.type === "heading" && (
                          <div className="pt-2">
                            {body.level === 1 && <h3 className="text-lg font-black text-foreground">{body.text}</h3>}
                            {body.level === 2 && <h4 className="text-base font-extrabold text-foreground">{body.text}</h4>}
                            {body.level === 3 && <h5 className="text-sm font-bold text-foreground">{body.text}</h5>}
                          </div>
                        )}

                        {/* Rendering: Paragraph */}
                        {block.type === "text" && (
                          <p className="text-xs text-foreground/80 leading-relaxed font-medium whitespace-pre-line">
                            {body.text}
                          </p>
                        )}

                        {/* Rendering: Code */}
                        {block.type === "code" && (
                          <div className="bg-gray-950 rounded-xl overflow-hidden shadow-sm">
                            <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-white/5">
                              <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">{body.language || "code"}</span>
                              <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                            </div>
                            <pre className="p-4 overflow-x-auto text-[11px] text-emerald-400 font-mono">
                              <code>{body.code}</code>
                            </pre>
                          </div>
                        )}

                        {/* Rendering: Media */}
                        {block.type === "media" && (
                          <div className="space-y-1">
                            <div className="aspect-video w-full rounded-xl bg-gray-100 overflow-hidden relative border border-border">
                              <img
                                src={body.url || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800"}
                                alt={body.caption}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {body.caption && <span className="text-[10px] text-text-muted italic block text-center font-medium">{body.caption}</span>}
                          </div>
                        )}
                        
                        {/* Rendering: File */}
                        {block.type === "file" && (
                          <div className="p-4 rounded-xl border border-border bg-gray-50 flex items-center gap-3">
                            <div className="p-2 bg-white rounded shadow-sm border border-border">
                              <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-bold text-foreground truncate block">Document Reference</span>
                              <a href={body.url} target="_blank" rel="noreferrer" className="text-[10px] font-semibold text-primary hover:underline truncate block">
                                {body.url}
                              </a>
                            </div>
                          </div>
                        )}

                        {/* Rendering: Callout */}
                        {block.type === "callout" && (
                          <div className={`p-4 rounded-xl border flex flex-col gap-1
                            ${body.variant === "success" ? "bg-emerald-50 border-emerald-100 text-emerald-800" : ""}
                            ${body.variant === "warning" ? "bg-amber-50 border-amber-100 text-amber-800" : ""}
                            ${body.variant === "danger" ? "bg-rose-50 border-rose-100 text-rose-800" : ""}
                            ${body.variant === "info" ? "bg-sky-50 border-sky-100 text-sky-850" : ""}
                          `}>
                            {body.title && <strong className="text-xs font-extrabold">{body.title}</strong>}
                            <span className="text-[11px] font-semibold opacity-90 leading-relaxed">{body.text}</span>
                          </div>
                        )}

                        {/* Rendering: Table */}
                        {block.type === "table" && (
                          <div className="border border-border rounded-xl overflow-hidden">
                            <table className="min-w-full divide-y divide-border text-left text-[11px]">
                              {body.headers && body.headers.length > 0 && (
                                <thead className="bg-gray-50 font-bold text-foreground">
                                  <tr>
                                    {body.headers.map((h, i) => <th key={i} className="px-4 py-2">{h}</th>)}
                                  </tr>
                                </thead>
                              )}
                              {body.rows && body.rows.length > 0 && (
                                <tbody className="divide-y divide-border text-foreground/80">
                                  {body.rows.map((row, rIdx) => (
                                    <tr key={rIdx}>
                                      {row.map((cell, cIdx) => <td key={cIdx} className="px-4 py-2 font-medium">{cell}</td>)}
                                    </tr>
                                  ))}
                                </tbody>
                              )}
                            </table>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      )}

      {/* 1. Modal Form - Create / Edit Content Block */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingContent ? `Edit Content Block (v${version})` : "Add Content Block"}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Block Label Title"
              placeholder="e.g. Code snippet sample"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={formErrors.title}
            />
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Content Type Format</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                disabled={!!editingContent}
                className="w-full px-3 py-2 border border-border bg-white rounded-xl text-sm focus:outline-none focus:border-primary/50 cursor-pointer"
              >
                {typeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Display Order Position"
              type="number"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              disabled={!!editingContent}
            />

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Publishing Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-border bg-white rounded-xl text-sm focus:outline-none focus:border-primary/50 cursor-pointer"
              >
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="PENDING_APPROVAL">Pending Review</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Allowed Roles (Access Control)</label>
              <select
                value={allowedRoles}
                onChange={(e) => setAllowedRoles(e.target.value)}
                className="w-full px-3 py-2 border border-border bg-white rounded-xl text-sm focus:outline-none focus:border-primary/50 cursor-pointer"
              >
                <option value="LEARNER,EDITOR,ADMIN">All Roles (Public)</option>
                <option value="EDITOR,ADMIN">Administrators & Editors only</option>
                <option value="ADMIN">Super Administrators only</option>
              </select>
            </div>
          </div>

          {/* Dynamic Inputs depending on selected type */}
          <div className="pt-4 border-t border-border">
            <h4 className="text-xs font-black text-primary uppercase tracking-wider mb-3">
              Format Payload Values
            </h4>

            {/* Type: Heading */}
            {contentType === "heading" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="Heading Text"
                    placeholder="Enter heading..."
                    value={headingText}
                    onChange={(e) => setHeadingText(e.target.value)}
                    error={formErrors.headingText}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Heading Level</label>
                  <select
                    value={headingLevel}
                    onChange={(e) => setHeadingLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-border bg-white rounded-xl text-sm"
                  >
                    <option value="1">Level 1 (h1 - Large)</option>
                    <option value="2">Level 2 (h2 - Medium)</option>
                    <option value="3">Level 3 (h3 - Small)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Type: Paragraph Text */}
            {contentType === "text" && (
              <Input
                label="Paragraph Markdown/Text"
                placeholder="Enter rich paragraph instructions..."
                value={plainText}
                onChange={(e) => setPlainText(e.target.value)}
                error={formErrors.plainText}
                textarea
                rows={5}
              />
            )}

            {/* Type: Code */}
            {contentType === "code" && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Code syntax language</label>
                  <select
                    value={codeLanguage}
                    onChange={(e) => setCodeLanguage(e.target.value)}
                    className="w-full px-3 py-2 border border-border bg-white rounded-xl text-sm"
                  >
                    <option value="javascript">Javascript (ES6)</option>
                    <option value="typescript">Typescript</option>
                    <option value="html">HTML5</option>
                    <option value="css">CSS3 / Tailwind</option>
                    <option value="java">Java (Spring Boot)</option>
                    <option value="python">Python</option>
                    <option value="bash">Bash / Shell scripts</option>
                  </select>
                </div>
                <Input
                  label="Code Snippet"
                  placeholder="Paste syntax block here..."
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  error={formErrors.codeSnippet}
                  textarea
                  rows={6}
                />
              </div>
            )}

            {/* Type: Media */}
            {contentType === "media" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FileUpload
                  label="Media Graphic/Video"
                  accept="image/*,video/*"
                  onUploadSuccess={(url) => {
                    setMediaUrl(url);
                    setFormErrors(prev => ({ ...prev, mediaUrl: null }));
                  }}
                  onUploadError={(err) => toast.addToast(err, "error")}
                />
                <Input
                  label="Asset Caption Text"
                  placeholder="e.g. Figure 1: RSC lifecycle context flows"
                  value={mediaCaption}
                  onChange={(e) => setMediaCaption(e.target.value)}
                />
              </div>
            )}
            
            {/* Type: File */}
            {contentType === "file" && (
              <div className="space-y-4">
                <FileUpload
                  label="Upload Document (PDF, ZIP, etc.)"
                  accept=".pdf,.zip,.doc,.docx"
                  onUploadSuccess={(url) => {
                    setFileUrl(url);
                    setFormErrors(prev => ({ ...prev, fileUrl: null }));
                  }}
                  onUploadError={(err) => toast.addToast(err, "error")}
                />
              </div>
            )}

            {/* Type: Callout */}
            {contentType === "callout" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Callout Header Title"
                    placeholder="e.g. Warning!"
                    value={calloutTitle}
                    onChange={(e) => setCalloutTitle(e.target.value)}
                  />
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Box Alert Variant</label>
                    <select
                      value={calloutVariant}
                      onChange={(e) => setCalloutVariant(e.target.value)}
                      className="w-full px-3 py-2 border border-border bg-white rounded-xl text-sm"
                    >
                      <option value="info">Info (Blue)</option>
                      <option value="success">Success (Green)</option>
                      <option value="warning">Warning (Orange)</option>
                      <option value="danger">Alert (Red)</option>
                    </select>
                  </div>
                </div>
                <Input
                  label="Callout message"
                  placeholder="Enter alert box message text..."
                  value={calloutText}
                  onChange={(e) => setCalloutText(e.target.value)}
                  textarea
                  rows={2}
                />
              </div>
            )}

            {/* Type: Table */}
            {contentType === "table" && (
              <div className="space-y-4">
                <Input
                  label="Table Headers (Comma separated)"
                  placeholder="ID, Title, Status, Description"
                  value={tableHeaders}
                  onChange={(e) => setTableHeaders(e.target.value)}
                />
                <Input
                  label="Table Rows (Comma separated cells, one row per line)"
                  placeholder="1, Setup, Active, Initial config&#10;2, Deploy, Inactive, Server configuration"
                  value={tableRows}
                  onChange={(e) => setTableRows(e.target.value)}
                  textarea
                  rows={4}
                />
              </div>
            )}
          </div>

          {/* Version Logs tracker */}
          {editingContent && versionHistory.length > 0 && (
            <div className="p-4 border border-border bg-gray-50/20 rounded-xl space-y-2">
              <span className="text-[10px] font-black text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Version & Audit Log History</span>
              </span>
              <div className="max-h-24 overflow-y-auto text-[10px] text-text-muted space-y-1.5 custom-scrollbar">
                {versionHistory.map((h, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-border/30 pb-1 last:border-0">
                    <span>Version <strong>v{h.version}</strong> published by <strong>{h.editedBy}</strong></span>
                    <span>{h.editedAt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={createMutation.isPending || updateMutation.isPending}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={createMutation.isPending || updateMutation.isPending}>
              Save Block
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
        title="Delete Content Block?"
        message="Are you sure you want to delete this block? It will be removed from the curriculum simulation page."
      />
    </div>
  );
}
