"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { Modal, ModalTrigger } from "~~/components/ui/animated-modal";
import { AnimatedTestimonials } from "~~/components/ui/animated-testimonials";
import { BackgroundGradient } from "~~/components/ui/background-gradient";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~~/components/ui/card";
import { PlaceholdersAndVanishInput } from "~~/components/ui/placeholders-and-vanish-input";
import { Progress } from "~~/components/ui/progress";

// interface GridItemProps {
//   // id: string;
//   title: string;
//   // description: string;
//   // badgeText?: string;
//   contributors?: string[]; // Ethereum addresses
//   // date?: string;
//   // price?: string;
// }

const Page = () => {
  const { id } = useParams();
  const [progress, setProgress] = React.useState(13);
  const [approver] = React.useState(true);
  const [funded] = React.useState(true);
  const [creator] = React.useState(false);
  const [contributor] = React.useState(true);
  const [showInput, setShowInput] = React.useState(false);
  const [amount, setAmount] = React.useState("");
  const [success, setSuccess] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-full py-20">
      <h2 className="max-w-7xl pl-4 mt-5 mx-auto text-xl text-center md:text-5xl font-bold text-neutral-800 dark:text-neutral-200">
        Degree Scholarship 2025
      </h2>
      <p className="max-w-7xl pl-4 mx-auto mt-2 text-center text-base md:text-xl text-neutral-600 dark:text-neutral-400">
        Fundraising organised by Hajimi
      </p>
      {/* Testimonials */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-5 items-start px-20 py-10">
        <div className="flex-1 w-full">
          <AnimatedTestimonials testimonials={testimonials} />
        </div>
        {/* Donate Card */}
        <div className="relative w-95 self-start mt-8">
          <BackgroundGradient className="bg-white dark:bg-zinc-900 rounded-[22px]">
            <Card className="w-full max-w-sm h-100 rounded-[22px]">
              <CardHeader>
                <CardTitle className="text-center text-4xl">RM10000</CardTitle>
                <CardDescription className="text-center">Raised of RM20000 goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex-col gap-6 mt-15">
                  <Progress value={progress} className="w-full" />
                  <div className="flex justify-end mt-2">
                    <span className="text-sm font-semibold mr-2">Contributor:</span>
                    <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                      <BlockieAvatar address="0x34aA3F359A9D614239015126635CE7732c18fDF3" size={24} />
                      <BlockieAvatar address="0x34aA3F359A9D614239015126635CE7732c18fDF3" size={24} />
                      <BlockieAvatar address="0x34aA3F359A9D614239015126635CE7732c18fDF3" size={24} />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col mt-auto gap-2">
                <Modal>
                  <ModalTrigger className="bg-black dark:bg-white dark:text-black text-white w-full flex justify-center group/modal-btn">
                    <div className="group-hover/modal-btn:translate-x-60 text-center transition duration-400">
                      {funded ? "Fund More" : "Fund their future"}
                    </div>
                    <div
                      className="-translate-x-60 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-400 text-white z-30"
                      onClick={() => setShowInput(true)}
                    >
                      💵
                    </div>
                  </ModalTrigger>
                </Modal>
                {creator && (
                  <Link href={`/program/${id}/requests`} className="w-full">
                    <Button variant="outline" className="w-full">
                      Create Request
                    </Button>
                  </Link>
                )}

                {!creator && (contributor || approver) && (
                  <Link href={`/program/${id}/requests`} className="w-full">
                    <Button variant="outline" className="w-full">
                      View Requests
                    </Button>
                  </Link>
                )}
              </CardFooter>
              {showInput && (
                <div className="absolute inset-0 backdrop-blur-sm flex items-center justify-center z-50 px-4 rounded-[22px] ">
                  <div className="bg-white dark:bg-zinc-900 p-3 shadow-lg w-full max-w-md">
                    <PlaceholdersAndVanishInput
                      placeholders={["Enter Amount in ETH", "Thanks for your contributions!"]}
                      onChange={e => {
                        setAmount(e.target.value);
                      }}
                      onSubmit={e => {
                        e.preventDefault();
                        setShowInput(false);
                      }}
                    />
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" onClick={() => setShowInput(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </BackgroundGradient>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="font-bold text-2xl underline">Requestor Story</h2>
        <div className="mt-4">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab at, velit veniam rerum repellat voluptatibus
          dignissimos mollitia modi id sapiente neque commodi laudantium quis minus enim porro esse cum. Laudantium
          voluptates minus odio vel, assumenda numquam? Asperiores, maxime commodi ipsa maiores quam minus nemo ipsam
          obcaecati dicta doloremque eius nostrum explicabo exercitationem soluta, officia ut vel mollitia harum vero!
          Debitis vel distinctio magnam dolorum facere sed laborum quia esse eaque et porro veniam eos ullam dicta sit
          minima officia voluptas ducimus asperiores corporis molestiae at, dolores delectus? Praesentium illum nisi
          exercitationem error voluptatibus cupiditate quisquam non similique reiciendis pariatur? Tempora maiores nam
          debitis ut quaerat quas provident nesciunt labore dolor, blanditiis temporibus, similique eaque, veritatis
          totam soluta amet. Fugit dolorem quaerat animi, est ad debitis mollitia minus unde dicta? Aut eveniet veniam
          vitae placeat, laudantium dolorem, dolorum assumenda aspernatur in provident ullam minima, incidunt voluptatem
          doloremque fuga omnis illo quisquam eligendi quis veritatis voluptas perferendis. Recusandae blanditiis eos
          nihil fugit mollitia! Numquam fuga placeat nemo ipsam magni. Aliquid ab, ipsum quidem ad a tempore eos iure
          maxime reiciendis odio deleniti beatae fugiat velit quae perferendis facere neque voluptates provident, atque
          optio aliquam aut aspernatur repellat recusandae? Accusantium aut inventore nisi.
        </div>
      </div>
    </div>
  );
};

export default Page;

const testimonials = [
  {
    src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export function PlaceholdersAndVanishInputDemo() {
  const placeholders = ["Enter Amount in ETH", "Thanks for your contributions!"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };
  return <PlaceholdersAndVanishInput placeholders={placeholders} onChange={handleChange} onSubmit={onSubmit} />;
}
