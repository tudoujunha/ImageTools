"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface Props {
  onFilesSelected: (files: File[]) => void;
  selectedFiles: File[];
}

export function FileDropZone({ onFilesSelected, selectedFiles }: Props) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesSelected(acceptedFiles);
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
    }
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
    >
      <input {...getInputProps()} />
      <p className="text-gray-600">
        {isDragActive
          ? "放开以添加图片..."
          : "拖放多个图片到这里，或点击选择图片"}
      </p>
      {selectedFiles.length > 0 && (
        <p className="mt-2 text-sm text-gray-500">
          已选择: {selectedFiles.length} 个文件
        </p>
      )}
    </div>
  );
} 