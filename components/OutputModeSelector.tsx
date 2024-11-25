interface Props {
  mode: "clipboard" | "file";
  onChange: (mode: "clipboard" | "file") => void;
}

export function OutputModeSelector({ mode, onChange }: Props) {
  return (
    <div className="flex gap-4">
      <label className="flex items-center gap-2">
        <input
          type="radio"
          checked={mode === "clipboard"}
          onChange={() => onChange("clipboard")}
          name="outputMode"
        />
        复制图片列表到剪贴板
      </label>
      <label className="flex items-center gap-2">
        <input
          type="radio"
          checked={mode === "file"}
          onChange={() => onChange("file")}
          name="outputMode"
        />
        生成图片列表为文件
      </label>
    </div>
  );
} 