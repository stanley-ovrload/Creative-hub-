import fs from "fs";
import path from "path";
import Database from "better-sqlite3";
import {
  JOBS as SEED_JOBS,
  type Brand,
  type Job,
  type JobStatus,
  type RecipeType,
} from "./jobs";

type JobRow = Omit<Job, "plan"> & { plan: string | null };

let db: Database.Database | null = null;

function getDbPath(): string {
  return path.resolve(process.cwd(), process.env.DATABASE_PATH ?? "data/jobs.db");
}

function ensureColumn(
  instance: Database.Database,
  column: string,
  definition: string,
): void {
  const columns = instance.prepare("PRAGMA table_info(jobs)").all() as {
    name: string;
  }[];
  if (!columns.some((c) => c.name === column)) {
    instance.exec(`ALTER TABLE jobs ADD COLUMN ${column} ${definition}`);
  }
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
      brief TEXT NOT NULL DEFAULT '',
      plan TEXT,
      status TEXT NOT NULL,
      userId TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);

  // Defensive migration for a data/jobs.db created before brief/plan existed.
  ensureColumn(instance, "brief", "TEXT NOT NULL DEFAULT ''");
  ensureColumn(instance, "plan", "TEXT");

  const { count } = instance
    .prepare("SELECT COUNT(*) AS count FROM jobs")
    .get() as { count: number };

  if (count === 0) seed(instance);

  db = instance;
  return instance;
}

function seed(instance: Database.Database): void {
  const insert = instance.prepare(`
    INSERT INTO jobs (id, brand, requestType, title, brief, plan, status, userId, createdAt, updatedAt)
    VALUES (@id, @brand, @requestType, @title, @brief, @plan, @status, @userId, @createdAt, @updatedAt)
  `);

  const insertAll = instance.transaction((seeds: typeof SEED_JOBS) => {
    const now = Date.now();
    seeds.forEach((job, index) => {
      // Space seeds a minute apart, oldest last, so createdAt ordering
      // is meaningful from the first run.
      const createdAt = new Date(now - (index + 1) * 60_000).toISOString();
      insert.run({
        ...job,
        brief: job.title,
        plan: null,
        userId: "me",
        createdAt,
        updatedAt: createdAt,
      });
    });
  });

  insertAll(SEED_JOBS);
}

function rowToJob(row: JobRow): Job {
  return { ...row, plan: row.plan ? JSON.parse(row.plan) : null };
}

export function listJobs(): Job[] {
  const rows = getDb()
    .prepare("SELECT * FROM jobs ORDER BY createdAt DESC")
    .all() as JobRow[];
  return rows.map(rowToJob);
}

export function createJob(input: {
  brand: Brand;
  requestType: string;
  title: string;
  brief: string;
  userId?: string;
}): Job {
  const instance = getDb();
  const now = new Date().toISOString();
  const job: Job = {
    id: `job-${crypto.randomUUID()}`,
    brand: input.brand,
    requestType: input.requestType,
    title: input.title,
    brief: input.brief,
    plan: null,
    status: "queued",
    userId: input.userId ?? "me",
    createdAt: now,
    updatedAt: now,
  };

  instance
    .prepare(
      `INSERT INTO jobs (id, brand, requestType, title, brief, plan, status, userId, createdAt, updatedAt)
       VALUES (@id, @brand, @requestType, @title, @brief, @plan, @status, @userId, @createdAt, @updatedAt)`,
    )
    .run({ ...job, plan: null });

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

    return rowToJob({ ...row, status: "running", updatedAt: now });
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

/** Flips requestType from "routing…" to the classified type and stores the plan. */
export function updateJobClassification(
  id: string,
  requestType: RecipeType,
  plan: string[],
): void {
  const instance = getDb();
  const now = new Date().toISOString();
  const info = instance
    .prepare(
      "UPDATE jobs SET requestType = ?, plan = ?, updatedAt = ? WHERE id = ?",
    )
    .run(requestType, JSON.stringify(plan), now, id);

  if (info.changes === 0) {
    throw new Error(`updateJobClassification: no job found with id ${id}`);
  }
}
