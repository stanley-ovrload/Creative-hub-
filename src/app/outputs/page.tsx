"use client";

import { useEffect, useState } from "react";
import OutputCard from "@/components/outputs/output-card";
import { type Job } from "@/lib/jobs";
import styles from "./page.module.css";

const POLL_INTERVAL_MS = 2000;

export default function OutputsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      const res = await fetch("/api/jobs");
      if (!res.ok || cancelled) return;
      const data: Job[] = await res.json();
      if (!cancelled) setJobs(data);
    }

    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const doneJobs = jobs.filter((job) => job.status === "done");

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>outputs</h1>

      {doneJobs.length === 0 ? (
        <p className={styles.empty}>No completed jobs yet.</p>
      ) : (
        <div className={styles.grid}>
          {doneJobs.map((job) => (
            <OutputCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
