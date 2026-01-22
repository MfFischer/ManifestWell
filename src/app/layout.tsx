import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ManifestWell - Holistic Wellness & Manifestation App",
  description: "Transform your life with ManifestWell - the all-in-one wellness app for nutrition tracking, fitness logging, guided meditation, Silva Method manifestation, journaling, and goal setting. 100% private, works offline.",
  keywords: [
    "wellness app",
    "manifestation",
    "meditation app",
    "nutrition tracker",
    "fitness tracker",
    "Silva Method",
    "mindfulness",
    "journaling app",
    "goal tracker",
    "holistic health",
    "mental wellness",
    "self improvement",
    "manifestation techniques",
    "guided meditation",
    "calorie counter",
    "workout tracker"
  ],
  authors: [{ name: "ManifestWell Team" }],
  creator: "ManifestWell",
  publisher: "ManifestWell",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon-48.webp", sizes: "48x48", type: "image/webp" },
      { url: "/icon-96.webp", sizes: "96x96", type: "image/webp" },
      { url: "/icon-192.webp", sizes: "192x192", type: "image/webp" },
    ],
    apple: [
      { url: "/icon-192.webp", sizes: "192x192", type: "image/webp" },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "ManifestWell - Transform Your Mind, Body & Spirit",
    description: "The holistic wellness app that combines nutrition, fitness, meditation, manifestation, journaling, and goals. 100% private, works offline.",
    type: "website",
    locale: "en_US",
    url: "https://manifestwell.com",
    siteName: "ManifestWell",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "ManifestWell Logo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "ManifestWell - Holistic Wellness App",
    description: "Transform your life with nutrition tracking, guided meditation, manifestation techniques, and more. 100% private.",
    images: ["/logo.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ManifestWell",
  },
  applicationName: "ManifestWell",
  category: "health",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
