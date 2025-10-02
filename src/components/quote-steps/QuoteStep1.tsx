
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Phone, Mail, MapPin, Hash, Shield, Star } from "lucide-react";
import { DepartmentSelect } from "@/components/ui/department-select";
import { CityAutocomplete } from "@/components/ui/city-autocomplete";
import { AddressSelect } from "@/components/ui/address-select";
import { InsuranceSelect } from "@/components/ui/insurance-select";
import { saveClient } from "@/services/clients";
import { toast } from "sonner";

interface QuoteStep1Props {
  data: any;
  onComplete: (data: any) => void;
  onBack?: () => void;
}

export const QuoteStep1 = ({
  data,
  onComplete,
  onBack
}: QuoteStep1Props) => {
  const [formData, setFormData] = useState({
    civilite: data.civilite || "",
    nom: data.nom || "",
    prenom: data.prenom || "",
    raison_sociale: data.raison_sociale || data.nomSociete || "",
    mobile: data.mobile || data.telephone || "",
    email: data.email || "",
    email_facturation: data.email_facturation || "",
    adresse_intervention: data.adresse_intervention || data.adresse || "",
    codePostal: data.codePostal || "",
    ville: data.ville || "",
    assurance: data.assurance || "",
    differentInterventionAddress: data.differentInterventionAddress || false,
    interventionCodePostal: data.interventionCodePostal || "",
    interventionVille: data.interventionVille || "",
    interventionAdresse: data.interventionAdresse || ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prevDepartment, setPrevDepartment] = useState(data.codePostal || "");
  const [prevCity, setPrevCity] = useState(data.ville || "");
  const [prevInterventionDepartment, setPrevInterventionDepartment] = useState(data.interventionCodePostal || "");
  const [prevInterventionCity, setPrevInterventionCity] = useState(data.interventionVille || "");

  // Réinitialiser la ville et l'adresse si le département change
  useEffect(() => {
    if (formData.codePostal !== prevDepartment) {
      setFormData(prev => ({
        ...prev,
        ville: "",
        adresse_intervention: ""
      }));
      setPrevDepartment(formData.codePostal);
      setPrevCity("");
    } else if (formData.ville !== prevCity) {
      // Si seule la ville change, réinitialiser uniquement l'adresse
      setFormData(prev => ({
        ...prev,
        adresse_intervention: ""
      }));
      setPrevCity(formData.ville);
    }
  }, [formData.codePostal, formData.ville, prevDepartment, prevCity]);

  // Réinitialiser la ville et l'adresse d'intervention si le département d'intervention change
  useEffect(() => {
    if (formData.interventionCodePostal !== prevInterventionDepartment) {
      setFormData(prev => ({
        ...prev,
        interventionVille: "",
        interventionAdresse: ""
      }));
      setPrevInterventionDepartment(formData.interventionCodePostal);
      setPrevInterventionCity("");
    } else if (formData.interventionVille !== prevInterventionCity) {
      // Si seule la ville change, réinitialiser uniquement l'adresse
      setFormData(prev => ({
        ...prev,
        interventionAdresse: ""
      }));
      setPrevInterventionCity(formData.interventionVille);
    }
  }, [formData.interventionCodePostal, formData.interventionVille, prevInterventionDepartment, prevInterventionCity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await saveClient({
        nom: formData.nom,
        prenom: formData.prenom,
        raison_sociale: formData.raison_sociale,
        mobile: formData.mobile,
        email: formData.email,
        email_facturation: formData.email_facturation,
        adresse_intervention: formData.adresse_intervention || `${formData.ville} ${formData.codePostal}`,
      });

      if (result.success) {
        toast.success("Informations sauvegardées avec succès");
      } else {
        toast.error("Erreur lors de la sauvegarde : " + (result.error || "Erreur inconnue"));
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setIsSubmitting(false);
    }

    // Always proceed to next step regardless of save result
    onComplete(formData);
  };

  const isCompanyOrBTP = formData.civilite === "societe" || formData.civilite === "entreprise-btp";
  const interventionFieldsRequired = isCompanyOrBTP && formData.differentInterventionAddress;
  const interventionFieldsValid = !interventionFieldsRequired || 
    (formData.interventionCodePostal && formData.interventionVille);
  const companyNameRequired = isCompanyOrBTP && !formData.raison_sociale;
  
  const isValid = formData.nom && formData.mobile && formData.email && 
    !companyNameRequired && interventionFieldsValid;

  return <Card className="shadow-card border-0">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Vos informations <span className="text-destructive">*</span>
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="civilite">Civilité <span className="text-destructive">*</span></Label>
            <Select value={formData.civilite} onValueChange={value => setFormData(prev => ({
            ...prev,
            civilite: value
          }))}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Sélectionnez" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="madame">Madame</SelectItem>
                <SelectItem value="monsieur">Monsieur</SelectItem>
                <SelectItem value="societe">Société ( Entreprise ou Association )</SelectItem>
                <SelectItem value="entreprise-btp">Professionnel du BTP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(formData.civilite === "societe" || formData.civilite === "entreprise-btp") && (
            <div>
              <Label htmlFor="raison_sociale">Nom de la société <span className="text-destructive">*</span></Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="raison_sociale" 
                  placeholder="Nom de la société" 
                  className="pl-10" 
                  value={formData.raison_sociale} 
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    raison_sociale: e.target.value
                  }))} 
                  required 
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nom">Nom <span className="text-destructive">*</span></Label>
              <div className="mt-1">
                <Input id="nom" placeholder="Nom" value={formData.nom} onChange={e => setFormData(prev => ({
                ...prev,
                nom: e.target.value
              }))} required />
              </div>
            </div>
            <div>
              <Label htmlFor="prenom">Prénom</Label>
              <div className="mt-1">
                <Input id="prenom" placeholder="Prénom" value={formData.prenom} onChange={e => setFormData(prev => ({
                ...prev,
                prenom: e.target.value
              }))} />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="mobile">Téléphone mobile <span className="text-destructive">*</span></Label>
            <div className="relative mt-1">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="mobile" type="tel" placeholder="06 12 34 56 78" className="pl-10" value={formData.mobile} onChange={e => setFormData(prev => ({
              ...prev,
              mobile: e.target.value
            }))} required />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="email" type="email" placeholder="votre@email.com" className="pl-10" value={formData.email} onChange={e => setFormData(prev => ({
              ...prev,
              email: e.target.value
            }))} required />
            </div>
          </div>

          <div>
            <Label htmlFor="codePostal">Département <span className="text-destructive">*</span></Label>
            <div className="mt-1">
              <DepartmentSelect 
                value={formData.codePostal} 
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  codePostal: value
                }))}
                placeholder="Numéro du département"
              />
            </div>
          </div>

          {formData.codePostal && (
            <div>
              <Label htmlFor="ville">Ville <span className="text-destructive">*</span></Label>
              <div className="mt-1">
                <CityAutocomplete 
                  value={formData.ville} 
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    ville: value
                  }))}
                  departmentCode={formData.codePostal}
                  placeholder="Saisissez votre ville"
                />
              </div>
            </div>
          )}

          {formData.codePostal && formData.ville && (
            <div>
              <Label htmlFor="adresse_intervention">Adresse d'intervention <span className="text-destructive">*</span></Label>
              <div className="mt-1">
                <AddressSelect 
                  value={formData.adresse_intervention} 
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    adresse_intervention: value
                  }))}
                  departmentCode={formData.codePostal}
                  city={formData.ville}
                  placeholder=""
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Adresse où aura lieu l'intervention</p>
            </div>
          )}

          {/* Adresse d'intervention différente pour les sociétés/BTP */}
          {isCompanyOrBTP && (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="differentInterventionAddress"
                  checked={formData.differentInterventionAddress}
                  onCheckedChange={(checked) => setFormData(prev => ({
                    ...prev,
                    differentInterventionAddress: checked as boolean,
                    // Reset intervention fields if unchecked
                    interventionCodePostal: checked ? prev.interventionCodePostal : "",
                    interventionVille: checked ? prev.interventionVille : "",
                    interventionAdresse: checked ? prev.interventionAdresse : ""
                  }))}
                />
                <Label htmlFor="differentInterventionAddress" className="text-sm font-medium">
                  Adresse d'intervention différente de l'adresse de facturation ?
                </Label>
              </div>

              {formData.differentInterventionAddress && (
                <div className="space-y-4 ml-6">
                  <div>
                    <Label htmlFor="interventionCodePostal">Département d'intervention <span className="text-destructive">*</span></Label>
                    <div className="mt-1">
                      <DepartmentSelect 
                        value={formData.interventionCodePostal} 
                        onValueChange={(value) => setFormData(prev => ({
                          ...prev,
                          interventionCodePostal: value
                        }))}
                        placeholder="Numéro du département"
                      />
                    </div>
                  </div>

                  {formData.interventionCodePostal && (
                    <div>
                      <Label htmlFor="interventionVille">Ville d'intervention <span className="text-destructive">*</span></Label>
                      <div className="mt-1">
                        <CityAutocomplete 
                          value={formData.interventionVille} 
                          onValueChange={(value) => setFormData(prev => ({
                            ...prev,
                            interventionVille: value
                          }))}
                          departmentCode={formData.interventionCodePostal}
                          placeholder="Saisissez la ville"
                        />
                      </div>
                    </div>
                  )}

                  {formData.interventionCodePostal && formData.interventionVille && (
                    <div>
                      <Label htmlFor="interventionAdresse">Adresse d'intervention (facultatif)</Label>
                      <div className="mt-1">
                        <AddressSelect 
                          value={formData.interventionAdresse} 
                          onValueChange={(value) => setFormData(prev => ({
                            ...prev,
                            interventionAdresse: value
                          }))}
                          departmentCode={formData.interventionCodePostal}
                          city={formData.interventionVille}
                          placeholder="Tapez votre adresse d'intervention"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="assurance">Assurance ( optionnel )</Label>
            <div className="mt-1">
              <InsuranceSelect 
                value={formData.assurance} 
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  assurance: value
                }))}
                placeholder="Sélectionnez votre assurance"
              />
            </div>
          </div>

          <div className="flex gap-4">
            {onBack && (
              <Button 
                type="button"
                variant="outline" 
                size="lg" 
                className="flex-1"
                onClick={onBack}
              >
                Retour
              </Button>
            )}
            <Button 
              type="submit" 
              variant="default" 
              size="lg" 
              className="flex-1" 
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? "Sauvegarde..." : "Continuer"}
            </Button>
          </div>
        </form>
      </div>
    </Card>;
};
