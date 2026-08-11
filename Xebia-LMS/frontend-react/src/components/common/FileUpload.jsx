import React, { useState, useRef } from "react";
import { Upload, X, File, Image as ImageIcon, Code, Loader2 } from "lucide-react";

export default function FileUpload({ label, accept, value, onUploadSuccess, onUploadError, className = "" }) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(value || null);
  const fileInputRef = useRef(null);

  // Sync value changes if they come from parent (e.g. switching edit item)
  React.useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(file.name);
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
      
      const response = await fetch(`${API_URL}/media/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      const fileUrl = result.url || result.data?.url || result; // Adjust based on exact backend response

      if (onUploadSuccess) {
        onUploadSuccess(fileUrl);
      }
    } catch (err) {
      console.error("File upload error:", err);
      if (onUploadError) {
        onUploadError(err.message);
      }
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = (e) => {
    e.preventDefault();
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onUploadSuccess) {
      onUploadSuccess(""); // clear the URL in parent
    }
  };

  const getIcon = () => {
    if (!accept) return <File className="w-8 h-8 text-primary/60" />;
    if (accept.includes("image")) return <ImageIcon className="w-8 h-8 text-primary/60" />;
    if (accept.includes("pdf")) return <File className="w-8 h-8 text-primary/60" />;
    if (accept.includes("video")) return <Upload className="w-8 h-8 text-primary/60" />; // Or Video icon
    return <Code className="w-8 h-8 text-primary/60" />;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block text-xs font-bold text-foreground uppercase tracking-wider">{label}</label>}
      
      <div className="relative border-2 border-dashed border-border rounded-xl p-4 hover:bg-gray-50 transition-colors text-center group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
        <input
          type="file"
          className="hidden"
          accept={accept}
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
            <p className="text-sm font-semibold text-text-muted">Uploading...</p>
          </div>
        ) : preview ? (
          <div className="flex items-center justify-between bg-white border border-border p-3 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 overflow-hidden">
              {preview.startsWith("data:image") ? (
                <img src={preview} alt="Preview" className="w-10 h-10 object-cover rounded-md border border-border" />
              ) : (
                <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center text-primary">
                  <File className="w-5 h-5" />
                </div>
              )}
              <span className="text-sm font-semibold text-foreground truncate max-w-[200px]">{preview.startsWith("data:image") ? "Image attached" : preview}</span>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                clearFile(e);
              }}
              className="p-1.5 hover:bg-red-50 text-red-500 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
              {getIcon()}
            </div>
            <p className="text-sm font-bold text-foreground">Click to upload file</p>
            <p className="text-xs font-medium text-text-muted mt-1">(Optional)</p>
          </div>
        )}
      </div>
    </div>
  );
}
