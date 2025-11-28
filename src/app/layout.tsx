import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/global.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://waheed-fragrance.vercel.app"),
  title: "Waheed Fragrance - Premium Fragrances",
  description:
    "Discover our curated collection of premium fragrances. Shop luxury scents from top brands worldwide.",
  keywords: ["perfume", "fragrance", "luxury", "eau de parfum", "scents"],
  authors: [{ name: "Waheed Fragrance" }],
  openGraph: {
    type: "website",
    url: "https://waheed-fragrance.vercel.app",
    title: "Waheed Fragrance",
    description: "Discover our curated collection of premium fragrances",
    images: [
      {
        url: "/seoimage.png",
        width: 1200,
        height: 630,
        alt: "Waheed Fragrance",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0f0f0f" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='50' font-size='60' font-weight='bold' text-anchor='middle' dominant-baseline='middle' fill='%23d4af37'>✨</text></svg>"
        />
      </head>
      <body>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
