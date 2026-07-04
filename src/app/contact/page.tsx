import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import MessageInABottle from "@/components/MessageInABottle";
import { site } from "@/data/content";

export const metadata: Metadata = {
  title: "Contact — Rahil Wijeyesekera",
  description: "Get in touch with Rahil Wijeyesekera — email, LinkedIn, GitHub.",
};

export default function ContactPage() {
  return (
    <PageShell
      title="Contact"
      emoji="🍾"
      accent="say ahoy!"
      subtitle="A message in a bottle drifted to your shore."
    >
      <MessageInABottle />

      {/* plain-text fallback so contact info is always crawlable/visible */}
      <p className="mt-12 text-center text-sm text-navy/60">
        Prefer plain text?{" "}
        <a className="underline hover:text-navy" href={`mailto:${site.email}`}>
          {site.email}
        </a>{" "}
        ·{" "}
        <a className="underline hover:text-navy" href={site.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>{" "}
        ·{" "}
        <a className="underline hover:text-navy" href={site.github} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </p>
    </PageShell>
  );
}
