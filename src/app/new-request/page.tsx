"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import OptionSelector from "@/components/new-request/option-selector";
import { type Brand } from "@/lib/jobs";
import styles from "./page.module.css";

const BRAND_OPTIONS: { label: string; value: Brand }[] = [
  { label: "ovrload", value: "Ovrload" },
  { label: "cloud", value: "Cloud" },
];

export default function NewRequestPage() {
  const router = useRouter();
  const [brand, setBrand] = useState<Brand>("Ovrload");
  const [brief, setBrief] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = brief.trim().length > 0 && !submitting;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brand, brief }),
    });

    if (!res.ok) {
      setSubmitting(false);
      setError("couldn't submit that request — try again.");
      return;
    }

    router.push("/job-board");
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>new request</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <span className={styles.label}>brand</span>
          <OptionSelector
            options={BRAND_OPTIONS}
            value={brand}
            onChange={setBrand}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="brief">
            brief
          </label>
          <textarea
            id="brief"
            className={styles.textarea}
            placeholder="Describe what you need…"
            value={brief}
            onChange={(event) => setBrief(event.target.value)}
            rows={8}
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.submit} disabled={!canSubmit}>
          submit request <span aria-hidden="true">→</span>
        </button>
      </form>
    </div>
  );
}
