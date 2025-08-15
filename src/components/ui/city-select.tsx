import * as React from "react"
import { useState } from "react"
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
  "01": ["Bourg-en-Bresse", "Oyonnax", "Bellegarde-sur-Valserine", "Ambérieu-en-Bugey", "Miribel"],
  "02": ["Laon", "Saint-Quentin", "Soissons", "Château-Thierry", "Chauny"],
  "06": ["Nice", "Cannes", "Antibes", "Grasse", "Cagnes-sur-Mer", "Menton", "Vallauris"],
  "13": ["Marseille", "Aix-en-Provence", "Arles", "Martigues", "Aubagne", "Istres", "Salon-de-Provence"],
  "33": ["Bordeaux", "Mérignac", "Pessac", "Talence", "Villenave-d'Ornon", "Bègles", "Libourne"],
  "34": ["Montpellier", "Béziers", "Sète", "Lunel", "Frontignan", "Agde", "Castelnau-le-Lez"],
  "35": ["Rennes", "Saint-Malo", "Fougères", "Vitré", "Redon", "Cesson-Sévigné", "Bruz"],
  "38": ["Grenoble", "Saint-Martin-d'Hères", "Échirolles", "Vienne", "Bourgoin-Jallieu", "Fontaine"],
  "42": ["Saint-Étienne", "Roanne", "Saint-Chamond", "Firminy", "Montbrison", "Rive-de-Gier"],
  "44": ["Nantes", "Saint-Nazaire", "Rezé", "Saint-Sébastien-sur-Loire", "Orvault", "Vertou"],
  "59": ["Lille", "Dunkerque", "Tourcoing", "Roubaix", "Calais", "Valenciennes", "Douai"],
  "67": ["Strasbourg", "Schiltigheim", "Haguenau", "Illkirch-Graffenstaden", "Sélestat"],
  "69": ["Lyon", "Villeurbanne", "Vénissieux", "Saint-Priest", "Caluire-et-Cuire", "Bron"],
  "75": ["Paris 1er", "Paris 2e", "Paris 3e", "Paris 4e", "Paris 5e", "Paris 6e", "Paris 7e", "Paris 8e", "Paris 9e", "Paris 10e", "Paris 11e", "Paris 12e", "Paris 13e", "Paris 14e", "Paris 15e", "Paris 16e", "Paris 17e", "Paris 18e", "Paris 19e", "Paris 20e"],
  "76": ["Le Havre", "Rouen", "Sotteville-lès-Rouen", "Saint-Étienne-du-Rouvray", "Dieppe"],
  "77": ["Meaux", "Chelles", "Melun", "Pontault-Combault", "Savigny-le-Temple", "Champs-sur-Marne"],
  "78": ["Versailles", "Sartrouville", "Mantes-la-Jolie", "Saint-Germain-en-Laye", "Poissy"],
  "83": ["Toulon", "La Seyne-sur-Mer", "Hyères", "Fréjus", "Draguignan", "Saint-Raphaël"],
  "84": ["Avignon", "Carpentras", "Orange", "Cavaillon", "Apt", "Pertuis"],
  "91": ["Évry-Courcouronnes", "Corbeil-Essonnes", "Massy", "Savigny-sur-Orge", "Sainte-Geneviève-des-Bois"],
  "92": ["Boulogne-Billancourt", "Nanterre", "Courbevoie", "Colombes", "Asnières-sur-Seine", "Rueil-Malmaison"],
  "93": ["Saint-Denis", "Montreuil", "Aubervilliers", "Aulnay-sous-Bois", "Drancy", "Noisy-le-Grand"],
  "94": ["Créteil", "Vitry-sur-Seine", "Saint-Maur-des-Fossés", "Champigny-sur-Marne", "Ivry-sur-Seine"],
  "95": ["Argenteuil", "Cergy", "Garges-lès-Gonesse", "Franconville", "Goussainville", "Pontoise"]
}

interface CitySelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  departmentCode?: string
  disabled?: boolean
}

export function CitySelect({ 
  value, 
  onValueChange, 
  placeholder = "Sélectionnez une ville", 
  departmentCode,
  disabled = false 
}: CitySelectProps) {
  const [open, setOpen] = useState(false)

  const availableCities = departmentCode ? CITIES_BY_DEPARTMENT[departmentCode] || [] : []
  const hasNoCities = !departmentCode || availableCities.length === 0

  const displayText = hasNoCities 
    ? "Sélectionnez d'abord un département"
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
      <PopoverContent className="w-full p-0" align="start">
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