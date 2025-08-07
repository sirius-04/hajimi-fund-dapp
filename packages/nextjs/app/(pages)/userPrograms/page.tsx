import React from "react";
import ProgramNotFound from "~~/components/ProgramNotFound";
import Timeline from "~~/components/Timeline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~~/components/ui/tabs";
import { cn } from "~~/lib/utils";

const Page = () => {
  const list1 = true;
  const list2 = false;

  return (
    <div className="relative w-full min-h-screen bg-white dark:bg-black overflow-hidden">
      {/* Background grid */}
      <div
        className={cn(
          "absolute inset-0 z-0",
          "[background-size:20px_20px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
        )}
      />

      {/* Radial mask */}
      <div className="pointer-events-none absolute inset-0 z-5 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black)] dark:bg-black" />

      {/* Page Content */}
      <div className="relative z-10 mt-18 container mx-auto">
        <div className="flex flex-col space-y-10 px-6 py-10 max-w-5xl mx-auto">
          <Tabs defaultValue="prorgams">
            <TabsList>
              <TabsTrigger value="prorgams">Programs</TabsTrigger>
              <TabsTrigger value="contributions">Contributions</TabsTrigger>
            </TabsList>
            <TabsContent value="prorgams">{list1 ? <Timeline /> : <ProgramNotFound variant="program" />}</TabsContent>
            <TabsContent value="contributions">
              {list2 ? <Timeline /> : <ProgramNotFound variant="contribution" />}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Page;
