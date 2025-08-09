"use client";

import { useState } from "react";
import { DialogClose, DialogFooter } from "./dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloudUpload, Paperclip } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { parseEther } from "viem";
import { z } from "zod";
import { Button } from "~~/components/ui/button";
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from "~~/components/ui/file-upload";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~~/components/ui/form";
import { Input } from "~~/components/ui/input";
import { Textarea } from "~~/components/ui/textarea";
import abi from "~~/contracts/ScholarshipProgram.json";
import { uploadToIPFS } from "~~/func/ipfs";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth/useScaffoldReadContract";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth/useScaffoldWriteContract";
import { cn } from "~~/lib/utils";

const formSchema = z.object({
  requestTitle: z
    .string()
    .min(1, "Request title is required")
    .max(100, "Request title must be less than 100 characters"),

  requestDescription: z
    .string()
    .min(1, "Request description is required")
    .max(1000, "Request description must be less than 1000 characters"),

  requestAmount: z.coerce
    .number({
      required_error: "Request goal is required",
      invalid_type_error: "Request goal must be a number",
    })
    .positive("Request goal must be a positive number")
    .min(1, "Request goal must be at least 1 ether"),

  requestMedia: z.array(z.instanceof(File)).min(1, "At least one file is required").max(10, "Maximum 10 files allowed"),
});

export default function RequestForm() {
  //   const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract({
  //     contract: {
  //       contractAddress: "0xYourScholarshipProgramAddress",
  //       //   contractName: "ScholarshipProgram",
  //       contractAbi: abi,
  //     },
  //   });
  const [files, setFiles] = useState<File[] | null>(null);

  const dropZoneConfig = {
    maxFiles: 10,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
    onDragEnter: () => {},
    onDragLeave: () => {},
    onDragOver: () => {},
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requestTitle: "",
      requestDescription: "",
      requestAmount: 1,
      requestMedia: [],
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const promise = (async () => {
      const ipfsUrls = await uploadToIPFS(data.requestMedia);
      //   return writeYourContractAsync({
      //     functionName: "createRequest",
      //     args: [data.requestTitle, data.requestDescription, parseEther(data.requestAmount.toString()), ipfsUrls],
      //   });
    })();

    toast.promise(promise, {
      loading: "Creating",
      success: () => "Request Created!",
      error: "Error",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-2">
        <FormField
          control={form.control}
          name="requestTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Scholarship for ..." type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4">
          <div className="col-span-4">
            <FormField
              control={form.control}
              name="requestDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your request here." className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="requestAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goal</FormLabel>
              <FormControl>
                <Input placeholder="(e.g.) 10" type="number" {...field} />
              </FormControl>
              <FormDescription>Enter amount of ethers you aims to request.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requestMedia"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supporting Evidence</FormLabel>
              <FormControl>
                <FileUploader
                  value={field.value || []}
                  onValueChange={newFiles => {
                    setFiles(newFiles);
                    field.onChange(newFiles);
                  }}
                  dropzoneOptions={dropZoneConfig}
                  className="relative bg-background rounded-lg p-2"
                >
                  <FileInput id="fileInput" className="outline-dashed outline-1 outline-slate-500">
                    <div className="flex items-center justify-center flex-col p-8 w-full ">
                      <CloudUpload className="text-gray-500 w-10 h-10" />
                      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>
                        &nbsp; or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF</p>
                    </div>
                  </FileInput>
                  <FileUploaderContent>
                    {files &&
                      files.length > 0 &&
                      files.map((file, i) => (
                        <FileUploaderItem key={i} index={i}>
                          <Paperclip className="h-4 w-4 stroke-current" />
                          <span>{file.name}</span>
                        </FileUploaderItem>
                      ))}
                  </FileUploaderContent>
                </FileUploader>
              </FormControl>
              <FormDescription>
                You must upload at least one image as evidence to prove you need the money.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button variant="secondary" type="submit" className="cursor-pointer">
            Confirm
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
