import { STATUS_LABELS, type JobStatus } from "@/lib/jobs";
import styles from "./status-pill.module.css";

const STATUS_CLASS: Record<JobStatus, string> = {
  queued: styles.queued,
  running: styles.running,
  "in-qc": styles.inQc,
  done: styles.done,
  "hard-break": styles.hardBreak,
};

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8.5L6.2 11.7L13 4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 1.5L15 14H1L8 1.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <line x1="8" y1="6" x2="8" y2="9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="8" cy="11.7" r="0.9" fill="currentColor" />
    </svg>
  );
}

export default function StatusPill({ status }: { status: JobStatus }) {
  return (
    <span className={`${styles.pill} ${STATUS_CLASS[status]}`}>
      {status === "done" && <CheckIcon />}
      {status === "hard-break" && <AlertIcon />}
      {STATUS_LABELS[status]}
    </span>
  );
}
