// src/utils/exportUtils.ts
import html2canvas from 'html2canvas';
import type { YarnInfo } from './excelParser';

/**
 * Export a granny square grid as a PNG image
 * @param gridRef React ref to the grid DOM element
 * @param filename Optional filename for the downloaded image
 */
export const exportGridAsPNG = async (
  gridRef: HTMLElement | null, 
  filename: string = 'granny-square-pattern.png'
): Promise<void> => {
  if (!gridRef) {
    alert('No grid to export');
    return;
  }
  
  try {
    // Render the grid to a canvas
    const canvas = await html2canvas(gridRef, {
      backgroundColor: '#000000',
      scale: 2, // Higher resolution
      logging: false
    });
    
    // Convert to data URL
    const dataUrl = canvas.toDataURL('image/png');
    
    // Create a link and trigger download
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link); // Need to append to body for Firefox
    link.click();
    document.body.removeChild(link); // Clean up
  } catch (error) {
    console.error('Error exporting grid:', error);
    alert('Failed to export the grid. Please try again.');
  }
};

/**
 * Create a printable design sheet with yarn details
 * @param gridRef Grid element reference
 * @param title Project title
 * @param yarns Yarn information
 * @param tropeInfo Trope information object
 */
export const exportDesignSheet = async (
  gridRef: HTMLElement | null,
  title: string,
  yarns: YarnInfo[],
  tropeInfo: { name: string; color: string }
): Promise<void> => {
  // Create a more descriptive filename using the provided parameters
  let filename = title ? `${title.replace(/\s+/g, '-')}` : 'book-inspired';
  
  // Add trope name to filename if available
  if (tropeInfo && tropeInfo.name) {
    filename += `-${tropeInfo.name.replace(/\s+/g, '-')}`;
  }
  
  // Add yarn count to filename
  if (yarns && yarns.length > 0) {
    filename += `-${yarns.length}-yarns`;
  }
  
  filename += '-pattern.png';
  
  // For now, just use the PNG export
  // In a future implementation, this could create a PDF with yarn details
  exportGridAsPNG(gridRef, filename);
  
  // Log yarn information for debugging purposes
  console.log(`Exported pattern with ${yarns.length} yarns and trope: ${tropeInfo.name}`);
};