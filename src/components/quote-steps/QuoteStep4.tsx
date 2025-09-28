import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, Edit3 } from "lucide-react";
import { useState } from "react";

interface QuoteStep4Props {
  data: any;
  onValidate: () => void;
  onModify: (step: number) => void;
}

export const QuoteStep4 = ({ data, onValidate, onModify }: QuoteStep4Props) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  // Helper function to escape regex special characters
  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  // Helper function to clean street name by removing duplicate postal code and city
  const cleanStreet = (address: string, codePostal: string, ville: string) => {
    if (!address) return "";
    
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
    const displayMap: { [key: string]: { [value: string]: string } } = {
      serviceType: {
        "reparation": "Réparation",
        "installation": "Installation"
      },
      civilite: {
        "m": "Monsieur",
        "mme": "Madame"
      },
      object: {
        "fenetre": "Fenêtre",
        "porte": "Porte",
        "cloison": "Cloison",
        "miroir": "Miroir",
        "vitre-cassee": "Vitre cassée",
        "autre": "Autre"
      },
      property: {
        "maison": "Maison",
        "appartement": "Appartement",
        "local-commercial": "Local commercial",
        "bureau": "Bureau"
      },
      motif: {
        "casse-naturelle": "Casse naturelle",
        "tentative-effraction": "Tentative d'effraction",
        "vandalisme": "Vandalisme",
        "bris-de-glace": "Bris de glace",
        "choc-thermique": "Choc thermique",
        "defaut-installation": "Défaut d'installation",
        "usure": "Usure",
        "remplacement-preventif": "Remplacement préventif",
        "mise-aux-normes": "Mise aux normes",
        "autre": "Autre",
        "accident": "Accident",
        "catastrophe-naturelle": "Catastrophe naturelle",
        "pompiers": "Intervention des pompiers"
      },
      category: {
        "baie-vitree": "Baie vitrée",
        "fenetre": "Fenêtre", 
        "porte-vitree": "Porte vitrée",
        "porte-entree": "Porte d'entrée",
        "porte-fenetre": "Porte-fenêtre",
        "vitrine": "Vitrine Magasin",
        "marquise": "Marquise",
        "fenetre-toit": "Fenêtre de toit",
        "velux": "VELUX",
        "cloison": "Cloison vitrée",
        "autre": "Autre"
      },
      subcategory: {
        "coulissante": "Coulissante",
        "fixe": "Fixe",
        "battante": "Battante",
        "oscillo-battante": "Oscillo-battante"
      },
      vitrage: {
        "simple": "Simple vitrage",
        "double": "Double vitrage",
        "triple": "Triple vitrage",
        "securit": "Verre sécurit",
        "feuillete": "Verre feuilleté",
        "verre-feuillete": "Verre Feuilleté Sécurit"
      }
    };

    return displayMap[key]?.[value] || value;
  };

  const infoSections = [
    {
      title: "Type de service",
      items: [
        { label: "Service", value: data.serviceType, key: "serviceType" }
      ]
    },
    {
      title: "Informations personnelles",
      items: [
        { label: "Civilité", value: data.civilite, key: "civilite" },
        { label: "Nom", value: data.nom, key: "nom" },
        { label: "Téléphone", value: data.telephone, key: "telephone" },
        { label: "Email", value: data.email, key: "email" },
        { label: "Adresse", value: data.adresse, key: "adresse" },
        { label: "Code postal", value: data.codePostal, key: "codePostal" },
        { label: "Ville", value: data.ville, key: "ville" }
      ]
    },
    {
      title: "Détails du projet",
      items: [
        { label: "Objet", value: data.object, key: "object" },
        { label: "Type de propriété", value: data.property, key: "property" },
        { label: "Motif", value: data.motif, key: "motif" }
      ]
    },
    {
      title: "Spécifications techniques",
      items: [
        { label: "Catégorie", value: data.category, key: "category" },
        ...(data.subcategory ? [{ label: "Type", value: data.subcategory, key: "subcategory" }] : []),
        { label: "Vitrage", value: data.vitrage, key: "vitrage" },
        { label: "Largeur", value: data.largeur ? `${data.largeur} cm` : "", key: "largeur" },
        { label: "Hauteur", value: data.hauteur ? `${data.hauteur} cm` : "", key: "hauteur" },
        { label: "Quantité", value: data.quantite, key: "quantite" },
        { label: "Assurance", value: data.assurance, key: "assurance" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-2xl mx-auto space-y-6 px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          RÉCAPITULATIF
        </h2>
        <p className="text-gray-700">
          Veuillez vérifier vos informations avant de valider votre demande de devis
        </p>
      </div>

      {/* Section Client */}
      <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-shadow">
        <CardContent className="p-6 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center mb-4">
            <CheckCircle2 className="h-6 w-6 text-blue-600 mr-3" />
            <span className="text-lg font-semibold text-blue-800">Vos informations</span>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">
              {(data.civilite === "societe" || data.civilite === "entreprise-btp") ? "ENTREPRISE" : "PARTICULIER"}
            </div>
            <div className="text-foreground">{data.civilite === "monsieur" ? "Monsieur" : data.civilite === "madame" ? "Madame" : data.civilite === "societe" ? "Société" : data.civilite === "entreprise-btp" ? "Professionnel du BTP" : data.civilite} {data.nom ? data.nom.toUpperCase() : ""}</div>
            {(data.raison_sociale || data.nomSociete) && <div className="text-foreground font-medium">{data.raison_sociale || data.nomSociete || "PRIOR REPAIR"}</div>}
            <div className="text-foreground">{data.email}</div>
            <div className="text-foreground">{data.telephone}</div>
            {!data.differentInterventionAddress && (
              <div className="text-foreground">
                {data.adresse_intervention}
              </div>
            )}
            
            {/* Adresse d'intervention si différente */}
            {data.differentInterventionAddress && (
              <div className="mt-3 pt-3 border-t border-muted">
                <div className="text-sm font-medium text-muted-foreground mb-1">ADRESSE D'INTERVENTION</div>
                <div className="text-foreground">
                  {data.interventionAdresse}<br/>
                  {[data.interventionCodePostal, data.interventionVille].filter(Boolean).join(" ")}
                </div>
              </div>
            )}
            
            {data.assurance && <div className="text-foreground">Assurance : {data.assurance}</div>}
          </div>
          <div className="flex justify-center mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onModify(3)}
              className="text-blue-600 border-blue-300 hover:bg-blue-50"
            >
              <Edit3 className="h-4 w-4 mr-1" />
              Modifier
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Section Interventions */}
      <Card className="border-l-4 border-l-green-500 shadow-lg hover:shadow-xl transition-shadow">
        <CardContent className="p-6 bg-gradient-to-r from-green-50 to-white">
          <div className="flex items-center mb-4">
            <CheckCircle2 className="h-6 w-6 text-green-600 mr-3" />
            <span className="text-lg font-semibold text-green-800">Description</span>
          </div>
          <div className="space-y-2">
            <div className="text-foreground font-medium">{getDisplayValue("object", data.object).toUpperCase()}</div>
            <div className="text-foreground">Motif : {getDisplayValue("motif", data.motif)}</div>
            <div className="text-foreground">{getDisplayValue("vitrage", data.vitrage)}</div>
            {data.category && data.subcategory && <div className="text-foreground">{getDisplayValue("category", data.category)} {getDisplayValue("subcategory", data.subcategory)}</div>}
            {data.category && !data.subcategory && <div className="text-foreground">{getDisplayValue("category", data.category)}</div>}
            <div className="text-foreground">{data.hauteur} cm (H) x {data.largeur} cm (L) x {data.quantite}</div>
          </div>
          <div className="flex justify-center mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onModify(2)}
              className="text-green-600 border-green-300 hover:bg-green-50"
            >
              <Edit3 className="h-4 w-4 mr-1" />
              Modifier
            </Button>
          </div>
        </CardContent>
      </Card>


      {/* Section Acceptation des conditions */}
      <Card className="border-l-4 border-l-purple-500 shadow-lg hover:shadow-xl transition-shadow">
        <CardContent className="p-6 bg-gradient-to-r from-purple-50 to-white">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
              className="mt-1"
            />
            <div className="space-y-1 leading-none">
              <label
                htmlFor="terms"
                className="text-sm font-medium cursor-pointer"
              >
                J'accepte les conditions générales de vente (CGV) et les conditions générales d'utilisation (CGU)
              </label>
              <p className="text-xs text-muted-foreground">
                En cochant cette case, vous acceptez nos{" "}
                <a href="#" className="underline text-primary hover:text-primary/80">
                  conditions générales de vente
                </a>{" "}
                et nos{" "}
                <a href="#" className="underline text-primary hover:text-primary/80">
                  conditions générales d'utilisation
                </a>
                .
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <Button
          onClick={onValidate}
          className="flex-1 h-12"
          disabled={!acceptedTerms}
        >
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Valider
        </Button>
        <Button
          onClick={() => onModify(0)}
          variant="outline"
          className="flex-1 h-12"
        >
          <Edit3 className="h-4 w-4 mr-2" />
          Modifier
        </Button>
        </div>
      </div>
    </div>
  );
};