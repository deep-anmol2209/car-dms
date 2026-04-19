"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";
import { Bot, MessageSquareText } from "lucide-react";
import { AIChatPanel } from "./chat-pannel";
import { cn } from "@/lib/utils";

const BUTTON_SIZE = 64;
const MARGIN = 20;

export function AIFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [constraints, setConstraints] = useState({ top: 0, left: 0, right: 0, bottom: 0 });

  const dragStartPos = useRef({ x: 0, y: 0 });
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const init = () => {
      const top = window.innerHeight - BUTTON_SIZE - MARGIN;
      const left = window.innerWidth - BUTTON_SIZE - MARGIN;

      setPosition({ top, left });
      setConstraints({
        top: -top,
        left: -left,
        right: window.innerWidth - left - BUTTON_SIZE,
        bottom: window.innerHeight - top - BUTTON_SIZE,
      });
    };

    init();
    window.addEventListener("resize", init);
    return () => window.removeEventListener("resize", init);
  }, []);

  // Don't render until position is calculated (avoids SSR flash)
  if (!position) return null;

  return (
    <>
      <motion.button
        drag
        dragElastic={0.08}
        dragMomentum={true}
        dragConstraints={constraints}
        dragTransition={{
          power: 0.3,
          timeConstant: 200,
          modifyTarget: (target) => Math.round(target),
        }}
        style={{ x, y, top: position.top, left: position.left }}
        onDragStart={(_, info) => {
          setIsDragging(true);
          dragStartPos.current = { x: info.point.x, y: info.point.y };
        }}
        onDragEnd={(_, info) => {
          const dx = Math.abs(info.point.x - dragStartPos.current.x);
          const dy = Math.abs(info.point.y - dragStartPos.current.y);
          setTimeout(() => setIsDragging(false), dx + dy > 4 ? 150 : 0);
        }}
        whileDrag={{ scale: 1.12, cursor: "grabbing" }}
        whileHover={{ scale: 1.05, cursor: "grab" }}
        onClick={() => {
          if (!isDragging) setIsOpen(!isOpen);
        }}
        className={cn(
          "fixed z-50 p-4 rounded-full shadow-2xl",
          "bg-gradient-to-tr from-primary via-primary to-blue-400 text-primary-foreground",
          "group border border-primary/20",
          "touch-none select-none"
        )}
      >
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