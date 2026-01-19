import type { Metadata } from "next";
import localFont from "next/font/local";
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const siteUrl = "https://octopals.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "OctoPals - Underwater Hockey Community Platform",
    template: "%s | OctoPals",
  },
  description:
    "Connect with the global underwater hockey community. Find clubs, join sessions, track your training, and compete with players worldwide.",
  keywords: [
    "underwater hockey",
    "octopush",
    "UWH",
    "swimming",
    "hockey",
    "aquatic sports",
    "clubs",
    "training",
    "community",
  ],
  authors: [{ name: "OctoPals" }],
  creator: "OctoPals",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "OctoPals",
    title: "OctoPals - Underwater Hockey Community Platform",
    description:
      "Connect with the global underwater hockey community. Find clubs, join sessions, track your training, and compete with players worldwide.",
    images: [
      {
        url: `${siteUrl}/api/og`,
        width: 1200,
        height: 630,
        alt: "OctoPals - Underwater Hockey Community Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OctoPals - Underwater Hockey Community Platform",
    description:
      "Connect with the global underwater hockey community. Find clubs, join sessions, track your training, and compete with players worldwide.",
    images: [`${siteUrl}/api/og`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
