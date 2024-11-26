"use client";

import { useEffect, useState } from "react";

interface Props {
  path: string;
  onPathChange: (path: string) => void;
}

export function PathInput({ path, onPathChange }: Props) {
  const [isMounted, setIsMounted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // 当path是base64时，自动折叠输入框
    if (path.startsWith('data:image/')) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
  }, [path]);

  const handleClear = () => {
    onPathChange("");
    setIsCollapsed(false);
  };

  const isBase64 = path.startsWith('data:image/');

  if (!isMounted) {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-600">图片所在目录的绝对路径或Base64图片数据</label>
        <input
          disabled
          type="text"
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="加载中..."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-600">
        图片所在目录的绝对路径或Base64图片数据
      </label>
      {isCollapsed ? (
        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
          <div className="flex-1">
            <p className="text-sm text-blue-600">已加载Base64图片数据</p>
            <p className="text-xs text-gray-500 truncate" title={path}>
              {path.substring(0, 50)}...
            </p>
          </div>
          <button
            onClick={handleClear}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-blue-100 rounded-full"
            title="清除Base64数据"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="relative">
          <input
            type="text"
            value={path}
            onChange={(e) => onPathChange(e.target.value)}
            placeholder="支持：1. 目录路径，如 D:\Images  2. Base64图片数据，如 data:image/png;base64,..."
            className={`w-full px-4 py-2 border rounded-lg ${
              isBase64 ? 'bg-blue-50' : ''
            }`}
          />
          {path && (
            <button
              onClick={handleClear}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}
        </div>
      )}
      {isBase64 && !isCollapsed && (
        <p className="text-xs text-blue-600">
          已检测到Base64图片数据
        </p>
      )}
    </div>
  );
} 