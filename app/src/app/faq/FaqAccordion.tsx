"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@/components/Icon";

export function FaqAccordion({ items }: { items: { id: string; question: string; answer: string }[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="divide-y divide-hair">
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between py-4 text-left"
            >
              <span className="text-sm font-bold">{item.question}</span>
              <ChevronDownIcon
                className={`h-4 w-4 flex-none text-mutefg transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <p className="pb-4 text-sm leading-relaxed text-bodyfg">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
