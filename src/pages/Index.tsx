import { useState } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { UrgentIntervention } from "@/components/UrgentIntervention";
import { OnlineQuote } from "@/components/OnlineQuote";

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
        // TODO: Implement technician dashboard
        return <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-lg">Tableau de bord technicien - En développement</p>
        </div>;
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
