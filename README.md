# 🧶 Granny Square Generator

A web application for creating randomized granny square patterns for crochet projects. This tool lets you design beautiful blanket patterns based on selected colors or inspired by book covers.

## Features

### Basic Generator
- Select yarn colors using a color wheel or picker
- Set grid dimensions (rows and columns)
- Choose how many colors per square
- Generate randomized granny square layouts
- Export your pattern as an image

### Book-Inspired Generator (Stitching My Bookshelf)
- Upload book cover images to extract color palettes
- Import your yarn stash from Excel/CSV
- Automatically match book colors to your available yarns
- Assign romance tropes with corresponding colors
- Generate patterns where each square incorporates the book's trope
- Export designs with yarn usage estimates

## Project Structure

```
granny-square-generator/
├── public/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── ColorPalette.tsx
│   │   ├── ColorPickerPanel.tsx
│   │   ├── GrannySquare.tsx
│   │   ├── TropeSelector.tsx
│   │   ├── YarnMatchingPanel.tsx
│   │   └── ColorExtractionPanel.tsx
│   ├── pages/           # Page components
│   │   ├── BasicGenerator.tsx
│   │   └── BookInspired.tsx
│   ├── utils/           # Utility functions
│   │   ├── colorExtractor.ts
│   │   ├── excelParser.ts
│   │   ├── yarnMatcher.ts
│   │   └── exportUtils.ts
│   ├── App.tsx          # Main app component with routing
│   └── main.tsx         # Entry point
├── tailwind.config.js   # Tailwind CSS configuration
├── vite.config.ts       # Vite configuration
└── package.json         # Dependencies and scripts
```

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Vite
- xlsx (for Excel parsing)
- html2canvas (for exporting patterns)
- react-colorful (for color picking)
- react-router-dom (for navigation)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/granny-square-generator.git
   cd granny-square-generator
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Basic Generator

1. Use the color picker to select yarn colors
2. Add colors to your palette
3. Set the number of rows and columns for your grid
4. Choose how many colors per square (1-4)
5. Click "Generate Grid" to create your pattern
6. Click "Export" to download your pattern as an image

### Book-Inspired Generator

1. Upload a book cover image
2. Upload your yarn inventory Excel file (or download and fill the template)
3. Extract colors from the book cover
4. Adjust extracted colors if needed
5. Select a literary trope for your book
6. Set grid dimensions
7. Generate your pattern
8. View estimated yarn usage
9. Export your design

## Yarn Inventory Format

The Book-Inspired Generator expects an Excel file with the following columns:
- No: Identifier for the yarn (e.g., "1.1", "2.3")
- Yarn Colors: Name of the yarn color
- Color: Hex color code (e.g., "#ff6b6b")
- Skeins Quantity: Number of skeins available
- Skeins Type: Type of yarn (e.g., "light DK", "Medium worsted")
- Skeins Size: Size information (e.g., "1", "4")

Category headers can be included as rows with only the "Yarn Colors" column filled (e.g., "Blue Shades").

## Color Extraction and Matching

The Book-Inspired Generator uses algorithm to:
1. Extract dominant colors from book covers using canvas pixel manipulation
2. Calculate color distances to find the closest match in your yarn inventory
3. Prioritize matches based on perceptual similarity


## Acknowledgements

- Developed by Maryam Mukhtar
- Inspired by Granny Square Color Pattern Generator by Melissa Avery-Weir.
