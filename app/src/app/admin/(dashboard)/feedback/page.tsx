import { prisma } from "@/lib/prisma";
import { FeedbackRow } from "./FeedbackRow";

export default async function AdminFeedbackPage() {
  const responses = await prisma.feedbackResponse.findMany({ orderBy: { createdAt: "desc" } });
  const avgRating = responses.length
    ? (responses.reduce((sum, f) => sum + f.rating, 0) / responses.length).toFixed(1)
    : "—";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink pb-3">
        <h1 className="font-display text-lg font-extrabold">Feedback · {responses.length}</h1>
        <span className="text-xs font-semibold text-mutefg">Average rating: {avgRating}</span>
      </div>
      <p className="mt-3 text-xs text-mutefg">
        Approve a response with a written testimonial to show it on the homepage and the public{" "}
        <a href="/testimonials" target="_blank" rel="noreferrer" className="underline hover:text-gold">Testimonials</a> page.
        The Best session / Improve notes stay private either way.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b-2 border-ink text-left text-[9px] font-bold uppercase tracking-wider text-mutefg">
              <th className="py-2 pr-4">Rating</th>
              <th className="py-2 pr-4">From</th>
              <th className="py-2 pr-4">Testimonial</th>
              <th className="py-2 pr-4">Private notes</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {responses.map((f) => (
              <FeedbackRow key={f.id} f={f} />
            ))}
            {responses.length === 0 && (
              <tr><td colSpan={6} className="py-6 text-mutefg">No feedback submitted yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
