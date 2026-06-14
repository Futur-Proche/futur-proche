import { useEffect, useRef, useCallback } from "react";
import { Bold, Italic, List, ListOrdered, Quote, Link as LinkIcon, Heading2, Heading3, Eraser } from "lucide-react";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
};

/**
 * Toolbar minimale (gras, italique, H2/H3, listes, citation, lien, clear).
 * Aucune dépendance — contenteditable + document.execCommand.
 */
export const RichTextEditor = ({ value, onChange, placeholder, minHeight = 160 }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  // Sync external value if it changes (e.g. on edit-open)
  useEffect(() => {
    if (ref.current && value !== ref.current.innerHTML) {
      ref.current.innerHTML = value || "";
    }
  }, [value]);

  const exec = useCallback((command: string, arg?: string) => {
    document.execCommand(command, false, arg);
    if (ref.current) onChange(ref.current.innerHTML);
    ref.current?.focus();
  }, [onChange]);

  const handleLink = () => {
    const url = window.prompt("URL du lien (https://…)");
    if (!url) return;
    exec("createLink", url);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  const btnClass = "p-2 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors";
  const sepClass = "w-px self-stretch bg-white/10 mx-1";

  return (
    <div className="rounded-lg overflow-hidden" style={{ background: "hsl(228 40% 12%)", border: "1px solid hsl(228 30% 25%)" }}>
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b" style={{ borderColor: "hsl(228 30% 20%)" }}>
        <button type="button" onClick={() => exec("bold")} className={btnClass} title="Gras"><Bold className="w-3.5 h-3.5" /></button>
        <button type="button" onClick={() => exec("italic")} className={btnClass} title="Italique"><Italic className="w-3.5 h-3.5" /></button>
        <span className={sepClass} />
        <button type="button" onClick={() => exec("formatBlock", "<h2>")} className={btnClass} title="Titre H2"><Heading2 className="w-3.5 h-3.5" /></button>
        <button type="button" onClick={() => exec("formatBlock", "<h3>")} className={btnClass} title="Titre H3"><Heading3 className="w-3.5 h-3.5" /></button>
        <span className={sepClass} />
        <button type="button" onClick={() => exec("insertUnorderedList")} className={btnClass} title="Liste à puces"><List className="w-3.5 h-3.5" /></button>
        <button type="button" onClick={() => exec("insertOrderedList")} className={btnClass} title="Liste numérotée"><ListOrdered className="w-3.5 h-3.5" /></button>
        <button type="button" onClick={() => exec("formatBlock", "<blockquote>")} className={btnClass} title="Citation"><Quote className="w-3.5 h-3.5" /></button>
        <span className={sepClass} />
        <button type="button" onClick={handleLink} className={btnClass} title="Lien"><LinkIcon className="w-3.5 h-3.5" /></button>
        <button type="button" onClick={() => exec("removeFormat")} className={btnClass} title="Nettoyer le format"><Eraser className="w-3.5 h-3.5" /></button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange(ref.current?.innerHTML ?? "")}
        onPaste={handlePaste}
        className="prose-editor px-3 py-3 text-sm text-white outline-none focus:bg-white/[0.02]"
        style={{ minHeight }}
        data-placeholder={placeholder ?? "Saisir le contenu…"}
      />
    </div>
  );
};

export default RichTextEditor;
