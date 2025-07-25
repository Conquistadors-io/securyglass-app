import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { PhotoCapture } from "@/components/ui/photo-capture";
import { ArrowLeft, Camera, PenTool, Euro, CheckCircle, FileText, Download } from "lucide-react";

interface TechnicianInstallationProps {
  onNavigate: (route: string) => void;
}

export const TechnicianInstallation = ({ onNavigate }: TechnicianInstallationProps) => {
  const [beforePhotos, setBeforePhotos] = useState<string[]>([]);
  const [afterPhotos, setAfterPhotos] = useState<string[]>([]);
  const [signature, setSigned] = useState(false);
  const [finalPayment, setFinalPayment] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  const handleBeforePhotoSelect = (file: File, previewUrl: string) => {
    if (beforePhotos.length < 3) {
      setBeforePhotos([...beforePhotos, previewUrl]);
    }
  };

  const handleAfterPhotoSelect = (file: File, previewUrl: string) => {
    if (afterPhotos.length < 3) {
      setAfterPhotos([...afterPhotos, previewUrl]);
    }
  };

  const removeBeforePhoto = (index: number) => {
    setBeforePhotos(beforePhotos.filter((_, i) => i !== index));
  };

  const removeAfterPhoto = (index: number) => {
    setAfterPhotos(afterPhotos.filter((_, i) => i !== index));
  };

  const handleComplete = () => {
    setIsCompleted(true);
    setTimeout(() => {
      onNavigate("technician-dashboard");
    }, 3000);
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-sm">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Installation terminée !</h2>
          <p className="text-muted-foreground mb-3">Facture générée automatiquement</p>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Télécharger facture
            </Button>
            <p className="text-xs text-muted-foreground">Retour au tableau de bord...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onNavigate("technician-order")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Installation</h1>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-32">{/* Added pb-32 for bottom padding */}
        {/* Client Info */}
        <Card className="p-4">
          <h3 className="font-medium text-foreground mb-2">Marie Dupont</h3>
          <p className="text-sm text-muted-foreground">15 rue Victor Hugo, 75001 Paris</p>
          <p className="text-sm text-muted-foreground">Installation vitre 80x120cm</p>
        </Card>

        {/* Installation Photos */}
        <Card className="p-4">
          <h3 className="font-medium text-foreground mb-3 flex items-center">
            <Camera className="h-4 w-4 mr-2" />
            Photos finales
          </h3>
          
          <div className="space-y-4">
            {/* Photos avant */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Photos avant installation</h4>
              {beforePhotos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {beforePhotos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={photo} 
                        alt={`Avant ${index + 1}`}
                        className="w-full h-16 object-cover rounded-lg"
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 hover:bg-red-600 text-white border-0"
                        onClick={() => removeBeforePhoto(index)}
                      >
                        <span className="text-xs">×</span>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <PhotoCapture onPhotoSelect={handleBeforePhotoSelect}>
                <Button 
                  variant="outline" 
                  className="w-full"
                  disabled={beforePhotos.length >= 3}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Photo avant ({beforePhotos.length}/3)
                </Button>
              </PhotoCapture>
            </div>
            
            {/* Photos après */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Photos après installation</h4>
              {afterPhotos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {afterPhotos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={photo} 
                        alt={`Après ${index + 1}`}
                        className="w-full h-16 object-cover rounded-lg"
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 hover:bg-red-600 text-white border-0"
                        onClick={() => removeAfterPhoto(index)}
                      >
                        <span className="text-xs">×</span>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <PhotoCapture onPhotoSelect={handleAfterPhotoSelect}>
                <Button 
                  variant="outline" 
                  className="w-full"
                  disabled={afterPhotos.length >= 3}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Photo après ({afterPhotos.length}/3)
                </Button>
              </PhotoCapture>
            </div>
          </div>

          {(beforePhotos.length > 0 || afterPhotos.length > 0) && (
            <div className="mt-3 p-2 bg-green-50 rounded text-sm text-green-800">
              {beforePhotos.length + afterPhotos.length} photo(s) ajoutée(s)
            </div>
          )}
        </Card>

        {/* Installation Notes */}
        <Card className="p-4">
          <h3 className="font-medium text-foreground mb-3">Notes d'installation</h3>
          <Textarea
            placeholder="Commentaires sur l'installation, difficultés rencontrées..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[80px]"
          />
        </Card>

        {/* Client Signature */}
        <Card className="p-4">
          <h3 className="font-medium text-foreground mb-3 flex items-center">
            <PenTool className="h-4 w-4 mr-2" />
            Signature client
          </h3>
          
          <div className="space-y-3">
            <div className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              {signature ? (
                <div className="text-green-600 text-sm font-medium">✓ Signé par M. Dupont</div>
              ) : (
                <div className="text-gray-400 text-sm">Zone de signature</div>
              )}
            </div>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setSigned(true)}
            >
              <PenTool className="h-4 w-4 mr-2" />
              Capturer signature
            </Button>
          </div>
        </Card>

        {/* Final Payment */}
        <Card className="p-4">
          <h3 className="font-medium text-foreground mb-3 flex items-center">
            <Euro className="h-4 w-4 mr-2" />
            Paiement final (450€)
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="cb-final"
                checked={finalPayment === "cb"}
                onCheckedChange={() => setFinalPayment("cb")}
              />
              <Label htmlFor="cb-final" className="text-sm">Carte bancaire</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="cash-final"
                checked={finalPayment === "cash"}
                onCheckedChange={() => setFinalPayment("cash")}
              />
              <Label htmlFor="cash-final" className="text-sm">Espèces</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="check-final"
                checked={finalPayment === "check"}
                onCheckedChange={() => setFinalPayment("check")}
              />
              <Label htmlFor="check-final" className="text-sm">Chèque</Label>
            </div>
          </div>

          {finalPayment && (
            <div className="mt-3 p-3 bg-green-50 rounded-lg">
              <div className="text-sm text-green-800 font-medium">Paiement de 450€ encaissé</div>
              <div className="text-xs text-green-600">Mode: {finalPayment === "cb" ? "Carte bancaire" : finalPayment === "cash" ? "Espèces" : "Chèque"}</div>
            </div>
          )}
        </Card>

        {/* Invoice Generation */}
        {finalPayment && signature && (
          <Card className="p-4 border-green-200 bg-green-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-800 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Facture auto-générée
              </span>
              <Button variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-100">
                <Download className="h-4 w-4 mr-1" />
                PDF
              </Button>
            </div>
            <p className="text-xs text-green-700">
              Facture + certificat TVA générés automatiquement
            </p>
          </Card>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-4 left-4 right-4">
        <Button 
          variant="hero" 
          size="lg" 
          className="w-full"
          disabled={beforePhotos.length === 0 || afterPhotos.length === 0 || !signature || !finalPayment}
          onClick={handleComplete}
        >
          <CheckCircle className="h-5 w-5 mr-2" />
          Terminer l'installation
        </Button>
      </div>
    </div>
  );
};