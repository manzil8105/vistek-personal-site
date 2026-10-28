import type { Metadata } from "next";
import { DM_Serif_Display, JetBrains_Mono, Syne } from "next/font/google";
import "./globals.css";
import CrtController from "@/components/CrtController";
import CustomCursor from "@/components/CustomCursor";

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MANZIL // RECORDS",
  description: "records log, computational experiments, writings and tactical engineering notes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSerifDisplay.variable} ${jetbrainsMono.variable} ${syne.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-[#030303] text-[#f3f4f6] ambient-grid selection:bg-[#ff007f] selection:text-white"
      >
        <CrtController />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
