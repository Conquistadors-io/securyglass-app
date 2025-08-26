import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import { MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

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
  const [searchTerm, setSearchTerm] = useState(value || "")
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

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
      label: addr,
      value: addr
    }))
  }, [city])

  // Fonction pour rechercher des adresses via l'API Adresse française
  const searchAddresses = async (query: string) => {
    const normalized = query.trim().toLowerCase()
    const stripLeadingNumber = (s: string) => s.replace(/^\s*\d+\s*(bis|ter|quater)?\s*/i, "")
    const afterNumber = stripLeadingNumber(normalized)
    const tokens = afterNumber.trim()
    const boulevardPrefixes = ["bd", "bld", "b", "bou", "boul", "boulev", "boulevard", "blvd", "bvd", "boul."]
    const wantsBoulevard = boulevardPrefixes.some((p) => tokens.startsWith(p))

    const isBoulevardText = (text: string) => /\bboulevard\b/i.test(text) || /\bbd\b/i.test(text) || /\bblvd\b/i.test(text) || /\bboul\.?\b/i.test(text)

    if (query.length < 3) {
      const base = commonAddresses.slice(0, 10)
      const baseFiltered = wantsBoulevard
        ? base.filter((s) => isBoulevardText(s.label))
        : base
      setSuggestions(baseFiltered)
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
      url.searchParams.set("autocomplete", "1")

      const response = await fetch(url.toString())
      
      if (response.ok) {
        const data = await response.json()
        const features: any[] = data.features || []

        const lcCity = city?.toLowerCase()
        const matchesCity = (p: any) =>
          lcCity
            ? (p?.city && String(p.city).toLowerCase().includes(lcCity)) ||
              (p?.context && String(p.context).toLowerCase().includes(lcCity))
            : true

        let filtered = features

        if (wantsBoulevard) {
          const isBoulevard = (p: any) => {
            const hay = `${p?.street ?? ""} ${p?.name ?? ""} ${p?.label ?? ""}`.toLowerCase()
            return isBoulevardText(hay)
          }
          filtered = filtered.filter((f) => isBoulevard(f.properties))
        }

        const inCity = filtered.filter((f) => matchesCity(f.properties))
        filtered = inCity.length ? inCity : filtered
        filtered = filtered.sort((a, b) => Number(matchesCity(b.properties)) - Number(matchesCity(a.properties)))

        const addressSuggestions = filtered.map((feature: any) => {
          // Extraire seulement le numéro et la rue (sans code postal et ville)
          const fullAddress = feature.properties.label
          const streetAddress = fullAddress.split(',')[0].trim()
          
          return {
            label: streetAddress,
            value: streetAddress,
          }
        })
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
      if (searchTerm && searchTerm.length >= 2) {
        searchAddresses(searchTerm)
        setShowSuggestions(true)
      } else {
        setSuggestions(commonAddresses.slice(0, 10))
        setShowSuggestions(searchTerm.length > 0)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, commonAddresses])

  // Synchroniser searchTerm avec value
  useEffect(() => {
    if (value !== searchTerm) {
      setSearchTerm(value || "")
    }
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchTerm(newValue)
    onValueChange?.(newValue)
  }

  const handleSuggestionClick = (suggestion: AddressSuggestion) => {
    setSearchTerm(suggestion.value)
    onValueChange?.(suggestion.value)
    setShowSuggestions(false)
  }

  const handleInputFocus = () => {
    if (searchTerm.length >= 2) {
      setShowSuggestions(true)
    }
  }

  const handleInputBlur = () => {
    // Délai pour permettre le clic sur une suggestion
    setTimeout(() => setShowSuggestions(false), 200)
  }

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          disabled={disabled}
          className="pl-10"
        />
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-md shadow-md max-h-60 overflow-y-auto">
          {isLoading && (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              Recherche en cours...
            </div>
          )}
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.value}-${index}`}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-muted"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}