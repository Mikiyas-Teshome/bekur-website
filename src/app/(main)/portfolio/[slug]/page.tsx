import { notFound } from "next/navigation";
import CaseStudyDetailPage from "@/components/mvp-clone/case-studies/CaseStudyDetailPage";
import {
  getCaseStudyDetail,
  caseStudySlugs,
} from "@/components/mvp-clone/case-studies/case-study-details";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return caseStudySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const project = getCaseStudyDetail(slug);
  if (!project) return { title: "Project not found" };

  return {
    title: `${project.title} — Shipped systems`,
    description: project.overview,
  };
}

export default async function PortfolioCaseStudyRoute({ params }: PageProps) {
  const { slug } = await params;
  const project = getCaseStudyDetail(slug);

  if (!project) {
    notFound();
  }

  return <CaseStudyDetailPage project={project} />;
}
