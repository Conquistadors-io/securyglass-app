import * as React from "react"
import { useState, useEffect, useMemo, forwardRef } from "react"
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

export const AddressSelect = forwardRef<HTMLInputElement, AddressSelectProps>(({ 
  value, 
  onValueChange, 
  placeholder = "Tapez votre adresse", 
  departmentCode,
  city,
  disabled = false 
}, ref) => {
  const [searchTerm, setSearchTerm] = useState(value || "")
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isAddressComplete, setIsAddressComplete] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Exposer l'input ref via le forward ref
  React.useImperativeHandle(ref, () => inputRef.current!);

  // Suggestions d'adresses communes basées sur le type de ville
  const commonAddresses = useMemo(() => {
    if (!city) return []
    
    const baseAddresses = [
      "1 Résidence des Rosiers",
      "2 Résidence du Parc",
      "3 Résidence des Jardins",
      "1 Résidence du Centre",
      "2 Résidence de la Gare",
      "1 Résidence Belle Vue",
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
    const wantsResidence = tokens.includes("res") || tokens.includes("residence") || tokens.includes("résidence")

    const isBoulevardText = (text: string) => /\bboulevard\b/i.test(text) || /\bbd\b/i.test(text) || /\bblvd\b/i.test(text) || /\bboul\.?\b/i.test(text)
    const isResidenceText = (text: string) => /\brésidence\b/i.test(text) || /\bresidence\b/i.test(text)

    // Préparer les suggestions filtrées selon le type recherché
    let filteredCommon = commonAddresses.slice(0, 10)
    if (wantsBoulevard) {
      filteredCommon = filteredCommon.filter((s) => isBoulevardText(s.label))
    } else if (wantsResidence) {
      filteredCommon = filteredCommon.filter((s) => isResidenceText(s.label))
    }

    if (query.length < 3) {
      setSuggestions(filteredCommon)
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
        setSuggestions(filteredCommon)
      }
    } catch (error) {
      console.error("Erreur lors de la recherche d'adresses:", error)
      setSuggestions(filteredCommon)
    } finally {
      setIsLoading(false)
    }
  }

  // Recherche avec debounce
  useEffect(() => {
    // Ne pas afficher les suggestions si l'adresse est déjà complète
    if (isAddressComplete) {
      setShowSuggestions(false)
      return
    }

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
  }, [searchTerm, commonAddresses, isAddressComplete])

  // Synchroniser searchTerm avec value
  useEffect(() => {
    if (value !== searchTerm) {
      setSearchTerm(value || "")
      // Vérifier si l'adresse semble complète (contient au moins un numéro et du texte)
      const addressComplete = value && value.trim().length > 5 && /\d/.test(value)
      setIsAddressComplete(!!addressComplete)
    }
  }, [value, searchTerm])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchTerm(newValue)
    // Si l'utilisateur efface complètement le champ, réinitialiser
    if (newValue.trim() === "") {
      setIsAddressComplete(false)
    }
    // Si l'utilisateur modifie une adresse existante, réinitialiser seulement si elle était complète
    else if (isAddressComplete) {
      setIsAddressComplete(false)
    }
    onValueChange?.(newValue)
  }

  const handleSuggestionClick = (suggestion: AddressSuggestion) => {
    setSearchTerm(suggestion.value)
    onValueChange?.(suggestion.value)
    setSuggestions([])
    setShowSuggestions(false)
    setIsAddressComplete(true) // Marquer comme complète après sélection
    setIsFocused(false)
    inputRef.current?.blur()
  }
  const handleInputFocus = () => {
    setIsFocused(true)
    // Seulement afficher les suggestions si l'adresse n'est pas complète
    if (searchTerm.length >= 2 && !isAddressComplete) {
      setShowSuggestions(true)
    }
  }

  const handleInputBlur = () => {
    // Délai pour permettre le clic sur une suggestion
    setTimeout(() => { 
      setShowSuggestions(false)
      setIsFocused(false)
    }, 200)
  }

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        <Input
          ref={inputRef}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          disabled={disabled}
          className="pl-12 h-12"
        />
      </div>
      
      {showSuggestions && isFocused && suggestions.length > 0 && !isAddressComplete && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {isLoading && (
            <div className="px-4 py-3 text-sm text-gray-500 border-b border-gray-100">
              Recherche en cours...
            </div>
          )}
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.value}-${index}`}
              className="px-4 py-3 text-sm cursor-pointer hover:bg-primary/5 transition-all duration-150 border-b border-gray-100 last:border-0 text-gray-900 font-medium"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
});

AddressSelect.displayName = 'AddressSelect';
