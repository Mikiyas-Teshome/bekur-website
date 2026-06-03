export type ProjectStatus = "shipped" | "in-build";

export type CaseStudyItem = {
  id: number;
  slug: string;
  title: string;
  stats: string;
  parallel: string;
  status: ProjectStatus;
  statusLabel: string;
  image?: string;
  thumbnail?: string;
  href?: string;
};

export const CASE_STUDY_ASSETS = "/assets/case-studies";
export const CASE_STUDY_IMAGE_WIDTH = 2528;
export const CASE_STUDY_IMAGE_HEIGHT = 1696;
export const CASE_STUDY_HERO_SIZES =
  "(max-width: 768px) calc(100vw - 2.5rem), (max-width: 1280px) calc(100vw - 4rem), 720px";
export const CASE_STUDY_THUMB_SIZES = "80px";

export const caseStudies: CaseStudyItem[] = [
  {
    id: 13,
    slug: "finden",
    title: "Finden AI",
    stats: "#3 Product of the Day · Product Hunt",
    parallel: "Controlled AI on real-world data — production discipline, not demo wrappers.",
    status: "shipped",
    statusLabel: "Shipped",
    image: `${CASE_STUDY_ASSETS}/findenn.png`,
    href: "/portfolio/finden",
  },
  {
    id: 14,
    slug: "bekur-hms",
    title: "Enterprise HRMS",
    stats: "Multi-tenant operations · role-based workflows",
    parallel: "Complex approval logic and tenant rules — the same class of problem as firm SOP automation.",
    status: "shipped",
    statusLabel: "Shipped",
    image: `${CASE_STUDY_ASSETS}/omniHr.png`,
    href: "/portfolio/bekur-hms",
  },
  {
    id: 0,
    slug: "tatariai",
    title: "TatariAI",
    stats: "Project management for software dev agencies",
    parallel: "Operational workflows for service teams — handoffs, status, and delivery ops at scale.",
    status: "shipped",
    statusLabel: "Shipped",
    image: `${CASE_STUDY_ASSETS}/tatariAi.png`,
    href: "/portfolio/tatariai",
  },
  {
    id: 0,
    slug: "lead-engine",
    title: "Lead gen engine",
    stats: "Internal · Sprint zero · Bekur GTM automation",
    parallel: "We're running the Automation Sprint on our own stack first — logic map to go-live.",
    status: "in-build",
    statusLabel: "In build",
    href: "/portfolio/lead-engine",
  },
];
