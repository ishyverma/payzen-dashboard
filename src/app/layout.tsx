import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const DESC =
  "Payzen is a crypto trading dashboard: live Bitcoin, Ethereum, Solana, Quant and Litecoin prices, interactive charts, one-tap buy, sell and swap, and a sortable market table.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "Payzen — Crypto Trading Dashboard", template: "%s | Payzen" },
  description: DESC,
  applicationName: "Payzen",
  keywords: ["crypto dashboard", "bitcoin price", "buy crypto", "swap crypto", "crypto portfolio", "Payzen"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: SITE, siteName: "Payzen", title: "Payzen — Crypto Trading Dashboard", description: DESC },
  twitter: { card: "summary_large_image", title: "Payzen — Crypto Trading Dashboard", description: DESC },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f6" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0c" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only rounded-lg bg-ink px-3.5 py-2 text-sm font-medium text-canvas focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100]"
          >
            Skip to main content
          </a>
          <TooltipProvider delay={300}>{children}</TooltipProvider>
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
