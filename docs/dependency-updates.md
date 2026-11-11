# Dependency updates and incremental security fixes

Renovate can open updates at any time, including major updates. Non-major
updates and daily lockfile maintenance can automerge after successful checks.
Security alerts inherit the same non-major automerge policy; major updates
remain available for review. The concurrent PR limit remains 20.

The `Security Audit` job runs on PRs, main pushes, the daily schedule, and manual
dispatch. Only the audit command is advisory on PRs: existing advisories must
not block individual dependency improvements. Installation errors still fail.
Builds, lint, unit tests, Playwright, and CodeQL keep their existing behavior.

Audit output is saved as the `security-audit` artifact for 14 days, and the job
summary records the actual audit outcome. Main, daily, and manual audit runs
still fail for moderate-or-higher findings. A green PR audit job means the
advisory scan completed, not that the dependency tree has no vulnerabilities.
Run `npm run security:audit` locally for the strict audit.

On November 11, 2026, the Wrangler PR's unit tests passed while its security
audit failed. Other unrelated Renovate PRs and the scheduled main audit also
failed. A local `npm audit --json` reported 11 moderate affected packages and
no high or critical findings, through glob/minimatch and the OpenNext/ESLint
dependency chains. This is a snapshot; audit results change over time.

Resolve those findings in focused dependency PRs, reviewing the report after
each merge. Prefer compatible upstream updates, then targeted transitive
updates after checking compatibility. Handle major migrations separately.
Do not use `npm audit fix --force` to force a clean report: the observed audit
suggested downgrading `@opennextjs/cloudflare` to 0.3.0 for one dependency chain.
No advisories are allowlisted or hidden by this policy change.
