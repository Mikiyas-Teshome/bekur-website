import Image from "next/image";
import type React from "react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface BlogCardProps {
  id: number;
  tag: string;
  headline: string;
  subtitle: string;
  author: string;
  authorImage?: string | null;
  date: string;
  blogUrl: string;
  className?: string;
  onClick?: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({
  tag,
  headline,
  subtitle,
  author,
  authorImage,
  date,
  blogUrl,
  className = "",
  onClick,
}) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get logo based on theme
  const getLogoPath = () => {
    if (!mounted) return "/assets/logo/logo-light.svg";
    return resolvedTheme === "dark"
      ? "/assets/logo/logo-dark.svg"
      : "/assets/logo/logo-light.svg";
  };

  const isBrandLogo =
    !authorImage ||
    authorImage.includes("/assets/logo/") ||
    authorImage.includes("logo");

  const avatarSrc = isBrandLogo ? getLogoPath() : authorImage;

  return (
    <div
      className={`max-w-max-w-98 ${className} space-y-6 ${
        onClick
          ? "cursor-pointer hover:transform hover:scale-105 transition-all duration-300"
          : ""
      }`}
      onClick={onClick}
    >
      <div className="w-full h-[220px] rounded-2xl overflow-hidden relative">
        <Image
          src={blogUrl || "/placeholder.svg"}
          alt="Blog"
          fill
          className="object-cover rounded-2xl hover:scale-102 transition-all duration-300"
        />
      </div>

      {/* Content Section */}
      <div className="space-y-4">
        {/* Tag */}
        <div className="inline-block">
          <span className="bg-purple-900 text-secondary dark:text-secondary-foreground text-[10px] leading-[16px] px-2 py-1 rounded-[6px] font-semibold">
            {tag}
          </span>
        </div>

        {/* Headline */}
        <h3 className="text-xl leading-6.5 font-semibold text-foreground wrap-break-words overflow-hidden">
          {headline}
        </h3>

        <div>
        {/* Subtitle (HTML parsed) */}
        <div
          className="text-base leading-6 font-normal text-muted-foreground dark:text-foreground/80 wrap-break-words overflow-hidden line-clamp-2"
          dangerouslySetInnerHTML={{ __html: subtitle }}
        />

        {/* Author and Date */}
        <div className="flex items-center gap-2 pt-2">
          <div
            className={
              isBrandLogo
                ? "relative h-10 w-10 shrink-0"
                : "relative h-10 w-10 shrink-0 overflow-hidden rounded-full"
            }
          >
            <Image
              src={avatarSrc}
              alt={author}
              fill
              className={isBrandLogo ? "object-contain" : "object-cover"}
            />
          </div>

          <div className="flex space-x-2">
            {author && (
              <span className="text-[11px] leading-[15.6px] font-normal text-muted-foreground dark:text-foreground/80">
                {author}
              </span>
            )}
            <span className="text-[11px] leading-[15.6px] font-normal text-muted-foreground dark:text-foreground/80">
              {date}
            </span>
          </div>
        </div>


        </div>
      </div>
    </div>
  );
};

export default BlogCard;
