import { useRef } from "react";

interface PhotoCaptureProps {
  onPhotoSelect: (file: File, previewUrl: string) => void;
  children: React.ReactNode;
  maxSizeMB?: number;
}

export const PhotoCapture = ({ onPhotoSelect, children, maxSizeMB = 5 }: PhotoCaptureProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcessFile = (file: File) => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image');
      return;
    }
    
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      alert(`La taille du fichier ne doit pas dépasser ${maxSizeMB}MB`);
      return;
    }
    
    // Create preview and immediately confirm selection
    const reader = new FileReader();
    reader.onload = (e) => {
      const previewUrl = e.target?.result as string;
      onPhotoSelect(file, previewUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <div onClick={handleClick}>
        {children}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </>
  );
};