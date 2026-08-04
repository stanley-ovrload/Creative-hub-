"use client";

import { type Brand } from "@/lib/jobs";
import styles from "./filter-bar.module.css";

export type BrandFilter = "all" | Brand;

const FILTERS: { label: string; value: BrandFilter }[] = [
  { label: "all", value: "all" },
  { label: "ovrload", value: "Ovrload" },
  { label: "cloud", value: "Cloud" },
];

export default function FilterBar({
  active,
  onChange,
}: {
  active: BrandFilter;
  onChange: (value: BrandFilter) => void;
}) {
  return (
    <div className={styles.bar}>
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          type="button"
          className={`${styles.button} ${
            active === filter.value ? styles.active : ""
          }`}
          onClick={() => onChange(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
