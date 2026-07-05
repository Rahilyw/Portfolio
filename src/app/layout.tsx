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
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Rahil Wijeyesekera — Portfolio",
  description:
    "Portfolio of Rahil Wijeyesekera — Computer Science student at the University of Victoria building AI agents, systems tools, and web apps. Surf the islands to explore.",
  keywords: [
    "Rahil Wijeyesekera",
    "portfolio",
    "computer science",
    "University of Victoria",
    "AI agents",
    "RAG",
    "MCP",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${pixelify.variable} ${titanOne.variable} ${pacifico.variable} ${marker.variable} ${bebasNeue.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
