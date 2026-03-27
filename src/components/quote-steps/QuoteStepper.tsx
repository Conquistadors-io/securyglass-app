import { Check } from 'lucide-react';

interface QuoteStepperProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = ['Prestation', 'Objet', 'Vitrage', 'Coordonnées', 'Récap', 'Envoi'];

export const QuoteStepper = ({ currentStep, totalSteps }: QuoteStepperProps) => {
  const steps = stepLabels.slice(0, totalSteps);
  const progressPercent = (currentStep / (totalSteps - 1)) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto px-6">
      <div className="relative flex items-start justify-between">
        {/* Continuous background line — inset by half the circle width (20px) so it spans center-to-center */}
        <div className="absolute h-0.5 bg-white/20" style={{ top: '20px', left: '20px', right: '20px' }} />
        {/* Progress fill line — same inset, width is a % of the track */}
        <div
          className="absolute h-0.5 bg-white/70 transition-all duration-500"
          style={{
            top: '20px',
            left: '20px',
            width: `calc((100% - 40px) * ${progressPercent / 100})`,
          }}
        />

        {steps.map((label, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div key={label} className="relative z-10 flex flex-col items-center">
              {/* Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-emerald-400 border-emerald-400 text-white'
                    : isActive
                      ? 'bg-white border-white text-primary shadow-lg shadow-black/10 scale-110'
                      : 'bg-primary-dark border-white/40 text-white'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </div>

              {/* Label */}
              <span
                className={`hidden sm:block mt-2 text-xs font-semibold transition-colors ${
                  isCompleted ? 'text-emerald-200' : isActive ? 'text-white' : 'text-white/70'
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
