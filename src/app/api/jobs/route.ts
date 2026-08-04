import { NextResponse } from "next/server";
import { createJob, listJobs } from "@/lib/job-queue";
import { briefToTitle, PENDING_REQUEST_TYPE, type Brand } from "@/lib/jobs";

export async function GET() {
  return NextResponse.json(listJobs());
}

export async function POST(request: Request) {
  const body = await request.json();
  const brand: Brand | undefined = body.brand;
  const brief: string | undefined = body.brief;

  if (brand !== "Ovrload" && brand !== "Cloud") {
    return NextResponse.json({ error: "brand must be Ovrload or Cloud" }, { status: 400 });
  }
  if (typeof brief !== "string" || !brief.trim()) {
    return NextResponse.json({ error: "brief is required" }, { status: 400 });
  }

  const job = createJob({
    brand,
    requestType: PENDING_REQUEST_TYPE,
    title: briefToTitle(brief),
  });

  return NextResponse.json(job, { status: 201 });
}
