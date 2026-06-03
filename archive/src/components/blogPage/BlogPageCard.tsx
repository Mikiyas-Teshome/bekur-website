import type React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { dmSans4 } from "@/app/fonts";

interface BlogCardProps {
  id: number;
  blogUrl: string;
  author: string;
  authorImage: string;
  date: string;
  headline: string; // previously title
  subtitle: string;
  tags: string[];
  isFeatured?: boolean;
  className?: string;
}

const BlogPageCard: React.FC<BlogCardProps> = ({
  blogUrl,
  author,
  authorImage,
  date,
  headline,
  subtitle,
  tags,
  isFeatured = false,
  className = "",
}) => {

  // Parse subtitle HTML safely
  const renderSubtitle = () => (
    <div
      className="text-sm text-muted-foreground"
      dangerouslySetInnerHTML={{ __html: subtitle }}
    />
  );

  if (isFeatured) {
    return (
      <div className={`cursor-pointer space-y-8 transition-all duration-300 ${className}`}>
        <div className="flex flex-col md:flex-row gap-9.5 items-start">
          {/* Image Container */}
          <div className="relative overflow-hidden rounded-xl shrink-0 w-full md:w-1/2 h-64 md:h-72">
            <Image
              src={blogUrl || "/placeholder.svg"}
              alt={headline}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-black/20 opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
          </div>

          {/* Content */}
          <div className="space-y-5 flex-1">
            <div className="flex items-center gap-2">
              <Image
                src={authorImage || "/default-avatar.png"}
                alt={author}
                width={24}
                height={24}
                className="w-6 h-6 rounded-full"
              />
              <div className={`flex items-center text-muted-foreground ${dmSans4.className} text-xs leading-3`}>
                <span className="uppercase tracking-wide">{author}</span>
                <span className="mx-2">-</span>
                <span className="uppercase tracking-wide">{date}</span>
              </div>
            </div>

            <h3 className="text-xl md:text-2xl lg:text-[2rem] text-foreground">
              {headline}
            </h3>

            {renderSubtitle()}

            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className={`flex items-center text-foreground ${dmSans4.className} text-sm leading-[0.9rem] group/link`}>
              <span className="group-hover/link:underline transition-all duration-300">
                READ FULL ARTICLE
              </span>
              <ArrowRight className="ml-2.75 w-4 h-4 transform group-hover/link:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`cursor-pointer transition-all duration-300 ${className}`}>
      <div className="relative overflow-hidden rounded-2xl mb-4 h-48 md:h-[15.5rem]">
        <Image
          src={blogUrl || "/placeholder.svg"}
          alt={headline}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-black/20 opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
      </div>

      <div className="space-y-5 flex-1">
        <div className="flex items-center gap-2">
          <Image
            src={authorImage || "/default-avatar.png"}
            alt={author}
            width={24}
            height={24}
            className="w-6 h-6 rounded-full"
          />
          <div className={`flex items-center text-muted-foreground ${dmSans4.className} text-xs leading-3`}>
            <span className="uppercase tracking-wide">{author}</span>
            <span className="mx-2">-</span>
            <span className="uppercase tracking-wide">{date}</span>
          </div>
        </div>

        <h3 className="text-xl md:text-2xl lg:text-[2rem] text-foreground">
          {headline}
        </h3>

        {renderSubtitle()}

        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className={`flex items-center text-foreground ${dmSans4.className} text-sm leading-[0.9rem] group/link`}>
          <span className="group-hover/link:underline transition-all duration-300">
            READ FULL ARTICLE
          </span>
          <ArrowRight className="ml-2.75 w-4 h-4 transform group-hover/link:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    </div>
  );
};

export default BlogPageCard;
