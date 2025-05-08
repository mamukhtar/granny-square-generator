// src/utils/excelParser.ts
import * as XLSX from 'xlsx';

export type YarnInfo = {
  id: string;
  name: string;
  colorHex: string;
  quantity: number;
  type: string;
  size: string;
  category?: string;
};

/**
 * Parse Excel file containing yarn data
 * @param file Excel/CSV file
 * @returns Promise with parsed yarn data
 */
export const parseYarnExcel = async (file: File): Promise<YarnInfo[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          reject(new Error('No data found in file'));
          return;
        }
        
        // Parse workbook
        const workbook = XLSX.read(data, { type: 'binary' });
        
        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);
        
        // Map to YarnInfo structure
        const yarnData: YarnInfo[] = [];
        let currentCategory = '';
        
        jsonData.forEach((row, index) => {
          // Check if this is a category header row
          if (
            row['Yarn Colors'] && 
            !row['Color (ArtyClick)'] && 
            !row['Skeins Quantity']
          ) {
            currentCategory = row['Yarn Colors'];
            return; // Skip category rows
          }
          
          // Process regular yarn row
          try {
            const id = row['No'] || `yarn_${index}`;
            const name = row['Yarn Colors'] || 'Unnamed Yarn';
            // Handle the color - some Excel files might have the color hex in different formats
            let colorHex = row['Color (ArtyClick)'] || '#cccccc';
            // Ensure color has # prefix
            colorHex = colorHex.startsWith('#') ? colorHex : `#${colorHex}`;
            
            const quantity = Number(row['Skeins Quantity']) || 1;
            const type = row['Skeins Type'] || 'Unknown';
            const size = row['Skeins Size'] || 'Unknown';
            
            yarnData.push({
              id: id.toString(),
              name,
              colorHex,
              quantity,
              type,
              size,
              category: currentCategory
            });
          } catch (err) {
            console.error('Error processing row:', row, err);
          }
        });
        
        resolve(yarnData);
      } catch (error) {
        reject(new Error(`Failed to parse Excel file: ${error}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    // Read file as binary
    reader.readAsBinaryString(file);
  });
};

/**
 * Generate a template Excel file for yarn data
 * @returns Blob of the Excel file
 */
export const generateYarnTemplate = (): Blob => {
  // Sample data for the template
  const sampleData = [
    { 'No': '1', 'Yarn Colors': 'Blue Shades', 'Color (ArtyClick)': '', 'Skeins Quantity': '', 'Skeins Type': '', 'Skeins Size': '' },
    { 'No': '1.1', 'Yarn Colors': 'Water', 'Color (ArtyClick)': '#b0e0e6', 'Skeins Quantity': 2, 'Skeins Type': 'light DK', 'Skeins Size': 1 },
    { 'No': '1.2', 'Yarn Colors': 'Periwinkle', 'Color (ArtyClick)': '#ccccff', 'Skeins Quantity': 1, 'Skeins Type': 'Medium worsted', 'Skeins Size': 4 },
    { 'No': '2', 'Yarn Colors': 'Green Shades', 'Color (ArtyClick)': '', 'Skeins Quantity': '', 'Skeins Type': '', 'Skeins Size': '' },
    { 'No': '2.1', 'Yarn Colors': 'Persian', 'Color (ArtyClick)': '#00a550', 'Skeins Quantity': 1, 'Skeins Type': 'light DK', 'Skeins Size': 1 },
  ];
  
  // Create a new workbook
  const workbook = XLSX.utils.book_new();
  
  // Create a worksheet from the sample data
  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  
  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Yarn Stash');
  
  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
  // Create Blob from buffer
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};

/**
 * Download a generated Excel file
 * @param blob Excel file as Blob
 * @param filename Name for the downloaded file
 */
export const downloadYarnTemplate = (filename: string = 'yarn-stash-template.xlsx'): void => {
  const blob = generateYarnTemplate();
  
  // Create download link
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
};