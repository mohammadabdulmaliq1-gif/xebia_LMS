
import React, { useState } from "react";
import { Copy, Check, FileText, Lightbulb, AlertTriangle, Play, HelpCircle } from "lucide-react";

export default function ContentRenderer({ content }) {
  const [copied, setCopied] = useState(false);

  if (!content) return null;

  let body = {};
  try {
    body = typeof content.body === "string" ? JSON.parse(content.body) : content.body || {};
  } catch (e) {
    console.error("Failed to parse content body JSON", e);
    return (
      <div className="p-4 border border-rose-200 rounded-lg bg-rose-50 text-rose-800 text-sm">
        Error parsing content block payload
      </div>
    );
  }

  const handleCopyCode = (codeText) => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  switch (content.type) {
    case "heading":
      const level = body.level || 2;
      const text = body.text || "";
      if (level === 1) {
        return <h1 className="text-3xl font-extrabold text-primary mb-4 border-b border-border pb-2 mt-6">{text}</h1>;
      } else if (level === 2) {
        return <h2 className="text-2xl font-bold text-primary mb-3 mt-6 pb-1 border-b border-gray-100">{text}</h2>;
      } else {
        return <h3 className="text-xl font-bold text-foreground mb-2 mt-4">{text}</h3>;
      }

    case "text":
      return (
        <div className="prose max-w-none text-foreground/90 text-sm leading-relaxed mb-4 whitespace-pre-line">
          {body.text || ""}
        </div>
      );

    case "code":
      const code = body.code || "";
      const language = body.language || "javascript";
      return (
        <div className="relative border border-slate-700 bg-slate-900 rounded-xl overflow-hidden shadow-md my-4 font-mono text-xs">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700 text-slate-400">
            <span className="uppercase text-[10px] font-bold tracking-wider">{language}</span>
            <button
              onClick={() => handleCopyCode(code)}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] font-semibold text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-semibold">Copy</span>
                </>
              )}
            </button>
          </div>
          {/* Code content */}
          <pre className="p-4 overflow-x-auto text-slate-200 custom-scrollbar leading-5">
            <code>{code}</code>
          </pre>
        </div>
      );

    case "video":
      const videoUrl = body.url || "";
      const videoCaption = body.caption || "";
      return (
        <div className="my-6">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-border shadow-sm group">
            {videoUrl.includes("mp4") ? (
              <video
                src={videoUrl}
                controls
                className="w-full h-full object-cover"
                poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1000&auto=format&fit=crop&q=80"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white/70">
                <Play className="w-16 h-16 text-primary animate-pulse mb-3" />
                <span className="text-sm font-semibold">External Video Stream</span>
                <a href={videoUrl} target="_blank" rel="noreferrer" className="mt-2 text-xs text-primary underline">
                  Open Stream Link
                </a>
              </div>
            )}
          </div>
          {videoCaption && (
            <p className="text-xs text-center text-text-muted mt-2 font-medium italic">
              {videoCaption}
            </p>
          )}
        </div>
      );

    case "image":
      const imgUrl = body.url || "";
      const imgCaption = body.caption || "";
      return (
        <div className="my-6">
          <div className="rounded-xl overflow-hidden border border-border shadow-xs bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imgUrl} alt={imgCaption} className="w-full h-auto object-cover max-h-[480px]" />
          </div>
          {imgCaption && (
            <p className="text-xs text-center text-text-muted mt-2 font-medium italic">
              {imgCaption}
            </p>
          )}
        </div>
      );

    case "callout":
      const cTitle = body.title || "";
      const cText = body.text || "";
      const variant = body.variant || "info"; // tip, warning, info

      let calloutStyles = {
        bg: "bg-sky-50 border-sky-200 text-sky-900",
        icon: <FileText className="w-5 h-5 text-sky-600 flex-shrink-0" />,
      };
      if (variant === "tip") {
        calloutStyles = {
          bg: "bg-emerald-50 border-emerald-200 text-emerald-950",
          icon: <Lightbulb className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
        };
      } else if (variant === "warning") {
        calloutStyles = {
          bg: "bg-amber-50 border-amber-200 text-amber-950",
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
        };
      }

      return (
        <div className={`flex items-start gap-3.5 p-4 border rounded-xl my-4 ${calloutStyles.bg}`}>
          {calloutStyles.icon}
          <div>
            {cTitle && <h4 className="text-sm font-bold mb-0.5">{cTitle}</h4>}
            <p className="text-xs leading-relaxed opacity-90">{cText}</p>
          </div>
        </div>
      );

    case "table":
      const headers = body.headers || [];
      const rows = body.rows || [];
      return (
        <div className="overflow-x-auto border border-border rounded-xl shadow-xs bg-white my-4 custom-scrollbar">
          <table className="min-w-full divide-y divide-border text-left text-xs">
            <thead className="bg-gray-50 text-foreground font-semibold uppercase tracking-wider">
              <tr>
                {headers.map((h, hIdx) => (
                  <th key={hIdx} className="px-6 py-3 border-b border-border">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground/80">
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-gray-50/50 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-6 py-3 whitespace-nowrap">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    default:
      return (
        <div className="flex items-center gap-2 p-3 border border-border rounded-lg bg-gray-50 text-text-muted text-xs">
          <HelpCircle className="w-4 h-4" />
          <span>Unsupported block format type: {content.type}</span>
        </div>
      );
  }
}
