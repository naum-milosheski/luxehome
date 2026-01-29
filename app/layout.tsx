import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import FooterWrapper from "@/components/FooterWrapper";
import "./globals.css";

const urbanist = Urbanist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LuxeHome System",
  description: "Luxury Real Estate System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={urbanist.className}>
        {children}
        <FooterWrapper />
      </body>
    </html>
  );
}
