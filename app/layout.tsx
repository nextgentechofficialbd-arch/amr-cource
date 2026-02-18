import React from "react";
import type { Metadata } from "next";
import { Hind_Siliguri, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const siliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-siliguri",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AmrCourse | বাংলাদেশের সেরা অনলাইন কোর্স",
  description: "AmrCourse - AI, Web Development, Video Editing, Figma ও Trading শিখুন বাংলায়।",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className={`${siliguri.variable} ${inter.variable}`}>
      <body className="font-siliguri antialiased">
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}