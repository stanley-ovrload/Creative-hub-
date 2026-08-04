"use client";

import { useMemo, useState } from "react";
import BrandTag from "@/components/job-board/brand-tag";
import FilterBar, { type BrandFilter } from "@/components/job-board/filter-bar";
import StatusPill from "@/components/job-board/status-pill";
import { useJobs } from "@/lib/job-store";
import styles from "./page.module.css";

export default function JobBoardPage() {
  const { jobs: allJobs } = useJobs();
  const [filter, setFilter] = useState<BrandFilter>("all");

  const jobs = useMemo(
    () =>
      filter === "all" ? allJobs : allJobs.filter((job) => job.brand === filter),
    [allJobs, filter],
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Job board</h1>
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
              <td className={`${styles.td} ${styles.muted}`}>
                {job.requestType}
              </td>
              <td className={styles.td}>{job.title}</td>
              <td className={styles.td}>
                <StatusPill status={job.status} />
              </td>
              <td className={`${styles.td} ${styles.muted} ${styles.timeCol}`}>
                {job.time}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
