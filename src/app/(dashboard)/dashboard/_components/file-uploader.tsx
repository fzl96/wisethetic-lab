/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use client";

import { useCallback, Dispatch, SetStateAction } from "react";
import { useDropzone } from "@uploadthing/react/hooks";
import { generateClientDropzoneAccept } from "uploadthing/client";

import { convertFileToUrl, truncateString } from "@/lib/utils";
import { cn } from "@/lib/utils";

type FileUploaderProps = {
  onFieldChange: (url: string) => void;
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
  imgUrl: string;
  disabled: boolean;
};

export function FileUploader({
  onFieldChange,
  setFiles,
  imgUrl,
  disabled,
}: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    if (acceptedFiles[0]) {
      onFieldChange(convertFileToUrl(acceptedFiles[0]));
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*" ? generateClientDropzoneAccept(["image/*"]) : undefined,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
      )}
    >
      <input {...getInputProps()} disabled={disabled} />
      <p className="text-sm text-muted-foreground">
        {imgUrl ? truncateString(imgUrl) : "Choose an image"}
      </p>
    </div>
  );
}
