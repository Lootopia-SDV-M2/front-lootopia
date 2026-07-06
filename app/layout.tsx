import type { Metadata, Viewport } from "next";
import { Inter, Outfit, Fira_Code } from "next/font/google";
import { Header, BottomNav, HealthCheck } from "@/components/layout";
import { PWAInstallButton } from "@/components/ui/PWAInstallButton";
import { ToastContainer } from "@/components/shared/ToastContainer";
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lootopia",
  description:
    "Explore, Loot, Conquer - La chasse au trésor nouvelle génération",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/favicon.png",
  },
  keywords: ["treasure hunt", "lootopia", "adventure", "map", "geocaching"],
  authors: [{ name: "Lootopia Team" }],
};

export const viewport: Viewport = {
  themeColor: "#faf8f4",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={cn(inter.variable, outfit.variable, firaCode.variable)}
    >
      <body className="noise-overlay relative min-h-screen bg-background font-sans text-text-body antialiased selection:bg-primary/20 selection:text-primary">
        {/* Backend health check */}
        <HealthCheck />

        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="pb-20 pt-16 md:pb-8 md:pt-16">{children}</main>

        {/* Mobile Bottom Navigation */}
        <BottomNav />

        {/* PWA Install Button */}
        <PWAInstallButton />

        {/* Global Toast Notifications */}
        <ToastContainer />
      </body>
    </html>
  );
}
