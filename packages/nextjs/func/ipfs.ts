"use client";

import { pinata } from "~~/utils/config";

export async function uploadToIPFS(fileArray: File[] | null) {
  if (!fileArray || fileArray.length === 0) return [];

  const CIDs: string[] = [];

  for (const file of fileArray) {
    try {
      const urlRequest = await fetch("/api/url");
      const { url } = await urlRequest.json();

      const upload = await pinata.upload.public.file(file).url(url);

      CIDs.push(upload.cid);
      console.log(upload);
    } catch (error) {
      console.error("Failed to upload", file.name, error);
    }
  }
  return CIDs;
}

export function getIpfsUrl(cid: string, gateway = "https://gateway.pinata.cloud/ipfs/"): string {
  return `${gateway}${cid}`;
}
