import * as React from "react"
import { useState, useEffect, useMemo } from "react"
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

interface AddressSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  departmentCode?: string
  city?: string
  disabled?: boolean
}

interface AddressSuggestion {
  label: string
  value: string
}

export function AddressSelect({ 
  value, 
  onValueChange, 
  placeholder = "Tapez votre adresse", 
  departmentCode,
  city,
  disabled = false 
}: AddressSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Suggestions d'adresses communes basées sur le type de ville
  const commonAddresses = useMemo(() => {
    if (!city) return []
    
    const baseAddresses = [
      "Avenue de la République",
      "Rue de la Paix", 
      "Boulevard Saint-Michel",
      "Place de la Mairie",
      "Rue Victor Hugo",
      "Avenue Charles de Gaulle",
      "Rue Jean Jaurès",
      "Boulevard Voltaire",
      "Rue de Rivoli",
      "Avenue des Champs-Élysées",
      "Rue de la Liberté",
      "Place du Marché",
      "Rue Nationale",
      "Avenue Foch",
      "Rue Gambetta"
    ]

    return baseAddresses.map(addr => ({
      label: `${addr}, ${city}`,
      value: addr
    }))
  }, [city])

  // Fonction pour rechercher des adresses via l'API Adresse française
  const searchAddresses = async (query: string) => {
    if (query.length < 3) {
      setSuggestions(commonAddresses.slice(0, 10))
      return
    }

    setIsLoading(true)
    try {
      const searchQuery = city ? `${query} ${city}` : query
      const hasNumber = /^\s*\d/.test(query)
      const type = hasNumber ? "housenumber" : "street"

      const url = new URL("https://api-adresse.data.gouv.fr/search/")
      url.searchParams.set("q", searchQuery)
      url.searchParams.set("limit", "10")
      url.searchParams.set("type", type)

      const response = await fetch(url.toString())
      
      if (response.ok) {
        const data = await response.json()
        const features: any[] = data.features || []

        // Filtrer/prioriser par ville si disponible
        let filtered = features
        if (city) {
          const lcCity = city.toLowerCase()
          const matchesCity = (p: any) =>
            (p?.city && String(p.city).toLowerCase().includes(lcCity)) ||
            (p?.context && String(p.context).toLowerCase().includes(lcCity))

          const exact = features.filter(f => matchesCity(f.properties))
          filtered = exact.length ? exact : features

          // Trier: d'abord les adresses qui matchent la ville
          filtered = filtered.sort((a, b) => Number(matchesCity(b.properties)) - Number(matchesCity(a.properties)))
        }

        const addressSuggestions = filtered.map((feature: any) => ({
          label: feature.properties.label,
          value: feature.properties.label,
        }))
        setSuggestions(addressSuggestions)
      } else {
        setSuggestions(commonAddresses.slice(0, 10))
      }
    } catch (error) {
      console.error("Erreur lors de la recherche d'adresses:", error)
      setSuggestions(commonAddresses.slice(0, 10))
    } finally {
      setIsLoading(false)
    }
  }

  // Recherche avec debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        searchAddresses(searchTerm)
      } else {
        setSuggestions(commonAddresses.slice(0, 10))
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, commonAddresses])

  const displayText = value || placeholder

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between pl-10 font-normal"
          disabled={disabled}
        >
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          {displayText}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start" side="bottom" sideOffset={4}>
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Rechercher une adresse..." 
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Recherche en cours..." : "Aucune adresse trouvée."}
            </CommandEmpty>
            <CommandGroup>
              {suggestions.map((suggestion, index) => (
                <CommandItem
                  key={`${suggestion.value}-${index}`}
                  value={suggestion.label}
                  onSelect={() => {
                    onValueChange?.(suggestion.value)
                    setOpen(false)
                    setSearchTerm("")
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === suggestion.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {suggestion.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}