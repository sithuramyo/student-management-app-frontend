type Step = {
    label: string;
  };
  
  interface StepIndicatorProps {
    currentStep: number;
    steps: Step[];
  }
  
  export default function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
    return (
      <div className="flex items-center justify-center gap-4 pb-8">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
  
          return (
            <div key={index} className="flex items-center gap-2 text-sm font-medium">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center border transition
                  ${isActive ? "bg-blue-600 text-white" :
                    isCompleted ? "bg-green-500 text-white" :
                    "border-gray-400 text-gray-500"}
                `}
              >
                {isCompleted ? "✓" : index + 1}
              </div>
              <span className={isActive ? "text-blue-600" : "text-gray-600"}>
                {step.label}
              </span>
              {index < steps.length - 1 && <span className="text-gray-400">→</span>}
            </div>
          );
        })}
      </div>
    );
  }
  