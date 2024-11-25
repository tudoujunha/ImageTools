export async function generateImageList(
  files: File[],
  outputMode: "clipboard" | "file"
) {
  const fileList = await Promise.all(
    files.map(async (file) => ({
      absolute_path: URL.createObjectURL(file),
      filename: file.name,
    }))
  );

  const jsonStr = JSON.stringify(fileList, null, 2);

  if (outputMode === "clipboard") {
    await navigator.clipboard.writeText(jsonStr);
    return {
      success: true,
      message: `已复制 ${files.length} 个文件信息到剪贴板`,
    };
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

    return {
      success: true,
      message: `已生成文件列表，共 ${files.length} 个文件`,
    };
  }
}

export async function processImages(files: File[]) {
  let successCount = 0;
  let failCount = 0;

  for (const file of files) {
    try {
      const image = await createImageBitmap(file);
      const { width, height } = image;
      
      // 创建四个画布用于切割
      const quarters = [
        { name: 'top_left', x: 0, y: 0 },
        { name: 'top_right', x: width / 2, y: 0 },
        { name: 'bottom_left', x: 0, y: height / 2 },
        { name: 'bottom_right', x: width / 2, y: height / 2 }
      ];

      for (const quarter of quarters) {
        const canvas = document.createElement('canvas');
        canvas.width = width / 2;
        canvas.height = height / 2;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.drawImage(
            image,
            quarter.x,
            quarter.y,
            width / 2,
            height / 2,
            0,
            0,
            width / 2,
            height / 2
          );

          // 转换为 blob 并下载
          const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((blob) => {
              resolve(blob!);
            }, 'image/png');
          });

          // 创建下载链接
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          const fileName = file.name.replace(/\.[^/.]+$/, '');
          a.href = url;
          a.download = `${fileName}_${quarter.name}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }
      
      successCount++;
    } catch (error) {
      console.error(`处理图片失败: ${file.name}`, error);
      failCount++;
    }
  }

  return {
    success: true,
    message: `处理完成！\n成功：${successCount}个文件\n失败：${failCount}个文件`,
  };
} 