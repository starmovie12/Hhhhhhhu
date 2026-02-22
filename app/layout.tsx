import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WatchlistProvider } from "../context/WatchlistContext";
import { ToastProvider } from "../context/ToastContext";
import { NetworkStatus } from "../components/NetworkStatus";

const inter = Inter({ subsets: ["latin"], weight: ["400","500","600","700","800","900"] });

export const metadata: Metadata = {
  title: "MFLIX - Cinema. Redefined.",
  description: "Premium HD movie streaming. Better than Netflix.",
  manifest: "/manifest.json",
  themeColor: "#030812",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WatchlistProvider>
          <ToastProvider>
            <NetworkStatus />
            {children}
          </ToastProvider>
        </WatchlistProvider>
      </body>
    </html>
  );
}
