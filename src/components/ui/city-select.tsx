import React, { useState, useEffect } from 'react';
import { Input } from './input';
import { Button } from './button';
import { Alert, AlertDescription } from './alert';

interface City {
  nom: string;
  codesPostaux: string[];
}

interface CitySelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  postalCode?: string;
  disabled?: boolean;
  className?: string;
}

export function CitySelect({
  value = '',
  onValueChange,
  placeholder = "Sélectionnez votre ville",
  postalCode = '',
  disabled = false,
  className = ""
}: CitySelectProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualCity, setManualCity] = useState('');

  // Fonction pour récupérer les villes via l'API gouvernementale
  const fetchCities = async (cp: string) => {
    if (!cp || cp.length !== 5) return;
    
    setLoading(true);
    setError('');
    
    try {
      // API officielle française
      const response = await fetch(
        `https://geo.api.gouv.fr/communes?codePostal=${cp}&fields=nom,codesPostaux&format=json&geometry=centre`
      );
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        setCities(data);
        setShowManualInput(false);
        
        // Si une seule ville, la sélectionner automatiquement
        if (data.length === 1 && onValueChange) {
          onValueChange(data[0].nom);
        }
      } else {
        // Aucune ville trouvée → passage en mode manuel
        setShowManualInput(true);
        setError(`Aucune ville trouvée pour le code postal ${cp}`);
      }
      
    } catch (err) {
      console.error('Erreur lors de la récupération des villes:', err);
      setError('Impossible de récupérer les villes. Veuillez saisir manuellement.');
      setShowManualInput(true);
      setCities([]);
    } finally {
      setLoading(false);
    }
  };

  // Effet pour récupérer les villes quand le code postal change
  useEffect(() => {
    if (postalCode && postalCode.length === 5) {
      fetchCities(postalCode);
    } else {
      setCities([]);
      setError('');
      setShowManualInput(false);
    }
  }, [postalCode]);

  // Gestion de la saisie manuelle
  const handleManualSubmit = () => {
    if (manualCity.trim() && onValueChange) {
      onValueChange(manualCity.trim());
      setManualCity('');
    }
  };

  // Gestion du retour à la sélection auto
  const handleBackToAuto = () => {
    setShowManualInput(false);
    setManualCity('');
    if (postalCode) {
      fetchCities(postalCode);
    }
  };

  if (disabled) {
    return (
      <Input
        type="text"
        value={value}
        placeholder={placeholder}
        disabled
        className={`bg-muted ${className}`}
      />
    );
  }

  // Rendu de l'état de chargement
  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        <span className="text-sm text-muted-foreground">Recherche des villes...</span>
      </div>
    );
  }

  // Mode saisie manuelle
  if (showManualInput) {
    return (
      <div className={`space-y-3 ${className}`}>
        {error && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertDescription className="text-orange-800">
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Saisissez votre ville manuellement :
          </label>
          <div className="flex space-x-2">
            <Input
              type="text"
              value={manualCity}
              onChange={(e) => setManualCity(e.target.value)}
              placeholder="Ex: Paris, Lyon, Marseille..."
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
            />
            <Button 
              type="button"
              onClick={handleManualSubmit}
              disabled={!manualCity.trim()}
            >
              Valider
            </Button>
          </div>
          
          {cities.length === 0 && (
            <Button 
              type="button"
              variant="outline" 
              size="sm"
              onClick={handleBackToAuto}
              className="text-xs"
            >
              🔄 Réessayer la recherche automatique
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Mode sélection automatique (liste des villes trouvées)
  if (cities.length > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        <label className="text-sm font-medium text-foreground">
          Sélectionnez votre ville :
        </label>
        <select
          value={value}
          onChange={(e) => onValueChange?.(e.target.value)}
          className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        >
          <option value="">{placeholder}</option>
          {cities.map((city, index) => (
            <option key={index} value={city.nom}>
              {city.nom}
            </option>
          ))}
        </select>
        
        <Button 
          type="button"
          variant="outline" 
          size="sm"
          onClick={() => setShowManualInput(true)}
          className="text-xs"
        >
          ✏️ Saisir manuellement
        </Button>
      </div>
    );
  }

  // Mode ville unique (auto-sélectionnée)
  if (cities.length === 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div 
          onClick={() => setShowManualInput(true)}
          className="cursor-pointer"
        >
          <Input
            type="text"
            value={cities[0].nom}
            disabled
            className="bg-muted cursor-pointer"
          />
        </div>
      </div>
    );
  }

  // État initial (pas de code postal valide)
  return (
    <div className={className}>
      <Input
        type="text"
        placeholder="Saisissez d'abord un code postal valide (5 chiffres)"
        disabled
        className="bg-muted"
      />
    </div>
  );
}