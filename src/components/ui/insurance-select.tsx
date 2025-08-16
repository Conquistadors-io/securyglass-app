import * as React from "react"
import { useState } from "react"
import { Check, ChevronsUpDown, Shield } from "lucide-react"
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
  logo?: string
}

const insurances: Insurance[] = [
  { name: "AXA", value: "axa", color: "#00008F" },
  { name: "Allianz", value: "allianz", color: "#003781" },
  { name: "Generali", value: "generali", color: "#B31B34" },
  { name: "MAIF", value: "maif", color: "#E60012" },
  { name: "MACIF", value: "macif", color: "#004B87" },
  { name: "MAAF", value: "maaf", color: "#E30613" },
  { name: "MMA", value: "mma", color: "#0066CC" },
  { name: "Groupama", value: "groupama", color: "#ED1C24" },
  { name: "MATMUT", value: "matmut", color: "#00A651" },
  { name: "GMF", value: "gmf", color: "#0066CC" },
  { name: "SMACL", value: "smacl", color: "#00A0B0" },
  { name: "Crédit Agricole Assurances", value: "credit-agricole", color: "#00A651" },
  { name: "BNP Paribas Cardif", value: "bnp-cardif", color: "#009639" },
  { name: "Société Générale Assurances", value: "societe-generale", color: "#E2001A" },
  { name: "LCL Assurances", value: "lcl", color: "#0066CC" },
  { name: "Autre", value: "autre", color: "#6B7280" }
]

export function InsuranceSelect({ 
  value, 
  onValueChange, 
  placeholder = "Sélectionnez votre assurance", 
  disabled = false 
}: InsuranceSelectProps) {
  const [open, setOpen] = useState(false)

  const selectedInsurance = insurances.find(insurance => insurance.value === value)

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
          <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <div className="flex items-center gap-2 truncate pr-2">
            {selectedInsurance && (
              <div 
                className="w-3 h-3 rounded-full shrink-0" 
                style={{ backgroundColor: selectedInsurance.color }}
              />
            )}
            <span className="truncate">
              {selectedInsurance ? selectedInsurance.name : placeholder}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start" side="bottom" sideOffset={4}>
        <Command>
          <CommandInput placeholder="Rechercher une assurance..." />
          <CommandList>
            <CommandEmpty>Aucune assurance trouvée.</CommandEmpty>
            <CommandGroup>
              {insurances.map((insurance) => (
                <CommandItem
                  key={insurance.value}
                  value={insurance.name}
                  onSelect={() => {
                    onValueChange?.(insurance.value)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === insurance.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div 
                    className="w-3 h-3 rounded-full mr-2 shrink-0" 
                    style={{ backgroundColor: insurance.color }}
                  />
                  {insurance.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}