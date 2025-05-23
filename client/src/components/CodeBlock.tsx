import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  className?: string;
}

export function CodeBlock({ code, language = "", title, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Simple syntax highlighting for JSON
  const formatJsonCode = (code: string) => {
    return code
      .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
        let cls = "text-amber-500"; // number
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "text-cyan-300"; // key
          } else {
            cls = "text-lime-300"; // string
          }
        } else if (/true|false/.test(match)) {
          cls = "text-rose-300"; // boolean
        } else if (/null/.test(match)) {
          cls = "text-violet-300"; // null
        }
        return `<span class="${cls}">${match}</span>`;
      })
      .replace(/\/\/(.*)/g, '<span class="text-neutral-400">$&</span>') // comments
      .replace(/(GET|POST|PUT|DELETE|PATCH)/g, '<span class="text-violet-300 font-medium">$&</span>'); // HTTP methods
  };

  return (
    <div className={cn("relative rounded-lg overflow-hidden", className)}>
      {title && (
        <div className="bg-neutral-800 text-white px-4 py-2 text-sm font-medium">
          {title}
        </div>
      )}
      <div className="absolute right-2 top-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-8 w-8 p-0 rounded-full bg-neutral-800/50 hover:bg-neutral-700 text-white"
        >
          {copied ? (
            <span className="material-icons text-sm">done</span>
          ) : (
            <span className="material-icons text-sm">content_copy</span>
          )}
        </Button>
      </div>
      <pre
        className="code-block overflow-x-auto p-4 text-sm font-mono"
        style={{ backgroundColor: "#263238" }}
      >
        {language === "json" ? (
          <div dangerouslySetInnerHTML={{ __html: formatJsonCode(code) }} />
        ) : (
          <code>{code}</code>
        )}
      </pre>
    </div>
  );
}
