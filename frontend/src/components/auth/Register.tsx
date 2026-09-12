import { useState } from 'react';
import { IoMailOutline, IoLockClosedOutline, IoPersonOutline } from 'react-icons/io5';
import { SiLeetcode } from 'react-icons/si';
import { useToast } from '../../store/toastStore';
import { signInUser, signUpNewUser } from '../../api/supabase';

export default function Register({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [leetcodeUsername, setLeetcodeUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const showToast = useToast((state) => state.showToast);

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword || !leetcodeUsername) {
      showToast('error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      showToast('error', 'Passwords do not match');
      return;
    }
    // Validate email format: x@x.x
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('error', 'Please enter a valid email address');
      return;
    }
    // Register
    try {
      await signUpNewUser(email, password);

      showToast('success', 'Account created successfully');
    } catch (error: any) {
      showToast('error', error.message);
    }
    // Login automatically
    try {
      const data = await signInUser(email, password);
      const uid = data.user?.id;
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: uid,
          username: displayName,
          leetcodeId: leetcodeUsername
        })
      });
      showToast('success', 'Logged in successfully');
    } catch (error: any) {
      showToast('error', error.message);
    }
  };

  return (
    <>
      <h3 className="hidden [@container(min-height:280px)]:block text-sm font-bold text-ink text-center">Sign Up</h3>

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

      <div className="flex items-center gap-2 bg-white/70 border border-ink/30 rounded-md px-2.5 py-0.5">
        <SiLeetcode size={14} className="shrink-0 text-ink-muted opacity-70" />
        <input
          type="text"
          placeholder="LeetCode username"
          value={leetcodeUsername}
          onChange={(e) => setLeetcodeUsername(e.target.value)}
          className="w-full min-w-0 bg-transparent text-xs text-ink placeholder:text-ink-muted outline-none"
        />
      </div>

      <div className="flex items-center gap-2 bg-white/70 border border-ink/30 rounded-md px-2.5 py-0.5">
        <IoPersonOutline size={14} className="shrink-0 text-ink-muted" />
        <input
          type="text"
          placeholder="Display name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full min-w-0 bg-transparent text-xs text-ink placeholder:text-ink-muted outline-none"
        />
      </div>

      <div className="flex items-center gap-2 bg-white/70 border border-ink/30 rounded-md px-2.5 py-0.5">
        <IoLockClosedOutline size={14} className="shrink-0 text-ink-muted" />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full min-w-0 bg-transparent text-xs text-ink placeholder:text-ink-muted outline-none"
        />
      </div>

      <div className="flex items-center gap-2 bg-white/70 border border-ink/30 rounded-md px-2.5 py-0.5">
        <IoLockClosedOutline size={14} className="shrink-0 text-ink-muted" />
        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full min-w-0 bg-transparent text-xs text-ink placeholder:text-ink-muted outline-none"
        />
      </div>

      <button
        onClick={handleSignUp}
        className="w-full flex items-center justify-center gap-1.5 bg-clay hover:bg-clay-dark text-white text-xs font-semibold rounded-md py-0.5 cursor-pointer">
        Sign Up
      </button>

      <div className="flex flex-col gap-0.5">
        <div className="hidden [@container(min-height:320px)]:flex w-full items-center gap-2 text-[10px] text-ink-muted">
          <div className="flex-1 h-px bg-ink/20" />
          or
          <div className="flex-1 h-px bg-ink/20" />
        </div>

        <button
          onClick={onSwitchToLogin}
          className="w-full flex items-center justify-center gap-1.5 bg-transparent border border-ink/40 hover:bg-ink/10 text-ink text-xs font-semibold rounded-md py-0.5 cursor-pointer">
          <IoPersonOutline size={14} />
          Log In Instead
        </button>
      </div>
    </>
  );
}
