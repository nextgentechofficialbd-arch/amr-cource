import React from "react";
import type { Metadata } from "next";
import { Hind_Siliguri, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

// Configure Bengali and Latin fonts
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
  title: "AmrCourse | বাংলাদেশের সেরা অনলাইন কোর্স প্ল্যাটফর্ম",
  description: "AmrCourse - AI, Web Development, Video Editing, Figma, Trading কোর্স শিখুন বাংলায়। দক্ষতাই হবে আপনার আগামীর শক্তি।",
  keywords: ["online course bangladesh", "bangla course", "amrcourse", "learn programming bangla", "bKash course"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className={`${siliguri.variable} ${inter.variable}`}>
      <body className="font-siliguri antialiased bg-[#0F172A] text-white min-h-screen selection:bg-blue-600/30">
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1E293B',
              color: '#fff',
              border: '1px solid #334155'
            },
          }}
        />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}