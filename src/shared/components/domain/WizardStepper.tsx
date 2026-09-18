type WizardStepperProps = {
  currentStep: number;
  totalSteps: number;
};

export function WizardStepper({ currentStep, totalSteps }: WizardStepperProps) {
  return (
    <div
      className="flex items-center gap-2"
      aria-label={`Step ${currentStep} of ${totalSteps}`}
    >
      {Array.from({ length: totalSteps }, (_, index) => (
        <span
          key={index}
          className={
            index + 1 <= currentStep
              ? 'h-2 flex-1 rounded-full bg-yellow-cta'
              : 'h-2 flex-1 rounded-full bg-surface-muted'
          }
        />
      ))}
    </div>
  );
}
