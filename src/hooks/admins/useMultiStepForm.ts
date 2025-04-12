import { useState } from "react";

export function useMultiStepForm(totalSteps: number) {
  const [step, setStep] = useState(0);

  const next = () => {
    setStep((prev) => (prev < totalSteps - 1 ? prev + 1 : prev));
  };

  const back = () => {
    setStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goTo = (index: number) => {
    if (index >= 0 && index < totalSteps) {
      setStep(index);
    }
  };

  return {
    step,
    next,
    back,
    goTo,
    isFirst: step === 0,
    isLast: step === totalSteps - 1,
  };
}
