import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Downtown Bakers — Artisanal Luxury Confectionery",
  description: "Experience absolute indulgence with handcrafted custom signature cakes, designer tier celebrations, and gourmet treats delivered fresh to your doorstep.",
  keywords: ["premium bakery", "custom cakes", "designer cakes", "fresh delivery", "eggless cakes", "luxury confectionery"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${outfit.variable} scroll-smooth`}
    >
      <body className="font-outfit bg-stone-50 text-stone-900 antialiased min-h-screen flex flex-col selection:bg-rose-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
