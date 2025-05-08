// src/components/YarnMatchingPanel.tsx
import type { YarnInfo } from "../utils/excelParser";
import type { ColorMatch } from "../utils/yarnMatcher";

type YarnMatchingPanelProps = {
  colorMatches: ColorMatch[];
  onManualMatch?: (colorIndex: number, yarnId: string) => void;
  availableYarns: YarnInfo[];
};

export default function YarnMatchingPanel({ 
  colorMatches, 
  onManualMatch, 
  availableYarns 
}: YarnMatchingPanelProps) {
  if (colorMatches.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-400">No yarn matches yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="text-gray-300 font-medium">Matched Yarns</h4>
      
      {colorMatches.map((match, index) => (
        <div key={index} className="bg-zinc-700 rounded-md p-3">
          <div className="flex items-center mb-2">
            <div className="flex-shrink-0 space-x-2 flex">
              <div 
                className="w-8 h-8 rounded-md border border-zinc-600"
                style={{ backgroundColor: match.bookColor }}
              />
              <div className="flex items-center">
                <span className="text-zinc-400">➔</span>
              </div>
              <div 
                className="w-8 h-8 rounded-md border border-zinc-600"
                style={{ backgroundColor: match.matchedYarn.colorHex }}
              />
            </div>
            
            <div className="ml-4 flex-1">
              <div className="font-medium text-white">
                {match.matchedYarn.name}
              </div>
              <div className="text-xs text-gray-400">
                {match.matchedYarn.type} • Size {match.matchedYarn.size}
              </div>
            </div>
            
            <div className="text-right text-sm text-gray-300">
              {match.matchedYarn.quantity} skeins available
            </div>
          </div>
          
          {onManualMatch && (
            <div className="mt-2 pt-2 border-t border-zinc-600 flex justify-end">
                <select 
                    className="text-xs bg-zinc-800 text-gray-300 border border-zinc-600 rounded p-1"
                    value={match.matchedYarn.id}
                    onChange={(e) => onManualMatch(index, e.target.value)}
                    >
                    {availableYarns.map((yarn, i) => (
                    <option 
                        key={`match-${index}-yarn-${yarn.id}-${i}`}  // add `i` to ensure uniqueness
                        value={yarn.id}
                    >
                        {yarn.name} ({yarn.colorHex})
                    </option>
                    ))}
                    </select>
            </div>
            )}
        </div>
      ))}
    </div>
  );
}