import { Inter, Outfit, Fira_Code } from "next/font/google"; // Outfit for modern simple headings
import { Header, BottomNav } from "@/components/layout";
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
  themeColor: "#030303", // Modern Black
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
      className={cn("dark", inter.variable, outfit.variable, firaCode.variable)}
    >
      <body className="min-h-screen bg-background font-sans text-text-body antialiased selection:bg-white/20 selection:text-white">
        {/* PillNav Header */}
        <Header />

        {/* Main Content */}
        <main className="pb-24 pt-20 md:pb-8 md:pt-24">{children}</main>

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </body>
    </html>
  );
}
