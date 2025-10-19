"use client";

import { useState } from "react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ from: 'user'|'bot', text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setMessages((m) => [...m, { from: 'user', text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const json = await res.json();
      const reply = json.reply || json.error || 'No response';
      setMessages((m) => [...m, { from: 'bot', text: String(reply) }]);
    } catch (e) {
      setMessages((m) => [...m, { from: 'bot', text: 'Network error' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-3 border-b border-gray-100 flex items-center justify-between">
            <div className="font-medium">AI Chat</div>
            <button onClick={() => setOpen(false)} className="text-sm text-gray-500">Close</button>
          </div>

          <div className="p-3 h-64 overflow-auto space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={m.from === 'user' ? 'text-right' : 'text-left'}>
                <div className={`inline-block px-3 py-2 rounded-lg ${m.from === 'user' ? 'bg-toyota-red text-white' : 'bg-gray-100 text-gray-900'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-sm text-gray-500">Thinking...</div>}
          </div>

          <div className="p-3 border-t border-gray-100">
            <div className="flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(); }} className="input-field flex-1" placeholder="Ask about financing..." />
              <button onClick={send} className="btn-primary">Send</button>
            </div>
          </div>
        </div>
      )}

      {!open && (
        <button onClick={() => setOpen(true)} className="w-14 h-14 rounded-full bg-toyota-red text-white flex items-center justify-center shadow-lg">
          AI
        </button>
      )}
    </div>
  );
}
