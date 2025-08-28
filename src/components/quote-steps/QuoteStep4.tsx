import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, Edit3 } from "lucide-react";
import { useState } from "react";

interface QuoteStep4Props {
  data: any;
  onValidate: () => void;
  onModify: () => void;
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
        "autre": "Autre"
      },
      property: {
        "maison": "Maison",
        "appartement": "Appartement",
        "local-commercial": "Local commercial",
        "bureau": "Bureau"
      },
      category: {
        "baie-vitree": "Baie vitrée",
        "fenetre-standard": "Fenêtre standard",
        "porte-vitree": "Porte vitrée",
        "vitrine": "Vitrine"
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
        "feuillete": "Verre feuilleté"
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
    <div className="max-w-4xl mx-auto bg-white">
      {/* En-tête avec logos */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-t-lg border border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-teal-500 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">securyglass</h1>
              <p className="text-gray-600 text-sm">Glass for your security</p>
            </div>
          </div>
          <div className="w-20 h-12 bg-red-600 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">RGE</span>
          </div>
        </div>
      </div>

      {/* Corps du devis */}
      <div className="border-x border-gray-200 bg-white">
        {/* Informations devis et entreprise */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between">
            <div className="space-y-2">
              <div><span className="font-medium">Devis N° :</span> DV{Date.now().toString().slice(-6)}</div>
              <div><span className="font-medium">Date :</span> {new Date().toLocaleDateString('fr-FR')}</div>
              <div className="space-y-1">
                <div><span className="font-medium">À :</span></div>
                <div>{getDisplayValue("civilite", data.civilite)} {data.nom?.toUpperCase()}</div>
                <div>{data.email}</div>
                <div>{cleanStreet(data.adresse, data.codePostal, data.ville)}</div>
                <div>{[data.codePostal, data.ville].filter(Boolean).join(" ")}</div>
                <div>{data.telephone}</div>
              </div>
            </div>
            <div className="text-right space-y-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Devis</h2>
              <div className="text-sm">
                <div>Securyglass France</div>
                <div>contact@securyglass.fr</div>
                <div>09 70 144 344</div>
                <div>Code APE 6201Z</div>
                <div>Siret 91094284600015</div>
                <div>TVA FR20910942846</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tableau des articles */}
        <div className="p-6">
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left font-medium">Désignation</th>
                <th className="border border-gray-300 px-4 py-2 text-center font-medium w-16">Qté</th>
                <th className="border border-gray-300 px-4 py-2 text-center font-medium w-20">P.U.</th>
                <th className="border border-gray-300 px-4 py-2 text-center font-medium w-16">TVA</th>
                <th className="border border-gray-300 px-4 py-2 text-center font-medium w-24">Montant</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="space-y-1">
                    <div className="font-medium">Déplacement / Constat des lieux / Prise de mesures :</div>
                    <div className="text-sm text-gray-600">
                      REMPLACEMENTS DE VITRAGES À L'IDENTIQUE SUITE À DES BRIS DE GLACE
                    </div>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">1</td>
                <td className="border border-gray-300 px-4 py-2 text-center">62,73 €</td>
                <td className="border border-gray-300 px-4 py-2 text-center">10 %</td>
                <td className="border border-gray-300 px-4 py-2 text-center">62,73 €</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="space-y-1">
                    <div className="font-medium">{getDisplayValue("vitrage", data.vitrage)}</div>
                    <div className="text-sm text-gray-600">
                      EP 4/16/4 mm - Hauteur {data.hauteur} x Largeur {data.largeur}
                    </div>
                    <div className="text-sm text-gray-600">
                      Croisillons Intégrés Bois / PVC Bicolore : Blanc / Taupe
                    </div>
                    <div className="text-sm text-gray-600">
                      Réglementation Thermique RT 2012 / RE 2020
                    </div>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">{data.quantite}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">496,11 €</td>
                <td className="border border-gray-300 px-4 py-2 text-center">10 %</td>
                <td className="border border-gray-300 px-4 py-2 text-center">496,11 €</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="space-y-1">
                    <div className="font-medium">Approvisionnement + Livraison Sur Site</div>
                    <div className="text-sm text-gray-600">Délai 48H</div>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">1</td>
                <td className="border border-gray-300 px-4 py-2 text-center">79,00 €</td>
                <td className="border border-gray-300 px-4 py-2 text-center">10 %</td>
                <td className="border border-gray-300 px-4 py-2 text-center">79,00 €</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="space-y-1">
                    <div className="font-medium">Main d'œuvre</div>
                    <div className="text-sm text-gray-600">Dépose Vitrage Initial</div>
                    <div className="text-sm text-gray-600">REMPLACEMENT À L'IDENTIQUE</div>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">1</td>
                <td className="border border-gray-300 px-4 py-2 text-center">178,18 €</td>
                <td className="border border-gray-300 px-4 py-2 text-center">10 %</td>
                <td className="border border-gray-300 px-4 py-2 text-center">178,18 €</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="space-y-1">
                    <div className="font-medium flex items-center">
                      <span className="text-green-600 mr-2">🌱</span>
                      SAVE PLANET
                    </div>
                    <div className="text-sm text-gray-600">
                      Eco-enlèvement / Nettoyage + Traitement déchets
                    </div>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">1</td>
                <td className="border border-gray-300 px-4 py-2 text-center">0,00 €</td>
                <td className="border border-gray-300 px-4 py-2 text-center">10 %</td>
                <td className="border border-gray-300 px-4 py-2 text-center">0,00 €</td>
              </tr>
            </tbody>
          </table>

          {/* Totaux */}
          <div className="mt-6 flex justify-end">
            <div className="w-80 space-y-2">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span>816,02 €</span>
              </div>
              <div className="flex justify-between">
                <span>TVA 10 % (816,02 €)</span>
                <span>81,60 €</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total TTC</span>
                <span>897,62 €</span>
              </div>
            </div>
          </div>

          {/* Total TTC highlighted */}
          <div className="mt-4 text-center">
            <div className="inline-block bg-gray-100 px-8 py-4 rounded">
              <div className="text-2xl font-bold">Total TTC</div>
              <div className="text-3xl font-bold text-teal-600">897,62 €</div>
            </div>
          </div>
        </div>

        {/* Modalités de règlement */}
        <div className="p-6 border-t border-gray-200">
          <h3 className="font-bold mb-2">Modalités de règlement</h3>
          <p className="text-sm mb-4">Acompte de 50% après validation du devis, solde fin de travaux.</p>
          
          <div className="space-y-1 text-sm">
            <div><span className="font-medium">Mode de règlement :</span></div>
            <div>• Carte bancaire</div>
            <div>• Chèque libellé à l'ordre de SECURYGLASS</div>
            <div>• Numéraire ( Voir Article L112-6 )</div>
            <div>• Virement bancaire :</div>
          </div>
          
          <div className="mt-4 space-y-1 text-sm">
            <div className="font-medium">RELEVÉ D'IDENTITÉ BANCAIRE</div>
            <div>Titulaire du compte : SAS SECURYGLASS</div>
            <div>Domiciliation : BPRIVES MONTROUGE</div>
            <div>IBAN : FR76 1020 7000 0123 2145 6187 131</div>
            <div>BIC / SWIFT : CCBPFRPPMT6</div>
          </div>
        </div>

        {/* Conditions générales */}
        <div className="p-6 border-t border-gray-200">
          <h3 className="font-bold mb-2">Conditions générales</h3>
          <div className="text-sm space-y-2">
            <div><span className="font-medium">1. CHAMP D'APPLICATION</span></div>
            <div className="text-xs">
              Les présentes conditions générales de vente (CGV) s'appliquent à toutes les prestations de serrurerie, vitrerie, miroiterie.
            </div>
          </div>
        </div>
      </div>

      {data.photo && (
        <div className="p-6 border-t border-gray-200">
          <h3 className="font-bold mb-2">Photo jointe</h3>
          <div className="text-sm">Photo téléchargée ({data.photo.name})</div>
        </div>
      )}

      {/* Section Acceptation des conditions */}
      <Card>
        <CardContent className="p-6">
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
          onClick={onModify}
          variant="outline"
          className="flex-1 h-12"
        >
          <Edit3 className="h-4 w-4 mr-2" />
          Modifier
        </Button>
      </div>
    </div>
  );
};