import type { Metadata } from "next";
import { JetBrains_Mono, Manrope, Noto_Sans_Georgian, Oswald } from "next/font/google";

import { Providers } from "@/app/providers";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/components/site-shell";
import { rootMetadata } from "@/lib/seo";
import "./globals.css";

const bodyFont = Manrope({
  variable: "--font-body-base",
  subsets: ["latin"],
});

const georgianSupportFont = Noto_Sans_Georgian({
  variable: "--font-body-georgian",
  subsets: ["georgian"],
});

const displayFont = Oswald({
  variable: "--font-display-base",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      className={`${bodyFont.variable} ${georgianSupportFont.variable} ${displayFont.variable} ${monoFont.variable} h-full antialiased`}
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
