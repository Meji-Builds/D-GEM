import { Logo } from "./Logo";

export function PublicFooter({
  contactEmail,
  contactPhone,
}: {
  contactEmail?: string;
  contactPhone?: string;
}) {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:grid-cols-3">
        <div>
          <Logo size="md" dark />
          <p className="mt-3 text-xs tracking-wide text-[#a8a29a]">
            Mentor · Grow · Excel · Impact
          </p>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-gold">
            Pages
          </div>
          <p className="mt-2 text-xs leading-loose text-[#a8a29a]">
            <a className="hover:text-white" href="/speakers">Speakers</a> ·{" "}
            <a className="hover:text-white" href="/agenda">Agenda</a> ·{" "}
            <a className="hover:text-white" href="/volunteer">Volunteer</a>
            <br />
            <a className="hover:text-white" href="/sponsorship">Sponsorship</a> ·{" "}
            <a className="hover:text-white" href="/faq">FAQ</a> ·{" "}
            <a className="hover:text-white" href="/faq#contact">Contact</a> ·{" "}
            <a className="hover:text-white" href="/my-ticket">My ticket</a>
          </p>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-gold">
            Contact
          </div>
          <p className="mt-2 text-xs leading-loose text-[#a8a29a]">
            {contactEmail || "info@dgem.org"}
            <br />
            {contactPhone || "+234 000 000 0000"}
          </p>
        </div>
      </div>
      <div className="border-t border-[#3a3733] px-5 py-4 text-center text-[10px] text-[#8a8580]">
        © {new Date().getFullYear()} Don't Graduate Empty Movement.
      </div>
    </footer>
  );
}
