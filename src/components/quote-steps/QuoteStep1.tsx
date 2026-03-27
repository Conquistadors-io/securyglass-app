import { AddressSelect } from '@/components/ui/address-select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { InsuranceSelect } from '@/components/ui/insurance-select';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { saveClient } from '@/services/clients';
import { Mail, Phone, User } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

interface QuoteStep1Props {
  data: any;
  onComplete: (data: any) => void;
  onBack?: () => void;
}

export const QuoteStep1 = ({ data, onComplete, onBack }: QuoteStep1Props) => {
  const [formData, setFormData] = useState({
    civilite: data.civilite || '',
    nom: data.nom || '',
    prenom: data.prenom || '',
    raison_sociale: data.raison_sociale || data.nomSociete || '',
    mobile: data.mobile || data.telephone || '',
    email: data.email || '',
    email_facturation: data.email_facturation || '',
    adresse_intervention: data.adresse_intervention || data.adresse || '',
    codePostal: data.codePostal || '',
    ville: data.ville || '',
    assurance: data.assurance || '',
    differentInterventionAddress: data.differentInterventionAddress || false,
    interventionCodePostal: data.interventionCodePostal || '',
    interventionVille: data.interventionVille || '',
    interventionAdresse: data.interventionAdresse || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressTouched, setAddressTouched] = useState(false);

  // Refs pour le focus automatique
  const raisonSocialeRef = useRef<HTMLInputElement>(null);
  const nomRef = useRef<HTMLInputElement>(null);
  const prenomRef = useRef<HTMLInputElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

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
        toast.success('Informations sauvegardées avec succès');
      } else {
        toast.error('Erreur lors de la sauvegarde : ' + (result.error || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSubmitting(false);
    }

    // Always proceed to next step regardless of save result
    onComplete(formData);
  };

  const isCompanyOrBTP = formData.civilite === 'societe' || formData.civilite === 'entreprise-btp';
  const interventionFieldsRequired = isCompanyOrBTP && formData.differentInterventionAddress;
  const interventionFieldsValid =
    !interventionFieldsRequired || (formData.interventionCodePostal && formData.interventionVille);
  const companyNameRequired = isCompanyOrBTP && !formData.raison_sociale;

  const isValid =
    formData.nom &&
    formData.mobile &&
    /^0[67]( \d{2}){4}$/.test(formData.mobile) &&
    formData.email &&
    formData.adresse_intervention &&
    formData.codePostal &&
    formData.ville &&
    !companyNameRequired &&
    interventionFieldsValid;

  return (
    <div>
      <div className="mb-6 pb-6 border-b border-slate-100">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary-light/20 flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              Vos informations <span className="text-destructive">*</span>
            </h2>
            <p className="text-sm text-slate-500">Renseignez vos coordonnées</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="civilite">
            Civilité <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.civilite}
            onValueChange={(value) => {
              setFormData((prev) => ({
                ...prev,
                civilite: value,
              }));
              // Focus sur le champ suivant
              setTimeout(() => {
                if (value === 'societe' || value === 'entreprise-btp') {
                  raisonSocialeRef.current?.focus();
                } else {
                  nomRef.current?.focus();
                }
              }, 100);
            }}
          >
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

        {(formData.civilite === 'societe' || formData.civilite === 'entreprise-btp') && (
          <div>
            <Label htmlFor="raison_sociale">
              Nom de la société <span className="text-destructive">*</span>
            </Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={raisonSocialeRef}
                id="raison_sociale"
                placeholder="Nom de la société"
                className="pl-10"
                value={formData.raison_sociale}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    raison_sociale: e.target.value,
                  }))
                }
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    nomRef.current?.focus();
                  }
                }}
                required
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nom">
              Nom <span className="text-destructive">*</span>
            </Label>
            <div className="mt-1">
              <Input
                ref={nomRef}
                id="nom"
                placeholder="Nom"
                value={formData.nom}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    nom: e.target.value,
                  }))
                }
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    prenomRef.current?.focus();
                  }
                }}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="prenom">Prénom</Label>
            <div className="mt-1">
              <Input
                ref={prenomRef}
                id="prenom"
                placeholder="Prénom"
                value={formData.prenom}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    prenom: e.target.value,
                  }))
                }
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    mobileRef.current?.focus();
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="mobile">
            Téléphone mobile <span className="text-destructive">*</span>
          </Label>
          <div className="relative mt-1">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={mobileRef}
              id="mobile"
              type="tel"
              inputMode="numeric"
              placeholder="06 12 34 56 78"
              className="pl-10"
              maxLength={14}
              value={formData.mobile}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                const formatted = digits.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
                setFormData((prev) => ({
                  ...prev,
                  mobile: formatted,
                }));
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  emailRef.current?.focus();
                }
              }}
              required
            />
          </div>
          {formData.mobile && !/^0[67]( \d{2}){4}$/.test(formData.mobile) && (
            <p className="text-xs text-destructive mt-1">
              Numéro mobile invalide (format attendu : 06 ou 07 suivi de 8 chiffres)
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="email">
            Email <span className="text-destructive">*</span>
          </Label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={emailRef}
              id="email"
              type="email"
              placeholder="votre@email.com"
              className="pl-10"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="adresse_intervention">
            Adresse d'intervention <span className="text-destructive">*</span>
          </Label>
          <div className="mt-1">
            <AddressSelect
              id="address-input"
              value={formData.adresse_intervention}
              onValueChange={(value) => {
                setFormData((prev) => ({
                  ...prev,
                  adresse_intervention: value,
                }));
                setAddressTouched(true);
              }}
              onAddressSelect={(data) => {
                setFormData((prev) => ({
                  ...prev,
                  adresse_intervention: data.address,
                  codePostal: data.postcode,
                  ville: data.city,
                }));
                setAddressTouched(true);
              }}
              onAddressIncomplete={() => {
                setFormData((prev) => ({
                  ...prev,
                  codePostal: '',
                  ville: '',
                }));
              }}
              placeholder="Recherchez votre adresse en France"
              showError={addressTouched && (!formData.codePostal || !formData.ville)}
            />
          </div>
          {addressTouched && formData.adresse_intervention && (!formData.codePostal || !formData.ville) ? (
            <p className="text-xs text-destructive mt-1">
              Veuillez sélectionner une adresse dans la liste de suggestions
            </p>
          ) : (
            <p className="text-xs text-muted-foreground mt-1">Adresse où aura lieu l'intervention</p>
          )}
        </div>

        {/* Adresse d'intervention différente pour les sociétés/BTP */}
        {isCompanyOrBTP && (
          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="differentInterventionAddress"
                checked={formData.differentInterventionAddress}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    differentInterventionAddress: checked as boolean,
                    // Reset intervention fields if unchecked
                    interventionCodePostal: checked ? prev.interventionCodePostal : '',
                    interventionVille: checked ? prev.interventionVille : '',
                    interventionAdresse: checked ? prev.interventionAdresse : '',
                  }))
                }
              />
              <Label htmlFor="differentInterventionAddress" className="text-sm font-medium">
                Adresse d'intervention différente de l'adresse de facturation ?
              </Label>
            </div>

            {formData.differentInterventionAddress && (
              <div className="space-y-4 ml-6">
                <div>
                  <Label htmlFor="interventionAdresse">
                    Adresse d'intervention <span className="text-destructive">*</span>
                  </Label>
                  <div className="mt-1">
                    <AddressSelect
                      value={formData.interventionAdresse}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          interventionAdresse: value,
                        }))
                      }
                      onAddressSelect={(data) =>
                        setFormData((prev) => ({
                          ...prev,
                          interventionAdresse: data.address,
                          interventionCodePostal: data.postcode,
                          interventionVille: data.city,
                        }))
                      }
                      placeholder="Recherchez l'adresse d'intervention en France"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div>
          <Label htmlFor="assurance">Assurance ( optionnel )</Label>
          <div className="mt-1">
            <InsuranceSelect
              value={formData.assurance}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  assurance: value,
                }))
              }
              placeholder="Sélectionnez votre assurance"
            />
          </div>
        </div>

        <div className="pt-6">
          <Button
            type="submit"
            className="w-full h-12 text-base rounded-xl btn-quote-cta"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? 'Sauvegarde...' : 'Continuer'}
          </Button>
        </div>
      </form>
    </div>
  );
};
