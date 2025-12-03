import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "NYE Bash - New Year's Eve Events & Celebrations",
  description: "Join the ultimate New Year's Eve celebrations. Book tickets for exclusive NYE parties, events, and experiences to ring in the new year in style.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.className} antialiased`}
      >
        {children}
         <Analytics />
      </body>
    </html>
  );
}
