import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { AuthModal } from "@/components/organisms/AuthModal";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "The Foodie Map — Discover, Share & Savor the Best Bites",
    template: "%s | The Foodie Map",
  },
  description:
    "Your culinary compass: a community-driven food blog to discover, share, and savor the world's best restaurants, cafés, bars, and hidden gems.",
  keywords: [
    "food blog",
    "restaurants",
    "food map",
    "dining guide",
    "cafe reviews",
    "restaurant reviews",
    "foodie community",
  ],
  authors: [{ name: "The Foodie Map Team" }],
  openGraph: {
    title: "The Foodie Map — Discover, Share & Savor the Best Bites",
    description:
      "A community-driven food blog to discover the world's best restaurants and hidden gems.",
    siteName: "The Foodie Map",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Foodie Map",
    description:
      "Your culinary compass for the world's best bites.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <AuthModal />
      </body>
    </html>
  );
}
