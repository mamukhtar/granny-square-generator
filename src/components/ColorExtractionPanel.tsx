// src/components/ColorExtractionPanel.tsx
import { useState, useRef, useEffect } from "react";
import { extractDominantColors } from "../utils/colorExtractor";

type ExtractedColor = {
  color: string;
  original: string;
};

type ColorExtractionPanelProps = {
  imageUrl: string | null;
  onColorsExtracted: (colors: string[]) => void;
};

export default function ColorExtractionPanel({ 
  imageUrl, 
  onColorsExtracted 
}: ColorExtractionPanelProps) {
  const [colorCount, setColorCount] = useState(3);
  const [extractedColors, setExtractedColors] = useState<ExtractedColor[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const colorInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Extract colors when image or color count changes
  useEffect(() => {
    if (!imageUrl) return;
    
    const extractColors = async () => {
      setIsExtracting(true);
      try {
        const colors = await extractDominantColors(imageUrl, colorCount);
        const colorObjects = colors.map(color => ({ color, original: color }));
        setExtractedColors(colorObjects);
        onColorsExtracted(colors);
        
      } catch (error) {
        console.error("Error extracting colors:", error);
      } finally {
        setIsExtracting(false);
      }
    };
    
    extractColors();
  }, [imageUrl, colorCount, onColorsExtracted]);

  // Update colors when user edits them
  const updateColor = (index: number, newColor: string) => {
    
    const updatedColors = [...extractedColors];
    updatedColors[index].color = newColor;
    setExtractedColors(updatedColors);
    
    // Important: Update parent component with new colors
    onColorsExtracted(updatedColors.map(c => c.color));
  };

  // Reset a color to its original value
  const resetColor = (index: number) => {
    const updatedColors = [...extractedColors];
    updatedColors[index].color = updatedColors[index].original;
    setExtractedColors(updatedColors);
    
    // Update parent component
    onColorsExtracted(updatedColors.map(c => c.color));
  };

  if (!imageUrl) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-400">Upload a book cover to extract colors</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-gray-300 mb-2 font-medium">Number of Colors</label>
        <input
          type="range"
          min="3"
          max="8"
          value={colorCount}
          onChange={(e) => setColorCount(parseInt(e.target.value))}
          className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-400">3</span>
          <span className="text-xs text-gray-400">{colorCount} colors</span>
          <span className="text-xs text-gray-400">8</span>
        </div>
      </div>
      
      {isExtracting ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500 mx-auto mb-3"></div>
          <p className="text-gray-300">Extracting colors...</p>
        </div>
      ) : extractedColors.length > 0 ? (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-gray-300 font-medium">Extracted Colors</h4>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1 rounded"
            >
              {isEditing ? "Done Editing" : "Edit Colors"}
            </button>
          </div>
          
          <div className="grid grid-cols-5 gap-2">
            {extractedColors.map((colorObj, index) => (
              <div key={index} className="text-center">
                <div 
                  className={`aspect-square rounded-md border border-zinc-600 mb-1 ${isEditing ? 'cursor-pointer' : ''}`}
                  style={{ backgroundColor: colorObj.color }}
                  onClick={() => {
                    if (isEditing && colorInputRefs.current[index]) {
                      colorInputRefs.current[index]?.click();
                    }
                  }}
                />
                
                {isEditing ? (
                  <div className="flex text-xs space-x-1">
                    <input 
                      ref={el => { colorInputRefs.current[index] = el }}
                      type="color"
                      value={colorObj.color}
                      onChange={(e) => updateColor(index, e.target.value)}
                      className="hidden"
                    />
                    <button 
                      onClick={() => colorInputRefs.current[index]?.click()}
                      className="text-teal-400 hover:text-teal-300"
                    >
                      Edit
                    </button>
                    {colorObj.color !== colorObj.original && (
                      <button 
                        onClick={() => resetColor(index)}
                        className="text-gray-400 hover:text-gray-300"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                ) : (
                  <span className="text-xs font-mono text-gray-400">{colorObj.color}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-400">No colors extracted yet</p>
        </div>
      )}
    </div>
  );
}