export type Brand = "Ovrload" | "Cloud";

export type JobStatus = "queued" | "running" | "in-qc" | "done" | "hard-break";

export type Job = {
  id: string;
  brand: Brand;
  requestType: string;
  title: string;
  status: JobStatus;
  time: string;
};

export const STATUS_LABELS: Record<JobStatus, string> = {
  queued: "Queued",
  running: "Running",
  "in-qc": "In QC",
  done: "Done",
  "hard-break": "Hard break",
};

export const JOBS: Job[] = [
  {
    id: "job-01",
    brand: "Ovrload",
    requestType: "Product shot",
    title: "Fall lookbook cover",
    status: "queued",
    time: "2m ago",
  },
  {
    id: "job-02",
    brand: "Cloud",
    requestType: "Video ad",
    title: "Onboarding explainer v3",
    status: "running",
    time: "6m ago",
  },
  {
    id: "job-03",
    brand: "Ovrload",
    requestType: "Social carousel",
    title: "Instagram launch pack",
    status: "running",
    time: "14m ago",
  },
  {
    id: "job-04",
    brand: "Cloud",
    requestType: "Copy variants",
    title: "Pricing page headlines",
    status: "in-qc",
    time: "22m ago",
  },
  {
    id: "job-05",
    brand: "Ovrload",
    requestType: "Voiceover",
    title: "Founder testimonial cut",
    status: "in-qc",
    time: "41m ago",
  },
  {
    id: "job-06",
    brand: "Cloud",
    requestType: "Landing page graphic",
    title: "Homepage hero banner",
    status: "done",
    time: "1h ago",
  },
  {
    id: "job-07",
    brand: "Ovrload",
    requestType: "UGC video",
    title: "TikTok hook v2",
    status: "done",
    time: "2h ago",
  },
  {
    id: "job-08",
    brand: "Cloud",
    requestType: "Image batch",
    title: "Email header set",
    status: "hard-break",
    time: "3h ago",
  },
  {
    id: "job-09",
    brand: "Ovrload",
    requestType: "Product shot",
    title: "Q3 catalog refresh",
    status: "hard-break",
    time: "5h ago",
  },
  {
    id: "job-10",
    brand: "Cloud",
    requestType: "Video ad",
    title: "Retargeting bumper set",
    status: "queued",
    time: "Yesterday",
  },
];
