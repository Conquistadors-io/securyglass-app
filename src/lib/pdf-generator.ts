import html2pdf from 'html2pdf.js';

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
    tempContainer.style.visibility = 'hidden';
    tempContainer.style.zIndex = '-1';
    tempContainer.style.width = '210mm'; // A4 width
    tempContainer.style.backgroundColor = 'white';
    tempContainer.style.padding = '20px';
    tempContainer.style.fontFamily = 'Arial, sans-serif';
    document.body.appendChild(tempContainer);
    
    console.log('Temp container created with styles, HTML length:', htmlContent.length);

    // Force reflow and wait for rendering (added extra delay)
    await new Promise(resolve => {
      tempContainer.offsetHeight; // Force reflow
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(resolve, 100); // Extra delay for DOM to fully render
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
    const dataUri = await worker.toPdf().output('datauristring');
    
    if (!dataUri || dataUri.indexOf(',') === -1) {
      console.error('Invalid PDF data URI generated');
      throw new Error('Invalid PDF data URI generated');
    }
    
    const base64Data = dataUri.split(',')[1];
    
    console.log('PDF conversion completed, base64 length:', base64Data.length);
    
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