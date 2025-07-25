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
import { TechnicianPlanning } from "@/components/TechnicianPlanning";
import { TechnicianProfile } from "@/components/TechnicianProfile";
import { TechnicianEarnings } from "@/components/TechnicianEarnings";
import { TechnicianMap } from "@/components/TechnicianMap";
import { TechnicianOnboarding } from "@/components/TechnicianOnboarding";
import { QuoteDetail } from "@/components/QuoteDetail";

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
      case "technician-planning":
        return <TechnicianPlanning onNavigate={handleNavigate} />;
      case "technician-profile":
        return <TechnicianProfile onNavigate={handleNavigate} />;
      case "technician-earnings":
        return <TechnicianEarnings onNavigate={handleNavigate} />;
      case "technician-map":
        return <TechnicianMap onNavigate={handleNavigate} />;
      case "technician-onboarding":
        return <TechnicianOnboarding onComplete={() => handleNavigate("technician-dashboard")} onNavigate={handleNavigate} />;
      case "quote-detail":
        return <QuoteDetail onNavigate={handleNavigate} />;
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
