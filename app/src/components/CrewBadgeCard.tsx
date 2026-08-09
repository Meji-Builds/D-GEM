import Image from "next/image";
import { formatEventDateLabel } from "@/lib/data";
import { Logo } from "@/components/Logo";

export function CrewBadgeCard({
  volunteer,
  settings,
  qrDataUrl,
  scanInfo,
  footerNote,
  className = "",
}: {
  volunteer: { fullName: string; role: string; crewId: string };
  settings: { eventDate: Date | null; venue: string };
  qrDataUrl: string;
  scanInfo?: { scannedAt: Date | null; gate: string | null };
  footerNote: string;
  className?: string;
}) {
  const firstName = volunteer.fullName.split(" ")[0];

  return (
    <div
      className={`badge-texture print-exact-colors relative w-full max-w-sm overflow-hidden rounded-2xl border-2 border-ink text-white shadow-2xl ${className}`}
    >
      <div className="relative flex items-center justify-between border-b border-[#3a3733] px-6 py-4">
        <Logo size="sm" dark />
        <span className="rounded-full border border-gold bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink shadow-[0_0_16px_rgba(201,162,39,0.5)]">
          Crew
        </span>
      </div>
      <div className="relative p-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gold">Crew badge</p>
        <h1 className="font-display mt-1 text-2xl font-extrabold">Welcome, {firstName}.</h1>
        <div className="mt-1 text-xs uppercase tracking-wide text-[#a8a29a]">{volunteer.role}</div>

        <div className="my-5 inline-block rounded-xl border-2 border-white/80 bg-white p-3 shadow-[0_8px_28px_rgba(0,0,0,0.45)]">
          <Image src={qrDataUrl} alt="Crew QR badge" width={200} height={200} unoptimized />
        </div>

        <p className="text-xs leading-relaxed text-[#a8a29a]">
          Crew ID · {volunteer.crewId}
          <br />
          {formatEventDateLabel(settings.eventDate)} · {settings.venue}
        </p>

        {scanInfo?.scannedAt && (
          <p className="mt-3 text-xs text-[#a8a29a]">
            Scanned {new Date(scanInfo.scannedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
            {scanInfo.gate ? ` · ${scanInfo.gate}` : ""}
          </p>
        )}

        <p className="mt-4 border-t border-[#3a3733] pt-4 text-xs leading-relaxed text-[#a8a29a]">{footerNote}</p>
      </div>
    </div>
  );
}
