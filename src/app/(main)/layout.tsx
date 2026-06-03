import Footer from "@/components/footer/Footer";
import HashScroll from "@/components/HashScroll";
import SiteHeader from "@/components/SiteHeader";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <HashScroll />
      {children}
      <Footer />
    </>
  );
}
