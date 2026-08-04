"use client";

import OutputCard from "@/components/outputs/output-card";
import { useJobs } from "@/lib/job-store";
import styles from "./page.module.css";

export default function OutputsPage() {
  const { jobs } = useJobs();
  const doneJobs = jobs.filter((job) => job.status === "done");

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Outputs</h1>

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
