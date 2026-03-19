"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, MessageSquareText } from "lucide-react";
import { AIChatPanel } from "./chat-pannel";
import { cn } from "@/lib/utils";

export function AIFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300",
          "bg-gradient-to-tr from-primary via-primary to-blue-400 text-primary-foreground",
          "group border border-primary/20"
        )}
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-full bg-primary/40 blur-xl animate-pulse group-hover:bg-primary/60" />
        
        <div className="relative z-10 flex items-center justify-center">
          {isOpen ? (
            <MessageSquareText className="h-6 w-6 animate-in zoom-in duration-300" />
          ) : (
            <Bot className="h-6 w-6 animate-in zoom-in duration-300" />
          )}
        </div>
      </motion.button>

      <AIChatPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}