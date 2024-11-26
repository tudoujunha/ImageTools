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
        <header className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">图片工具箱</h1>
          <div className="h-24 bg-gray-200 rounded"></div>
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
      <header className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">图片工具箱</h1>
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <h2 className="text-lg font-semibold text-gray-700">功能说明：</h2>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 mt-0.5 flex-shrink-0">
                <svg viewBox="0 0 20 20" fill="currentColor" className="text-green-500">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-gray-700"><span className="font-medium">图片切割：</span>将图片自动切割成四个相等的部分</p>
                <p className="text-sm text-gray-500">支持拖放或选择多个图片，也支持直接粘贴剪贴板中的图片</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 mt-0.5 flex-shrink-0">
                <svg viewBox="0 0 20 20" fill="currentColor" className="text-blue-500">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-gray-700"><span className="font-medium">路径生成：</span>生成图片的绝对路径列表</p>
                <p className="text-sm text-gray-500">可选择复制到剪贴板或导出为JSON文件</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 mt-0.5 flex-shrink-0">
                <svg viewBox="0 0 20 20" fill="currentColor" className="text-purple-500">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-gray-700"><span className="font-medium">多种输入方式：</span>灵活的图片输入支持</p>
                <p className="text-sm text-gray-500">支持文件选择、拖放、Base64数据和剪贴板图片</p>
              </div>
            </div>
          </div>
        </div>
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
