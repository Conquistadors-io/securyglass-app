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
  // Create a temporary container with body content only
  const tempContainer = document.createElement('div');
  
  // Extract only the body content from the full HTML document
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const bodyContent = doc.body?.innerHTML || htmlContent;
  
  tempContainer.innerHTML = bodyContent;
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.top = '-9999px';
  tempContainer.style.width = '210mm'; // A4 width
  tempContainer.style.backgroundColor = 'white';
  tempContainer.style.padding = '20px';
  document.body.appendChild(tempContainer);

  try {
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

    // Use worker method for proper PDF generation
    const worker = html2pdf().set(options).from(tempContainer);
    const pdf = await worker.get('pdf');
    const base64Data = pdf.output('datauristring').split(',')[1];
    
    return base64Data;
  } finally {
    // Clean up
    document.body.removeChild(tempContainer);
  }
};