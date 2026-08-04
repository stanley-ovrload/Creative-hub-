import { claimOldestQueuedJob, updateJobStatus } from "../lib/job-queue";

const POLL_INTERVAL_MS = 1500;
const WORK_DURATION_MS = 2000;

function log(message: string): void {
  console.log(`[worker] ${new Date().toISOString()} ${message}`);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runLoop(): Promise<void> {
  log("started, polling for queued jobs...");

  while (true) {
    const job = claimOldestQueuedJob();

    if (!job) {
      await sleep(POLL_INTERVAL_MS);
      continue;
    }

    log(`claimed ${job.id} ("${job.title}") — queued -> running`);

    await sleep(WORK_DURATION_MS);

    log(`finished ${job.id} — running -> done`);
    updateJobStatus(job.id, "done");
  }
}

runLoop();
