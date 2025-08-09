"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ImagePlus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { useWriteContract } from "wagmi";
import abi from "~~/contracts/ScholarshipProgram.json";
import { uploadToIPFS } from "~~/func/ipfs";

type Testimonial = {
  src: string;
};
export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
  showAddFile,
  address,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
  showAddFile: boolean;
  address: `0x${string}`;
}) => {
  const { writeContractAsync } = useWriteContract();
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive(prev => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive(prev => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index: number) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };

  // ---- Input logic ---
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const uploadFiles: File[] = [];

  const handleButtonClick = async () => {
    fileInputRef.current?.click();
    if (file) {
      uploadFiles.push(file);

      const promise = uploadToIPFS(uploadFiles);

      toast.promise(promise, {
        loading: "Uploading",
        success: () => "Uploaded!",
        error: "Error",
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  return (
    <div className="max-w-sm py-10 font-sans antialiased md:max-w-4xl md:px-8 lg:px-12">
      <div className="flex flex-col">
        <div>
          <div className="relative h-90 w-100">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.src}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: randomRotateY(),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : randomRotateY(),
                    zIndex: isActive(index) ? 40 : testimonials.length + 2 - index,
                    y: isActive(index) ? [0, -80, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: randomRotateY(),
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom"
                >
                  <img
                    src={testimonial.src}
                    width={120}
                    height={80}
                    draggable={false}
                    className="h-full w-full rounded-3xl object-cover object-center"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex flex-col justify-between py-4">
          <motion.div
            key={active}
            initial={{
              y: 20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -20,
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
          ></motion.div>
          <div className="flex justify-between items-center pt-12 md:pt-0">
            <div className="flex gap-4">
              <button
                onClick={handlePrev}
                className="group/button cursor-pointer flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800 z-30"
              >
                <ArrowLeft className="h-5 w-5 text-black transition-transform duration-300 group-hover/button:rotate-12 dark:text-neutral-400" />
              </button>
              <button
                onClick={handleNext}
                className="group/button cursor-pointer flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800 z-30"
              >
                <ArrowRight className="h-5 w-5 text-black transition-transform duration-300 group-hover/button:-rotate-12 dark:text-neutral-400" />
              </button>
            </div>
            <div>
              {showAddFile && (
                <button
                  // onClick={handleNext}
                  className="group/button cursor-pointer flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800 z-30"
                  onClick={handleButtonClick}
                >
                  <ImagePlus className="h-5 w-5 text-black transition-transform duration-300 group-hover/button:-rotate-12 dark:text-neutral-400" />
                </button>
              )}

              {/* Hidden file input */}
              <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
