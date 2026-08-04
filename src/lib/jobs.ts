export type Brand = "Ovrload" | "Cloud";

export type JobStatus = "queued" | "running" | "in-qc" | "done" | "hard-break";

export type Job = {
  id: string;
  brand: Brand;
  requestType: string;
  title: string;
  status: JobStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

// Seed shape: id/brand/requestType/title/status only — the store fills
// in userId/createdAt/updatedAt when it seeds the database.
export type JobSeed = Pick<
  Job,
  "id" | "brand" | "requestType" | "title" | "status"
>;

// requestType placeholder until the orchestrator classifies the brief.
export const PENDING_REQUEST_TYPE = "routing…";

export const STATUS_LABELS: Record<JobStatus, string> = {
  queued: "queued",
  running: "running",
  "in-qc": "in qc",
  done: "done",
  "hard-break": "hard break",
};

const TITLE_MAX_LENGTH = 60;

export function briefToTitle(brief: string): string {
  const collapsed = brief.trim().replace(/\s+/g, " ");
  if (collapsed.length <= TITLE_MAX_LENGTH) return collapsed;
  return `${collapsed.slice(0, TITLE_MAX_LENGTH - 1).trimEnd()}…`;
}

export const JOBS: JobSeed[] = [
  {
    id: "job-01",
    brand: "Ovrload",
    requestType: "Product shot",
    title: "Fall lookbook cover",
    status: "queued",
  },
  {
    id: "job-02",
    brand: "Cloud",
    requestType: "Video ad",
    title: "Onboarding explainer v3",
    status: "running",
  },
  {
    id: "job-03",
    brand: "Ovrload",
    requestType: "Social carousel",
    title: "Instagram launch pack",
    status: "running",
  },
  {
    id: "job-04",
    brand: "Cloud",
    requestType: "Copy variants",
    title: "Pricing page headlines",
    status: "in-qc",
  },
  {
    id: "job-05",
    brand: "Ovrload",
    requestType: "Voiceover",
    title: "Founder testimonial cut",
    status: "in-qc",
  },
  {
    id: "job-06",
    brand: "Cloud",
    requestType: "Landing page graphic",
    title: "Homepage hero banner",
    status: "done",
  },
  {
    id: "job-07",
    brand: "Ovrload",
    requestType: "UGC video",
    title: "TikTok hook v2",
    status: "done",
  },
  {
    id: "job-08",
    brand: "Cloud",
    requestType: "Image batch",
    title: "Email header set",
    status: "hard-break",
  },
  {
    id: "job-09",
    brand: "Ovrload",
    requestType: "Product shot",
    title: "Q3 catalog refresh",
    status: "hard-break",
  },
  {
    id: "job-10",
    brand: "Cloud",
    requestType: "Video ad",
    title: "Retargeting bumper set",
    status: "queued",
  },
];
