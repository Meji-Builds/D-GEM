import Image from "next/image";
import { formatEventDateLabel } from "@/lib/data";
import { Logo } from "@/components/Logo";

export function AttendeeTicketCard({
  attendee,
  settings,
  qrDataUrl,
  checkedInInfo,
  footerNote,
  actions,
  className = "",
}: {
  attendee: { fullName: string; ticketId: string; school: string; level: string; department: string };
  settings: { eventDate: Date | null; venue: string };
  qrDataUrl: string;
  checkedInInfo?: { checkedInAt: Date | null; gate: string | null };
  footerNote: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`badge-texture print-exact-colors relative w-full overflow-hidden rounded-2xl border-2 border-ink text-white shadow-2xl ${className}`}
    >
      <div className="relative flex items-center justify-between border-b border-[#3a3733] px-6 py-4">
        <Logo size="md" dark />
        <span className="rounded-full border border-gold bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink shadow-[0_0_16px_rgba(201,162,39,0.5)]">
          General
        </span>
      </div>
      <div className="relative p-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gold">Attendee</p>
        <h1 className="font-display mt-1 text-xl font-extrabold">{attendee.fullName}</h1>

        <div className="my-5 inline-block rounded-xl border-2 border-white/80 bg-white p-3 shadow-[0_8px_28px_rgba(0,0,0,0.45)]">
          <Image src={qrDataUrl} alt="Ticket QR code" width={200} height={200} unoptimized />
        </div>

        <p className="text-xs leading-relaxed text-[#a8a29a]">
          Ticket ID · {attendee.ticketId}
          <br />
          {attendee.school} · {attendee.level} · {attendee.department}
          <br />
          {formatEventDateLabel(settings.eventDate)} · {settings.venue}
        </p>

        {checkedInInfo?.checkedInAt && (
          <p className="mt-3 text-xs text-[#a8a29a]">
            Checked in {new Date(checkedInInfo.checkedInAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
            {checkedInInfo.gate ? ` · ${checkedInInfo.gate}` : ""}
          </p>
        )}

        {actions && <div className="mt-5 flex flex-wrap gap-3 print:hidden">{actions}</div>}

        <p className="mt-4 border-t border-[#3a3733] pt-4 text-xs leading-relaxed text-[#a8a29a]">{footerNote}</p>
      </div>
    </div>
  );
}
