import React from "react";
import SectionHeader from "../homePage/SectionHeader";
import ValueCard from "./ValueCard";
// import valuesData from "../../data/values.json";
import Shield from "./svg/Shield";
import HandShake from "./svg/HandShake";
import LightBulb from "./svg/LightBulb";
import Users from "./svg/Users";


type ValueItem = {
  id: number;
  title: string;
  description: string;
  step: string;
  iconKey: string;
};

const OurValue = ({ data, title, description }: { data: ValueItem[], title: string, description: string }) => {
  // Icon mapping for dynamic icons
  const iconMap: Record<string, React.ReactNode> = {
    Users: <Users />,
    Lightbulb: <LightBulb />,
    Handshake: <HandShake />,
    Shield: <Shield />,
  };

  return (
    <section className="py-6 md:py-12.5">
      <div className="container mx-auto px-4 md:px-8 space-y-2 md:space-y-16">
        <SectionHeader
          title={title}
          description={description}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center">
          {data.map((value) => (
            <ValueCard
              key={value.id}
              title={value.title}
              description={value.description}
              step={value.step}
              icon={iconMap[value.iconKey] || iconMap.Shield}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurValue;
