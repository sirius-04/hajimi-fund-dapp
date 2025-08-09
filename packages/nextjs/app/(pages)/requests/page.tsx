"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, Carousel } from "~~/components/ui/apple-cards-carousel";
import { Button } from "~~/components/ui/button";

const data = [
  {
    src: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=3556&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    src: "https://images.unsplash.com/photo-1531554694128-c4c6665f59c2?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    src: "https://images.unsplash.com/photo-1713869791518-a770879e60dc?q=80&w=2333&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },

  {
    src: "https://images.unsplash.com/photo-1599202860130-f600f4948364?q=80&w=2515&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    src: "https://images.unsplash.com/photo-1602081957921-9137a5d6eaee?q=80&w=2793&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    src: "https://images.unsplash.com/photo-1511984804822-e16ba72f5848?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const RequestETH = () => {
  const cards = data.map((card, index) => <Card key={card.src} card={card} index={index} />);
  const isSingleImage = data.length === 1;
  const params = useParams();
  const programId = params.id as string;

  return (
    <div className="w-full h-full py-20">
      <div className="flex justify-between items-center  max-w-7xl  mt-5 gap-3">
        <Link href={`/program/${programId}/requests`} className="z-10 mx-24 ">
          <button className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800 cursor-pointer">
            <ArrowLeft className="h-5 w-5 text-black transition-transform duration-300 group-hover/button:rotate-12 dark:text-neutral-400" />
          </button>
        </Link>
        <h2 className="w-full text-center md:text-5xl font-bold text-neutral-800 dark:text-neutral-200">
          Lorem ipsum dolor sit amet.
        </h2>
      </div>
      {isSingleImage ? (
        <div className="max-w-7xl mx-auto px-10 py-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left: Image */}
          <img src={data[0].src} alt="Request" className="w-120 h-auto rounded-xl shadow-lg object-cover" />

          {/* Right: Description */}
          <div>
            <h2 className="font-bold text-2xl underline">Request Description</h2>
            <div className="mt-4 text-muted-foreground">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem dolorem ad dolorum consectetur
              laudantium aspernatur, nesciunt architecto animi quia tempora? Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Veritatis doloribus odio alias placeat ipsum, odit soluta suscipit ipsam iste
              dignissimos! Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, veritatis!
            </div>
            <div className="mt-8 flex gap-4">
              <Button variant="outline" className="w-28">
                Approve
              </Button>
              <Button variant="destructive" className="w-28">
                Reject
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <Carousel items={cards} />
          <div className="max-w-7xl mx-auto px-10 py-10">
            <h2 className="font-bold text-2xl underline">Request Description</h2>
            <div className="mt-4 text-muted-foreground">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem dolorem ad dolorum consectetur
              laudantium aspernatur, nesciunt architecto animi quia tempora? Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Veritatis doloribus odio alias placeat ipsum, odit soluta suscipit ipsam iste
              dignissimos! Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, veritatis!
            </div>
            <div className="mt-8 flex justify-end gap-4 px-10">
              <Button variant="outline" className="w-28">
                Approve
              </Button>
              <Button variant="destructive" className="w-28">
                Reject
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RequestETH;
