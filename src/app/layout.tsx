import type { Metadata } from "next";
import localFont from "next/font/local";
import { Figtree } from "next/font/google";
import Sidebar from "@/components/sidebar";
import "@/styles/tokens.css";
import "./globals.css";
import styles from "./layout.module.css";

const satoshi = localFont({
  src: [
    {
      path: "./fonts/satoshi/Satoshi-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/satoshi/Satoshi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/satoshi/Satoshi-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  title: "creative hub",
  description: "Internal marketing-agent console for Ovrload + Cloud.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${satoshi.variable} ${figtree.variable}`}>
      <body>
        <div className={styles.shell}>
          <Sidebar />
          <main className={styles.main}>
            <div className={styles.mainInner}>{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
