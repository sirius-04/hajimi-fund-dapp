"use client";

import React from "react";
import Link from "next/link";
import { BackgroundGradient } from "./ui/background-gradient";
import { Button } from "./ui/button";
import { CalendarOff, Compass, Plus, UserRoundX } from "lucide-react";

interface ProgramNotFoundProps {
  variant?: "program" | "contribution";
}

const ProgramNotFound: React.FC<ProgramNotFoundProps> = ({ variant = "program" }) => {
  const isProgram = variant === "program";

  return (
    <div className="flex flex-col justify-center items-center space-y-7 py-10">
      <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
        {isProgram ? <CalendarOff className="w-30 h-30" /> : <UserRoundX className="w-30 h-30" />}
      </BackgroundGradient>

      <div className="text-center space-y-3">
        <p className="text-muted-foreground font-semibold">
          {isProgram ? "No Scholarship Programs" : "No Scholarship Contributions"}
        </p>
        <p className="text-neutral-500">
          {isProgram
            ? "You have no scholarship programs. Why not host one?"
            : "You haven't made any contributions. Start helping now!"}
        </p>
      </div>

      <Link href={isProgram ? "/create" : "/"}>
        <Button className="cursor-pointer">
          {isProgram ? <Plus /> : <Compass />}
          {isProgram ? "Create a Program" : "Discover Now"}
        </Button>
      </Link>
    </div>
  );
};

export default ProgramNotFound;
