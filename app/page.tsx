"use client";

import { useState, useEffect } from "react";
import { FileDropZone } from "@/components/FileDropZone";
import { ActionButtons } from "@/components/ActionButtons";
import { StatusDisplay } from "@/components/StatusDisplay";
import { OutputModeSelector } from "@/components/OutputModeSelector";
import { PathInput } from "@/components/PathInput";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [outputMode, setOutputMode] = useState<"clipboard" | "file">("clipboard");
  const [status, setStatus] = useState<string>("");
  const [basePath, setBasePath] = useState<string>("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen p-8 flex flex-col gap-6 max-w-3xl mx-auto opacity-50">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">图片路径生成工具</h1>
        </header>
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
        <div className="h-32 border-2 border-dashed rounded-lg"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        <div className="flex gap-4">
          <div className="flex-1 h-10 bg-gray-200 rounded"></div>
          <div className="flex-1 h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 flex flex-col gap-6 max-w-3xl mx-auto">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">图片路径生成工具</h1>
      </header>

      <PathInput path={basePath} onPathChange={setBasePath} />

      <FileDropZone 
        onFilesSelected={setSelectedFiles}
        selectedFiles={selectedFiles}
      />

      <OutputModeSelector
        mode={outputMode}
        onChange={setOutputMode}
      />

      <ActionButtons
        selectedFiles={selectedFiles}
        outputMode={outputMode}
        onStatusChange={setStatus}
        basePath={basePath}
      />

      <StatusDisplay message={status} />
    </div>
  );
}
