"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export default function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-white transition focus-within:ring-[3px] focus-within:ring-brand-600/20",
        open
          ? "border-brand-200 bg-brand-50/40 shadow-card"
          : "border-slate-200 hover:border-brand-200",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-slate-900 focus-visible:outline-none"
      >
        {question}
        <ChevronDown
          aria-hidden
          className={cn(
            "size-4 shrink-0 text-slate-400 transition-transform duration-300",
            open && "rotate-180",
          )}
        />
      </button>
      {open && <div className="px-5 pb-4 text-sm leading-6 text-slate-600">{answer}</div>}
    </div>
  );
}
