import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getFaqs } from "@/lib/data";
import { FaqForm } from "./FaqForm";
import { DeleteButton } from "./DeleteButton";

export default async function AdminFaqPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const [faqs, editing] = await Promise.all([
    getFaqs(),
    edit ? prisma.faqItem.findUnique({ where: { id: edit } }) : Promise.resolve(null),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between border-b-2 border-ink pb-3">
        <h1 className="font-display text-lg font-extrabold">FAQ · {faqs.length}</h1>
        {edit && (
          <Link href="/admin/faq" className="text-xs font-semibold text-bodyfg hover:text-gold">
            + New question instead
          </Link>
        )}
      </div>

      <div className="mt-4 divide-y divide-hair">
        {faqs.map((f) => (
          <div key={f.id} className="flex items-start justify-between gap-4 py-3">
            <div>
              <div className="text-sm font-bold">{f.question}</div>
              <p className="mt-1 text-xs text-bodyfg">{f.answer}</p>
            </div>
            <div className="shrink-0 text-xs font-semibold whitespace-nowrap">
              <Link href={`/admin/faq?edit=${f.id}`} className="text-bodyfg hover:text-gold">Edit</Link>
              {" · "}
              <DeleteButton id={f.id} />
            </div>
          </div>
        ))}
        {faqs.length === 0 && <p className="py-6 text-sm text-mutefg">No FAQs yet.</p>}
      </div>

      <div className="mt-8 border-t-2 border-ink bg-mist p-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">
          {editing ? "Edit question" : "Add question"}
        </p>
        <div className="mt-4">
          <FaqForm
            key={editing?.id ?? "new"}
            initial={editing ? { id: editing.id, question: editing.question, answer: editing.answer, order: editing.order } : null}
          />
        </div>
      </div>
    </div>
  );
}
