// src/components/ColorPickerPanel.tsx
import { useState, useRef, useEffect } from "react";

type Props = { onAddColor: (color: string) => void };

export default function ColorPickerPanel({ onAddColor }: Props) {
  const [color, setColor] = useState("#430f57");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  // Handle clicking outside the color picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // This effect automatically triggers the color input click when showColorPicker becomes true
  useEffect(() => {
    if (showColorPicker && colorInputRef.current) {
      // Small timeout to ensure the DOM is ready
      setTimeout(() => {
        colorInputRef.current?.click();
      }, 10);
    }
  }, [showColorPicker]);

  const handleAddColor = () => {
    onAddColor(color);
  };

  return (
    <div className="mb-6">
      <h3 className="text-xl font-bold text-gray-100 mb-3">Pick a Color</h3>
      
      <div className="flex flex-col gap-5 mt-4">
        <div className="flex items-center gap-4">
          {/* Color preview / swatch button */}
          <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-12 h-12 rounded border border-gray-600 cursor-pointer"
              style={{ backgroundColor: color }}
              aria-label="Toggle color picker"
          />

          <div className="flex-1 flex gap-2">
            {/* Hex input */}
            <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="border border-gray-600 bg-gray-800 text-white font-mono rounded px-3 py-2 w-36 shadow-inner focus:outline-none focus:ring focus:ring-blue-500 transition"
            />

            {/* Add button - positioned beside the hex input */}
            <button
                onClick={handleAddColor}
                className="px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded shadow hover:from-teal-500 hover:to-teal-600 transition"
            >
                + Add
            </button>
          </div>
        </div>
        
        {/* Color picker overlay */}
        {showColorPicker && (
          <div 
            ref={pickerRef}
            className="absolute z-10 bg-gray-900 border border-gray-700 rounded shadow-lg p-3"
            style={{ width: '240px', top: '240px', left: '20px' }}
          >
            {/* Use the browser's native color picker inside our custom UI */}
            <input
              ref={colorInputRef}
              type="color"
              value={color}
              onChange={e => setColor(e.target.value)}
              className="w-full h-40 cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
}