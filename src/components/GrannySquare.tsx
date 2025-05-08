// src/components/GrannySquare.tsx
type GrannySquareProps = {
  colors: string[];
};

export default function GrannySquare({ colors }: GrannySquareProps) {
  // Make sure we handle any number of colors (up to 10)
  const squareColors = colors.slice(0, 10);
  const colorCount = squareColors.length;
  
  return (
    <div className="relative aspect-square w-full">

      {squareColors.slice().reverse().map((color, index) => {
        // Calculate size dynamically based on number of colors
        const squareSize = 100 - (index * (100 / colorCount));
        
        return (
          <div 
            key={index} 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              backgroundColor: color,
              width: `${squareSize}%`,
              height: `${squareSize}%`,
              border: '1px solid black',
              boxSizing: 'border-box',
            }}
          />
        );
      })}
    </div>
  );
}