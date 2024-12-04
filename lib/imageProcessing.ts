const isBrowser = typeof window !== 'undefined';

function getTimeStamp(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hour = now.getHours().toString().padStart(2, '0');
  const minute = now.getMinutes().toString().padStart(2, '0');
  const second = now.getSeconds().toString().padStart(2, '0');
  
  return `${year}${month}${day}_${hour}${minute}${second}`;
}

export async function generateImageList(
  files: File[],
  outputMode: "clipboard" | "file"
) {
  if (!isBrowser) {
    throw new Error('This function can only be used in browser environment');
  }
  
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

async function base64ToFile(base64String: string): Promise<File | null> {
  if (!isBrowser) {
    return null;
  }
  
  try {
    // 检查是否是有效的base64图片格式
    if (!base64String.startsWith('data:image/')) {
      return null;
    }

    // 从base64字符串中提取MIME类型和实际数据
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return null;
    }

    const mimeType = matches[1];
    const base64Data = matches[2];

    // 将base64转换为Blob
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }
    const blob = new Blob([new Uint8Array(byteArrays)], { type: mimeType });

    // 创建File对象
    return new File([blob], `split.${mimeType.split('/')[1]}`, { type: mimeType });
  } catch (error) {
    console.error('Base64转换失败:', error);
    return null;
  }
}

export async function processImages(files: File[], basePath?: string) {
  if (!isBrowser) {
    throw new Error('This function can only be used in browser environment');
  }
  
  let successCount = 0;
  let failCount = 0;

  // 如果提供了basePath且看起来像是base64字符串，尝试转换它
  if (basePath?.startsWith('data:image/')) {
    const base64File = await base64ToFile(basePath);
    if (base64File) {
      files = [base64File];
    }
  }

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
          a.download = `Image_${getTimeStamp()}_${fileName}_${quarter.name}.png`;
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