import * as React from "react"
import { useState } from "react"
import { Check, ChevronsUpDown, Shield, Plus } from "lucide-react"
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

interface InsuranceSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

interface Insurance {
  name: string
  value: string
  color: string
  logo: string | { src: string; alt: string }
}

// Import logos
import allianzLogo from "@/assets/insurance-logos/allianz.png"
import generaliLogo from "@/assets/insurance-logos/generali.png"

const insurances: Insurance[] = [
  { name: "AXA", value: "axa", color: "#00008F", logo: "🅰️" },
  { name: "Allianz", value: "allianz", color: "#003781", logo: { src: allianzLogo, alt: "Allianz" } },
  { name: "Generali", value: "generali", color: "#B31B34", logo: { src: generaliLogo, alt: "Generali" } },
  { name: "MAIF", value: "maif", color: "#E60012", logo: "🏠" },
  { name: "MACIF", value: "macif", color: "#004B87", logo: "🛡️" },
  { name: "MAAF", value: "maaf", color: "#E30613", logo: "🚗" },
  { name: "MMA", value: "mma", color: "#0066CC", logo: "Ⓜ️" },
  { name: "Groupama", value: "groupama", color: "#ED1C24", logo: "🔺" },
  { name: "MATMUT", value: "matmut", color: "#00A651", logo: "🐕" },
  { name: "GMF", value: "gmf", color: "#0066CC", logo: "🏛️" },
  { name: "SMACL", value: "smacl", color: "#00A0B0", logo: "💼" },
  { name: "Crédit Agricole Assurances", value: "credit-agricole", color: "#00A651", logo: "🏦" },
  { name: "BNP Paribas Cardif", value: "bnp-cardif", color: "#009639", logo: "🏪" },
  { name: "Société Générale Assurances", value: "societe-generale", color: "#E2001A", logo: "🏢" },
  { name: "LCL Assurances", value: "lcl", color: "#0066CC", logo: "🏛️" }
]

export function InsuranceSelect({ 
  value, 
  onValueChange, 
  placeholder = "Sélectionnez votre assurance", 
  disabled = false 
}: InsuranceSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const selectedInsurance = insurances.find(insurance => insurance.value === value)
  const isCustomValue = value && !selectedInsurance

  const handleSelect = (selectedValue: string) => {
    if (selectedValue === "custom") {
      onValueChange?.(searchValue)
    } else {
      const insurance = insurances.find(ins => ins.name.toLowerCase() === selectedValue.toLowerCase())
      onValueChange?.(insurance?.value || selectedValue)
    }
    setOpen(false)
    setSearchValue("")
  }

  const filteredInsurances = insurances.filter(insurance =>
    insurance.name.toLowerCase().includes(searchValue.toLowerCase())
  )

  const showCustomOption = searchValue && 
    !insurances.some(ins => ins.name.toLowerCase() === searchValue.toLowerCase()) &&
    searchValue.length > 2

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
          <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <span className="truncate">
            {selectedInsurance ? selectedInsurance.name : (isCustomValue ? value : placeholder)}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start" sideOffset={4} avoidCollisions>
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Rechercher une assurance..." 
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>
              {searchValue ? "Tapez pour ajouter votre assurance" : "Aucune assurance trouvée."}
            </CommandEmpty>
            <CommandGroup>
              {filteredInsurances.map((insurance) => (
                <CommandItem
                  key={insurance.value}
                  value={insurance.name}
                  onSelect={() => handleSelect(insurance.name)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === insurance.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {insurance.name}
                </CommandItem>
              ))}
              {showCustomOption && (
                <CommandItem
                  value="custom"
                  onSelect={() => handleSelect("custom")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter "{searchValue}"
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}