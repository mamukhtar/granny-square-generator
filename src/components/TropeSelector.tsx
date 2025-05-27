// src/components/TropeSelector.tsx
import { useState, useRef, useEffect } from "react";

type TropeSelectorProps = {
  trope: string;
  tropeColor: string;
  onTropeChange: (trope: string) => void;
  onColorChange: (color: string) => void;
};

// Literary tropes with their associated colors
type TropeInfo = {
  name: string;
  color: string;
  description: string;
};

// Complete trope mapping based on your table
const tropeColorMap: TropeInfo[] = [
  { name: "Friends to Lovers", color: "#7BEBFC", description: "Calmness, trust, and friendship" },
  { name: "Enemies to Lovers", color: "#FA1338", description: "Passion and fiery tension" },
  { name: "Second Chance Romance", color: "#985CA8", description: "Nostalgia and emotional growth" },
  { name: "Fake Dating", color: "#F1A049", description: "Playful pretenses and the glimmer of something real" },
  { name: "Arranged Marriage", color: "#CBC4A9", description: "Tradition, purity, and the formality of arranged marriages" },
  { name: "Forced Proximity", color: "#00A550", description: "Grounding, intimacy, and personal growth" },
  { name: "Slow Burn", color: "#B9E267", description: "Gradual build-up of feelings, like a flickering flame" },
  { name: "Small Town Romance", color: "#183628", description: "Cozy, earthy vibes and community" },
  { name: "Royalty", color: "#242385", description: "Luxury, power, and romance" },
  { name: "Billionaire", color: "#AAAAAA", description: "Symbolizes luxury, modernity, and prestige" },
  { name: "Grumpy/Sunshine", color: "#FEFE8B", description: "Cheerful, uplifting energy of the 'sunshine' character" },
  { name: "Opposites Attract", color: "#FFC0CB", description: "Contrast and romance that blends personalities" },
  { name: "Childhood Sweethearts", color: "#FFB6C1", description: "Innocence and warmth of young love" },
  { name: "Forbidden Romance", color: "#0D177D", description: "Secrecy and depth of emotion" },
  { name: "Workplace Romance", color: "#797979", description: "Professionalism with a hint of intrigue" },
  { name: "Holiday Romance", color: "#FF3B30", description: "Festive, passionate, and cozy" },
  { name: "Marriage of Convenience", color: "#CBC4A9", description: "Subtlety and the evolution of a practical arrangement into love" },
  { name: "Mythical/Paranormal Romance", color: "#60335f", description: "Mysterious and magical vibes" },
  { name: "Celebrity/Ordinary Person", color: "#EE8236", description: "Glamour and the allure of stardom" },
  { name: "Secret Identity/Hidden Past", color: "#808080", description: "Intrigue and hidden layers" },
  { name: "Sports Romance", color: "#A72221", description: "Energetic, competitive, and dynamic" },
  { name: "Age Gap Romance", color: "#D67D89", description: "Gentle yet bold, representing growth and balance" },
  { name: "Single Parent Romance", color: "#C597F6", description: "A fresh start and rediscovery of love" },
  { name: "Best Friend's Sibling", color: "#ED7FA5", description: "Romantic with a hint of forbidden allure" },
  { name: "Revenge Turned Romance", color: "#A52A2A", description: "Intense emotions and unexpected depth" },
  { name: "Fairy Tale Retelling", color: "#00A550", description: "Classic and whimsical" },
  { name: "Mafia Romance", color: "#000000", description: "Danger, power, and passion" },
  { name: "Dark Romance", color: "#860889", description: "Darker, intense, and morally complex themes" },
  { name: "Accidental Pregnancy", color: "#860889", description: "Symbolizes hope, new beginnings, and a fresh chapter in life" }
];

export default function TropeSelector({ 
  trope, 
  tropeColor, 
  onTropeChange, 
  onColorChange 
}: TropeSelectorProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const pickerRef = useRef<HTMLDivElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  // Filter tropes based on search term
  const filteredTropes = searchTerm 
    ? tropeColorMap.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : tropeColorMap;

  // Handle trope selection with auto-color
  const handleTropeSelect = (tropeName: string) => {
    onTropeChange(tropeName);
    
    // Auto-set the color if trope exists in our map
    const selectedTrope = tropeColorMap.find(t => t.name === tropeName);
    if (selectedTrope) {
      onColorChange(selectedTrope.color);
    }
  };

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

  // Trigger color input click when showColorPicker becomes true
  useEffect(() => {
    if (showColorPicker && colorInputRef.current) {
      setTimeout(() => {
        colorInputRef.current?.click();
      }, 10);
    }
  }, [showColorPicker]);


  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-300 mb-2 font-medium">Book Trope</label>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a trope..."
            className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded text-white mb-2"
          />
          <div className="max-h-40 overflow-y-auto bg-zinc-700 rounded-md mb-3">
            {filteredTropes.length > 0 ? (
              filteredTropes.map((tropeInfo) => (
                <div 
                  key={tropeInfo.name}
                  className={`flex items-center p-2 cursor-pointer hover:bg-zinc-600 ${tropeInfo.name === trope ? 'bg-zinc-600' : ''}`}
                  onClick={() => {
                    handleTropeSelect(tropeInfo.name);
                    setSearchTerm("");
                  }}
                >
                  <div 
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: tropeInfo.color }}
                  />
                  <div>
                    <div className="text-sm text-white">{tropeInfo.name}</div>
                    <div className="text-xs text-gray-400">{tropeInfo.description}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-2 text-sm text-gray-400">No tropes found. Type to search again.</div>
            )}
          </div>
          
          <div className="flex items-center bg-zinc-800 p-3 rounded-md">
            {trope ? (
              <>
                <div 
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: tropeColor }}
                />
                <span className="text-white font-medium">{trope}</span>
                <span className="ml-auto text-sm text-gray-400">Selected</span>
              </>
            ) : (
              <span className="text-gray-400">No trope selected yet</span>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          A trope is a common theme or device in literature
        </p>
      </div>
      
      <div>
        <label className="block text-gray-300 mb-2 font-medium">Trope Color</label>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowColorPicker(true)}
            className="w-10 h-10 rounded-md border border-zinc-600"
            style={{ backgroundColor: tropeColor }}
            aria-label="Select trope color"
          />
          
          <input
            type="text"
            value={tropeColor}
            onChange={(e) => onColorChange(e.target.value)}
            className="flex-1 p-2 bg-zinc-700 border border-zinc-600 rounded text-white font-mono"
          />
          
          {showColorPicker && (
            <div 
              ref={pickerRef}
              className="absolute z-50 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl overflow-hidden"
              style={{ 
                top: '50%', 
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '240px'
              }}
            >
              <div className="border-b border-zinc-700 px-3 py-2 flex justify-between">
                <span className="text-sm font-medium text-zinc-300">Select Trope Color</span>
                <span className="text-xs font-mono text-zinc-400">{tropeColor}</span>
              </div>
              <input
                ref={colorInputRef}
                type="color"
                value={tropeColor}
                onChange={e => onColorChange(e.target.value)}
                className="w-full h-40 cursor-pointer"
              />
            </div>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1">
          This color will be used for the outer ring of each granny square
        </p>
      </div>
    </div>
  );
}
