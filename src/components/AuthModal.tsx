import React, { useState } from 'react';
import { 
  X, Lock, Mail, User, Sparkles, ArrowRight, 
  CheckCircle2, AlertCircle, Eye, EyeOff, ShieldCheck, Zap
} from 'lucide-react';
import { 
  registerWithEmail, 
  loginWithEmail, 
  loginWithGoogle 
} from '../lib/firebase';
import { 
  getUserProfileFromFirestore, 
  syncUserProfileToFirestore 
} from '../lib/firestoreService';
import { UserAccount } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  onAuthSuccess: (user: UserAccount, isNewUser: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onAuthSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!username.trim()) {
          setError('Please provide a channel or creator username.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters long.');
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }

        const fbUser = await registerWithEmail(email, password, username.trim());
        
        // Build initial profile with 1,000 Free Starter Credits!
        const refCodeGenerated = username.trim().toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(100 + Math.random() * 900);
        const newAccount: UserAccount = {
          uid: fbUser.uid,
          username: username.trim(),
          email: fbUser.email || email,
          credits: 1000, // Starter bonus
          membershipTier: 'free',
          dailyStreak: 1,
          lastDailyClaim: null,
          totalEarned: 1000,
          totalSpent: 0,
          viewsGiven: 0,
          likesGiven: 0,
          subsGiven: 0,
          referralCode: refCodeGenerated,
          referralsCount: 0,
          referralEarnings: 0,
          joinedDate: new Date().toISOString().split('T')[0],
          verifications: []
        };

        await syncUserProfileToFirestore(newAccount);
        onAuthSuccess(newAccount, true);
        onClose();
      } else {
        // Login Flow
        const fbUser = await loginWithEmail(email, password);
        
        // Attempt to load existing cloud profile
        const existingProfile = await getUserProfileFromFirestore(fbUser.uid);
        if (existingProfile) {
          onAuthSuccess(existingProfile, false);
        } else {
          // Fallback or migrate profile
          const fallbackAccount: UserAccount = {
            uid: fbUser.uid,
            username: fbUser.displayName || email.split('@')[0] || 'Creator',
            email: fbUser.email || email,
            credits: 1000,
            membershipTier: 'free',
            dailyStreak: 1,
            lastDailyClaim: null,
            totalEarned: 1000,
            totalSpent: 0,
            viewsGiven: 0,
            likesGiven: 0,
            subsGiven: 0,
            referralCode: (fbUser.displayName || 'ref').toLowerCase().replace(/[^a-z0-9]/g, '') + '101',
            referralsCount: 0,
            referralEarnings: 0,
            joinedDate: new Date().toISOString().split('T')[0],
            verifications: []
          };
          await syncUserProfileToFirestore(fallbackAccount);
          onAuthSuccess(fallbackAccount, false);
        }
        onClose();
      }
    } catch (err: any) {
      console.error('Auth action failed:', err);
      let msg = 'Authentication failed. Please check your credentials.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'This email is already registered. Please sign in instead.';
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password. Please try again.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password is too weak. Please use at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const fbUser = await loginWithGoogle();
      if (!fbUser) return;

      const existingProfile = await getUserProfileFromFirestore(fbUser.uid);
      if (existingProfile) {
        onAuthSuccess(existingProfile, false);
      } else {
        const uName = fbUser.displayName || fbUser.email?.split('@')[0] || 'Creator';
        const refCodeGenerated = uName.toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(100 + Math.random() * 900);
        const newAccount: UserAccount = {
          uid: fbUser.uid,
          username: uName,
          email: fbUser.email || '',
          credits: 1000,
          membershipTier: 'free',
          dailyStreak: 1,
          lastDailyClaim: null,
          totalEarned: 1000,
          totalSpent: 0,
          viewsGiven: 0,
          likesGiven: 0,
          subsGiven: 0,
          referralCode: refCodeGenerated,
          referralsCount: 0,
          referralEarnings: 0,
          joinedDate: new Date().toISOString().split('T')[0],
          verifications: []
        };
        await syncUserProfileToFirestore(newAccount);
        onAuthSuccess(newAccount, true);
      }
      onClose();
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google sign-in could not be completed.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Instant Demo Switch for fast testing
  const handleQuickDemoLogin = async (demoUsername: string, demoEmail: string, credits: number, tier: 'free' | 'lite' | 'premium' | 'pro') => {
    const demoAccount: UserAccount = {
      uid: `demo-${demoUsername.toLowerCase()}`,
      username: demoUsername,
      email: demoEmail,
      credits: credits,
      membershipTier: tier,
      dailyStreak: 6,
      lastDailyClaim: null,
      totalEarned: credits + 20000,
      totalSpent: 20000,
      viewsGiven: 320,
      likesGiven: 84,
      subsGiven: 38,
      referralCode: demoUsername.toLowerCase().replace(/[^a-z0-9]/g, ''),
      referralsCount: 8,
      referralEarnings: 4200,
      joinedDate: '2026-08-01',
      verifications: []
    };
    await syncUserProfileToFirestore(demoAccount);
    onAuthSuccess(demoAccount, false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-[#0f1225] border border-indigo-900/60 w-full max-w-md rounded-3xl p-6 sm:p-8 space-y-6 relative shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-rose-600/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full text-indigo-300 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>YTMonster Creator Network</span>
          </div>
          <h2 className="text-2xl font-black text-white font-display">
            {mode === 'signup' ? 'Create Creator Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-400">
            {mode === 'signup' 
              ? 'Sign up to track your views, launch campaigns & earn free credits!' 
              : 'Sign in to access your dashboard, statistics & active campaigns.'}
          </p>
        </div>

        {/* Bonus Notification on Signup */}
        {mode === 'signup' && (
          <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border border-amber-500/40 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 font-bold">
              ⚡
            </div>
            <div className="text-xs">
              <span className="font-extrabold text-amber-300 block">+1,000 Free Credits Bonus</span>
              <span className="text-slate-300 text-[11px]">Instant welcome credit package added upon sign up!</span>
            </div>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-[#090b16] rounded-2xl border border-slate-800 text-xs font-black">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`py-2 rounded-xl transition ${
              mode === 'login'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`py-2 rounded-xl transition ${
              mode === 'signup'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign Up (Free)
          </button>
        </div>

        {/* Error alert */}
        {error && (
          <div className="bg-rose-500/20 border border-rose-500/40 rounded-2xl p-3 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 block">Creator / Channel Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. Alex_Gaming or TechTube"
                  className="w-full bg-[#0a0c18] border border-slate-800 focus:border-indigo-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-slate-600 focus:outline-none transition"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 block">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creator@example.com"
                className="w-full bg-[#0a0c18] border border-slate-800 focus:border-indigo-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-slate-600 focus:outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 block">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-[#0a0c18] border border-slate-800 focus:border-indigo-500 rounded-xl py-2.5 pl-10 pr-10 text-xs text-white placeholder:text-slate-600 focus:outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 block">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full bg-[#0a0c18] border border-slate-800 focus:border-indigo-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-slate-600 focus:outline-none transition"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Processing...</span>
              </span>
            ) : (
              <>
                <span>{mode === 'signup' ? 'Create Account & Claim +1,000 Credits' : 'Sign In to Profile'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px bg-slate-800 flex-1"></div>
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Or quick connect</span>
          <div className="h-px bg-slate-800 flex-1"></div>
        </div>

        {/* Google Sign In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-2.5 bg-[#14172b] hover:bg-[#1a1e38] border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-bold text-white transition flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Fast Switch / Demo Switchers */}
        <div className="pt-2 border-t border-slate-800/80 space-y-2">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block text-center">
            Quick Switch Test Accounts
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('Juan_Creator', 'juan819171@gmail.com', 14500, 'pro')}
              className="px-2.5 py-1.5 bg-[#090b16] hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/30 rounded-xl text-[10px] font-bold text-slate-300 hover:text-white transition flex items-center justify-between"
            >
              <span>Juan (PRO VIP)</span>
              <span className="text-amber-400 font-mono">14.5k ⚡</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('Alex_Gamer', 'alex_vlogs@gmail.com', 4800, 'premium')}
              className="px-2.5 py-1.5 bg-[#090b16] hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/30 rounded-xl text-[10px] font-bold text-slate-300 hover:text-white transition flex items-center justify-between"
            >
              <span>Alex (PREMIUM)</span>
              <span className="text-amber-400 font-mono">4.8k ⚡</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
