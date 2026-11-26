import { useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";

export default function EnableNotifications({
  closeModal,
}: {
  closeModal: () => void;
}) {
  const [step, setStep] = useState(1);

  return (
    <div className="flex-1 flex">
      {step === 1 ? (
        <Step1 next={() => setStep(2)} closeModal={closeModal} />
      ) : (
        <Step2 closeModal={closeModal} />
      )}
    </div>
  );
}
