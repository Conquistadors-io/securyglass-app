import { Phone } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-extrabold text-white tracking-tight">SECURYGLASS</span>
          </div>

          {/* Phone */}
          <a
            href="tel:0970144344"
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
          >
            <Phone className="h-4 w-4" />
            <span className="text-sm font-medium">09 70 14 43 44</span>
          </a>

          {/* Legal */}
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} SecuryGlass. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};
