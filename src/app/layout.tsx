import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pertamina Cabang Bandung - Melayani Kebutuhan Energi Masyarakat",
  description: "Pertamina Cabang Bandung berkomitmen melayani kebutuhan energi masyarakat Bandung dan sekitarnya dengan standar kualitas dan pelayanan terbaik.",
  keywords: "Pertamina, Bandung, BBM, LPG, SPBU, energi, bahan bakar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
