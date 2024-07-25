import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DebugButton from "@/utils/DebugButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BudgetMe",
  description: "Website for tracking and budgeting",
};

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </head>
      <body className={inter.className}>
        {children}

        <DebugButton />
      </body>
    </html>
  );
}
