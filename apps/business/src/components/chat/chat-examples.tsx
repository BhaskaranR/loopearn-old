"use client";

import { shuffle } from "@loopearn/utils";
import { motion } from "framer-motion";
import { type MutableRefObject, useMemo, useRef } from "react";
import { useDraggable } from "react-use-draggable-scroll";
import { chatExamples } from "./examples";

const listVariant = {
  hidden: { y: 45, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.08,
    },
  },
};

const itemVariant = {
  hidden: { y: 45, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

interface ChatExamplesProps {
  onSubmit: (message: string) => void;
  examples?: string[];
}

export const DEFAULT_EXAMPLES = [
  "What are the best practices for customer retention?",
  "How can I increase my store's conversion rate?",
  "What marketing strategies work best for small businesses?",
];

export function ChatExamples({
  onSubmit,
  examples = DEFAULT_EXAMPLES,
}: ChatExamplesProps) {
  const items = useMemo(() => shuffle(chatExamples), []);
  const ref = useRef<HTMLDivElement>(null);
  const { events } = useDraggable(ref as MutableRefObject<HTMLDivElement>);

  const totalLength = chatExamples.reduce((accumulator, currentString) => {
    return accumulator + currentString.length * 8.2 + 20;
  }, 0);

  return (
    <div className="px-4 py-2 space-y-2">
      <p className="text-xs text-muted-foreground">Try asking:</p>
      <div className="flex flex-wrap gap-2">
        {examples.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => onSubmit(example)}
            className="text-xs px-2 py-1 rounded-md bg-muted hover:bg-muted/80 transition-colors"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}
