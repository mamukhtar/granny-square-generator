// src/pages/BasicGenerator.tsx
import { useState, useRef } from "react";
import ColorPickerPanel from "../components/ColorPickerPanel";
import ColorPalette from "../components/ColorPalette";
import GrannySquare from "../components/GrannySquare";
import { FaDownload, FaRandom } from "react-icons/fa";
import { exportGridAsPNG } from "../utils/exportUtils";

type GridSquare = {
  id: string;
  colors: string[];
};

// squareSize will be calculated inside the BasicGenerator function


export default function BasicGenerator() {
  // Same state logic as before
  const [colors, setColors] = useState<string[]>([
    "#4a701f", "#155b3e", "#1c71d9", "#7a9178"
  ]);
  
  const [rows, setRows] = useState<number>(8);
  const [columns, setColumns] = useState<number>(8);
  const [colorsPerSquare, setColorsPerSquare] = useState<number>(4);

  const [generatedGrid, setGeneratedGrid] = useState<GridSquare[][]>([]);
  const gridRef = useRef<HTMLDivElement>(null);
  
  // Same functions as before
  const addColor = (c: string) => {
    if (!colors.includes(c)) setColors([...colors, c]);
  };
  
  const removeColor = (c: string) => setColors(colors.filter(col => col !== c));
  
  const generateGrid = () => {
    // Same logic as before
    if (colors.length === 0) {
      alert('Please add at least one color');
      return;
    }
    
    if (colorsPerSquare > colors.length) {
      alert(`You can't have more colors per square than total colors. 
             You have ${colors.length} colors and are trying to use ${colorsPerSquare} per square.`);
      return;
    }
    
    const newGrid: GridSquare[][] = [];
    
    for (let i = 0; i < rows; i++) {
      const row: GridSquare[] = [];
      
      for (let j = 0; j < columns; j++) {
        const shuffledColors = [...colors]
          .sort(() => Math.random() - 0.5)
          .slice(0, colorsPerSquare);
        
        row.push({
          id: `${i}-${j}`,
          colors: shuffledColors,
        });
      }
      
      newGrid.push(row);
    }
    
    setGeneratedGrid(newGrid);
  };
  
  const exportAsPNG = () => {
    if (gridRef.current) {
      exportGridAsPNG(gridRef.current, 'granny-square-pattern.png');
    }
  };
  
  return (
    <div>
      {/* Two-column layout for larger screens */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column - Controls */}
        <div className="lg:col-span-4 space-y-6">
          {/* Color Selection Card */}
          <div className="bg-zinc-800 rounded-xl overflow-hidden shadow-lg border border-zinc-700">
            <div className="bg-gradient-to-r from-teal-700 to-teal-800 px-6 py-3">
              <h3 className="text-xl font-bold text-white">Color Selection</h3>
            </div>
            <div className="p-6">
              <ColorPickerPanel onAddColor={addColor} />
              <ColorPalette colors={colors} onRemoveColor={removeColor} />
            </div>
          </div>
          
          {/* Grid Settings Card */}
          <div className="bg-zinc-800 rounded-xl overflow-hidden shadow-lg border border-zinc-700">
            <div className="bg-gradient-to-r from-teal-700 to-teal-800 px-6 py-3">
              <h3 className="text-xl font-bold text-white">Grid Settings</h3>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Rows:</label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={rows}
                  onChange={(e) => setRows(parseInt(e.target.value))}
                  className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-400">1</span>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={rows}
                    onChange={(e) => setRows(parseInt(e.target.value) || 1)}
                    className="w-16 p-1 text-center border border-zinc-600 bg-zinc-700 text-white rounded"
                  />
                  <span className="text-xs text-gray-400">20</span>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Columns:</label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={columns}
                  onChange={(e) => setColumns(parseInt(e.target.value))}
                  className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-400">1</span>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={columns}
                    onChange={(e) => setColumns(parseInt(e.target.value) || 1)}
                    className="w-16 p-1 text-center border border-zinc-600 bg-zinc-700 text-white rounded"
                  />
                  <span className="text-xs text-gray-400">20</span>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Colors per Square:</label>
                <input
                  type="range"
                  min="1"
                  max={Math.min(10, colors.length)}
                  value={colorsPerSquare}
                  onChange={(e) => setColorsPerSquare(parseInt(e.target.value))}
                  className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                  disabled={colors.length === 0}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-400">1</span>
                  <input
                    type="number"
                    min="1"
                    max={Math.min(10, colors.length)}
                    value={colorsPerSquare}
                    onChange={(e) => setColorsPerSquare(parseInt(e.target.value) || 1)}
                    className="w-16 p-1 text-center border border-zinc-600 bg-zinc-700 text-white rounded"
                    disabled={colors.length === 0}
                  />
                  <span className="text-xs text-gray-400">{Math.min(10, colors.length)}</span>
                </div>
              </div>
              
              <div className="pt-3">
                <button 
                  onClick={generateGrid} 
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white py-3 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={colors.length === 0}
                >
                  <FaRandom className="text-teal-300" />
                  <span>Generate Grid</span>
                </button>
                
                <p className="text-center text-sm text-gray-400 mt-2">
                  {colors.length === 0 
                    ? "Add colors to your palette first" 
                    : `Your grid will have ${rows * columns} granny squares`}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - Results */}
        <div className="lg:col-span-8">
          <div className="bg-zinc-800 rounded-xl overflow-hidden shadow-lg border border-zinc-700 h-full">
            <div className="bg-gradient-to-r from-teal-700 to-teal-800 px-6 py-3 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">
                Generated Granny Square Grid
              </h3>
              
              {generatedGrid.length > 0 && (
                <button 
                  onClick={exportAsPNG}
                  className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-1 rounded-md flex items-center gap-2 transition"
                >
                  <FaDownload size={14} />
                  <span>Export</span>
                </button>
              )}
            </div>
            
            <div className="p-6">
            {generatedGrid.length > 0 ? (
              <div className="overflow-auto" style={{ maxHeight: "100vh" }}>
                <div 
                  ref={gridRef}
                  className="grid bg-black p-4 rounded-lg mx-auto" 
                  style={{ 
                    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                    gap: columns > 10 ? "2px" : "3px",
                    width: `${Math.min(columns * 100, 1200)}px`, // Wider container based on columns
                    maxWidth: "100%"
                  }}
                >
                  {generatedGrid.flat().map(square => (
                    <GrannySquare 
                      key={square.id} 
                      colors={square.colors} 
                    />
                  ))}
                </div>
              </div> 
              ) : (
                <div className="flex flex-col items-center justify-center h-80 text-center">
                  <div className="text-8xl mb-4">🧶</div>
                  <h3 className="text-xl font-bold text-gray-300 mb-2">No Pattern Generated Yet</h3>
                  <p className="text-gray-400 max-w-md">
                    Use the controls on the left to select colors and grid dimensions, 
                    then click "Generate Grid" to create your pattern.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}