import { useState } from "react";
import Step1 from "./Step1";

export default function CompleteProfile() {
  const [step, setStep] = useState(1);

  return (
    <div className="relative [container-type:size] w-full min-w-60 min-h-38 h-full bg-cream rounded-lg border border-ink flex flex-col justify-center items-center gap-1.5 px-4 py-4">
      <h3 className="text-sm font-bold text-ink text-center">
        Complete your profile [1/3]
      </h3>

      {step === 1 ? (
        <Step1 />
      ) : step === 2 ? (
        <div />
      ) : (
        <div />
      )}

      <button
        className="w-full max-w-2xs flex items-center justify-center gap-1.5 bg-clay hover:bg-clay-dark text-white text-xs font-semibold rounded-md py-0.5 cursor-pointer"
      >
        Continue
      </button>
    </div>
  );
}
