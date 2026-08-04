# Creative Hub — Orchestrator Spec

The orchestrator is the only agent the team talks to. It plans, routes, coordinates, and escalates — and does no domain work itself. It never writes copy, generates media, or runs QC. Keeping it a pure coordinator is what keeps the system debuggable. Build it stub-first: a full cast of fake specialist agents (each returns canned output) so the orchestrator's logic can be built and tested end-to-end before any real agent or integration exists.

## Where it lives + how it runs

- The orchestrator is a long-running worker process (not something in a chat or in Claude Code — those just write the code).
- Dev: runs locally while building/testing. Prod (later): runs on a small always-on cloud server so it works 24/7.
- The loop: check the queue → job waiting? → pick it up → run it (plan, dispatch, track) → mark done → look again. It never exits.

## Integration with the console

- Shared job store. The console and the worker read/write the same job store the console already uses. The console creates jobs; the worker updates their status; the board reflects it live.
- Language: TypeScript, same repo as the console, using the Claude Agent SDK (@anthropic-ai/claude-agent-sdk), so job types and the store are shared.

## Built for multiplayer from day one

Even single-player today (one user, one worker), the plumbing already assumes more than one of each — so scaling later is a config change, not a rewrite.

- **Every job carries a `userId`.** Hardcoded to `"me"` for now (no real auth yet), but it's a real column on every job row, so scoping the board to a real user later is a query filter, not a schema migration.
- **The queue lives in the store, not in worker memory.** Job state is durable in the shared store, not held in any worker process. That store is a local SQLite file today (`data/jobs.db`, WAL mode) — WAL specifically so reads (the console polling) aren't blocked by the worker's writes. It's built to be swappable to a hosted Postgres instance later via a connection string, without touching the worker loop or the console.
- **Atomic job claiming.** The worker claims the oldest queued job with one transaction — find the oldest queued row and mark it running as a single indivisible unit — so multiple worker processes pointed at the same store can never claim the same job. This is built and verified today, not aspirational.
- **Configurable via env vars, not hardcoded.** The DB path is currently hardcoded (`data/jobs.db` under the repo root) — that's a known gap, not the target state. As real config shows up (a Postgres connection string, ports, secrets), it should go through env vars from the start, so there's nothing to sweep later when moving off a single local file.
- **Every page assumes a logged-in user.** Auth today is one shared password for the whole team, not real accounts — but the UI and API should behave as though a real, distinct `userId` is always present, so swapping in real accounts later is an auth-provider change, not a rewrite of every page.

## The job object

`{ id, brand ("Ovrload" | "Cloud"), brief (free text), status, type, plan, steps[], outputs[], error?, createdAt, updatedAt }`

Statuses (match the console): queued → routing → running → in_qc → done / hard_break.

Type: starts "routing…", set by the orchestrator once classified.

## What the orchestrator does, per job

1. Pick up a queued job from the store.
2. Load brand context — the resolved brand's memory (voice, positioning, winners, competitor list, "never do this"). Everything downstream is scoped to this brand. (Stub: return a small canned brand object for now.)
3. Classify the brief into a request type (report / script / video / statics / broll / full_sweep). Set the job's type.
4. Extract parameters — pull structured inputs from the free text (competitors, counts, recency, aspect ratio, flavour, style, variants).
5. Compose the recipe — the ordered agent chain for that type (see below).
6. Dispatch each step as a sub-agent with brand context + step inputs + scoped tools; sequential, or parallel where steps are independent.
7. Track state — feed each output into the next step, update job status on the board at each stage.
8. Handle failure — unrecoverable error / QC retries exhausted / spend cap → mark hard_break, call the Messenger. Escalate, don't improvise.
9. Close out — mark done; ensure the Organizer's output link shows in the console.

## Recipe library (fixed, keyed to type)

Start with a fixed recipe map — predictable and testable. Add free-form planning later only for novel compound requests.

- report: sourcing → breakdown (report mode) → docs
- script: script writer
- statics: static gen → QC → organizer
- broll: planner (light) → broll gen → QC → organizer
- video: planner → video gen → QC → organizer
- full_sweep: sourcing → breakdown ×2 → script writer → (per script) planner → video gen → QC → organizer

QC → generator is a retry loop: on fail, re-dispatch the generator with notes, up to a retry limit; exceed it → hard_break.

## Three baked-in behaviours (defaults chosen — override if you disagree)

1. Ambiguous briefs → classify with a confidence check. If confident and inputs are sufficient, run. If genuinely unsure, post one clarifying question back to the requester in the console rather than guess. Default: confidence-gated, one question max.
2. Missing parameters → brand-memory defaults for low-stakes, ask for high-stakes. Low-stakes (aspect ratio, count) fall back to brand defaults; high-stakes (which competitors, spend-heavy scope) prompt. Default: defaults where safe, ask where costly.
3. Fixed recipes, not free planning (to start). Pick from the recipe map above so behaviour is trustable and testable. Free composition comes later.

## Stub-first build order

1. Worker loop + queue. Poll the shared store for queued jobs, pick one, mark running, then done. No brain yet — prove the loop drives the console board.
2. Stub specialist agents. One stub per agent (sourcing, breakdown, script writer, planner, video gen, static gen, broll gen, QC, organizer, messenger). Each takes inputs, waits briefly, returns canned output. QC stub can randomly fail to exercise the retry loop.
3. Classification + planning. Agent SDK: brief + brand → resolved type + a plan (ordered steps with inputs). Flip "routing…" to the resolved type. Test against sample briefs.
4. Dispatch + tracking. Run the planned chain against the stubs, feed output→input, update status per step, handle the QC pass/fail branch.
5. Failure + escalation. Hard-break handling → stub Messenger logs an "email". Confirms the escalation path end to end.

After step 5 you have a working orchestrator driving fake jobs across the real console. Then swap stubs for real agents one at a time.

## Tech notes

- Model tier: high-reasoning model for classification/planning; the loop/plumbing needs no model.
- No domain work in the orchestrator — every specialist action goes through a (stub, later real) sub-agent.
- Idempotency: a job that restarts mid-run shouldn't double-charge or double-post; track step completion on the job.
