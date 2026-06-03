import BlogLayout from "@/components/blogPage/Blogs";
import React from "react";
const page = () => {
  return (
    <section className="bg-background">
      <div className="container mx-auto px-4 pt-[3.125rem]">
        <BlogLayout />
      </div>
    </section>
  );
};

export default page;
