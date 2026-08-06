import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// Nearly every page reads live data (registration counts, admin-edited
// content, check-in state) — force per-request rendering everywhere so the
// build never has to reach the database, and pages never serve stale data.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "D-GEM · Don't Graduate Empty — Conference 1.0",
  description:
    "Don't Graduate Empty Movement Conference 1.0 — November 2026, Olabisi Onabanjo University. Mentor. Grow. Excel. Impact.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${archivo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-paper text-ink">
        {children}
      </body>
    </html>
  );
}
