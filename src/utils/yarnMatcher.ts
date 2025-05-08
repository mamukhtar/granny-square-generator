// src/utils/yarnMatcher.ts
import type { YarnInfo } from './excelParser';
import { getColorDistance } from './colorExtractor';

export type ColorMatch = {
  bookColor: string;
  matchedYarn: YarnInfo;
  distance: number; // Color distance score (lower is better)
};

/**
 * Match extracted colors to available yarn colors
 * @param extractedColors Array of hex color codes from the book
 * @param availableYarns Array of available yarn information
 * @returns Array of matched colors with yarn info
 */
export const matchColorsToYarn = (
  extractedColors: string[],
  availableYarns: YarnInfo[]
): ColorMatch[] => {
  const matches: ColorMatch[] = [];
  
  for (const bookColor of extractedColors) {
    let bestMatch: YarnInfo | null = null;
    let minDistance = Number.MAX_VALUE;
    
    for (const yarnOption of availableYarns) {
      const distance = getColorDistance(bookColor, yarnOption.colorHex);
      
      if (distance < minDistance) {
        minDistance = distance;
        bestMatch = yarnOption;
      }
    }
    
    if (bestMatch) {
      matches.push({
        bookColor,
        matchedYarn: bestMatch,
        distance: minDistance
      });
    }
  }
  
  // Sort by closest match (lowest distance)
  return matches.sort((a, b) => a.distance - b.distance);
};

/**
 * Calculate estimated yarn usage for a grid
 * @param yarnInfo The yarn information
 * @param rows Grid rows
 * @param columns Grid columns
 * @returns Estimated yarn usage in grams
 */
export const calculateYarnUsage = (
    yarnInfo: YarnInfo,
    rows: number, 
    columns: number
  ): number => {
    // Calculate based on yarn type
    let usagePerSquare = 5; // Default: 5g per square
    
    // Adjust usage based on yarn type
    if (yarnInfo.type.toLowerCase().includes('light')) {
      usagePerSquare = 3; // Lighter yarn uses less
    } else if (yarnInfo.type.toLowerCase().includes('medium')) {
      usagePerSquare = 5; // Medium yarn uses moderate amount
    } else if (yarnInfo.type.toLowerCase().includes('worsted')) {
      usagePerSquare = 7; // Worsted uses more
    } else if (yarnInfo.type.toLowerCase().includes('dk')) {
      usagePerSquare = 4; // DK weight uses slightly less than medium
    }
    
    // Calculate total usage
    const squaresCount = rows * columns;
    return squaresCount * usagePerSquare;
  };