export function getCroppedImg(
    imageSrc: string,
    pixelCrop: { x: number; y: number; width: number; height: number },
    zoom: number
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
  
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
        if (!ctx) {
          return reject(new Error('Could not get canvas context'));
        }
  
        const { width, height } = pixelCrop;
  
        canvas.width = width;
        canvas.height = height;
  
        const scaleX = image.width / width;
        const scaleY = image.height / height;
  
        const cropWidth = Math.min(image.width, width * scaleX);
        const cropHeight = Math.min(image.height, height * scaleY);
        const cropX = (image.width - cropWidth) / 2;
        const cropY = (image.height - cropHeight) / 2;
  
        ctx.drawImage(
          image,
          cropX, cropY, cropWidth, cropHeight,  
          0, 0, width, height  
        );
  
        canvas.toBlob((blob) => {
          if (!blob) {
            return reject(new Error('Failed to create blob'));
          }
          resolve(blob);
        }, 'image/jpeg');
      };
  
      image.onerror = (error) => {
        if (error instanceof Event) {
          reject(new Error('Image failed to load'));
        } else {
          reject(new Error(`Image failed to load: ${error}`));
        }
      };
    });
  }
  