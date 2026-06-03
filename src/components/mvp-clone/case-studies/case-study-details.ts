import type { ProjectStatus } from "./data";
import { CASE_STUDY_ASSETS } from "./data";

export type CaseStudyDetail = {
  slug: string;
  title: string;
  stats: string;
  parallel: string;
  status: ProjectStatus;
  statusLabel: string;
  image?: string;
  overview: string;
  challenge: string;
  approach: string[];
  outcomes: { label: string; value: string }[];
  stack: string[];
  proofLine: string;
};

export const caseStudyDetails: Record<string, CaseStudyDetail> = {
  finden: {
    slug: "finden",
    title: "Finden AI",
    stats: "#3 Product of the Day · Product Hunt",
    parallel: "Controlled AI on real-world data — production discipline, not demo wrappers.",
    status: "shipped",
    statusLabel: "Shipped",
    image: `${CASE_STUDY_ASSETS}/findenn.png`,
    overview:
      "Finden is a production AI product that ranked #3 Product of the Day on Product Hunt — ahead of Vercel v0 — because the team optimized for real-world data control, not demo-grade wrappers.",
    challenge:
      "Generic AI stacks break when data is messy, permissions are strict, and partners need auditability. The product had to feel fast for users while keeping firm-grade boundaries on every AI step.",
    approach: [
      "Mapped data flows and approval boundaries before model integration — logic before code.",
      "Bounded AI calls with explicit spend and scope caps wired into the architecture.",
      "Shipped a senior-only build path with partner-visible gates on client-facing outputs.",
      "Tuned for production observability — not a pilot that stalls after launch week.",
    ],
    outcomes: [
      { label: "Product Hunt", value: "#3 Product of the Day" },
      { label: "Positioning", value: "Ahead of Vercel v0 launch week" },
      { label: "Delivery", value: "Production system — not a slide deck" },
      { label: "Discipline", value: "Real-world data control" },
    ],
    stack: ["Controlled AI", "Production web app", "Partner approval gates", "Spend caps"],
    proofLine: "Proof that Bekur ships production AI — ranked on Product Hunt against global tools.",
  },
  "bekur-hms": {
    slug: "bekur-hms",
    title: "Enterprise HRMS",
    stats: "Multi-tenant operations · role-based workflows",
    parallel:
      "Complex approval logic and tenant rules — the same class of problem as firm SOP automation.",
    status: "shipped",
    statusLabel: "Shipped",
    image: `${CASE_STUDY_ASSETS}/omniHr.png`,
    overview:
      "A multi-tenant HRMS with role-based workflows, tenant isolation, and approval chains that mirror how professional firms actually govern sensitive operations.",
    challenge:
      "HR and operations teams needed one system for tenants, roles, and approvals — without ripping out how each unit already worked or creating silent permission holes.",
    approach: [
      "Documented tenant rules and approval trees as the source of truth before build.",
      "Implemented role-based access and workflow states with explicit handoff points.",
      "Designed for multi-tenant scale — isolated data, shared platform economics.",
      "Delivered handoff documentation and admin walkthroughs for operational owners.",
    ],
    outcomes: [
      { label: "Tenancy", value: "Multi-tenant platform" },
      { label: "Governance", value: "Role-based approvals" },
      { label: "Pattern", value: "SOP-grade workflow logic" },
      { label: "Fit", value: "Enterprise operations" },
    ],
    stack: ["Multi-tenant SaaS", "RBAC", "Workflow engine", "Admin ops"],
    proofLine: "Same workflow discipline we bring to Automation Sprints — complex rules, fixed scope.",
  },
  tatariai: {
    slug: "tatariai",
    title: "TatariAI",
    stats: "Project management for software dev agencies",
    parallel: "Operational workflows for service teams — handoffs, status, and delivery ops at scale.",
    status: "shipped",
    statusLabel: "Shipped",
    image: `${CASE_STUDY_ASSETS}/tatariAi.png`,
    overview:
      "TatariAI helps software agencies run delivery ops — status, handoffs, and project visibility — without forcing a generic template that ignores how agencies actually ship.",
    challenge:
      "Agencies lose margin when delivery status lives in scattered tools and partners chase updates manually. The product had to match agency delivery logic, not a horizontal PM template.",
    approach: [
      "Mapped agency delivery stages and handoff triggers with operator input first.",
      "Built status and assignment flows into one operational surface.",
      "Reduced manual chase with automated state transitions where logic was stable.",
      "Kept scope fixed per release — no endless feature sprawl.",
    ],
    outcomes: [
      { label: "Users", value: "Software agency teams" },
      { label: "Value", value: "Delivery visibility" },
      { label: "Pattern", value: "Handoff automation" },
      { label: "Outcome", value: "Less admin drag" },
    ],
    stack: ["Agency PM", "Workflow status", "Team handoffs", "SaaS"],
    proofLine: "Operational software for service teams — the same pain profile as professional firms.",
  },
  "lead-engine": {
    slug: "lead-engine",
    title: "Lead gen engine",
    stats: "Internal · Sprint zero · Bekur GTM automation",
    parallel:
      "We're running the Automation Sprint on our own stack first — logic map to go-live.",
    status: "in-build",
    statusLabel: "In build",
    overview:
      "Bekur's internal GTM automation — the same Logic Mapping → fixed-scope build → partner gates process we run for clients, applied to our own lead engine before we scale it outward.",
    challenge:
      "Outbound and qualification logic for professional firms can't be a generic CRM sequence. We needed one workflow that respects ICP fit, partner-led sales, and hard caps on AI spend — dogfooding the sprint model.",
    approach: [
      "Logic map for ICP, triggers, and handoff points before any integration work.",
      "Fixed-scope sprint with written AI cap — same contract structure as client engagements.",
      "Partner approval on client-facing messaging and outbound steps.",
      "Measure pipeline quality, not vanity sends — aligned to 90-day ROI thinking.",
    ],
    outcomes: [
      { label: "Status", value: "In build" },
      { label: "Scope", value: "Sprint zero · internal" },
      { label: "Model", value: "Dogfooding Automation Sprint" },
      { label: "Gate", value: "Logic map → go-live" },
    ],
    stack: ["GTM automation", "ICP logic", "Hard AI cap", "Internal sprint"],
    proofLine:
      "We run the same playbook on ourselves first — you'll see the discipline before we touch your workflow.",
  },
};

export function getCaseStudyDetail(slug: string): CaseStudyDetail | undefined {
  return caseStudyDetails[slug];
}

export const caseStudySlugs = Object.keys(caseStudyDetails);
