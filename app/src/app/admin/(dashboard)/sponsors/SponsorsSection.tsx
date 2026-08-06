"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SponsorForm } from "./SponsorForm";
import { deleteSponsor } from "./actions";

type Sponsor = { id: string; name: string; tier: string; url: string; logoUrl: string | null };

export function SponsorsSection({ sponsors }: { sponsors: Sponsor[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();
  const editing = sponsors.find((s) => s.id === editingId) ?? null;

  return (
    <div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-ink text-left text-[9px] font-bold uppercase tracking-wider text-mutefg">
            <th className="py-2">Logo</th>
            <th className="py-2">Sponsor</th>
            <th className="py-2">Tier</th>
            <th className="py-2">Link</th>
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {sponsors.map((s) => (
            <tr key={s.id} className="border-b border-hair">
              <td className="py-2">
                {s.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.logoUrl} alt={s.name} className="h-6 w-10 object-contain" />
                ) : (
                  <div className="placeholder-fill h-6 w-10 border border-line" />
                )}
              </td>
              <td className="py-2 font-semibold">{s.name}</td>
              <td className="py-2">
                <span className={`border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${s.tier === "GOLD" ? "border-gold bg-gold" : "border-ink"}`}>
                  {s.tier.charAt(0) + s.tier.slice(1).toLowerCase()}
                </span>
              </td>
              <td className="py-2 text-xs text-bodyfg">{s.url || "—"}</td>
              <td className="py-2 text-right text-xs font-semibold">
                <button className="text-bodyfg hover:text-gold" onClick={() => setEditingId(s.id)}>Edit</button>
                {" · "}
                <button
                  disabled={pending}
                  className="text-bodyfg hover:text-red-700"
                  onClick={() => {
                    if (confirm("Remove this sponsor?")) {
                      start(async () => {
                        await deleteSponsor(s.id);
                        router.refresh();
                      });
                    }
                  }}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
          {sponsors.length === 0 && (
            <tr><td colSpan={5} className="py-6 text-mutefg">No sponsors yet.</td></tr>
          )}
        </tbody>
      </table>

      <div className="mt-5 border-t-2 border-ink pt-4">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-mutefg">
          {editing ? `Editing — ${editing.name}` : "Add sponsor"}
        </p>
        <SponsorForm
          key={editing?.id ?? "new"}
          initial={editing ? { id: editing.id, name: editing.name, tier: editing.tier, url: editing.url } : null}
          onDone={() => {
            setEditingId(null);
            router.refresh();
          }}
        />
        {editing && (
          <button className="mt-2 text-xs font-semibold text-bodyfg hover:text-gold" onClick={() => setEditingId(null)}>
            Cancel edit
          </button>
        )}
      </div>
    </div>
  );
}
