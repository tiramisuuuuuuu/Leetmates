import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import loginCatDuo from "../../assets/loginCatDuo.png";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="@container w-full h-full bg-cream rounded-lg border border-ink flex items-stretch">
      {/* Left: Branding */}
      <div className="hidden @xs:flex w-5/12 flex-col items-center justify-center gap-3 px-6">
        <img src={loginCatDuo} alt="Leetmates cats" className="w-25" />

        <div className="flex flex-col items-center gap-0.5 text-center">
          <p className="text-xl font-bold text-ink">LEETMATES</p>
          <p className="text-xs text-ink-muted">
            Find friends. Solve together.
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="hidden @xs:block w-px shrink-0 bg-ink/15 my-6" />

      {/* Right: Auth */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5 px-4">
        {mode === "login" ? (
          <Login onSwitchToRegister={() => setMode("register")} />
        ) : (
          <Register onSwitchToLogin={() => setMode("login")} />
        )}
      </div>
    </div>
  );
}
