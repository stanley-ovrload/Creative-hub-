"use client";

import styles from "./option-selector.module.css";

export default function OptionSelector<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className={styles.group}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`${styles.option} ${
            value === option.value ? styles.active : ""
          }`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
