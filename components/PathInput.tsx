interface Props {
  path: string;
  onPathChange: (path: string) => void;
}

export function PathInput({ path, onPathChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-600">图片所在目录的绝对路径</label>
      <input
        type="text"
        value={path}
        onChange={(e) => onPathChange(e.target.value)}
        placeholder="例如: D:\Images 或 /Users/username/Pictures"
        className="w-full px-4 py-2 border rounded-lg"
      />
    </div>
  );
} 