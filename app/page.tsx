"use client";

import { useState } from "react";
import { FileDropZone } from "@/components/FileDropZone";
import { ActionButtons } from "@/components/ActionButtons";
import { StatusDisplay } from "@/components/StatusDisplay";
import { OutputModeSelector } from "@/components/OutputModeSelector";
import { PathInput } from "@/components/PathInput";

export default function Home() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [outputMode, setOutputMode] = useState<"clipboard" | "file">("clipboard");
  const [status, setStatus] = useState<string>("");
  const [basePath, setBasePath] = useState<string>("");

  return (
    <div className="min-h-screen p-8 flex flex-col gap-6 max-w-3xl mx-auto">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">图片处理工具</h1>
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
