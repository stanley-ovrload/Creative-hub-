import fs from "fs";
import path from "path";
import { JOBS as SEED_JOBS, type Job, type JobStatus } from "./jobs";

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "jobs.json");

function jobIdSequence(job: Job): number {
  const match = job.id.match(/(\d+)$/);
  return match ? Number(match[1]) : 0;
}

function ensureStore(): void {
  if (fs.existsSync(STORE_PATH)) return;
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(SEED_JOBS, null, 2));
}

function readJobs(): Job[] {
  ensureStore();
  return JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
}

function writeJobs(jobs: Job[]): void {
  fs.writeFileSync(STORE_PATH, JSON.stringify(jobs, null, 2));
}

export function getOldestQueuedJob(): Job | undefined {
  const queued = readJobs().filter((job) => job.status === "queued");
  queued.sort((a, b) => jobIdSequence(a) - jobIdSequence(b));
  return queued[0];
}

export function updateJobStatus(id: string, status: JobStatus): void {
  const jobs = readJobs();
  const job = jobs.find((candidate) => candidate.id === id);
  if (!job) throw new Error(`updateJobStatus: no job found with id ${id}`);
  job.status = status;
  writeJobs(jobs);
}
