"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import OptionSelector from "@/components/new-request/option-selector";
import { type Brand } from "@/lib/jobs";
import { useJobs } from "@/lib/job-store";
import styles from "./page.module.css";

const BRAND_OPTIONS: { label: string; value: Brand }[] = [
  { label: "Ovrload", value: "Ovrload" },
  { label: "Cloud", value: "Cloud" },
];

const REQUEST_TYPE_OPTIONS = [
  { label: "Report", value: "Report" },
  { label: "Script", value: "Script" },
  { label: "Video", value: "Video" },
  { label: "Statics", value: "Statics" },
  { label: "B-roll", value: "B-roll" },
];

const TITLE_MAX_LENGTH = 60;

function briefToTitle(brief: string) {
  const collapsed = brief.trim().replace(/\s+/g, " ");
  if (collapsed.length <= TITLE_MAX_LENGTH) return collapsed;
  return `${collapsed.slice(0, TITLE_MAX_LENGTH - 1).trimEnd()}…`;
}

export default function NewRequestPage() {
  const router = useRouter();
  const { addJob } = useJobs();
  const [brand, setBrand] = useState<Brand>("Ovrload");
  const [requestType, setRequestType] = useState(REQUEST_TYPE_OPTIONS[0].value);
  const [brief, setBrief] = useState("");

  const canSubmit = brief.trim().length > 0;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;

    addJob({
      brand,
      requestType,
      title: briefToTitle(brief),
    });

    router.push("/job-board");
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>New request</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <span className={styles.label}>Brand</span>
          <OptionSelector
            options={BRAND_OPTIONS}
            value={brand}
            onChange={setBrand}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Request type</span>
          <OptionSelector
            options={REQUEST_TYPE_OPTIONS}
            value={requestType}
            onChange={setRequestType}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="brief">
            Brief
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

        <button type="submit" className={styles.submit} disabled={!canSubmit}>
          Submit request
        </button>
      </form>
    </div>
  );
}
