import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Agentation } from "agentation";
import Tracker from "@/components/activity/Tracker";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Daniel Chung",
  description: "Product designer working with early-stage startups",
  // Advertise the OpenFeed JSON Feed from every page so it's discoverable from any URL.
  alternates: {
    types: {
      "application/feed+json": "/photo/feed.json",
    },
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "48x48" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased bg-neutral-50`}
      >
        {children}
        <Tracker />
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
