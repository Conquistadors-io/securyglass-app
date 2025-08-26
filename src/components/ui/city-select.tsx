import * as React from "react"
import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const CITIES_BY_DEPARTMENT: Record<string, string[]> = {
  "01": ["Bourg-en-Bresse", "Oyonnax", "Bellegarde-sur-Valserine", "Ambérieu-en-Bugey", "Miribel", "Ferney-Voltaire", "Gex", "Divonne-les-Bains", "Trévoux", "Châtillon-sur-Chalaronne"],
  "02": ["Laon", "Saint-Quentin", "Soissons", "Château-Thierry", "Chauny", "Tergnier", "Villers-Cotterêts", "Hirson", "Guignicourt", "Bohain-en-Vermandois"],
  "03": ["Moulins", "Montluçon", "Vichy", "Cusset", "Yzeure", "Bellerive-sur-Allier", "Commentry", "Gannat", "Domérat", "Désertines"],
  "04": ["Digne-les-Bains", "Manosque", "Sisteron", "Château-Arnoux-Saint-Auban", "Forcalquier", "Pierrevert", "Oraison", "Villeneuve", "Banon", "Riez"],
  "05": ["Gap", "Briançon", "Embrun", "Veynes", "Laragne-Montéglin", "Tallard", "Saint-Bonnet-en-Champsaur", "Chorges", "Guillestre", "L'Argentière-la-Bessée"],
  "06": ["Nice", "Cannes", "Antibes", "Grasse", "Cagnes-sur-Mer", "Menton", "Vallauris", "Mandelieu-la-Napoule", "Villeneuve-Loubet", "Vence", "Mougins", "Saint-Laurent-du-Var", "Carros"],
  "07": ["Privas", "Annonay", "Aubenas", "Tournon-sur-Rhône", "Guilherand-Granges", "Romans-sur-Isère", "Bourg-Saint-Andéol", "Le Teil", "Largentière", "Villeneuve-de-Berg"],
  "08": ["Charleville-Mézières", "Sedan", "Rethel", "Revin", "Givet", "Nouzonville", "Bogny-sur-Meuse", "Vouziers", "Carignan", "Fumay"],
  "09": ["Foix", "Pamiers", "Saint-Girons", "Lavelanet", "Tarascon-sur-Ariège", "Saverdun", "Mirepoix", "Saint-Paul-de-Jarrat", "Laroque-d'Olmes", "Ax-les-Thermes"],
  "10": ["Troyes", "Romilly-sur-Seine", "La Chapelle-Saint-Luc", "Saint-André-les-Vergers", "Sainte-Savine", "Nogent-sur-Seine", "Bar-sur-Aube", "Saint-Julien-les-Villas", "Pont-Sainte-Marie", "Les Noës-près-Troyes"],
  "11": ["Carcassonne", "Narbonne", "Béziers", "Perpignan", "Castelnaudary", "Limoux", "Lézignan-Corbières", "Coursan", "Port-la-Nouvelle", "Sigean"],
  "12": ["Rodez", "Millau", "Villefranche-de-Rouergue", "Decazeville", "Saint-Affrique", "Onet-le-Château", "Capdenac-Gare", "Espalion", "Luc-la-Primaube", "Baraqueville"],
  "13": ["Marseille", "Aix-en-Provence", "Arles", "Martigues", "Aubagne", "Istres", "Salon-de-Provence", "Vitrolles", "Miramas", "La Ciotat", "Gardanne", "Fos-sur-Mer", "Marignane", "Tarascon", "Cassis"],
  "14": ["Caen", "Hérouville-Saint-Clair", "Lisieux", "Bayeux", "Vire", "Mondeville", "Ifs", "Ouistreham", "Colombelles", "Dives-sur-Mer"],
  "15": ["Aurillac", "Saint-Flour", "Mauriac", "Ydes", "Arpajon-sur-Cère", "Vic-sur-Cère", "Pleaux", "Maurs", "Riom-ès-Montagnes", "Condat"],
  "16": ["Angoulême", "Cognac", "Soyaux", "La Couronne", "Ruelle-sur-Touvre", "Barbezieux-Saint-Hilaire", "Châteaubernard", "Jarnac", "Confolens", "Gond-Pontouvre"],
  "17": ["La Rochelle", "Rochefort", "Saintes", "Royan", "Tonnay-Charente", "Saint-Jean-d'Angély", "Pons", "Saujon", "Surgères", "Marennes"],
  "18": ["Bourges", "Vierzon", "Saint-Amand-Montrond", "Saint-Doulchard", "Mehun-sur-Yèvre", "Saint-Florent-sur-Cher", "Dun-sur-Auron", "Aubigny-sur-Nère", "Sancoins", "La Guerche-sur-l'Aubois"],
  "19": ["Tulle", "Brive-la-Gaillarde", "Ussel", "Malemort", "Saint-Pantaléon-de-Larche", "Objat", "Meymac", "Allassac", "Donzenac", "Argentat"],
  "21": ["Dijon", "Beaune", "Chenôve", "Talant", "Quetigny", "Longvic", "Fontaine-lès-Dijon", "Auxonne", "Is-sur-Tille", "Châtillon-sur-Seine"],
  "22": ["Saint-Brieuc", "Lannion", "Dinan", "Plérin", "Lamballe", "Loudéac", "Paimpol", "Trégueux", "Langueux", "Guingamp"],
  "23": ["Guéret", "La Souterraine", "Aubusson", "Bourganeuf", "Sainte-Feyre", "Bonnat", "Evaux-les-Bains", "Dun-le-Palestel", "Gouzon", "Ahun"],
  "24": ["Périgueux", "Bergerac", "Sarlat-la-Canéda", "Coulounieix-Chamiers", "Trélissac", "Boulazac", "Terrasson-Lavilledieu", "Saint-Astier", "Ribérac", "Nontron"],
  "25": ["Besançon", "Montbéliard", "Pontarlier", "Audincourt", "Valdahon", "Hérimoncourt", "Grand-Charmont", "Morteau", "Ornans", "Baume-les-Dames"],
  "26": ["Valence", "Romans-sur-Isère", "Montélimar", "Pierrelatte", "Bourg-lès-Valence", "Portes-lès-Valence", "Saint-Paul-Trois-Châteaux", "Tournon-sur-Rhône", "Nyons", "Die"],
  "27": ["Évreux", "Vernon", "Louviers", "Val-de-Reuil", "Gisors", "Pont-Audemer", "Les Andelys", "Gaillon", "Bernay", "Pacy-sur-Eure"],
  "28": ["Chartres", "Dreux", "Lucé", "Châteaudun", "Vernouillet", "Luisant", "Nogent-le-Rotrou", "Mainvilliers", "Épernon", "Lèves"],
  "29": ["Brest", "Quimper", "Concarneau", "Lorient", "Morlaix", "Douarnenez", "Landerneau", "Guipavas", "Plouzané", "Fouesnant"],
  "30": ["Nîmes", "Alès", "Bagnols-sur-Cèze", "Beaucaire", "Saint-Gilles", "Villeneuve-lès-Avignon", "Pont-Saint-Esprit", "La Grand-Combe", "Vauvert", "Uzès"],
  "31": ["Toulouse", "Colomiers", "Tournefeuille", "Muret", "Blagnac", "Plaisance-du-Touch", "Balma", "Cugnaux", "Castanet-Tolosan", "Saint-Gaudens"],
  "32": ["Auch", "Condom", "Fleurance", "Lectoure", "L'Isle-Jourdain", "Mirande", "Nogaro", "Vic-Fezensac", "Gimont", "Masseube"],
  "33": ["Bordeaux", "Mérignac", "Pessac", "Talence", "Villenave-d'Ornon", "Bègles", "Libourne", "Le Bouscat", "Gradignan", "Cenon", "Floirac", "Blanquefort", "Saint-Médard-en-Jalles"],
  "34": ["Montpellier", "Béziers", "Sète", "Lunel", "Frontignan", "Agde", "Castelnau-le-Lez", "Lattes", "Mauguio", "Pérols", "Saint-Gély-du-Fesc", "Mèze", "Lodève"],
  "35": ["Rennes", "Saint-Malo", "Fougères", "Vitré", "Redon", "Cesson-Sévigné", "Bruz", "Pacé", "Dinard", "Saint-Jacques-de-la-Lande", "Betton", "Melesse", "Chartres-de-Bretagne"],
  "36": ["Châteauroux", "Issoudun", "Le Blanc", "Argenton-sur-Creuse", "La Châtre", "Buzançais", "Déols", "Levroux", "Valençay", "Saint-Maur"],
  "37": ["Tours", "Joué-lès-Tours", "Saint-Pierre-des-Corps", "Saint-Cyr-sur-Loire", "Chambray-lès-Tours", "Amboise", "Chinon", "Loches", "Montlouis-sur-Loire", "Ballan-Miré"],
  "38": ["Grenoble", "Saint-Martin-d'Hères", "Échirolles", "Vienne", "Bourgoin-Jallieu", "Fontaine", "Voiron", "Meylan", "Villefontaine", "L'Isle-d'Abeau", "Seyssinet-Pariset", "Sassenage"],
  "39": ["Lons-le-Saunier", "Dole", "Saint-Claude", "Champagnole", "Morez", "Tavaux", "Les Rousses", "Poligny", "Arbois", "Saint-Amour"],
  "40": ["Mont-de-Marsan", "Dax", "Biscarrosse", "Saint-Paul-lès-Dax", "Tarnos", "Aire-sur-l'Adour", "Soustons", "Mimizan", "Capbreton", "Saint-Pierre-du-Mont"],
  "41": ["Blois", "Romorantin-Lanthenay", "Vendôme", "Vineuil", "Saint-Gervais-la-Forêt", "Mer", "Lamotte-Beuvron", "Selles-sur-Cher", "Contres", "Montrichard"],
  "42": ["Saint-Étienne", "Roanne", "Saint-Chamond", "Firminy", "Montbrison", "Rive-de-Gier", "Le Chambon-Feugerolles", "Andrézieux-Bouthéon", "Villars", "Riorges"],
  "43": ["Le Puy-en-Velay", "Monistrol-sur-Loire", "Yssingeaux", "Brioude", "Aurec-sur-Loire", "Sainte-Sigolène", "Langeac", "Vals-près-le-Puy", "Craponne-sur-Arzon", "Dunières"],
  "44": ["Nantes", "Saint-Nazaire", "Rezé", "Saint-Sébastien-sur-Loire", "Orvault", "Vertou", "Couëron", "Carquefou", "Bouguenais", "La Chapelle-sur-Erdre", "Saint-Herblain", "Pornic"],
  "45": ["Orléans", "Fleury-les-Aubrais", "Olivet", "Saint-Jean-de-Braye", "Châlette-sur-Loing", "Montargis", "Gien", "Pithiviers", "Saran", "Saint-Jean-le-Blanc"],
  "46": ["Cahors", "Figeac", "Gourdon", "Souillac", "Prayssac", "Saint-Céré", "Gramat", "Luzech", "Puy-l'Évêque", "Martel"],
  "47": ["Agen", "Villeneuve-sur-Lot", "Marmande", "Tonneins", "Le Passage", "Nérac", "Sainte-Livrade-sur-Lot", "Fumel", "Casteljaloux", "Boé"],
  "48": ["Mende", "Florac", "Saint-Chély-d'Apcher", "Langogne", "La Canourgue", "Marvejols", "Chanac", "Banassac", "Saint-Alban-sur-Limagnole", "Aumont-Aubrac"],
  "49": ["Angers", "Cholet", "Saumur", "Avrillé", "Trélazé", "Les Ponts-de-Cé", "Saint-Barthélemy-d'Anjou", "Bouchemaine", "Beaucouzé", "Doué-la-Fontaine"],
  "50": ["Cherbourg-en-Cotentin", "Saint-Lô", "Équeurdreville-Hainneville", "Tourlaville", "Granville", "Avranches", "Coutances", "Valognes", "Carentan", "Octeville"],
  "51": ["Reims", "Châlons-en-Champagne", "Épernay", "Vitry-le-François", "Bezannes", "Tinqueux", "Saint-Memmie", "Fismes", "Ay", "Sézanne"],
  "52": ["Saint-Dizier", "Chaumont", "Langres", "Nogent", "Saint-Dizier", "Wassy", "Joinville", "Bourbonne-les-Bains", "Arc-en-Barrois", "Fayl-Billot"],
  "53": ["Laval", "Château-Gontier", "Mayenne", "Ernée", "Évron", "Changé", "L'Huisserie", "Bonchamp-lès-Laval", "Saint-Berthevin", "Craon"],
  "54": ["Nancy", "Vandœuvre-lès-Nancy", "Villers-lès-Nancy", "Malzéville", "Toul", "Laxou", "Lunéville", "Pont-à-Mousson", "Longwy", "Mont-Saint-Martin"],
  "55": ["Bar-le-Duc", "Verdun", "Commercy", "Saint-Mihiel", "Ligny-en-Barrois", "Étain", "Stenay", "Revigny-sur-Ornain", "Ancerville", "Belleville-sur-Meuse"],
  "56": ["Lorient", "Vannes", "Lanester", "Ploemeur", "Hennebont", "Pontivy", "Auray", "Saint-Avé", "Guidel", "Carnac"],
  "57": ["Metz", "Thionville", "Montigny-lès-Metz", "Yutz", "Sarreguemines", "Forbach", "Saint-Avold", "Creutzwald", "Hagondange", "Woippy"],
  "58": ["Nevers", "Cosne-Cours-sur-Loire", "Decize", "La Charité-sur-Loire", "Varennes-Vauzelles", "Fourchambault", "Imphy", "Garchizy", "Pougues-les-Eaux", "Clamecy"],
  "59": ["Lille", "Dunkerque", "Tourcoing", "Roubaix", "Calais", "Valenciennes", "Douai", "Wattrelos", "Marcq-en-Barœul", "Cambrai", "Maubeuge", "Lambersart", "Armentières"],
  "60": ["Beauvais", "Compiègne", "Creil", "Senlis", "Nogent-sur-Oise", "Pont-Sainte-Maxence", "Méru", "Clermont", "Montataire", "Crépy-en-Valois"],
  "61": ["Alençon", "Flers", "Argentan", "L'Aigle", "Domfront", "La Ferté-Macé", "Vimoutiers", "Mortagne-au-Perche", "Sées", "Tinchebray"],
  "62": ["Calais", "Boulogne-sur-Mer", "Arras", "Lens", "Liévin", "Hénin-Beaumont", "Douai", "Béthune", "Bruay-la-Buissière", "Carvin", "Avion", "Saint-Omer"],
  "63": ["Clermont-Ferrand", "Chamalières", "Cournon-d'Auvergne", "Riom", "Beaumont", "Aubière", "Issoire", "Thiers", "Pont-du-Château", "Gerzat"],
  "64": ["Pau", "Bayonne", "Anglet", "Biarritz", "Hendaye", "Saint-Jean-de-Luz", "Oloron-Sainte-Marie", "Orthez", "Billère", "Lescar"],
  "65": ["Tarbes", "Lourdes", "Aureilhan", "Bagnères-de-Bigorre", "Vic-en-Bigorre", "Argelès-Gazost", "Séméac", "Ossun", "Ibos", "Tournay"],
  "66": ["Perpignan", "Canet-en-Roussillon", "Saint-Cyprien", "Argelès-sur-Mer", "Saint-Estève", "Elne", "Rivesaltes", "Port-Vendres", "Céret", "Prades"],
  "67": ["Strasbourg", "Schiltigheim", "Haguenau", "Illkirch-Graffenstaden", "Sélestat", "Bischwiller", "Saverne", "Obernai", "Molsheim", "Erstein"],
  "68": ["Mulhouse", "Colmar", "Saint-Louis", "Illzach", "Wittenheim", "Kingersheim", "Rixheim", "Guebwiller", "Cernay", "Thann"],
  "69": ["Lyon", "Villeurbanne", "Vénissieux", "Saint-Priest", "Caluire-et-Cuire", "Bron", "Meyzieu", "Rillieux-la-Pape", "Décines-Charpieu", "Écully", "Oullins", "Tassin-la-Demi-Lune"],
  "70": ["Vesoul", "Héricourt", "Lure", "Gray", "Luxeuil-les-Bains", "Saint-Sauveur", "Champagney", "Ronchamp", "Fougerolles", "Villersexel"],
  "71": ["Chalon-sur-Saône", "Mâcon", "Le Creusot", "Autun", "Montceau-les-Mines", "Paray-le-Monial", "Digoin", "Tournus", "Louhans", "Charnay-lès-Mâcon"],
  "72": ["Le Mans", "Sablé-sur-Sarthe", "La Flèche", "Mamers", "Château-du-Loir", "Coulaines", "Allonnes", "La Ferté-Bernard", "Yvré-l'Évêque", "Changé"],
  "73": ["Chambéry", "Aix-les-Bains", "Albertville", "Saint-Jean-de-Maurienne", "Bourg-Saint-Maurice", "Ugine", "La Motte-Servolex", "Bassens", "Cognin", "Jacob-Bellecombette"],
  "74": ["Annecy", "Thonon-les-Bains", "Annemasse", "Chamonix-Mont-Blanc", "Rumilly", "Cluses", "Seynod", "Cran-Gevrier", "Évian-les-Bains", "Sallanches"],
  "75": ["Paris 1er", "Paris 2e", "Paris 3e", "Paris 4e", "Paris 5e", "Paris 6e", "Paris 7e", "Paris 8e", "Paris 9e", "Paris 10e", "Paris 11e", "Paris 12e", "Paris 13e", "Paris 14e", "Paris 15e", "Paris 16e", "Paris 17e", "Paris 18e", "Paris 19e", "Paris 20e"],
  "76": ["Le Havre", "Rouen", "Sotteville-lès-Rouen", "Saint-Étienne-du-Rouvray", "Dieppe", "Barentin", "Montivilliers", "Fécamp", "Mont-Saint-Aignan", "Yvetot"],
  "77": ["Meaux", "Chelles", "Melun", "Pontault-Combault", "Savigny-le-Temple", "Champs-sur-Marne", "Torcy", "Roissy-en-Brie", "Lognes", "Dammarie-les-Lys"],
  "78": ["Versailles", "Sartrouville", "Mantes-la-Jolie", "Saint-Germain-en-Laye", "Poissy", "Montigny-le-Bretonneux", "Plaisir", "Les Mureaux", "Houilles", "Chatou"],
  "79": ["Niort", "Bressuire", "Thouars", "Parthenay", "Saint-Maixent-l'École", "Melle", "Cerizay", "Coulonges-sur-l'Autize", "Moncoutant", "Chef-Boutonne"],
  "80": ["Amiens", "Abbeville", "Albert", "Péronne", "Montdidier", "Doullens", "Ham", "Corbie", "Roye", "Friville-Escarbotin"],
  "81": ["Albi", "Castres", "Gaillac", "Mazamet", "Carmaux", "Lavaur", "Graulhet", "Saint-Sulpice", "Rabastens", "Réalmont"],
  "82": ["Montauban", "Castelsarrasin", "Moissac", "Caussade", "Nègrepelisse", "Montech", "Grisolles", "Verdun-sur-Garonne", "Beaumont-de-Lomagne", "Lafrançaise"],
  "83": ["Toulon", "La Seyne-sur-Mer", "Hyères", "Fréjus", "Draguignan", "Saint-Raphaël", "Six-Fours-les-Plages", "La Garde", "Sanary-sur-Mer", "Ollioules"],
  "84": ["Avignon", "Carpentras", "Orange", "Cavaillon", "Apt", "Pertuis", "L'Isle-sur-la-Sorgue", "Bollène", "Sorgues", "Le Pontet"],
  "85": ["La Roche-sur-Yon", "Les Sables-d'Olonne", "Fontenay-le-Comte", "Challans", "Saint-Jean-de-Monts", "Luçon", "Montaigu", "Les Herbiers", "Olonne-sur-Mer", "Saint-Hilaire-de-Riez"],
  "86": ["Poitiers", "Châtellerault", "Montmorillon", "Loudun", "Buxerolles", "Saint-Benoit", "Migné-Auxances", "Jaunay-Clan", "Neuville-de-Poitou", "Civray"],
  "87": ["Limoges", "Saint-Junien", "Panazol", "Couzeix", "Isle", "Saint-Yrieix-la-Perche", "Bellac", "Rilhac-Rancon", "Condat-sur-Vienne", "Feytiat"],
  "88": ["Épinal", "Saint-Dié-des-Vosges", "Gérardmer", "Remiremont", "Golbey", "Mirecourt", "Vittel", "Neufchâteau", "Thaon-les-Vosges", "Saint-Maurice-sur-Moselle"],
  "89": ["Auxerre", "Sens", "Joigny", "Avallon", "Migennes", "Saint-Florentin", "Tonnerre", "Villeneuve-sur-Yonne", "Pont-sur-Yonne", "Cheroy"],
  "90": ["Belfort", "Delle", "Bavilliers", "Valdoie", "Beaucourt", "Danjoutin", "Offemont", "Essert", "Andelnans", "Bourogne"],
  "91": ["Évry-Courcouronnes", "Corbeil-Essonnes", "Massy", "Savigny-sur-Orge", "Sainte-Geneviève-des-Bois", "Palaiseau", "Athis-Mons", "Viry-Châtillon", "Yerres", "Brunoy"],
  "92": ["Boulogne-Billancourt", "Nanterre", "Courbevoie", "Colombes", "Asnières-sur-Seine", "Rueil-Malmaison", "Levallois-Perret", "Issy-les-Moulineaux", "Antony", "Neuilly-sur-Seine", "Puteaux", "Suresnes", "Clichy", "Montrouge", "Clamart", "Meudon", "Châtillon", "Vanves", "Malakoff", "Fontenay-aux-Roses", "Le Plessis-Robinson", "Bagneux", "Garches", "Saint-Cloud", "Ville-d'Avray", "Marnes-la-Coquette", "Vaucresson", "La Garenne-Colombes", "Gennevilliers", "Villeneuve-la-Garenne"],
  "93": ["Saint-Denis", "Montreuil", "Aubervilliers", "Aulnay-sous-Bois", "Drancy", "Noisy-le-Grand", "Pantin", "Le Blanc-Mesnil", "Épinay-sur-Seine", "Bobigny"],
  "94": ["Créteil", "Vitry-sur-Seine", "Saint-Maur-des-Fossés", "Champigny-sur-Marne", "Ivry-sur-Seine", "Maisons-Alfort", "Vincennes", "Fontenay-sous-Bois", "Alfortville", "Nogent-sur-Marne"],
  "95": ["Argenteuil", "Cergy", "Garges-lès-Gonesse", "Franconville", "Goussainville", "Pontoise", "Bezons", "Ermont", "Villiers-le-Bel", "Gonesse"]
}

interface CitySelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  departmentCode?: string
  postalCode?: string
  disabled?: boolean
}

export function CitySelect({ 
  value, 
  onValueChange, 
  placeholder = "Sélectionnez une ville", 
  departmentCode,
  postalCode,
  disabled = false 
}: CitySelectProps) {
  const [open, setOpen] = useState(false)

  // Déterminer le département à partir du code postal ou utiliser departmentCode
  const getDepartmentFromPostalCode = (postal: string): string => {
    if (!postal || postal.length < 2) return ""
    
    // Pour les codes postaux à 5 chiffres
    if (postal.length >= 5) {
      const firstTwo = postal.substring(0, 2)
      
      // Cas spéciaux pour la Corse
      if (firstTwo === "20") {
        const firstThree = postal.substring(0, 3)
        if (parseInt(firstThree) <= 200) return "2A" // Corse-du-Sud
        return "2B" // Haute-Corse
      }
      
      // Cas spéciaux DOM-TOM
      if (firstTwo === "97") return postal.substring(0, 3)
      if (firstTwo === "98") return postal.substring(0, 3)
      
      return firstTwo
    }
    
    return ""
  }

  const determinedDepartment = postalCode ? getDepartmentFromPostalCode(postalCode) : departmentCode
  const availableCities = determinedDepartment ? CITIES_BY_DEPARTMENT[determinedDepartment] || [] : []
  const hasNoCities = !determinedDepartment || availableCities.length === 0

  // Sélection automatique si une seule ville disponible
  useEffect(() => {
    if (availableCities.length === 1 && !value && onValueChange) {
      onValueChange(availableCities[0])
    }
  }, [availableCities, value, onValueChange])

  const displayText = hasNoCities 
    ? "Saisir d'abord un code postal"
    : value || placeholder

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between pl-10 font-normal"
          disabled={disabled || hasNoCities}
        >
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          {displayText}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start" side="bottom" sideOffset={4}>
        <Command>
          <CommandInput placeholder="Rechercher une ville..." />
          <CommandList>
            <CommandEmpty>Aucune ville trouvée.</CommandEmpty>
            <CommandGroup>
              {availableCities.map((city) => (
                <CommandItem
                  key={city}
                  value={city}
                  onSelect={() => {
                    onValueChange?.(city)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === city ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {city}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}