import { Angry, Annoyed, Frown, Laugh, Meh, PencilRuler, Smile } from "lucide-react";
import { getAddress } from "viem";
import EventCard from "~~/components/EventCard";
import ProgramNotFound from "~~/components/ProgramNotFound";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import GlassIcons from "~~/components/ui/GlassIcons";
import { Badge } from "~~/components/ui/badge";
import { Button } from "~~/components/ui/button";
import { Separator } from "~~/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~~/components/ui/sheet";
import { cn } from "~~/lib/utils";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const checkSumAddress = getAddress(id);
  const list1 = true;
  const list2 = false;

  return (
    <>
      <div className="relative z-10 mt-18 container max-w-5xl mx-auto">
        <div className="block md:flex items-start px-6 py-10 gap-8 w-full">
          <BlockieAvatar address={checkSumAddress} size={150} />

          <div className="flex flex-col justify-between w-full">
            <div className="flex justify-between items-center ">
              <h1 className="text-3xl font-bold text-foreground">
                {checkSumAddress?.slice(0, 6)}...{checkSumAddress?.slice(-4)}
              </h1>
              {checkSumAddress === id && (
                <Button variant="outline" className="flex items-center gap-2 cursor-pointer">
                  <PencilRuler className="w-4 h-4" />
                  Edit Profile
                </Button>
              )}
            </div>

            <div className="text-muted-foreground max-w-[30rem] w-full text-sm mt-1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat.
            </div>

            <div className="flex items-center space-x-4 h-5 text-sm text-muted-foreground mt-3">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-foreground">5</span>
                <span>programs</span>
              </div>

              <Separator orientation="vertical" />

              <div className="flex items-center gap-1">
                <span className="font-semibold text-foreground">12</span>
                <span>contributions</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={cn(" bg-gradient-to-b from-white to-neutral-200 dark:from-neutral-950 dark:to-neutral-800")}>
        <div className="relative z-10  container max-w-5xl mx-auto">
          <div className="px-6 py-10 bg- w-full">
            {/* ------ Rewards ------ */}
            <div className="mb-7">
              <div className="flex items-center justify-between mb-2">
                <p className="text-lg font-bold">Achievements</p>

                {/* open sheet here */}
                <Sheet>
                  <SheetTrigger asChild>
                    <p className="text-md cursor-pointer text-muted-foreground hover:underline">View All</p>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle className="text-2xl font-bold">Programs</SheetTitle>
                      <Separator className="my-2" />
                    </SheetHeader>
                    <div className="px-4 overflow-y-scroll">
                      {events.map((event, index) => (
                        <EventCard
                          key={index}
                          date={event.date}
                          description={event.description}
                          eth={event.eth}
                          title={event.title}
                          size="small"
                        />
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              <div className="flex justify-between w-full items-center border-2 rounded-xl h-[200px] px-10 relative gap-4">
                {items.map((item, index) => (
                  <div className="flex flex-col items-center space-y-4" key={index}>
                    <GlassIcons color={item.color} image={item.image} key={index} />
                    <p>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-10 max-w-3xl mx-auto" />

            {/* ------ Past Events ------ */}
            <div className="mb-7 max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-2">
                <p className="text-lg font-bold">Past Programs</p>

                {/* open sheet here */}
                <Sheet>
                  <SheetTrigger asChild>
                    {list1 && <p className="text-md cursor-pointer text-muted-foreground hover:underline">View All</p>}
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle className="text-2xl font-bold">Programs</SheetTitle>
                      <Separator className="my-2" />
                    </SheetHeader>
                    <div className="px-4 overflow-y-scroll">
                      {events.map((event, index) => (
                        <EventCard
                          key={index}
                          date={event.date}
                          description={event.description}
                          eth={event.eth}
                          title={event.title}
                          size="small"
                        />
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {list1 ? (
                <div className="">
                  {events.map((event, index) => (
                    <EventCard
                      key={index}
                      date={event.date}
                      description={event.description}
                      eth={event.eth}
                      title={event.title}
                    />
                  ))}
                </div>
              ) : (
                <ProgramNotFound />
              )}
            </div>

            <Separator className="my-10 max-w-3xl mx-auto" />

            {/* ------ Contributions ------ */}
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-2">
                <p className="text-lg font-bold">Contributions</p>

                {/* open sheet here */}
                <Sheet>
                  <SheetTrigger asChild>
                    {list2 && <p className="text-md cursor-pointer text-muted-foreground hover:underline">View All</p>}
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle className="text-2xl font-bold">Contributions</SheetTitle>
                      <Separator className="my-2" />
                    </SheetHeader>
                    <div className="px-4 overflow-y-scroll">
                      {events.map((event, index) => (
                        <EventCard
                          key={index}
                          date={event.date}
                          description={event.description}
                          eth={event.eth}
                          title={event.title}
                          size="small"
                        />
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {list2 ? (
                <div>
                  {events.map((event, index) => (
                    <EventCard
                      key={index}
                      date={event.date}
                      description={event.description}
                      eth={event.eth}
                      title={event.title}
                      size="small"
                    />
                  ))}
                </div>
              ) : (
                <ProgramNotFound variant="contribution" />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;

const items = [
  { image: "/hajimi.png", color: "blue", label: "Achievment 1" },
  { image: "/hajimi.png", color: "green", label: "Achievment 1" },
  { image: "/hajimi.png", color: "pink", label: "Achievment 1" },
  { image: "/hajimi.png", color: "purple", label: "Achievment 1" },
  { image: "/hajimi.png", color: "red", label: "Achievment 1" },
];

// List of events
const events = [
  {
    title: "Degree Scholarship 2025",
    description: "Scholarship for students in degree programs.",
    eth: 1.0,
    date: "30 July 2025",
    size: "large",
  },
  {
    title: "Blockchain Conference",
    description: "Learn about blockchain innovations.",
    eth: 0.75,
    date: "15 Aug 2025",
    size: "medium",
  },
  {
    title: "AI Hackathon",
    description: "24-hour hackathon focused on AI solutions.",
    eth: 1.5,
    date: "5 Sept 2025",
    size: "small",
  },
];
