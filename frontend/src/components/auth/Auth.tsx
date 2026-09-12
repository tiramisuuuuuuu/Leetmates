import { useState } from 'react';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import { useAssetPrefix } from '../../store/assetPrefixStore';

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'register' | 'forgotPassword'>('login');
  const assetPrefix = useAssetPrefix((state) => state.assetPrefix);

  return (
    <div className="[container-type:size] w-full h-full bg-cream rounded-lg border border-ink flex items-stretch">
      {/* Left: Branding */}
      <div className="hidden @xs:flex w-5/12 flex-col items-center justify-center gap-3 px-6">
        <img src={assetPrefix + 'loginCatDuo.png'} alt="Leetmates cats" className="w-25" />

        <div className="flex flex-col items-center gap-0.5 text-center">
          <p className="text-xl font-bold text-ink">LEETMATES</p>
          <p className="text-xs text-ink-muted">Find friends. Solve together.</p>
        </div>
      </div>

      {/* Divider */}
      <div className="hidden @xs:block w-px shrink-0 bg-ink/15 my-6" />

      {/* Right: Auth */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5 px-4">
        {mode === 'login' ? (
          <Login
            onSwitchToRegister={() => setMode('register')}
            onSwitchToForgotPassword={() => setMode('forgotPassword')}
          />
        ) : mode === 'register' ? (
          <Register onSwitchToLogin={() => setMode('login')} />
        ) : (
          <ForgotPassword onSwitchToLogin={() => setMode('login')} />
        )}
      </div>
    </div>
  );
}
