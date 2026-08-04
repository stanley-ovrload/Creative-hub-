import { classifyBrief } from "../lib/classifier";
import {
  claimOldestQueuedJob,
  updateJobClassification,
  updateJobStatus,
} from "../lib/job-queue";
import { PENDING_REQUEST_TYPE } from "../lib/jobs";

// Next.js auto-loads .env for the console; this script doesn't, so load it
// here too — otherwise DATABASE_PATH/ANTHROPIC_API_KEY could differ between
// the worker and the console.
try {
  process.loadEnvFile();
} catch {
  // no .env file — fine, defaults / ambient env vars apply.
}

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

    if (job.requestType === PENDING_REQUEST_TYPE) {
      try {
        const { type, reasoning, plan } = await classifyBrief(
          job.brand,
          job.brief,
        );
        updateJobClassification(job.id, type, plan);
        log(`classified ${job.id} as "${type}" — ${reasoning}`);
        log(`plan for ${job.id}: ${plan.join(" -> ")}`);
      } catch (error) {
        log(
          `classification failed for ${job.id}: ${(error as Error).message}`,
        );
      }
    } else {
      // Seed/mock job with a pre-set type — nothing to classify.
      await sleep(WORK_DURATION_MS);
    }

    log(`finished ${job.id} — running -> done`);
    updateJobStatus(job.id, "done");
  }
}

runLoop();
