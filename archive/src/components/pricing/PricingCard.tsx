import type React from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";

interface PricingCardProps {
  planName: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  targetAudience?: string;
  features: string[];
  buttonText?: string;
  isHighlighted?: boolean;
  className?: string;
  subtitle?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  planName,
  price,
  discount,
  features,
  buttonText = "Get Started",
  isHighlighted = false,
  className = "",
  subtitle = "per user/month, billed annually",
}) => {
  return (
    <div
      className={`w-full md:max-w-[374px] rounded-[0.5rem] p-6 space-y-6 transition-all duration-300 hover:shadow-lg ${
        isHighlighted
          ? "bg-primary text-secondary shadow-xl scale-100"
          : "bg-secondary text-foreground border border-border dark:border-[#214A9C]"
      } ${className}`}
    >
      {/* Plan  */}
      <div className="text-left space-y-2">
        <h3
          className={`${
            isHighlighted ? "text-secondary dark:text-white" : "text-foreground"
          } text-2xl font-semibold leading-[120%]`}
        >
          {planName}
        </h3>
        {/* Price */}
        <div className="text-left space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`${
                isHighlighted
                  ? "text-secondary dark:text-white"
                  : "text-foreground"
              } text-[2rem] font-semibold leading-[120%]`}
            >
              ${price}
            </span>
            {discount && (
              <Badge
                className={`${
                  isHighlighted
                    ? "bg-secondary dark:bg-white text-foreground dark:text-black"
                    : "bg-dark-background text-secondary"
                } text-sm font-medium px-2 py-1`}
              >
                -{discount}%
              </Badge>
            )}
          </div>
          <p className="text-sm text-[#AFAFAF]  mt-1">{subtitle}</p>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <Checkbox
              checked={true}
              className={`mt-0.5 ${
                isHighlighted
                  ? "data-[state=checked]:bg-secondary dark:data-[state=checked]:bg-white data-[state=checked]:text-primary dark:data-[state=checked]:text-black "
                  : "data-[state=checked]:bg-dark-background dark:data-[state=checked]:bg-transparent data-[state=checked]:border-dark-background dark:data-[state=checked]:border-transparent dark:data-[state=checked]:text-white"
              }`}
            />
            <span
              className={`text-sm ${
                isHighlighted ? "text-white" : "text-black dark:text-white"
              }`}
            >
              {feature}
            </span>
          </div>
        ))}
      </div>

      {/* Button */}
      <Button
        className={`w-full h-12 font-medium transition-all duration-200 cursor-pointer ${
          isHighlighted
            ? "bg-white text-primary hover:bg-gray-100"
            : "bg-primary text-white hover:bg-primary/90"
        }`}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default PricingCard;
