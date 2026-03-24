import type { Metadata } from "next";
import { Barlow_Condensed, JetBrains_Mono, Noto_Sans_Georgian } from "next/font/google";

import { Providers } from "@/app/providers";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/components/site-shell";
import { rootMetadata } from "@/lib/seo";
import "./globals.css";

const bodyFont = Noto_Sans_Georgian({
  variable: "--font-body-base",
  subsets: ["latin", "georgian"],
});

const displayFont = Barlow_Condensed({
  variable: "--font-display-base",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const monoFont = JetBrains_Mono({
  variable: "--font-mono-base",
  subsets: ["latin"],
});

export const metadata: Metadata = rootMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)]">
        <Providers>
          <div className="min-h-full">
            <SiteHeader />
            <Breadcrumbs />
            <main>{children}</main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
