import { Angry, Annoyed, Frown, Laugh, Meh, PencilRuler, Smile } from "lucide-react";
import { getAddress } from "viem";
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
              <Button variant="outline" className="flex items-center gap-2 cursor-pointer">
                <PencilRuler className="w-4 h-4" />
                Edit Profile
              </Button>
            </div>

            <div className="text-muted-foreground max-w-[30rem] w-full text-sm mt-1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat.
            </div>

            <div className="flex flex-wrap gap-2 mt-3 ">
              <Badge className="bg-violet-500 dark:bg-violet-400">Degree</Badge>
              <Badge className="bg-sky-600 not-odd:dark:bg-sky-400">Computer Science</Badge>
              <Badge className="bg-green-400">APU</Badge>
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
                <p className="text-lg">Rewards</p>

                {/* open sheet here */}
                <Sheet>
                  <SheetTrigger asChild>
                    <p className="text-md cursor-pointer text-muted-foreground">View All</p>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Edit profile</SheetTitle>
                      <SheetDescription>
                        Make changes to your profile here. Click save when you&apos;re done.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="grid flex-1 auto-rows-min gap-6 px-4">
                      <div className="grid gap-3">
                        <p>Rewards</p>
                        <p>Rewards</p>
                      </div>
                      <div className="grid gap-3">
                        <p>Rewards</p>
                        <p>Rewards</p>
                      </div>
                    </div>
                    <SheetFooter>
                      <Button type="submit">Save changes</Button>
                      <SheetClose asChild>
                        <Button variant="outline">Close</Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>

              <div className=" border-2 rounded-xl h-[200px] p-4 relative">
                <GlassIcons items={items} className="custom-class" />
              </div>
            </div>

            <Separator className="my-10" />

            {/* ------ Past Events ------ */}
            <div className="mb-7">
              <div className="flex items-center justify-between mb-2">
                <p className="text-lg">Past Programs</p>

                {/* open sheet here */}
                <Sheet>
                  <SheetTrigger asChild>
                    <p className="text-md cursor-pointer text-muted-foreground">View All</p>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Edit profile</SheetTitle>
                      <SheetDescription>
                        Make changes to your profile here. Click save when you&apos;re done.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="grid flex-1 auto-rows-min gap-6 px-4">
                      <div className="grid gap-3">
                        <p>Rewards</p>
                        <p>Rewards</p>
                      </div>
                      <div className="grid gap-3">
                        <p>Rewards</p>
                        <p>Rewards</p>
                      </div>
                    </div>
                    <SheetFooter>
                      <Button type="submit">Save changes</Button>
                      <SheetClose asChild>
                        <Button variant="outline">Close</Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>

              <div className="bg-neutral-400 border h-[200px] p-3">hi</div>
            </div>

            <Separator className="my-10" />

            {/* ------ Contributions ------ */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-lg">Contributions</p>

                {/* open sheet here */}
                <Sheet>
                  <SheetTrigger asChild>
                    <p className="text-md cursor-pointer text-muted-foreground">View All</p>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Edit profile</SheetTitle>
                      <SheetDescription>
                        Make changes to your profile here. Click save when you&apos;re done.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="grid flex-1 auto-rows-min gap-6 px-4">
                      <div className="grid gap-3">
                        <p>Rewards</p>
                        <p>Rewards</p>
                      </div>
                      <div className="grid gap-3">
                        <p>Rewards</p>
                        <p>Rewards</p>
                      </div>
                    </div>
                    <SheetFooter>
                      <Button type="submit">Save changes</Button>
                      <SheetClose asChild>
                        <Button variant="outline">Close</Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>

              <div className="h-[200px] p-3 ">hi</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;

const items = [
  { icon: <Angry />, color: "blue", label: "Files" },
  { icon: <Annoyed />, color: "purple", label: "Books" },
  { icon: <Frown />, color: "red", label: "Health" },
  //   { icon: <Laugh />, color: "indigo", label: "Weather" },
  //   { icon: <Meh />, color: "orange", label: "Notes" },
  //   { icon: <Smile />, color: "green", label: "Stats" },
];
