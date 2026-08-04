"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { JOBS as SEED_JOBS, type Brand, type Job } from "./jobs";

type NewJobInput = {
  brand: Brand;
  requestType: string;
  title: string;
};

type JobsContextValue = {
  jobs: Job[];
  addJob: (input: NewJobInput) => void;
};

const JobsContext = createContext<JobsContextValue | null>(null);

let nextJobId = SEED_JOBS.length + 1;

export function JobsProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(SEED_JOBS);

  const addJob = ({ brand, requestType, title }: NewJobInput) => {
    const job: Job = {
      id: `job-${nextJobId++}`,
      brand,
      requestType,
      title,
      status: "queued",
      time: "Just now",
    };
    setJobs((prev) => [job, ...prev]);
  };

  const value = useMemo(() => ({ jobs, addJob }), [jobs]);

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
}

export function useJobs() {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error("useJobs must be used within a JobsProvider");
  }
  return context;
}
