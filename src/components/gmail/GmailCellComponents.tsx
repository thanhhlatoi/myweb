import { useState } from "react";
import { Check, Copy, Eye, EyeOff } from "lucide-react";

export function CopyableText({ value, className = "" }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`group inline-flex max-w-full items-center gap-2 rounded-lg px-2 py-1 text-left transition hover:bg-slate-100 ${className}`}
      title="Click để copy"
    >
      <span className="truncate">{value}</span>
      {copied ? (
        <Check size={15} className="shrink-0 text-emerald-600" />
      ) : (
        <Copy size={15} className="shrink-0 text-slate-400 opacity-0 transition group-hover:opacity-100" />
      )}
    </button>
  );
}

export function PasswordCell({ value }: { value: string }) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 font-mono text-sm font-semibold text-slate-700">
      <button type="button" onClick={handleCopy} className="max-w-28 truncate" title="Click để copy mật khẩu">
        {visible ? value : "••••••••"}
      </button>
      <button type="button" onClick={() => setVisible((current) => !current)} className="text-slate-500 hover:text-slate-950">
        {visible ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
      {copied ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} className="text-slate-400" />}
    </div>
  );
}
