// Currently unused

import { useState } from "react";
import { IoMailOutline, IoArrowBackOutline } from "react-icons/io5";
import { useToast } from "../../store/toastStore";
import { resetPassword } from "../../api/supabase";

export default function ForgotPassword({
  onSwitchToLogin,
}: {
  onSwitchToLogin: () => void;
}) {
  const [email, setEmail] = useState("");
  const showToast = useToast((state) => state.showToast);

  const handleResetPassword = async () => {
    if (!email) {
      showToast("error", "Please enter your email address");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast("error", "Please enter a valid email address");
      return;
    }
    try {
      await resetPassword(email);
      showToast(
        "success",
        "If an account exists with that email, we've sent a password reset link.",
      );
    } catch (error: any) {
      showToast("error", error.message);
    }
  };

  return (
    <>
      <h3 className="text-sm font-bold text-ink text-center">Reset Password</h3>

      <div className="flex items-center gap-2 bg-white/70 border border-ink/30 rounded-md px-2.5 py-0.5">
        <IoMailOutline size={14} className="shrink-0 text-ink-muted" />
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full min-w-0 bg-transparent text-xs text-ink placeholder:text-ink-muted outline-none"
        />
      </div>

      <button
        onClick={handleResetPassword}
        className="w-full flex items-center justify-center gap-1.5 bg-clay hover:bg-clay-dark text-white text-xs font-semibold rounded-md py-0.5 cursor-pointer"
      >
        Send Reset Email
      </button>

      <button
        onClick={onSwitchToLogin}
        className="w-full flex items-center justify-center gap-1.5 bg-transparent border border-ink/40 hover:bg-ink/10 text-ink text-xs font-semibold rounded-md py-0.5 cursor-pointer"
      >
        <IoArrowBackOutline size={14} />
        Back to Login
      </button>
    </>
  );
}
