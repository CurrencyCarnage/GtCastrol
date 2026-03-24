import type { Metadata } from "next";

const siteName = "Castrol Georgia";
const siteUrl = "https://castrol-georgia.example.com";
const defaultDescription =
  "Product finder, service-center booking, and commerce-ready automotive lubricant platform for Georgia.";

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  keywords: ["Castrol Georgia", "product finder", "booking", "engine oil", "service center", "automotive lubricants"],
  openGraph: {
    title: siteName,
    description: defaultDescription,
    siteName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: defaultDescription,
  },
};

export function buildMetadata({
  title,
  description = defaultDescription,
  path = "/",
}: {
  title: string;
  description?: string;
  path?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: new URL(path, siteUrl),
      siteName,
      type: "website",
    },
  };
}
