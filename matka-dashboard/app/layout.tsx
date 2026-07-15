import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Satta Matka-Dpboss | India",
  description: "Live Satta Matka results, jodi and panel charts — SattaMatka-Dpboss.in and SattaMatkaDpboss.Mobi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-black">{children}</body>
    </html>
  );
}
