import { STATUS_LABELS, type JobStatus } from "@/lib/jobs";
import styles from "./status-pill.module.css";

const STATUS_CLASS: Record<JobStatus, string> = {
  queued: styles.queued,
  running: styles.running,
  "in-qc": styles.inQc,
  done: styles.done,
  "hard-break": styles.hardBreak,
};

export default function StatusPill({ status }: { status: JobStatus }) {
  return (
    <span className={`${styles.pill} ${STATUS_CLASS[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
