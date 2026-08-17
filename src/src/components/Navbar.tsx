import React, { useState, useRef, useEffect } from 'react';
import { UserAccount } from '../types';
import { 
  Zap, Play, PlusCircle, ShoppingBag, Crown, 
  Gift, User, HelpCircle, Shield, Award, ChevronDown, 
  Flame, Bell, Sparkles, LayoutDashboard, LogOut, LogIn, 
  UserCheck, RefreshCw, BarChart2
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'exchange' | 'campaigns' | 'store' | 'pricing' | 'dashboard' | 'profile' | 'faq';
  setActiveTab: (tab: 'home' | 'exchange' | 'campaigns' | 'store' | 'pricing' | 'dashboard' | 'profile' | 'faq') => void;
  user: UserAccount;
  onlineCount?: number;
  isFirebaseConnected?: boolean;
  onOpenStore: () => void;
  onClaimDailyBonus: () => void;
  onOpenAuthModal: (mode: 'login' | 'signup') => void;
  onLogout?: () => void;
  canClaimDaily: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onlineCount = 1,
  isFirebaseConnected = true,
  onOpenStore,
  onClaimDailyBonus,
  onOpenAuthModal,
  onLogout,
  canClaimDaily
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTierBadge = (tier: UserAccount['membershipTier']) => {
    switch (tier) {
      case 'pro':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">★ PRO VIP</span>;
      case 'premium':
        return <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">PREMIUM</span>;
      case 'lite':
        return <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">LITE</span>;
      default:
        return <span className="bg-slate-800 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full">FREE TIER</span>;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0c0e1a]/95 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-2.5 transition">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition">
              <div className="w-full h-full bg-[#0c0e1a] rounded-[14px] flex items-center justify-center">
                <Play className="w-5 h-5 text-rose-500 fill-rose-500 ml-0.5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white font-display">
                  YT<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-indigo-400">Monster</span>
                </span>
                <span className="text-[10px] bg-rose-500/20 text-rose-400 font-extrabold px-1.5 py-0.2 rounded border border-rose-500/30">
                  NETWORK
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block -mt-0.5 font-medium">YouTube Exchange & Growth</span>
            </div>
          </button>

          {/* Real-time Community Online Badge */}
          <div className="hidden xl:flex items-center gap-2 bg-[#121528] border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-mono font-black">{onlineCount}</span>
            <span className="text-[11px] text-slate-400">Creators Live Online</span>
          </div>

          {/* Main Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('exchange')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'exchange'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Client Exchanger</span>
            </button>

            <button
              onClick={() => setActiveTab('campaigns')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'campaigns'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>Campaigns</span>
            </button>

            <button
              onClick={() => setActiveTab('store')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'store'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              <span>Store / Buy Credits</span>
            </button>

            <button
              onClick={() => setActiveTab('pricing')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'pricing'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-purple-400" />
              <span>VIP Memberships</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'profile'
                  ? 'bg-indigo-600/90 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Profile & Stats</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'dashboard'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-sky-400" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('faq')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'faq'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Help & FAQ</span>
            </button>
          </nav>
        </div>

        {/* Right: Credits, Daily Bonus, Sign In & User Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Daily Bonus Button */}
          {canClaimDaily && (
            <button
              onClick={onClaimDailyBonus}
              className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-extrabold px-3 py-1.5 rounded-xl transition shadow-md shadow-amber-500/20 animate-pulse"
              title="Claim +500 daily bonus credits"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>+500 Bonus</span>
            </button>
          )}

          {/* Credits Counter Pill */}
          <div 
            onClick={onOpenStore}
            className="flex items-center gap-2 bg-[#16192d] hover:bg-[#1d223c] border border-slate-800 hover:border-slate-700 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl cursor-pointer transition shadow-inner"
            title="Your current YTMonster Credits Balance. Click to add more."
          >
            <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black text-xs">
              ⚡
            </div>
            <div className="text-left">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider hidden sm:block">Credits</span>
              <span className="text-sm font-black text-amber-300 font-mono tracking-tight">
                {user.credits.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Sign Up / Log In Fast Action Button */}
          <button
            onClick={() => onOpenAuthModal('signup')}
            className="hidden md:flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black px-3 py-2 rounded-xl transition shadow-md shadow-emerald-600/20"
            title="Create account or login (+1,000 Free Credits)"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Sign Up / Login</span>
          </button>

          {/* User Account Dropdown / Profile Switcher */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 bg-[#16192d] hover:bg-[#1e223d] border border-slate-800 p-1.5 sm:px-2.5 sm:py-1.5 rounded-2xl transition cursor-pointer"
            >
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs uppercase shadow">
                {user.username ? user.username.charAt(0) : 'U'}
              </div>
              <div className="hidden md:block text-left">
                <span className="text-xs font-bold text-white block leading-tight truncate max-w-[100px]">
                  {user.username}
                </span>
                <div className="mt-0.5">{getTierBadge(user.membershipTier)}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#0f1225] border border-slate-800 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1 text-xs">
                <div className="px-3 py-2 border-b border-slate-800/80">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Signed in as</span>
                  <p className="font-bold text-white truncate text-sm mt-0.5">{user.username}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email || 'Free Member Account'}</p>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setUserDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2.5 transition font-bold"
                >
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>My Profile & Stats Page</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('dashboard');
                    setUserDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2.5 transition font-bold"
                >
                  <LayoutDashboard className="w-4 h-4 text-sky-400" />
                  <span>Creator Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    onOpenAuthModal('signup');
                    setUserDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2.5 transition font-bold"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Create New Account (+1k)</span>
                </button>

                <button
                  onClick={() => {
                    onOpenAuthModal('login');
                    setUserDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2.5 transition font-bold"
                >
                  <RefreshCw className="w-4 h-4 text-indigo-400" />
                  <span>Switch Account / Sign In</span>
                </button>

                <div className="border-t border-slate-800/80 pt-1">
                  <button
                    onClick={() => {
                      if (onLogout) onLogout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 flex items-center gap-2.5 transition font-bold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex lg:hidden items-center justify-around gap-1 pt-2 mt-2 border-t border-slate-800/80 text-[11px] font-bold text-slate-400 overflow-x-auto">
        <button
          onClick={() => setActiveTab('home')}
          className={`py-1 px-2.5 rounded-lg whitespace-nowrap ${activeTab === 'home' ? 'text-white bg-slate-800' : ''}`}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab('exchange')}
          className={`py-1 px-2.5 rounded-lg whitespace-nowrap flex items-center gap-1 ${activeTab === 'exchange' ? 'text-emerald-400 bg-slate-800' : ''}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Exchanger
        </button>
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`py-1 px-2.5 rounded-lg whitespace-nowrap ${activeTab === 'campaigns' ? 'text-white bg-slate-800' : ''}`}
        >
          Campaigns
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`py-1 px-2.5 rounded-lg whitespace-nowrap ${activeTab === 'profile' ? 'text-emerald-400 bg-slate-800' : ''}`}
        >
          Profile & Stats
        </button>
        <button
          onClick={() => setActiveTab('store')}
          className={`py-1 px-2.5 rounded-lg whitespace-nowrap ${activeTab === 'store' ? 'text-amber-400 bg-slate-800' : ''}`}
        >
          Store
        </button>
        <button
          onClick={() => setActiveTab('pricing')}
          className={`py-1 px-2.5 rounded-lg whitespace-nowrap ${activeTab === 'pricing' ? 'text-purple-400 bg-slate-800' : ''}`}
        >
          VIP
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`py-1 px-2.5 rounded-lg whitespace-nowrap ${activeTab === 'dashboard' ? 'text-sky-400 bg-slate-800' : ''}`}
        >
          Dashboard
        </button>
      </div>
    </header>
  );
};

