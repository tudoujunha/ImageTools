"use client";

import { useEffect, useState } from "react";
import { processImages } from "@/lib/imageProcessing";

interface Props {
  selectedFiles: File[];
  outputMode: "clipboard" | "file";
  onStatusChange: (status: string) => void;
  basePath: string;
}

export function ActionButtons({ selectedFiles, outputMode, onStatusChange, basePath }: Props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex gap-4">
        <button
          disabled
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg opacity-50"
        >
          生成图片列表
        </button>
        <button
          disabled
          className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg opacity-50"
        >
          切割图片
        </button>
      </div>
    );
  }

  const handleGenerateList = async () => {
    if (selectedFiles.length === 0) {
      onStatusChange("请先选择文件！");
      return;
    }

    if (!basePath.trim()) {
      onStatusChange("请输入图片所在的绝对路径！");
      return;
    }

    try {
      const fileList = selectedFiles.map(file => ({
        absolute_path: `${basePath.replace(/\\/g, '/')}/${file.name}`,
        filename: file.name
      }));

      const jsonStr = JSON.stringify(fileList, null, 2);

      if (outputMode === "clipboard") {
        await navigator.clipboard.writeText(jsonStr);
        onStatusChange(`已复制 ${selectedFiles.length} 个文件信息到剪贴板`);
      } else {
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `image_list_${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        onStatusChange(`已生成文件列表，共 ${selectedFiles.length} 个文件`);
      }
    } catch (error: unknown) {
      onStatusChange(`生成列表失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleSplitImages = async () => {
    if (selectedFiles.length === 0 && !basePath.startsWith('data:image/')) {
      onStatusChange("请先选择文件或输入有效的Base64图片数据！");
      return;
    }

    try {
      const result = await processImages(selectedFiles, basePath);
      onStatusChange(result.message);
    } catch (error: unknown) {
      onStatusChange(`处理图片失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={handleGenerateList}
        disabled={selectedFiles.length === 0}
        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
      >
        生成图片列表
      </button>
      <button
        onClick={handleSplitImages}
        disabled={selectedFiles.length === 0 && !basePath.startsWith('data:image/')}
        className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg disabled:opacity-50"
      >
        切割图片
      </button>
    </div>
  );
} 