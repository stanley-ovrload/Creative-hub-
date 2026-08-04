"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BrandMemoryIcon,
  JobBoardIcon,
  NewRequestIcon,
  OutputsIcon,
} from "./nav-icons";
import styles from "./sidebar.module.css";

const NAV_ITEMS = [
  { label: "new request", href: "/new-request", Icon: NewRequestIcon },
  { label: "job board", href: "/job-board", Icon: JobBoardIcon },
  { label: "outputs", href: "/outputs", Icon: OutputsIcon },
  { label: "brand memory", href: "/brand-memory", Icon: BrandMemoryIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.logoMark} aria-hidden="true" />
        <span className={styles.wordmark}>creative hub</span>
      </div>

      <nav className={styles.nav}>
        <ul className={styles.list}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`${styles.link} ${isActive ? styles.active : ""}`}
                >
                  <item.Icon />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
