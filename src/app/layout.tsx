import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Pixelify_Sans,
  Titan_One,
  Pacifico,
  Permanent_Marker,
  Bebas_Neue,
  Newsreader,
} from "next/font/google";
import localFont from "next/font/local";
import { site, siteUrl } from "@/data/content";
import "./globals.css";

const dxBurst = localFont({
  src: "./fonts/DxBurst-Regular.otf",
  variable: "--font-dxburst",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pixelify = Pixelify_Sans({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const titanOne = Titan_One({
  variable: "--font-retro",
  subsets: ["latin"],
  weight: "400",
});

const pacifico = Pacifico({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

const marker = Permanent_Marker({
  variable: "--font-marker",
  subsets: ["latin"],
  weight: "400",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

const newsreader = Newsreader({
  variable: "--font-editorial",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
});

const description =
  "Portfolio of Rahil Wijeyesekera — Computer Science student at the University of Victoria building AI agents, systems tools, and web apps. Surf the islands to explore.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Rahil Wijeyesekera — Portfolio",
  description,
  keywords: [
    "Rahil Wijeyesekera",
    "portfolio",
    "computer science",
    "University of Victoria",
    "AI agents",
    "RAG",
    "MCP",
  ],
  openGraph: {
    title: "Rahil Wijeyesekera — Portfolio",
    description,
    url: "/",
    siteName: "Rahil Wijeyesekera",
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rahil Wijeyesekera — Portfolio",
    description,
  },
};

/** Schema.org Person — helps search engines connect the site to the name. */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: siteUrl,
  email: `mailto:${site.email}`,
  jobTitle: "Computer Science Student",
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: "University of Victoria",
  },
  sameAs: [site.github, site.linkedin],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${pixelify.variable} ${titanOne.variable} ${pacifico.variable} ${marker.variable} ${bebasNeue.variable} ${newsreader.variable} ${dxBurst.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
