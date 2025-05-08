// src/components/ColorPalette.tsx
import { FaTrash } from "react-icons/fa";

type ColorPaletteProps = {
  colors: string[];
  onRemoveColor: (color: string) => void;
};

export default function ColorPalette({ colors, onRemoveColor }: ColorPaletteProps) {
  return (
    <div className="bg-gray-800 p-5 rounded-xl mb-8 shadow-lg">
      <h3 className="text-2xl text-gray-100 font-semibold mb-3">
        Your Palette {colors.length > 0 && `(${colors.length})`}
      </h3>
      {colors.length === 0 ? (
        <p className="text-gray-400">Add some colors to get started</p>
      ) : (
        <div className="grid grid-cols-6 gap-3">
          {colors.map(color => (
            <div key={color} className="relative group rounded overflow-hidden">
              <div
                className="aspect-square border-2 border-gray-900"
                style={{ backgroundColor: color }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 bg-black bg-opacity-50 transition-opacity">
                {/* Removed the hex code span here */}
                <button
                  onClick={() => onRemoveColor(color)}
                  className="bg-black bg-opacity-60 p-1 rounded-full text-red-400 hover:text-red-600"
                  aria-label={`Remove color ${color}`}
                >
                  <FaTrash size={10} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}