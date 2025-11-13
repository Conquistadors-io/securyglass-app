import React, { useState, useEffect, useRef } from 'react';
import { Input } from './input';

interface City {
  nom: string;
  code: string;
  codeDepartement: string;
  codesPostaux: string[];
}

interface CityAutocompleteProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  departmentCode?: string;
  disabled?: boolean;
  className?: string;
  onComplete?: () => void;
}

export function CityAutocomplete({
  value = '',
  onValueChange,
  placeholder = "Saisissez votre ville",
  departmentCode = '',
  disabled = false,
  className = "",
  onComplete
}: CityAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fermer les suggestions quand on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mettre à jour l'inputValue quand value change
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Récupérer les villes du département
  const fetchCities = async (search: string, deptCode: string) => {
    if (!deptCode || deptCode.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      // Utiliser l'API geo.gouv.fr pour récupérer les communes du département
      const response = await fetch(
        `https://geo.api.gouv.fr/departements/${deptCode}/communes?fields=nom,code,codesPostaux&format=json&limit=100`
      );
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }
      
      const data: City[] = await response.json();
      
      // Filtrer les villes selon la recherche
      const filtered = data.filter(city => 
        city.nom.toLowerCase().startsWith(search.toLowerCase())
      ).slice(0, 10); // Limiter à 10 résultats
      
      setSuggestions(filtered);
      
      // Sélection automatique s'il n'y a qu'une seule ville correspondante
      if (filtered.length === 1 && search.length >= 1) {
        const singleCity = filtered[0];
        const cityWithPostal = singleCity.codesPostaux && singleCity.codesPostaux.length > 0 
          ? `${singleCity.nom} (${singleCity.codesPostaux[0]})`
          : singleCity.nom;
        onValueChange?.(cityWithPostal);
        setShowSuggestions(false);
        setSuggestions([]);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des villes:', err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Gérer les changements d'input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    if (newValue.length >= 1 && departmentCode) {
      fetchCities(newValue, departmentCode);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Gérer la sélection d'une suggestion
  const handleSelectSuggestion = (city: City) => {
    const cityWithPostal = city.codesPostaux && city.codesPostaux.length > 0 
      ? `${city.nom} (${city.codesPostaux[0]})`
      : city.nom;
    setInputValue(cityWithPostal);
    onValueChange?.(cityWithPostal);
    setSuggestions([]);
    setShowSuggestions(false);
    setTimeout(() => onComplete?.(), 100);
  };

  // Gérer le blur (perte de focus)
  const handleBlur = () => {
    // Utiliser un délai pour permettre le clic sur une suggestion
    setTimeout(() => {
      if (inputValue !== value) {
        onValueChange?.(inputValue);
      }
    }, 200);
  };

  if (disabled) {
    return (
      <Input
        type="text"
        value={inputValue}
        placeholder={placeholder}
        disabled
        className={`bg-muted ${className}`}
      />
    );
  }

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={() => {
          if (suggestions.length > 0) {
            setShowSuggestions(true);
          }
        }}
        placeholder={departmentCode ? placeholder : "Sélectionnez d'abord un département"}
        disabled={!departmentCode}
        className={`h-12 ${!departmentCode ? "bg-gray-50" : ""}`}
      />
      
      {loading && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
        </div>
      )}
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto">
          {suggestions.map((city, index) => (
            <button
              key={`${city.code}-${index}`}
              type="button"
              className="w-full px-4 py-3 text-left hover:bg-primary/5 transition-all duration-150 cursor-pointer border-b border-gray-100 last:border-0"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelectSuggestion(city);
              }}
            >
              <div className="font-medium text-gray-900">
                {city.nom}
                {city.codesPostaux && city.codesPostaux.length > 0 && (
                  <span className="text-gray-500 ml-2 font-normal">
                    ({city.codesPostaux[0]})
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
      
      {showSuggestions && suggestions.length === 0 && !loading && inputValue.length >= 1 && departmentCode && !inputValue.includes('(') && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl p-4 text-sm text-gray-500">
          Aucune ville trouvée
        </div>
      )}
    </div>
  );
}
