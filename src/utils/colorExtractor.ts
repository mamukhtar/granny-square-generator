// src/utils/colorExtractor.ts

/**
 * Extracts dominant colors from an image
 * @param imageUrl URL or data URL of the image
 * @param colorCount Number of colors to extract
 * @returns Promise with array of hex color codes
 */
export const extractDominantColors = async (
    imageUrl: string,
    colorCount: number = 5
  ): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      
      img.onload = () => {
        // Create a canvas to analyze the image
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }
        
        // Set canvas size to match image
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw image on canvas
        ctx.drawImage(img, 0, 0);
        
        // Get image data (pixels)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        
        // Simple color quantization and clustering
        // For production, consider using a more sophisticated algorithm
        const colorMap: Record<string, number> = {};
        
        // Sample pixels (every 5th pixel for performance)
        for (let i = 0; i < pixels.length; i += 20) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          
          // Convert to hex
          const hex = rgbToHex(r, g, b);
          
          // Count color occurrences
          colorMap[hex] = (colorMap[hex] || 0) + 1;
        }
        
        // Sort colors by frequency
        const sortedColors = Object.entries(colorMap)
          .sort((a, b) => b[1] - a[1])
          .map(([color]) => color);
        
        // Filter colors to ensure diversity
        const diverseColors: string[] = [];
        for (const color of sortedColors) {
          // Only add if not too similar to already chosen colors
          if (!diverseColors.some(c => getColorDistance(color, c) < 30)) {
            diverseColors.push(color);
            if (diverseColors.length >= colorCount) break;
          }
        }
        
        resolve(diverseColors);
      };
      
      img.onerror = () => {
        reject(new Error("Could not load image"));
      };
      
      img.src = imageUrl;
    });
  };
  
  /**
   * Calculate Euclidean distance between two colors in RGB space
   * @param color1 First color (hex)
   * @param color2 Second color (hex)
   * @returns Distance value (lower means more similar)
   */
  export const getColorDistance = (color1: string, color2: string): number => {
    // Convert hex to RGB
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return Number.MAX_VALUE;
    
    // Calculate distance using Euclidean formula
    return Math.sqrt(
      Math.pow(rgb1.r - rgb2.r, 2) +
      Math.pow(rgb1.g - rgb2.g, 2) +
      Math.pow(rgb1.b - rgb2.b, 2)
    );
  };
  
  /**
   * Convert RGB to hex color
   */
  export const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };
  
  /**
   * Convert hex color to RGB
   */
  export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  };