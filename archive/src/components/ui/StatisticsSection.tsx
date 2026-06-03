import { Award, Calendar, FolderOpen, Users } from "lucide-react";
import React from "react";
import statisticsData from "../../data/statistics.json";

const StatisticsSection = () => {
  const iconMap = {
    Calendar,
    Award,
    FolderOpen,
    Users,
  };

  const metrics = statisticsData.statistics.map((stat) => ({
    ...stat,
    icon: iconMap[stat.icon as keyof typeof iconMap],
  }));
  return (
    <div className="">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {metrics.map((metric, index) => {
          return (
            <div key={index} className="text-center space-y-1.5">
              <div className="text-3xl lg:text-[4rem]  text-primary font-bold">
                {metric.number}
              </div>
              <div className="text-xl text-foreground font-medium">
                {metric.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatisticsSection;
