import { Toaster } from "@/components/ui/sonner";
import IndexProvider from "@/context/IndexProvider";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zeit - Your Wishlist, Measured in Time",
  description:
    "Zeit is a wishlist app that measures your wishes in time helping you make smarter budgeting decisions.",
  icons: [
    {
      rel: "icon",
      type: "image/x-icon",
      url: "/favicon.ico",
      media: "(prefers-color-scheme: light)",
    },
    {
      rel: "icon",
      type: "image/png",
      url: "/favicon-dark.png",
      media: "(prefers-color-scheme: dark)",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <Toaster />
      <html lang="en" suppressHydrationWarning>
        <head>
          <meta name="apple-mobile-web-app-title" content="Zeit" />
        </head>
        <IndexProvider>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <main>{children}</main>
          </body>
        </IndexProvider>
      </html>
    </ClerkProvider>
  );
}
