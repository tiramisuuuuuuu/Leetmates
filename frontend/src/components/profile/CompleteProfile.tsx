import { useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { useProfileForm } from "../../store/profileFormStore";
import { uploadFile } from "../../api/supabase";

export default function CompleteProfile() {
  const [step, setStep] = useState(1);

  function handleSubmit() {
    const file = useProfileForm.getState().file;
    if (file) {
      uploadFile(file);
    }
  }

  return (
    <div
      className="relative w-full min-w-[255px] min-h-[213px] h-full bg-cream rounded-lg border border-ink flex flex-col gap-3 p-3 
        overflow-y-scroll [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-ink/20 [&::-webkit-scrollbar-thumb]:rounded-full"
    >
      <h3 className="text-sm font-bold text-ink text-center">
        Complete your profile
      </h3>

      <div className="flex-1 flex flex-col justify-center">
        {step === 1 ? <Step1 /> : step === 2 ? <Step2 /> : <Step3 />}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-center gap-1">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 rounded-full transition-all ${
                s === step ? "w-4 bg-clay" : "w-1 bg-ink/15"
              }`}
            />
          ))}
        </div>

        <div className="flex flex-row justify-center items-center w-full gap-1.5">
          {step > 1 && (
            <button
              className="flex-1 max-w-xs flex items-center justify-center gap-1.5 bg-transparent border border-ink/40 hover:bg-ink/10 text-ink text-xs font-semibold rounded-md py-1 cursor-pointer"
              onClick={() => setStep((prev) => prev - 1)}
            >
              Back
            </button>
          )}

          <button
            className="flex-1 max-w-xs flex items-center justify-center gap-1.5 bg-clay hover:bg-clay-dark text-white text-xs font-semibold rounded-md py-1 cursor-pointer"
            onClick={() => {
              if (step < 3) setStep((prev) => prev + 1);
              else handleSubmit();
            }}
          >
            {step === 3 ? "Submit" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
