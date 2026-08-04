import BrandTag from "@/components/job-board/brand-tag";
import { type Job } from "@/lib/jobs";
import styles from "./output-card.module.css";

export default function OutputCard({ job }: { job: Job }) {
  return (
    <article className={styles.card}>
      <BrandTag brand={job.brand} />
      <h2 className={styles.title}>{job.title}</h2>
      <p className={styles.type}>{job.requestType}</p>
      <button type="button" className={styles.download}>
        Download
      </button>
    </article>
  );
}
