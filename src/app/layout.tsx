import type { Metadata } from "next";
import { IBM_Plex_Mono, Source_Sans_3, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const body = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Open Ads",
  description: "Internal ads targeting and campaign management console",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} ${mono.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
