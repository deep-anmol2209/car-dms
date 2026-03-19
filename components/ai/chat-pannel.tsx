"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, SendHorizontal, Sparkles, Loader2, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { AIMessage } from "./ai-message";

const SUGGESTIONS = [
  "Total cars sold this month",
  "Top selling car model",
  "Revenue generated this quarter",
];

export function AIChatPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;
  
    const userMsg = { role: "user" as const, content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
  
    try {
      const res = await fetch("/api/ai/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: text }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.message || "I couldn't process that request.",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.answer,
          },
        ]);
      }
  
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble connecting right now.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 20, y: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, x: 20, y: 20 }}
          className="fixed bottom-24 right-6 z-50 w-[300px] md:w-[420px] h-[60vh] max-h-[700px]"
        >
          <Card className="flex flex-col h-full border-primary/10 shadow-2xl backdrop-blur-xl bg-background/95 overflow-hidden rounded-2xl">
            {/* Header */}
            <div className="p-4 flex items-center justify-between bg-primary/5 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary rounded-lg text-primary-foreground shadow-lg shadow-primary/20">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm tracking-tight">AI Assistant</h3>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Sales & Inventory Expert</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-primary/10">
                <X size={18} />
              </Button>
            </div>

            {/* Chat Area */}
            <ScrollArea className="flex-1 p-4">
  <div ref={scrollRef}>
    {messages.length === 0 && (
      <div className="flex flex-col gap-4 mt-4">
        <div className="p-4 rounded-xl border border-dashed border-primary/20 bg-primary/5">
          <p className="text-sm text-muted-foreground mb-3 font-medium flex items-center gap-2">
            <BarChart3 size={14} className="text-primary" /> Quick insights:
          </p>

          <div className="flex flex-col gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="text-left text-xs p-2.5 rounded-lg bg-background border border-border hover:border-primary/50 transition-colors shadow-sm"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    )}

    {messages.map((m, i) => (
      <AIMessage key={i} role={m.role} content={m.content} />
    ))}

    {isLoading && (
      <div className="flex justify-start mb-4">
        <div className="bg-secondary/50 p-3 rounded-2xl rounded-tl-none">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        </div>
      </div>
    )}
  </div>
</ScrollArea>

            {/* Input */}
            <div className="p-4 border-t bg-background/50">
              <div className="relative flex items-center">
                <textarea
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
                  placeholder="Ask anything..."
                  className="w-full resize-none bg-secondary/30 border border-border rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all min-h-[48px] max-h-[120px]"
                />
                <Button 
                  size="icon" 
                  disabled={!input.trim() || isLoading}
                  onClick={() => handleSend()}
                  className="absolute right-1.5 h-8 w-8 rounded-lg shadow-md transition-transform active:scale-95"
                >
                  <SendHorizontal size={16} />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}