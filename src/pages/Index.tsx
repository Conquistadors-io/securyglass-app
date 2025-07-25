import { useState } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { UrgentIntervention } from "@/components/UrgentIntervention";
import { OnlineQuote } from "@/components/OnlineQuote";
import { TechnicianDashboard } from "@/components/TechnicianDashboard";
import { TechnicianIntervention } from "@/components/TechnicianIntervention";
import { TechnicianAppointment } from "@/components/TechnicianAppointment";
import { TechnicianMeasurement } from "@/components/TechnicianMeasurement";
import { TechnicianOrder } from "@/components/TechnicianOrder";
import { TechnicianInstallation } from "@/components/TechnicianInstallation";

const Index = () => {
  const [currentRoute, setCurrentRoute] = useState("welcome");

  const handleNavigate = (route: string) => {
    setCurrentRoute(route);
  };

  const renderCurrentScreen = () => {
    switch (currentRoute) {
      case "welcome":
        return <WelcomeScreen onNavigate={handleNavigate} />;
      case "urgent-intervention":
        return <UrgentIntervention onNavigate={handleNavigate} />;
      case "online-quote":
        return <OnlineQuote onNavigate={handleNavigate} />;
      case "technician-dashboard":
        return <TechnicianDashboard onNavigate={handleNavigate} />;
      case "technician-intervention":
        return <TechnicianIntervention onNavigate={handleNavigate} />;
      case "technician-appointment":
        return <TechnicianAppointment onNavigate={handleNavigate} />;
      case "technician-measurement":
        return <TechnicianMeasurement onNavigate={handleNavigate} />;
      case "technician-order":
        return <TechnicianOrder onNavigate={handleNavigate} />;
      case "technician-installation":
        return <TechnicianInstallation onNavigate={handleNavigate} />;
      case "admin-dashboard":
        // TODO: Implement admin dashboard
        return <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-lg">Tableau de bord admin - En développement</p>
        </div>;
      default:
        return <WelcomeScreen onNavigate={handleNavigate} />;
    }
  };

  return renderCurrentScreen();
};

export default Index;
