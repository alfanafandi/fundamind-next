import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Fundamind - Learn Math Through Adventure",
  description:
    "Educational gamification platform for learning mathematics through quests, challenges, and boss battles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Navbar />
        <main className="pt-14 min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900">
          {children}
        </main>
      </body>
    </html>
  );
}
