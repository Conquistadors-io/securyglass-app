import html2pdf from 'html2pdf.js';
import { pdf } from '@react-pdf/renderer';
import { QuotePDFTemplate } from '@/components/pdf/QuotePDFTemplate';
import type { QuotePDFData } from '@/components/pdf/QuotePDFTemplate';

// Re-export the type for convenience
export type { QuotePDFData };

/**
 * Generate PDF using @react-pdf/renderer (NEW - Recommended)
 * Provides high-quality vector rendering with perfect fidelity
 */
export const generateQuotePDF = async (data: QuotePDFData, filename: string): Promise<void> => {
  try {
    console.log('Generating PDF with @react-pdf/renderer...');
    
    const blob = await pdf(<QuotePDFTemplate data={data} />).toBlob();
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    
    console.log('PDF generated successfully');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

/**
 * Generate PDF as Base64 using @react-pdf/renderer (NEW - Recommended)
 * Returns base64 string for email attachments
 */
export const generateQuotePDFBase64 = async (data: QuotePDFData): Promise<string> => {
  try {
    console.log('Generating PDF as base64 with @react-pdf/renderer...');
    
    const blob = await pdf(<QuotePDFTemplate data={data} />).toBlob();
    
    // Convert blob to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        const base64 = base64data.split(',')[1];
        console.log('PDF base64 generated, length:', base64.length);
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error generating PDF base64:', error);
    throw error;
  }
};

/**
 * LEGACY: Generate PDF from HTML using html2pdf.js
 * Kept for backwards compatibility, but @react-pdf/renderer is recommended
 */
export const generatePDFFromHTML = async (htmlContent: string, filename: string): Promise<void> => {
  // Create a temporary container
  const tempContainer = document.createElement('div');
  tempContainer.innerHTML = htmlContent;
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.top = '-9999px';
  tempContainer.style.width = '210mm'; // A4 width
  document.body.appendChild(tempContainer);

  try {
    const options = {
      margin: 1,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' 
      }
    };

    await html2pdf().set(options).from(tempContainer).save();
  } finally {
    // Clean up
    document.body.removeChild(tempContainer);
  }
};

/**
 * LEGACY: Generate PDF from HTML as Base64 using html2pdf.js
 * Kept for backwards compatibility, but generateQuotePDFBase64 is recommended
 */
export const generatePDFFromHTMLBase64 = async (htmlContent: string): Promise<string> => {
  console.log('Starting PDF generation...');
  
  // Create a temporary container
  const tempContainer = document.createElement('div');
  
  try {
    // Parse the full HTML document and preserve styles
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // Extract styles from head
    const styles = doc.querySelectorAll('style');
    let combinedStyles = '';
    styles.forEach(style => {
      combinedStyles += style.textContent || '';
    });
    
    // Get body content
    const bodyContent = doc.body?.innerHTML || htmlContent;
    
    // Create a style element and inject combined styles
    const styleElement = document.createElement('style');
    styleElement.textContent = combinedStyles;
    
    // Set up the container with preserved styles
    tempContainer.innerHTML = bodyContent;
    tempContainer.insertBefore(styleElement, tempContainer.firstChild);
    tempContainer.style.position = 'fixed';
    tempContainer.style.left = '0';
    tempContainer.style.top = '0';
    tempContainer.style.opacity = '0'; // Use opacity instead of visibility
    tempContainer.style.zIndex = '-1';
    tempContainer.style.width = '210mm'; // A4 width
    tempContainer.style.minHeight = '297mm'; // A4 height to ensure content
    tempContainer.style.backgroundColor = 'white';
    tempContainer.style.padding = '20px';
    tempContainer.style.fontFamily = 'Arial, sans-serif';
    document.body.appendChild(tempContainer);
    
    console.log('Temp container created with styles, HTML length:', htmlContent.length);
    
    // Log container dimensions for debugging
    const rect = tempContainer.getBoundingClientRect();
    console.log('Container dimensions:', { width: rect.width, height: rect.height });

    // Force reflow and wait for rendering (added extra delay)
    await new Promise(resolve => {
      tempContainer.offsetHeight; // Force reflow
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(resolve, 200); // Increased delay for DOM to fully render
        });
      });
    });

    const options = {
      margin: 1,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true,
        backgroundColor: '#ffffff'
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' 
      }
    };

    console.log('Starting html2pdf conversion with full sequence...');
    // Use complete sequence: from -> toPdf -> output
    const worker = html2pdf().set(options).from(tempContainer);
    let dataUri = await worker.toPdf().output('datauristring');
    
    if (!dataUri || dataUri.indexOf(',') === -1) {
      console.error('Invalid PDF data URI generated');
      throw new Error('Invalid PDF data URI generated');
    }
    
    let base64Data = dataUri.split(',')[1];
    
    console.log('PDF conversion completed, base64 length:', base64Data.length);
    
    // If PDF is too small, try fallback method with direct HTML
    if (base64Data.length < 8000) {
      console.warn('PDF appears small, trying fallback method...');
      
      try {
        const fallbackWorker = html2pdf().set(options).from(htmlContent);
        const fallbackDataUri = await fallbackWorker.toPdf().output('datauristring');
        
        if (fallbackDataUri && fallbackDataUri.indexOf(',') !== -1) {
          const fallbackBase64 = fallbackDataUri.split(',')[1];
          if (fallbackBase64.length > base64Data.length) {
            console.log('Fallback method successful, base64 length:', fallbackBase64.length);
            base64Data = fallbackBase64;
          }
        }
      } catch (fallbackError) {
        console.warn('Fallback method failed:', fallbackError);
      }
    }
    
    // Warning for small PDF size (don't block anymore)
    if (base64Data.length < 10000) {
      console.warn('Generated PDF appears small, base64 length:', base64Data.length);
    }
    
    return base64Data;
  } catch (error) {
    console.error('Error in PDF generation:', error);
    throw error;
  } finally {
    // Clean up
    if (tempContainer.parentNode) {
      document.body.removeChild(tempContainer);
      console.log('Temp container cleaned up');
    }
  }
};