import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

export const metadata: Metadata = {
  title: "HARIZEN AI | Next Generation Intelligent System",
  description: "Experience the next generation of artificial intelligence with Harizen AI. A cinematic, interactive AI chatbot developed by Harish Yuvaraj.",
  authors: [{ name: "Harish Yuvaraj" }],
  keywords: ["futuristic AI website", "cinematic web design", "scroll animation", "robot interaction UI", "AI chatbot"],
};

export const viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${inter.variable} ${orbitron.variable} antialiased bg-black text-white`}
      >
        {children}
      </body>
    </html>
  );
}
