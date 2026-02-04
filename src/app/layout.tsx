import type { Metadata } from "next";
import { Inter, Fustat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fustat = Fustat({
  variable: "--font-fustat",
  subsets: ["latin"],
  weight: ["600"],
});

export const metadata: Metadata = {
  title: "Daniel Chung",
  description: "Product designer working with early-stage startups",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${fustat.variable} antialiased bg-white`}
      >
        {children}
      </body>
    </html>
  );
}
