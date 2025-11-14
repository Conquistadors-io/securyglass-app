import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"

const DEPARTMENTS = [
  { code: "01", name: "Ain" },
  { code: "02", name: "Aisne" },
  { code: "03", name: "Allier" },
  { code: "04", name: "Alpes-de-Haute-Provence" },
  { code: "05", name: "Hautes-Alpes" },
  { code: "06", name: "Alpes-Maritimes" },
  { code: "07", name: "Ardèche" },
  { code: "08", name: "Ardennes" },
  { code: "09", name: "Ariège" },
  { code: "10", name: "Aube" },
  { code: "11", name: "Aude" },
  { code: "12", name: "Aveyron" },
  { code: "13", name: "Bouches-du-Rhône" },
  { code: "14", name: "Calvados" },
  { code: "15", name: "Cantal" },
  { code: "16", name: "Charente" },
  { code: "17", name: "Charente-Maritime" },
  { code: "18", name: "Cher" },
  { code: "19", name: "Corrèze" },
  { code: "20", name: "Corse" },
  { code: "21", name: "Côte-d'Or" },
  { code: "22", name: "Côtes-d'Armor" },
  { code: "23", name: "Creuse" },
  { code: "24", name: "Dordogne" },
  { code: "25", name: "Doubs" },
  { code: "26", name: "Drôme" },
  { code: "27", name: "Eure" },
  { code: "28", name: "Eure-et-Loir" },
  { code: "29", name: "Finistère" },
  { code: "30", name: "Gard" },
  { code: "31", name: "Haute-Garonne" },
  { code: "32", name: "Gers" },
  { code: "33", name: "Gironde" },
  { code: "34", name: "Hérault" },
  { code: "35", name: "Ille-et-Vilaine" },
  { code: "36", name: "Indre" },
  { code: "37", name: "Indre-et-Loire" },
  { code: "38", name: "Isère" },
  { code: "39", name: "Jura" },
  { code: "40", name: "Landes" },
  { code: "41", name: "Loir-et-Cher" },
  { code: "42", name: "Loire" },
  { code: "43", name: "Haute-Loire" },
  { code: "44", name: "Loire-Atlantique" },
  { code: "45", name: "Loiret" },
  { code: "46", name: "Lot" },
  { code: "47", name: "Lot-et-Garonne" },
  { code: "48", name: "Lozère" },
  { code: "49", name: "Maine-et-Loire" },
  { code: "50", name: "Manche" },
  { code: "51", name: "Marne" },
  { code: "52", name: "Haute-Marne" },
  { code: "53", name: "Mayenne" },
  { code: "54", name: "Meurthe-et-Moselle" },
  { code: "55", name: "Meuse" },
  { code: "56", name: "Morbihan" },
  { code: "57", name: "Moselle" },
  { code: "58", name: "Nièvre" },
  { code: "59", name: "Nord" },
  { code: "60", name: "Oise" },
  { code: "61", name: "Orne" },
  { code: "62", name: "Pas-de-Calais" },
  { code: "63", name: "Puy-de-Dôme" },
  { code: "64", name: "Pyrénées-Atlantiques" },
  { code: "65", name: "Hautes-Pyrénées" },
  { code: "66", name: "Pyrénées-Orientales" },
  { code: "67", name: "Bas-Rhin" },
  { code: "68", name: "Haut-Rhin" },
  { code: "69", name: "Rhône" },
  { code: "70", name: "Haute-Saône" },
  { code: "71", name: "Saône-et-Loire" },
  { code: "72", name: "Sarthe" },
  { code: "73", name: "Savoie" },
  { code: "74", name: "Haute-Savoie" },
  { code: "75", name: "Paris" },
  { code: "76", name: "Seine-Maritime" },
  { code: "77", name: "Seine-et-Marne" },
  { code: "78", name: "Yvelines" },
  { code: "79", name: "Deux-Sèvres" },
  { code: "80", name: "Somme" },
  { code: "81", name: "Tarn" },
  { code: "82", name: "Tarn-et-Garonne" },
  { code: "83", name: "Var" },
  { code: "84", name: "Vaucluse" },
  { code: "85", name: "Vendée" },
  { code: "86", name: "Vienne" },
  { code: "87", name: "Haute-Vienne" },
  { code: "88", name: "Vosges" },
  { code: "89", name: "Yonne" },
  { code: "90", name: "Territoire de Belfort" },
  { code: "91", name: "Essonne" },
  { code: "92", name: "Hauts-de-Seine" },
  { code: "93", name: "Seine-Saint-Denis" },
  { code: "94", name: "Val-de-Marne" },
  { code: "95", name: "Val-d'Oise" },
  { code: "971", name: "Guadeloupe" },
  { code: "972", name: "Martinique" },
  { code: "973", name: "Guyane" },
  { code: "974", name: "La Réunion" },
  { code: "976", name: "Mayotte" },
]

interface DepartmentSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  onComplete?: () => void
}

export function DepartmentSelect({ value, onValueChange, placeholder = "Numéro du département", onComplete }: DepartmentSelectProps) {
  const [inputValue, setInputValue] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const selectedDepartment = DEPARTMENTS.find(dept => dept.code === value)

  // Mettre à jour l'inputValue quand value change
  useEffect(() => {
    if (value) {
      const dept = DEPARTMENTS.find(d => d.code === value)
      if (dept) {
        setInputValue(`${dept.code} ${dept.name}`)
      }
    } else {
      setInputValue("")
    }
  }, [value])

  // Fermer les suggestions quand on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredDepartments = DEPARTMENTS.filter(department => {
    if (!inputValue || inputValue === `${selectedDepartment?.code} ${selectedDepartment?.name}`) return false
    
    const search = inputValue.toLowerCase()
    const departmentText = `${department.code} ${department.name}`.toLowerCase()
    
    // Si la recherche ne contient que des chiffres, chercher seulement au début du code
    if (/^\d+$/.test(inputValue)) {
      return department.code.startsWith(inputValue)
    }
    
    // Sinon, recherche normale dans le texte complet
    return departmentText.includes(search)
  })

  // Sélection automatique s'il n'y a qu'un seul résultat exact
  useEffect(() => {
    if (filteredDepartments.length === 1 && inputValue && /^\d+$/.test(inputValue)) {
      const singleDept = filteredDepartments[0]
      if (singleDept.code === inputValue) {
        onValueChange?.(singleDept.code)
        setShowSuggestions(false)
      }
    }
  }, [filteredDepartments, inputValue, onValueChange])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    
    if (newValue.length >= 1) {
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
      onValueChange?.("")
    }
  }

  const handleSelectDepartment = (dept: typeof DEPARTMENTS[0]) => {
    onValueChange?.(dept.code)
    setShowSuggestions(false)
    setTimeout(() => onComplete?.(), 100)
  }

  const handleClick = () => {
    // Si un département est déjà sélectionné, effacer pour permettre une nouvelle saisie
    if (value) {
      onValueChange?.("")
      setInputValue("")
      setShowSuggestions(false)
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onClick={handleClick}
          onFocus={() => {
            if (inputValue && filteredDepartments.length > 0 && !value) {
              setShowSuggestions(true)
            }
          }}
          placeholder={placeholder}
          className="pl-10 cursor-pointer"
        />
      </div>
      
      {showSuggestions && filteredDepartments.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredDepartments.map((department) => (
            <button
              key={department.code}
              type="button"
              className="w-full px-4 py-2 text-left hover:bg-accent transition-colors cursor-pointer"
              onMouseDown={(e) => {
                e.preventDefault()
                handleSelectDepartment(department)
              }}
            >
              <div className="font-medium">{department.code} {department.name}</div>
            </button>
          ))}
        </div>
      )}
      
      {showSuggestions && filteredDepartments.length === 0 && inputValue.length >= 1 && inputValue !== `${selectedDepartment?.code} ${selectedDepartment?.name}` && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg p-4 text-sm text-muted-foreground">
          Aucun département trouvé
        </div>
      )}
    </div>
  )
}