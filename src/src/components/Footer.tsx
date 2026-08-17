import React from 'react';
import { PAYMENT_CONFIG } from '../data/ytmonsterData';
import { Play, ShieldCheck, Heart, ExternalLink, Zap, Lock } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: 'home' | 'exchange' | 'campaigns' | 'store' | 'pricing' | 'dashboard' | 'faq') => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-[#080912] border-t border-slate-800/80 text-slate-400 text-xs py-12 px-4 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Col 1: Brand */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-indigo-600 p-0.5">
              <div className="w-full h-full bg-[#080912] rounded-[10px] flex items-center justify-center">
                <Play className="w-4 h-4 text-rose-500 fill-rose-500 ml-0.5" />
              </div>
            </div>
            <span className="text-lg font-black text-white tracking-tight font-display">
              YT<span className="text-rose-500">Monster</span>
            </span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            The premier YouTube growth and audience exchange network. Empowering creators worldwide with organic views, likes, subscribers, and watch time.
          </p>
          <div className="pt-1 flex items-center gap-2 text-[10px] text-slate-500 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Monetization Safe Network</span>
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div className="space-y-2.5">
          <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Growth Tools</h4>
          <ul className="space-y-1.5 text-slate-400">
            <li>
              <button onClick={() => setActiveTab('exchange')} className="hover:text-indigo-400 transition">
                Client Exchanger (Earn Free)
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('campaigns')} className="hover:text-indigo-400 transition">
                Campaign Manager
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('store')} className="hover:text-indigo-400 transition">
                Credit Packages Store
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('pricing')} className="hover:text-indigo-400 transition">
                VIP Membership Plans
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Accepted Payment Channels */}
        <div className="space-y-2.5">
          <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Direct Payment Methods</h4>
          <div className="space-y-2 text-[11px]">
            <div className="bg-[#0e1020] p-2 rounded-xl border border-slate-800 space-y-0.5">
              <span className="text-blue-400 font-bold block">PayPal Direct (No Shipping)</span>
              <span className="text-slate-400 font-mono text-[10px]">{PAYMENT_CONFIG.paypalEmail}</span>
            </div>
            <div className="bg-[#0e1020] p-2 rounded-xl border border-slate-800 space-y-0.5">
              <span className="text-amber-400 font-bold block">Bitcoin (BTC) Address</span>
              <span className="text-slate-400 font-mono text-[10px] truncate block">{PAYMENT_CONFIG.btcAddress}</span>
            </div>
          </div>
        </div>

        {/* Col 4: Support & Security */}
        <div className="space-y-2.5">
          <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Creator Trust</h4>
          <ul className="space-y-1.5 text-slate-400">
            <li>
              <button onClick={() => setActiveTab('faq')} className="hover:text-indigo-400 transition">
                Knowledge Base & FAQ
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('dashboard')} className="hover:text-indigo-400 transition">
                Affiliate & Referrals (15%)
              </button>
            </li>
            <li className="text-[11px] text-slate-500 pt-1">
              Digital Goods: Instant fulfillment directly to user account balance upon payment confirmation.
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
        <p>&copy; {new Date().getFullYear()} YTMonster. All rights reserved. YouTube is a registered trademark of Google LLC.</p>
        <div className="flex items-center gap-4">
          <button onClick={() => setActiveTab('faq')} className="hover:text-slate-400">Terms of Service</button>
          <button onClick={() => setActiveTab('faq')} className="hover:text-slate-400">Privacy Policy</button>
          <button onClick={() => setActiveTab('faq')} className="hover:text-slate-400">Support Desk</button>
        </div>
      </div>
    </footer>
  );
};
