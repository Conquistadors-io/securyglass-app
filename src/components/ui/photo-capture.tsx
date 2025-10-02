import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Camera, Images, X, Check } from "lucide-react";

interface PhotoCaptureProps {
  onPhotoSelect: (file: File, previewUrl: string) => void;
  children: React.ReactNode;
  maxSizeMB?: number;
}

export const PhotoCapture = ({ onPhotoSelect, children, maxSizeMB = 5 }: PhotoCaptureProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcessFile = (file: File) => {
    setError(null);
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner un fichier image');
      return;
    }
    
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setError(`La taille du fichier ne doit pas dépasser ${maxSizeMB}MB`);
      return;
    }
    
    // Create preview and immediately confirm selection
    const reader = new FileReader();
    reader.onload = (e) => {
      const previewUrl = e.target?.result as string;
      onPhotoSelect(file, previewUrl);
      setIsOpen(false);
      resetState();
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  const handleConfirm = () => {
    if (selectedFile && preview) {
      onPhotoSelect(selectedFile, preview);
      setIsOpen(false);
      resetState();
    }
  };

  const resetState = () => {
    setPreview(null);
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleCancel = () => {
    setIsOpen(false);
    resetState();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter une photo</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          
          {preview ? (
            <div className="space-y-4">
              <div className="relative">
                <img 
                  src={preview} 
                  alt="Aperçu" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                  onClick={resetState}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={handleConfirm} className="flex-1">
                  <Check className="h-4 w-4 mr-2" />
                  Confirmer
                </Button>
                <Button variant="outline" onClick={resetState} className="flex-1">
                  Changer
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Camera Capture */}
              <Card className="p-4">
                <Button
                  variant="outline"
                  className="w-full h-20 flex-col space-y-2"
                  onClick={() => cameraInputRef.current?.click()}
                >
                  <Camera className="h-8 w-8 text-primary" />
                  <span className="text-sm">Prendre une photo</span>
                </Button>
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </Card>
              
              {/* File Upload */}
              <Card className="p-4">
                <Button
                  variant="outline"
                  className="w-full h-20 flex-col space-y-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Images className="h-8 w-8 text-primary" />
                  <span className="text-sm">Mes photos</span>
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </Card>
              
              <p className="text-xs text-muted-foreground text-center">
                Formats acceptés: JPG, PNG, WEBP • Taille max: {maxSizeMB}MB
              </p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <Button variant="ghost" onClick={handleCancel}>
            Annuler
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};