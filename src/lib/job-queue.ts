import fs from "fs";
import path from "path";
import Database from "better-sqlite3";
import { JOBS as SEED_JOBS, type Brand, type Job, type JobStatus } from "./jobs";

type JobRow = Job;

let db: Database.Database | null = null;

function getDbPath(): string {
  return path.resolve(process.cwd(), process.env.DATABASE_PATH ?? "data/jobs.db");
}

function getDb(): Database.Database {
  if (db) return db;

  const dbPath = getDbPath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  const instance = new Database(dbPath);
  instance.pragma("journal_mode = WAL");

  instance.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      brand TEXT NOT NULL,
      requestType TEXT NOT NULL,
      title TEXT NOT NULL,
      status TEXT NOT NULL,
      userId TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);

  const { count } = instance
    .prepare("SELECT COUNT(*) AS count FROM jobs")
    .get() as { count: number };

  if (count === 0) seed(instance);

  db = instance;
  return instance;
}

function seed(instance: Database.Database): void {
  const insert = instance.prepare(`
    INSERT INTO jobs (id, brand, requestType, title, status, userId, createdAt, updatedAt)
    VALUES (@id, @brand, @requestType, @title, @status, @userId, @createdAt, @updatedAt)
  `);

  const insertAll = instance.transaction((seeds: typeof SEED_JOBS) => {
    const now = Date.now();
    seeds.forEach((job, index) => {
      // Space seeds a minute apart, oldest last, so createdAt ordering
      // is meaningful from the first run.
      const createdAt = new Date(now - (index + 1) * 60_000).toISOString();
      insert.run({ ...job, userId: "me", createdAt, updatedAt: createdAt });
    });
  });

  insertAll(SEED_JOBS);
}

export function listJobs(): Job[] {
  return getDb()
    .prepare("SELECT * FROM jobs ORDER BY createdAt DESC")
    .all() as JobRow[];
}

export function createJob(input: {
  brand: Brand;
  requestType: string;
  title: string;
  userId?: string;
}): Job {
  const instance = getDb();
  const now = new Date().toISOString();
  const job: Job = {
    id: `job-${crypto.randomUUID()}`,
    brand: input.brand,
    requestType: input.requestType,
    title: input.title,
    status: "queued",
    userId: input.userId ?? "me",
    createdAt: now,
    updatedAt: now,
  };

  instance
    .prepare(
      `INSERT INTO jobs (id, brand, requestType, title, status, userId, createdAt, updatedAt)
       VALUES (@id, @brand, @requestType, @title, @status, @userId, @createdAt, @updatedAt)`,
    )
    .run(job);

  return job;
}

/**
 * Atomically claims the oldest queued job (SELECT + UPDATE inside one
 * SQLite transaction), so concurrent workers can never claim the same job.
 */
export function claimOldestQueuedJob(): Job | undefined {
  const instance = getDb();
  const now = new Date().toISOString();

  const claim = instance.transaction((): Job | undefined => {
    const row = instance
      .prepare(
        "SELECT * FROM jobs WHERE status = 'queued' ORDER BY createdAt ASC LIMIT 1",
      )
      .get() as JobRow | undefined;

    if (!row) return undefined;

    instance
      .prepare("UPDATE jobs SET status = 'running', updatedAt = ? WHERE id = ?")
      .run(now, row.id);

    return { ...row, status: "running", updatedAt: now };
  });

  return claim();
}

export function updateJobStatus(id: string, status: JobStatus): void {
  const instance = getDb();
  const now = new Date().toISOString();
  const info = instance
    .prepare("UPDATE jobs SET status = ?, updatedAt = ? WHERE id = ?")
    .run(status, now, id);

  if (info.changes === 0) {
    throw new Error(`updateJobStatus: no job found with id ${id}`);
  }
}
