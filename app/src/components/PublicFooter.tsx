import { Logo } from "./Logo";
import { InstagramIcon, XIcon, TikTokIcon } from "./Icon";

export function PublicFooter({
  contactEmail,
  contactPhone,
  instagramUrl,
  twitterUrl,
  tiktokUrl,
}: {
  contactEmail?: string;
  contactPhone?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  tiktokUrl?: string;
}) {
  const socials = [
    instagramUrl && { href: instagramUrl, label: "Instagram", Icon: InstagramIcon },
    twitterUrl && { href: twitterUrl, label: "X", Icon: XIcon },
    tiktokUrl && { href: tiktokUrl, label: "TikTok", Icon: TikTokIcon },
  ].filter((s): s is { href: string; label: string; Icon: typeof InstagramIcon } => Boolean(s));

  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:grid-cols-3">
        <div>
          <Logo size="md" dark />
          <p className="mt-3 text-xs tracking-wide text-[#a8a29a]">
            Mentor · Grow · Excel · Impact
          </p>
          {socials.length > 0 && (
            <div className="mt-4 flex gap-2.5">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#3a3733] text-[#a8a29a] transition-colors hover:border-gold hover:text-gold"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
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
