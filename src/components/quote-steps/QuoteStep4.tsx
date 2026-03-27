import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CheckCircle2, FileText, Info, User } from 'lucide-react';
import { useState } from 'react';
interface QuoteStep4Props {
  data: any;
  onValidate: () => void;
  onModify: (step: number) => void;
}
export const QuoteStep4 = ({ data, onValidate, onModify }: QuoteStep4Props) => {
  const [miseEnSecurite, setMiseEnSecurite] = useState(data.miseEnSecurite || 'non');
  // Helper function to escape regex special characters
  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  // Helper function to clean street name by removing duplicate postal code and city
  const cleanStreet = (address: string, codePostal: string, ville: string) => {
    if (!address) return '';
    let cleanedAddress = address;

    // Remove postal code and city if they appear in the address
    if (codePostal && ville) {
      const postalCityPattern = new RegExp(`\\s*${escapeRegExp(codePostal)}\\s*${escapeRegExp(ville)}\\s*`, 'gi');
      cleanedAddress = cleanedAddress.replace(postalCityPattern, '');
    }

    // Clean up any trailing commas or spaces
    cleanedAddress = cleanedAddress.replace(/,\s*$/, '').trim();
    return cleanedAddress;
  };
  const getDisplayValue = (key: string, value: any) => {
    const displayMap: {
      [key: string]: {
        [value: string]: string;
      };
    } = {
      serviceType: {
        reparation: 'Réparation',
        installation: 'Installation',
      },
      civilite: {
        m: 'Monsieur',
        mme: 'Madame',
      },
      object: {
        fenetre: 'Fenêtre',
        porte: 'Porte',
        cloison: 'Cloison',
        miroir: 'Miroir',
        'vitre-cassee': 'Vitre cassée',
        autre: 'Autre',
      },
      property: {
        maison: 'Maison',
        appartement: 'Appartement',
        'local-commercial': 'Local commercial',
        bureau: 'Bureau',
      },
      motif: {
        'casse-naturelle': 'Casse naturelle',
        'tentative-effraction': "Tentative d'effraction",
        vandalisme: 'Vandalisme',
        'bris-de-glace': 'Bris de glace',
        'choc-thermique': 'Choc thermique',
        'defaut-installation': "Défaut d'installation",
        usure: 'Usure',
        'remplacement-preventif': 'Remplacement préventif',
        'mise-aux-normes': 'Mise aux normes',
        autre: 'Autre',
        accident: 'Accident',
        'catastrophe-naturelle': 'Catastrophe naturelle',
        pompiers: 'Intervention des pompiers',
      },
      category: {
        'baie-vitree': 'Baie vitrée',
        fenetre: 'Fenêtre',
        'porte-vitree': 'Porte vitrée',
        'porte-entree': "Porte d'entrée",
        'porte-fenetre': 'Porte-fenêtre',
        vitrine: 'Vitrine Magasin',
        marquise: 'Marquise',
        'fenetre-toit': 'Fenêtre de toit',
        velux: 'VELUX',
        cloison: 'Cloison vitrée',
        autre: 'Autre',
      },
      subcategory: {
        coulissante: 'Coulissante',
        fixe: 'Fixe',
        battante: 'Battante',
        'oscillo-battante': 'Oscillo-battante',
      },
      vitrage: {
        simple: 'Simple vitrage',
        double: 'Double vitrage',
        triple: 'Triple vitrage',
        securit: 'Verre sécurit',
        feuillete: 'Verre feuilleté',
        'verre-feuillete': 'Verre Feuilleté Sécurit',
      },
    };
    return displayMap[key]?.[value] || value;
  };
  const infoSections = [
    {
      title: 'Type de service',
      items: [
        {
          label: 'Service',
          value: data.serviceType,
          key: 'serviceType',
        },
      ],
    },
    {
      title: 'Informations personnelles',
      items: [
        {
          label: 'Civilité',
          value: data.civilite,
          key: 'civilite',
        },
        {
          label: 'Nom',
          value: data.nom,
          key: 'nom',
        },
        {
          label: 'Téléphone',
          value: data.mobile,
          key: 'telephone',
        },
        {
          label: 'Email',
          value: data.email,
          key: 'email',
        },
        {
          label: 'Adresse',
          value: data.adresse,
          key: 'adresse',
        },
        {
          label: 'Code postal',
          value: data.codePostal,
          key: 'codePostal',
        },
        {
          label: 'Ville',
          value: data.ville,
          key: 'ville',
        },
      ],
    },
    {
      title: 'Détails du projet',
      items: [
        {
          label: 'Objet',
          value: data.object,
          key: 'object',
        },
        {
          label: 'Type de propriété',
          value: data.property,
          key: 'property',
        },
        {
          label: 'Motif',
          value: data.motif,
          key: 'motif',
        },
      ],
    },
    {
      title: 'Spécifications techniques',
      items: [
        {
          label: 'Catégorie',
          value: data.category,
          key: 'category',
        },
        ...(data.subcategory
          ? [
              {
                label: 'Type',
                value: data.subcategory,
                key: 'subcategory',
              },
            ]
          : []),
        {
          label: 'Vitrage',
          value: data.vitrage,
          key: 'vitrage',
        },
        {
          label: 'Largeur',
          value: data.largeur ? `${data.largeur} cm` : '',
          key: 'largeur',
        },
        {
          label: 'Hauteur',
          value: data.hauteur ? `${data.hauteur} cm` : '',
          key: 'hauteur',
        },
        {
          label: 'Quantité',
          value: data.quantite,
          key: 'quantite',
        },
        {
          label: 'Assurance',
          value: data.assurance,
          key: 'assurance',
        },
      ],
    },
  ];
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-6 border-b border-slate-100">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary-light/20 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">Récapitulatif de votre demande</h2>
            <p className="text-sm text-slate-500">Vérifiez les informations avant validation</p>
          </div>
        </div>
      </div>

      {/* Section Client */}
      <div className="border-2 border-gray-200 rounded-xl p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Vos informations</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-10 border-2 hover:border-primary hover:bg-primary/5"
            onClick={() => onModify(1)}
          >
            Modifier
          </Button>
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">
            {data.civilite === 'societe' || data.civilite === 'entreprise-btp' ? 'ENTREPRISE' : 'PARTICULIER'}
          </div>
          <div className="text-foreground">
            {data.civilite === 'monsieur'
              ? 'Monsieur'
              : data.civilite === 'madame'
                ? 'Madame'
                : data.civilite === 'entreprise-btp'
                  ? 'Professionnel du BTP'
                  : ''}{' '}
            {data.nom}
          </div>
          {(data.civilite === 'societe' || data.civilite === 'entreprise-btp') &&
            (data.raison_sociale || data.nomSociete) && (
              <div className="text-foreground font-medium">{data.raison_sociale || data.nomSociete}</div>
            )}
          <div className="text-foreground">{data.email}</div>
          <div className="text-foreground">{data.mobile}</div>
          {!data.differentInterventionAddress && (
            <>
              <div className="text-foreground">{data.adresse_intervention}</div>
            </>
          )}

          {/* Adresse d'intervention si différente */}
          {data.differentInterventionAddress && (
            <div className="mt-3 pt-3 border-t border-muted">
              <div className="text-sm font-medium text-muted-foreground mb-1">ADRESSE D'INTERVENTION</div>
              <div className="text-foreground">{data.interventionAdresse}</div>
            </div>
          )}

          {data.assurance && <div className="text-foreground">Assurance : {data.assurance}</div>}
        </div>
      </div>

      {/* Section Description */}
      <div className="border-2 border-gray-200 rounded-xl p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Description</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-10 border-2 hover:border-primary hover:bg-primary/5"
            onClick={() => onModify(2)}
          >
            Modifier
          </Button>
        </div>
        <div className="space-y-2">
          <div className="text-foreground font-medium">{getDisplayValue('object', data.object).toUpperCase()}</div>
          <div className="text-foreground">Motif : {getDisplayValue('motif', data.motif)}</div>
          <div className="text-foreground">{getDisplayValue('vitrage', data.vitrage)}</div>
          {data.category && data.subcategory && data.category !== 'vitrine' && (
            <div className="text-foreground">
              {getDisplayValue('category', data.category)} {getDisplayValue('subcategory', data.subcategory)}
            </div>
          )}
          {(data.category && !data.subcategory) ||
            (data.category === 'vitrine' && (
              <div className="text-foreground">{getDisplayValue('category', data.category)}</div>
            ))}
          <div className="text-foreground">
            {data.hauteur} cm (H) x {data.largeur} cm (L) x {data.quantite}
          </div>
        </div>
      </div>

      {/* Section Mise en sécurité */}
      <div className="border-2 border-gray-200 rounded-xl p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900">Voulez-vous une mise en sécurité ?</h3>
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setMiseEnSecurite('non')}
            className={`flex items-center justify-center px-6 h-12 border-2 rounded-lg transition-colors cursor-pointer font-medium ${miseEnSecurite === 'non' ? 'bg-primary border-primary text-primary-foreground' : 'border-border text-foreground'}`}
          >
            Non
          </button>

          <button
            type="button"
            onClick={() => setMiseEnSecurite('oui')}
            className={`flex items-center justify-center px-6 h-12 border-2 rounded-lg transition-colors cursor-pointer font-medium ${miseEnSecurite === 'oui' ? 'bg-primary border-primary text-primary-foreground' : 'border-border text-foreground'}`}
          >
            Oui
          </button>
        </div>

        <div className="p-4 bg-muted/50 rounded-lg mt-3 flex items-start gap-2">
          <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <p className="text-muted-foreground text-sm">
            La mise en sécurité protège votre propriété en attendant la réparation définitive. Cette option peut
            influencer le coût final.
          </p>
        </div>
      </div>

      <div className="pt-6">
        <Button
          onClick={() => {
            data.miseEnSecurite = miseEnSecurite;
            onValidate();
          }}
          className="w-full h-12 text-base rounded-xl btn-quote-cta"
        >
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Valider
        </Button>
      </div>
    </div>
  );
};
