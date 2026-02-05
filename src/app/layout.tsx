import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fustat = localFont({
  src: [
    { path: "../../public/fonts/Fustat-ExtraLight.ttf", weight: "200" },
    { path: "../../public/fonts/Fustat-Light.ttf", weight: "300" },
    { path: "../../public/fonts/Fustat-Regular.ttf", weight: "400" },
    { path: "../../public/fonts/Fustat-Medium.ttf", weight: "500" },
    { path: "../../public/fonts/Fustat-SemiBold.ttf", weight: "600" },
    { path: "../../public/fonts/Fustat-Bold.ttf", weight: "700" },
    { path: "../../public/fonts/Fustat-ExtraBold.ttf", weight: "800" },
  ],
  variable: "--font-fustat",
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
