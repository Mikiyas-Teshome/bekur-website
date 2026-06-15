import type { Metadata } from "next";
import BookCallPage from "@/components/book/BookCallPage";

export const metadata: Metadata = {
  title: "Book a call",
  description:
    "Schedule a discovery call with Bekur Technologies. Map your workflow, scope the automation, and get a fixed sprint quote.",
  alternates: { canonical: "/book" },
};

export default function BookRoute() {
  return <BookCallPage />;
}
