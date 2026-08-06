import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ticketQrDataUrl } from "@/lib/ticket";
import { Logo } from "@/components/Logo";

export default async function CrewBadgePage({
  params,
}: {
  params: Promise<{ crewId: string }>;
}) {
  const { crewId } = await params;
  const volunteer = await prisma.volunteerApplication.findUnique({ where: { crewId } });
  if (!volunteer || volunteer.status !== "ACCEPTED") notFound();
  const qrDataUrl = await ticketQrDataUrl(crewId);

  return (
    <div className="flex min-h-full items-center justify-center bg-mist px-5 py-16">
      <div className="w-full max-w-sm border-2 border-ink bg-ink p-8 text-white">
        <Logo size="sm" />
        <p className="mt-6 text-[10px] font-bold uppercase tracking-widest text-gold">Crew badge</p>
        <div className="mt-1 text-xl font-extrabold">{volunteer.fullName}</div>
        <div className="mt-1 text-xs uppercase tracking-wide text-[#a8a29a]">{volunteer.role}</div>
        <Image src={qrDataUrl} alt="Crew QR badge" width={180} height={180} unoptimized className="my-5 border-2 border-white bg-white p-2" />
        <p className="text-xs text-[#a8a29a]">Crew ID · {crewId}</p>
        <p className="mt-3 text-xs text-[#a8a29a]">Show this badge at accreditation on event day.</p>
      </div>
    </div>
  );
}
