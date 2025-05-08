// src/pages/BookInspired.tsx
import { useState, useRef, useCallback } from "react";
import { FaImage, FaTable, FaDownload, FaRandom } from "react-icons/fa";
import GrannySquare from "../components/GrannySquare";
import TropeSelector from "../components/TropeSelector";
import ColorExtractionPanel from "../components/ColorExtractionPanel";
import YarnMatchingPanel from "../components/YarnMatchingPanel";
import {exportDesignSheet } from "../utils/exportUtils";

// Import utilities
import { parseYarnExcel, downloadYarnTemplate } from "../utils/excelParser";
import { matchColorsToYarn, calculateYarnUsage } from "../utils/yarnMatcher";
import type { YarnInfo } from "../utils/excelParser";
import type { ColorMatch } from "../utils/yarnMatcher";

type GridSquare = {
  id: string;
  colors: string[];
};

type BookInfo = {
  title: string;
  author: string;
  trope: string;
  tropeColor: string;
};

export default function BookInspired() {
  // State for uploaded files
  const [bookCover, setBookCover] = useState<string | null>(null);
  const [yarns, setYarns] = useState<YarnInfo[]>([]);
  
  // State for extracted colors
  const [extractedColors, setExtractedColors] = useState<string[]>([]);
  const [colorMatches, setColorMatches] = useState<ColorMatch[]>([]);
  
  // State for book info
  const [bookInfo, setBookInfo] = useState<BookInfo>({
    title: "",
    author: "",
    trope: "",
    tropeColor: "#663399" // Default purple
  });
  
  // State for grid
  const [rows, setRows] = useState(8);
  const [columns, setColumns] = useState(8);
  const [generatedGrid, setGeneratedGrid] = useState<GridSquare[][]>([]);
  
  // State for workflow stages
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // References for file inputs
  const bookInputRef = useRef<HTMLInputElement>(null);
  const excelInputRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Handle book cover upload
  const handleBookCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setBookCover(event.target.result as string);
        setCurrentStep(Math.max(currentStep, 2));
      }
    };
    reader.readAsDataURL(file);
  };
  
  // Handle yarn data upload
  const handleYarnDataUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsProcessing(true);
    try {
      const yarnData = await parseYarnExcel(file);
      setYarns(yarnData);
      setCurrentStep(Math.max(currentStep, 3));
    } catch (error) {
      console.error("Error parsing yarn data:", error);
      alert("Failed to parse yarn data. Please check the file format.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle extracted colors
  const handleColorsExtracted = useCallback((colors: string[]) => {
    setExtractedColors(colors);
  
    if (colors.length > 0 && yarns.length > 0) {
      const matches = matchColorsToYarn(colors, yarns);
      setColorMatches(matches);
      setCurrentStep((prev) => Math.max(prev, 4));
    }
  }, [yarns, currentStep]);
  
  
  // Handle manual yarn match
  const handleManualMatch = (colorIndex: number, yarnId: string) => {
    const selectedYarn = yarns.find(yarn => yarn.id === yarnId);
    if (!selectedYarn) return;
    
    const updatedMatches = [...colorMatches];
    updatedMatches[colorIndex] = {
      ...updatedMatches[colorIndex],
      matchedYarn: selectedYarn
    };
    
    setColorMatches(updatedMatches);
  };


// Inside your component
const handleTropeChange = useCallback((trope: string) => {
  setBookInfo(prev => ({ ...prev, trope }));
}, []);

const handleTropeColorChange = useCallback((color: string) => {
  setBookInfo(prev => ({ ...prev, tropeColor: color }));
}, []);

  
  
  // Generate grid
const generateGrid = () => {
  if (colorMatches.length === 0) {
    alert('Please extract colors and match yarns first');
    return;
  }
  
  if (!bookInfo.trope) {
    alert('Please select a book trope first');
    return;
  }
  
  setIsProcessing(true);
  
  try {
    
    // Generate the grid
    const newGrid: GridSquare[][] = [];
    
    for (let i = 0; i < rows; i++) {
      const row: GridSquare[] = [];
      
      for (let j = 0; j < columns; j++) {
        // Get shuffled yarn colors (excluding trope color)
        const innerColors = colorMatches
          .map(match => match.matchedYarn.colorHex)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        
        // Add trope color as last color
        const squareColors = [...innerColors, bookInfo.tropeColor];

        
        row.push({
          id: `square-${i}-${j}`,
          colors: squareColors,
        }); 
      }
      
      newGrid.push(row);
    }
    
    // Update state
    setGeneratedGrid(newGrid);
  } catch (error) {
    console.error("Error generating grid:", error);
    alert("Something went wrong while generating the grid");
  } finally {
    setIsProcessing(false);
    setCurrentStep(5); // Final step
  }
};
  
  // Export grid
  const exportGrid = () => {
    if (gridRef.current) {
      exportDesignSheet(
        gridRef.current,
        bookInfo.title || 'Book-Inspired-Pattern',
        colorMatches.map(m => m.matchedYarn),
        { name: bookInfo.trope, color: bookInfo.tropeColor }
      );
    }
  };

  // Check if we can proceed to the next step
  const canProceedToStep = (step: number) => {
    switch (step) {
      case 2: // Color Extraction
        return !!bookCover;
      case 3: // Yarn Matching
        return extractedColors.length > 0 && yarns.length > 0;
      case 4: // Trope Selection & Grid Settings
        return colorMatches.length > 0 && bookInfo.trope.trim() !== '';
      case 5: // Generate Grid
        return true;
      default:
        return false;
    }
  };
  
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column - Upload and settings */}
        <div className="lg:col-span-4 space-y-6">
          {/* Book Cover Upload */}
          <div className="bg-zinc-800 rounded-xl overflow-hidden shadow-lg border border-zinc-700">
            <div className="bg-gradient-to-r from-teal-700 to-teal-800 px-6 py-3">
              <h3 className="text-xl font-bold text-white">Book Cover</h3>
            </div>
            <div className="p-6">
              {/* Book Cover Upload Logic */}
              {bookCover ? (
                <div className="space-y-4">
                  <div className="relative w-full h-60 rounded-md overflow-hidden">
                    <img 
                      src={bookCover} 
                      alt="Book Cover" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-1">Title</label>
                      <input 
                        type="text"
                        value={bookInfo.title}
                        onChange={(e) => setBookInfo({...bookInfo, title: e.target.value})}
                        className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                        placeholder="Enter book title"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-1">Author</label>
                      <input 
                        type="text"
                        value={bookInfo.author}
                        onChange={(e) => setBookInfo({...bookInfo, author: e.target.value})}
                        className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                        placeholder="Enter author"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => bookInputRef.current?.click()}
                    className="w-full py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded flex items-center justify-center gap-2"
                  >
                    <FaImage size={14} />
                    <span>Change Cover</span>
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-zinc-600 rounded-lg p-8 text-center">
                  <FaImage size={48} className="mx-auto text-zinc-500 mb-4" />
                  <p className="text-gray-400 mb-4">
                    Upload a book cover to extract colors
                  </p>
                  <button 
                    onClick={() => bookInputRef.current?.click()}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Select Image"}
                  </button>
                </div>
              )}
              <input
                ref={bookInputRef}
                type="file"
                onChange={handleBookCoverUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          {/* Color Extraction Panel - moved here */}
          {bookCover && (
            <div className="bg-zinc-800 rounded-xl overflow-hidden shadow-lg border border-zinc-700">
              <div className="bg-gradient-to-r from-teal-700 to-teal-800 px-6 py-3">
                <h3 className="text-xl font-bold text-white">Color Extraction</h3>
              </div>
              <div className="p-6">
                <ColorExtractionPanel 
                  imageUrl={bookCover}
                  onColorsExtracted={handleColorsExtracted}
                />
              </div>
            </div>
          )}

          {/* Yarn Data Upload - moved after Color Extraction */}
          <div className="bg-zinc-800 rounded-xl overflow-hidden shadow-lg border border-zinc-700">
            <div className="bg-gradient-to-r from-teal-700 to-teal-800 px-6 py-3">
              <h3 className="text-xl font-bold text-white">Yarn Stash</h3>
            </div>
            <div className="p-6">
              {/* Yarn Data Upload Logic */}
              {isProcessing ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500 mx-auto mb-3"></div>
                  <p className="text-gray-300">Processing yarn data...</p>
                </div>
              ) : yarns.length > 0 ? (
                <div className="space-y-4">
                  <div className="bg-zinc-700 p-3 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-medium">
                        {yarns.length} yarns loaded
                      </span>
                      <span className="text-xs text-gray-400">
                        {Array.from(new Set(yarns.map(y => y.category))).filter(Boolean).length} categories
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                    {yarns.slice(0, 10).map((yarn, index) => (
                      <div 
                        key={`yarn-${index}-${yarn.id}`} 
                        className="w-6 h-6 rounded-full border border-zinc-600"
                        style={{ backgroundColor: yarn.colorHex }}
                        title={yarn.name}
                      />
                    ))}
                      {yarns.length > 10 && (
                        <div className="w-6 h-6 rounded-full bg-zinc-600 flex items-center justify-center text-xs text-white">
                          +{yarns.length - 10}
                        </div>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => excelInputRef.current?.click()}
                    className="w-full py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded flex items-center justify-center gap-2"
                  >
                    <FaTable size={14} />
                    <span>Change Yarn Data</span>
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-zinc-600 rounded-lg p-8 text-center">
                  <FaTable size={48} className="mx-auto text-zinc-500 mb-4" />
                  <p className="text-gray-400 mb-4">
                    Upload Excel/CSV file with your yarn data
                  </p>
                  <div className="flex flex-col space-y-2">
                    <button 
                      onClick={() => excelInputRef.current?.click()}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md"
                    >
                      Select File
                    </button>
                    <button 
                      onClick={() => downloadYarnTemplate()}
                      className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-md text-sm"
                    >
                      Download Template
                    </button>
                  </div>
                </div>
              )}
              <input
                ref={excelInputRef}
                type="file"
                onChange={handleYarnDataUpload}
                accept=".xlsx,.xls,.csv"
                className="hidden"
              />
            </div>
          </div>

          {/* Yarn Matching Panel */}
          {extractedColors.length > 0 && yarns.length > 0 && (
            <div className="bg-zinc-800 rounded-xl overflow-hidden shadow-lg border border-zinc-700">
              <div className="bg-gradient-to-r from-teal-700 to-teal-800 px-6 py-3">
                <h3 className="text-xl font-bold text-white">Yarn Matching</h3>
              </div>
              <div className="p-6">
                <YarnMatchingPanel 
                  colorMatches={colorMatches}
                  availableYarns={yarns}
                  onManualMatch={handleManualMatch}
                />
              </div>
            </div>
          )}

          {/* Trope Selection */}
          {colorMatches.length > 0 && (
            <div className="bg-zinc-800 rounded-xl overflow-hidden shadow-lg border border-zinc-700">
              <div className="bg-gradient-to-r from-teal-700 to-teal-800 px-6 py-3">
                <h3 className="text-xl font-bold text-white">Book Trope & Grid</h3>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {/* Trope Selector */}
                  <TropeSelector 
                    trope={bookInfo.trope}
                    tropeColor={bookInfo.tropeColor}
                    onTropeChange={handleTropeChange}
                    onColorChange={handleTropeColorChange}
                  />  
                  {/* Grid Size Controls */}
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Grid Size</label>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Rows</label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={rows}
                          onChange={(e) => setRows(parseInt(e.target.value) || 1)}
                          className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Columns</label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={columns}
                          onChange={(e) => setColumns(parseInt(e.target.value) || 1)}
                          className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                        />
                      </div>
                    </div>
                    <button 
                      onClick={generateGrid}
                      className="w-full py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white rounded flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                      disabled={!canProceedToStep(4) || isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <FaRandom className="text-teal-300" size={14} />
                          <span>Generate Pattern</span>
                        </>
                      )}
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-2">
                      {canProceedToStep(4) 
                        ? `Your pattern will have ${rows * columns} granny squares` 
                        : "Complete the previous steps first"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Right column - Results */}
        <div className="lg:col-span-8 w-full max-w-[1200px] mx-auto">
          <div className="bg-zinc-800 rounded-xl overflow-hidden shadow-lg border border-zinc-700 h-full">
            <div className="bg-gradient-to-r from-teal-700 to-teal-800 px-6 py-3 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">
                Book-Inspired Granny Square Grid
              </h3>
              
              {generatedGrid.length > 0 && (
                <button 
                  onClick={exportGrid}
                  className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-1 rounded-md flex items-center gap-2 transition"
                >
                  <FaDownload size={14} />
                  <span>Export</span>
                </button>
              )}
            </div>
            
            <div className="p-6">
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center h-80">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mb-4"></div>
                  <p className="text-gray-300 text-lg">Generating your pattern...</p>
                </div>
              ) : generatedGrid.length > 0 ? (
                <div>
                  <div className="mb-4">
                    <div className="flex items-baseline justify-between">
                      <h2 className="text-xl font-bold text-white">
                        {bookInfo.title || "Unnamed Book"}
                      </h2>
                      <span className="text-gray-400">
                        by {bookInfo.author || "Unknown Author"}
                      </span>
                    </div>
                    <div className="flex items-center mt-1">
                      <div 
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: bookInfo.tropeColor }}
                      />
                      <span className="text-sm text-gray-300">
                        Trope: {bookInfo.trope}
                      </span>
                    </div>
                  </div>
                  
                  {/* Grid Display */}
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
                  {/* Yarn Usage Estimates */}
                  <div className="mt-6">
                    <h4 className="text-gray-300 font-medium mb-3">Estimated Yarn Usage</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {colorMatches.map((match, index) => (
                        <div 
                          key={index}
                          className="flex items-center p-2 bg-zinc-700 rounded-md border border-zinc-600"
                        >
                          <div 
                            className="w-6 h-6 rounded-full mr-2"
                            style={{ backgroundColor: match.matchedYarn.colorHex }}
                          />
                          <div className="flex-1">
                            <div className="text-sm text-white">{match.matchedYarn.name}</div>
                            <div className="text-xs text-gray-400">{match.matchedYarn.type}</div>
                          </div>
                          <div className="text-sm text-gray-300">
                            ~{calculateYarnUsage(match.matchedYarn, rows, columns)}g
                          </div>
                        </div>
                      ))}
                      <div 
                        className="flex items-center p-2 bg-zinc-700 rounded-md border border-zinc-600"
                      >
                        <div 
                          className="w-6 h-6 rounded-full mr-2"
                          style={{ backgroundColor: bookInfo.tropeColor }}
                        />
                        <div className="flex-1">
                          <div className="text-sm text-white">Trope Color</div>
                          <div className="text-xs text-gray-400">{bookInfo.trope}</div>
                        </div>
                        <div className="text-sm text-gray-300">
                          ~{rows * columns * 5}g
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-80 text-center">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-xl font-bold text-gray-300 mb-2">
                    Let's Create a Book-Inspired Pattern
                  </h3>
                  <p className="text-gray-400 max-w-md">
                    {!bookCover ? (
                      "Upload a book cover and your yarn data to get started."
                    ) : !yarns.length ? (
                      "Now upload your yarn stash Excel file to continue."
                    ) : !colorMatches.length ? (
                      "Extract colors from your book cover to match with your yarns."
                    ) : !bookInfo.trope ? (
                      "Enter a literary trope and generate your pattern."
                    ) : (
                      "Adjust settings and generate your pattern."
                    )}
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