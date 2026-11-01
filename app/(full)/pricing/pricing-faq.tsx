"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export type PricingFaq = { question: string; answer: string };

export default function PricingFaqList({ items }: { items: PricingFaq[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <PricingFaqItem key={item.question} {...item} />
      ))}
    </div>
  );
}

function PricingFaqItem({ question, answer }: PricingFaq) {
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
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full transition",
            open ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500",
          )}
        >
          <ChevronDown
            aria-hidden
            className={cn("size-4 transition-transform duration-300", open && "rotate-180")}
          />
        </span>
      </button>
      {open && <div className="px-5 pb-5 text-sm leading-7 text-slate-600">{answer}</div>}
    </div>
  );
}
