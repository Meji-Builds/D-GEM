"use client";

import { useState } from "react";

export function FaqAccordion({ items }: { items: { id: string; question: string; answer: string }[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="divide-y divide-hair">
      {items.map((item) => (
        <div key={item.id}>
          <button
            type="button"
            onClick={() => setOpen(open === item.id ? null : item.id)}
            className="flex w-full items-center justify-between py-4 text-left"
          >
            <span className="text-sm font-bold">{item.question}</span>
            <span className="text-lg text-mutefg">{open === item.id ? "−" : "+"}</span>
          </button>
          {open === item.id && (
            <p className="pb-4 text-sm leading-relaxed text-bodyfg">{item.answer}</p>
          )}
        </div>
      ))}
    </div>
  );
}
