import type { Metadata } from "next";
import Sidebar from "@/components/sidebar";
import TopBar from "@/components/top-bar";
import "./globals.css";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: "Creative Hub",
  description: "Creative Hub",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <div className={styles.shell}>
          <Sidebar />
          <div className={styles.content}>
            <TopBar />
            <main className={styles.main}>{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
