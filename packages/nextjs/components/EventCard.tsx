import React from "react";
import Image from "next/image";
import { BlockieAvatar } from "./scaffold-eth";
import GradientText from "./ui/GradientText";
import { Separator } from "./ui/separator";
import { Badge, CalendarDays } from "lucide-react";

interface Props {
  title: string;
  description: string;
  eth: number;
  date: string;
  size?: "small" | "medium" | "large";
}

const EventCard = ({ title, description, eth, date, size = "medium" }: Props) => {
  // Define size-based styles
  const sizeStyles = {
    small: {
      title: "text-md md:text-lg",
      description: "text-sm md:text-md",
    },
    medium: {
      title: "text-lg md:text-xl",
      description: "text-base md:text-md",
      eth: "text-xl md:text-2xl",
    },
    large: {
      title: "text-2xl md:text-3xl",
      description: "text-lg md:text-xl",
    },
  };

  return (
    <div className="flex justify-between w-full gap-2 mb-5">
      {/* Left: Image */}
      {/* <div className="min-w-24 min-h-24 w-16 h-16 md:w-24 md:h-24">
        <BlockieAvatar address="0x34aA3F359A9D614239015126635CE7732c18fDF3" size={100} />
      </div> */}
      <div className="min-w-24 min-h-24 w-16 h-16 md:w-20 md:h-20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl  dark:hover:shadow-[0_4px_20px_rgba(255,255,255,0.3)]">
        <img
          src="/hajimi.png"
          className="w-full h-full object-contain rounded-md pointer-events-none select-none"
          draggable={false}
        />
      </div>

      {/* Center: Text */}
      <div className="flex-1 pl-4">
        <h2 className={`font-bold ${sizeStyles[size].title}`}>{title}</h2>

        <div className="flex justify-between items-center gap-2 my-1">
          <p className={`text-muted-foreground max-w-[100%] md:max-w-[75%] w-full ${sizeStyles[size].description}`}>
            {description}
          </p>
        </div>

        <div className="flex h-5 items-center space-x-4 mt-2 ">
          <div className="flex items-center space-x-2 ">
            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={5}
              showBorder={false}
              className="text-lg"
            >
              {eth}
            </GradientText>
            <Image src="/eth.png" alt="Ethereum Logo" width={15} height={15} />
          </div>
          <Separator orientation="vertical" />
          <div className="flex items-center gap-2">
            <CalendarDays size="15" />
            <p className="text-sm">{date}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
