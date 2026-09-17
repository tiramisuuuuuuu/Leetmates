import { useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";

export default function CompleteProfile() {
  const [step, setStep] = useState(1);

  return (
    <div className="relative w-full h-full bg-cream rounded-lg border border-ink flex flex-col justify-center items-center gap-1.5 p-4">
      <h3 className="text-sm font-bold text-ink text-center [@container(max-height:320px)]:text-xs">
        Complete your profile [{step}/3]
      </h3>

      <div className="flex-1 flex flex-col justify-center items-center gap-1">
        {step === 1 ? <Step1 /> : step === 2 ? <Step2 /> : <div />}
      </div>

      <div className="flex flex-row justify-center items-center w-full">
        {step > 1 && (
          <button
            className="flex-1 max-w-2xs flex items-center justify-center gap-1.5 bg-transparent border border-ink/40 hover:bg-ink/10 text-ink text-xs font-semibold rounded-md py-0.5 cursor-pointer"
            onClick={() => {
              setStep((prev) => prev - 1);
            }}
          >
            Back
          </button>
        )}

        <button
          className="flex-1 max-w-2xs flex items-center justify-center gap-1.5 bg-clay hover:bg-clay-dark text-white text-xs font-semibold rounded-md py-0.5 cursor-pointer"
          onClick={() => {
            step < 3 && setStep((prev) => prev + 1);
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
