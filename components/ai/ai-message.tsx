"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import { motion } from "framer-motion";

interface MessageProps {
  role: "user" | "assistant";
  content: string;
}

export function AIMessage({ role, content }: MessageProps) {
  const isAssistant = role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn(
        "flex w-full mb-4 gap-3",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      {isAssistant && (
        <Avatar className="h-8 w-8 border border-primary/20 bg-primary/10">
          <AvatarFallback className="bg-primary/10 text-primary">
            <Bot size={16} />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div
  className={cn(
    "max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-line",
    isAssistant
      ? "bg-secondary/50 backdrop-blur-md border border-border rounded-tl-none text-foreground"
      : "bg-primary text-primary-foreground rounded-tr-none font-medium"
  )}
>
  {content}
</div>

      {!isAssistant && (
        <Avatar className="h-8 w-8 border border-primary/20">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <User size={16} />
          </AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );
}