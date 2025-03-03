import type { Metadata } from "next";
import { Inter, Poppins, JetBrains_Mono } from "next/font/google";

import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
});

// Metadata configuration
export const metadata: Metadata = {
  // Title configuration: 'default' is used if no other title is provided (in child route segments), while 'template' appends/prepends custom text to child route titles. title.absolute can be used to provide a title that ignores title.template set in parent segments.
  title: {
    default: "Pokemon Team Builder & Pokedex",
    template: "%s | Pokemon Team Builder",
  },
  description:
    "Explore Pokemon, build teams, and analyze Pokemon statistics with our comprehensive Pokedex application.",
  keywords: [
    "Pokemon",
    "Pokedex",
    "Team Builder",
    "Pokemon Stats",
    "Pokemon Analysis",
  ],

  authors: [{ name: "Aswini", url: "https://nextjs.org" }],
  creator: "Aswini",
  publisher: "Aswini",

  robots: {
    index: true,
    follow: true,
  },
  // manifest: "/site.webmanifest", // Manifest file for Progressive Web App (PWA) support.
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Providers>
          {children}
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}
