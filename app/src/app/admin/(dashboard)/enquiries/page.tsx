import { prisma } from "@/lib/prisma";
import { EnquiryCard } from "./EnquiryCard";

export default async function AdminEnquiriesPage() {
  const enquiries = await prisma.sponsorshipEnquiry.findMany({ orderBy: { createdAt: "desc" } });
  const newCount = enquiries.filter((e) => e.status === "NEW").length;

  return (
    <div>
      <h1 className="font-display border-b-2 border-ink pb-3 text-lg font-extrabold">
        Sponsorship enquiries · {enquiries.length}
        {newCount > 0 && <span className="ml-2 text-sm font-semibold text-gold">{newCount} new</span>}
      </h1>
      <div className="mt-4 space-y-3">
        {enquiries.map((e) => (
          <EnquiryCard key={e.id} enquiry={e} />
        ))}
        {enquiries.length === 0 && <p className="py-6 text-mutefg">No enquiries yet.</p>}
      </div>
    </div>
  );
}
