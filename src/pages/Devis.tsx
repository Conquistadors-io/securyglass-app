import { useNavigate } from "react-router-dom";
import { OnlineQuote } from "@/components/OnlineQuote";

const Devis = () => {
  const navigate = useNavigate();

  const handleNavigate = (route: string) => {
    if (route === "welcome") {
      navigate("/");
    }
  };

  return <OnlineQuote onNavigate={handleNavigate} />;
};

export default Devis;
