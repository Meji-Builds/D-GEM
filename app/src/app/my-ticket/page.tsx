import { PublicNav } from "@/components/PublicNav";
import { PublicFooter } from "@/components/PublicFooter";
import { getEventSettings } from "@/lib/data";
import { LookupForm } from "./LookupForm";

export default async function MyTicketPage() {
  const settings = await getEventSettings();
  return (
    <div className="flex min-h-full flex-col">
      <PublicNav />
      <main className="flex-1">
        <div className="mx-auto max-w-md px-5 py-16">
          <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">My ticket</p>
          <h1 className="font-display mt-2 text-2xl font-extrabold tracking-tight">
            Find your invitation
          </h1>
          <p className="mt-2 text-sm text-bodyfg">
            Enter the ticket ID from your email, or the email address you registered with.
          </p>
          <LookupForm />
        </div>
      </main>
      <PublicFooter contactEmail={settings.contactEmail} contactPhone={settings.contactPhone} />
    </div>
  );
}
