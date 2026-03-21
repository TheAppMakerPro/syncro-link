"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function MessageInput({
  onSend,
  disabled,
}: {
  onSend: (content: string) => Promise<void>;
  disabled?: boolean;
}) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setSending(true);
    try {
      await onSend(trimmed);
      setText("");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2 p-3 border-t border-white/10">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        disabled={disabled}
        rows={1}
        className="flex-1 gold-input px-4 py-2.5 text-sm resize-none min-h-[42px] max-h-[120px]"
        style={{ height: "auto" }}
        onInput={(e) => {
          const el = e.currentTarget;
          el.style.height = "auto";
          el.style.height = Math.min(el.scrollHeight, 120) + "px";
        }}
      />
      <button
        onClick={handleSend}
        disabled={!text.trim() || sending || disabled}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white hover:bg-purple-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  );
}
