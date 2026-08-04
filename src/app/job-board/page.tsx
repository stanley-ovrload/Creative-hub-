"use client";

import { useEffect, useMemo, useState } from "react";
import BrandTag from "@/components/job-board/brand-tag";
import FilterBar, { type BrandFilter } from "@/components/job-board/filter-bar";
import StatusPill from "@/components/job-board/status-pill";
import { formatRelativeTime } from "@/lib/format-time";
import { PENDING_REQUEST_TYPE, type Job } from "@/lib/jobs";
import styles from "./page.module.css";

const POLL_INTERVAL_MS = 2000;

export default function JobBoardPage() {
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [filter, setFilter] = useState<BrandFilter>("all");

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      const res = await fetch("/api/jobs");
      if (!res.ok || cancelled) return;
      const jobs: Job[] = await res.json();
      if (!cancelled) setAllJobs(jobs);
    }

    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const jobs = useMemo(
    () =>
      filter === "all" ? allJobs : allJobs.filter((job) => job.brand === filter),
    [allJobs, filter],
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>job board</h1>
        <FilterBar active={filter} onChange={setFilter} />
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Brand</th>
            <th className={styles.th}>Request type</th>
            <th className={styles.th}>Title</th>
            <th className={styles.th}>Status</th>
            <th className={`${styles.th} ${styles.timeCol}`}>Time</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id} className={styles.row}>
              <td className={styles.td}>
                <BrandTag brand={job.brand} />
              </td>
              <td
                className={`${styles.td} ${
                  job.requestType === PENDING_REQUEST_TYPE
                    ? styles.pending
                    : styles.muted
                }`}
              >
                {job.requestType}
              </td>
              <td className={styles.td}>{job.title}</td>
              <td className={styles.td}>
                <StatusPill status={job.status} />
              </td>
              <td className={`${styles.td} ${styles.muted} ${styles.timeCol}`}>
                {formatRelativeTime(job.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
