import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Phone, Mail, MapPin, Hash, Shield } from "lucide-react";
import { DepartmentSelect } from "@/components/ui/department-select";
import { CitySelect } from "@/components/ui/city-select";
import { AddressSelect } from "@/components/ui/address-select";
import { InsuranceSelect } from "@/components/ui/insurance-select";
interface QuoteStep1Props {
  data: any;
  onComplete: (data: any) => void;
  onBack?: () => void;
}
export const QuoteStep1 = ({
  data,
  onComplete,
  onBack
}: QuoteStep1Props) => {
  const [formData, setFormData] = useState({
    civilite: data.civilite || "",
    nom: data.nom || "",
    telephone: data.telephone || "",
    email: data.email || "",
    adresse: data.adresse || "",
    codePostal: data.codePostal || "",
    ville: data.ville || "",
    priseEnChargeAssurance: data.priseEnChargeAssurance || "",
    assurance: data.assurance || ""
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };
  const isValid = formData.nom && formData.telephone && formData.email;
  return;
};