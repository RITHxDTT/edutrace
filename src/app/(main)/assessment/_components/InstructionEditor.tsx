import { useEffect, useRef } from "react";
import { List } from "lucide-react";

interface InstructionEditorProps {
  label?: string;
  placeholder?: string;
  optional?: boolean;
  value?: string;
  onChange?: (html: string) => void;
}

export default function InstructionEditor({
  label = "Instruction",
  placeholder = "your instruction...",
  optional = true,
  value = "",
  onChange,
}: InstructionEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const format = (command: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false);
  };

  const handleInput = () => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <p className="text-sm font-medium text-gray-800">
          {label}{" "}
          {optional && (
            <span className="font-normal text-gray-400">(Optional)</span>
          )}
        </p>
      )}

      <div className="border border-gray-200 rounded-xl bg-white focus-within:border-gray-400 transition-colors overflow-hidden">
        {/* EDITOR */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          data-placeholder={placeholder}
          className="min-h-[120px] p-3 text-sm text-gray-800 outline-none leading-relaxed
            empty:before:content-[attr(data-placeholder)] 
            empty:before:text-gray-300 
            empty:before:pointer-events-none"
        />

        {/* TOOLBAR */}
        <div className="border-t border-gray-100 px-2 py-1.5 flex items-center gap-1 bg-white">
          <button
            onClick={() => format("bold")}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 font-bold text-sm"
          >
            B
          </button>

          <button
            onClick={() => format("italic")}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 italic text-sm"
          >
            I
          </button>

          <button
            onClick={() => format("underline")}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 underline text-sm"
          >
            U
          </button>

          <button
            onClick={() => format("strikeThrough")}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 line-through text-sm"
          >
            S
          </button>

          <div className="w-px h-4 bg-gray-200 mx-1" />

          <button
            onClick={() => format("insertUnorderedList")}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
