import React, { useState } from 'react';
import { CREDIT_PACKAGES, MEMBERSHIP_PLANS, EXPRESS_SERVICES, PAYMENT_CONFIG } from '../data/ytmonsterData';
import { CreditPackage, MembershipPlan, ExpressService, UserAccount } from '../types';
import { 
  Zap, Crown, ShoppingBag, ShieldCheck, Check, 
  Sparkles, Flame, Clock, Star, ArrowRight, Lock, 
  CreditCard, Award, ChevronRight
} from 'lucide-react';

interface StorePricingProps {
  user: UserAccount;
  onSelectItemForCheckout: (item: {
    id: string;
    type: 'credits' | 'membership' | 'express';
    title: string;
    description: string;
    priceUsd: number;
    creditsAmount?: number;
    membershipTier?: 'lite' | 'premium' | 'pro';
  }) => void;
  defaultTab?: 'credits' | 'memberships' | 'express';
}

export const StorePricing: React.FC<StorePricingProps> = ({
  user,
  onSelectItemForCheckout,
  defaultTab = 'credits'
}) => {
  const [storeTab, setStoreTab] = useState<'credits' | 'memberships' | 'express'>(defaultTab);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-indigo-950/60 border border-indigo-500/30 px-3.5 py-1.5 rounded-full text-xs font-black text-indigo-300 shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Official YTMonster Direct Fulfillment Store</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-display">
          Buy Credits & VIP Memberships
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Select any package below for instant automated credit delivery. We accept direct <strong className="text-blue-400">PayPal</strong> (<span className="text-slate-300">No shipping required &bull; Digital Goods</span>) and <strong className="text-amber-400">Bitcoin (BTC)</strong>.
        </p>

        {/* Security & Direct Payment Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <div className="flex items-center gap-1.5 bg-[#121528] border border-blue-900/40 px-3 py-1.5 rounded-xl text-xs text-blue-300 font-semibold">
            <CreditCard className="w-3.5 h-3.5" />
            <span>PayPal: <strong>{PAYMENT_CONFIG.paypalEmail}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#121528] border border-amber-900/40 px-3 py-1.5 rounded-xl text-xs text-amber-300 font-semibold">
            <span>₿</span>
            <span>Bitcoin: <strong>{PAYMENT_CONFIG.btcAddress.slice(0, 10)}...{PAYMENT_CONFIG.btcAddress.slice(-6)}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#121528] border border-emerald-900/40 px-3 py-1.5 rounded-xl text-xs text-emerald-300 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Instant Digital Delivery to Balance</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex bg-[#121426] p-1.5 rounded-2xl border border-slate-800 shadow-xl">
          <button
            onClick={() => setStoreTab('credits')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition ${
              storeTab === 'credits'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Credit Packages</span>
          </button>

          <button
            onClick={() => setStoreTab('memberships')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition ${
              storeTab === 'memberships'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Crown className="w-4 h-4" />
            <span>VIP Memberships</span>
          </button>

          <button
            onClick={() => setStoreTab('express')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition ${
              storeTab === 'express'
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Express Delivery</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CREDIT PACKAGES */}
      {storeTab === 'credits' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CREDIT_PACKAGES.map((pkg) => {
            const totalCredits = pkg.credits + pkg.bonusCredits;
            return (
              <div
                key={pkg.id}
                className={`relative bg-[#13162a] border rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                  pkg.popular
                    ? 'border-amber-500/60 ring-2 ring-amber-500/30 shadow-amber-500/10'
                    : pkg.bestValue
                    ? 'border-indigo-500/60 ring-2 ring-indigo-500/30 shadow-indigo-500/10'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Badges */}
                {pkg.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-black text-[10px] uppercase px-3 py-0.5 rounded-full shadow-md">
                    Most Popular
                  </span>
                )}
                {pkg.bestValue && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white font-black text-[10px] uppercase px-3 py-0.5 rounded-full shadow-md">
                    Best Value
                  </span>
                )}

                <div className="space-y-4">
                  <div className="text-center pt-2">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto mb-2">
                      <Zap className="w-6 h-6 fill-amber-400" />
                    </div>
                    <h3 className="text-xl font-black text-white font-mono">{pkg.credits.toLocaleString()}</h3>
                    <span className="text-[11px] text-emerald-400 font-bold block">+{pkg.bonusCredits.toLocaleString()} Bonus Credits</span>
                  </div>

                  <div className="bg-[#0f1122] p-3 rounded-2xl border border-slate-800 text-center">
                    <span className="text-2xl font-black text-white font-display">${pkg.priceUsd.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">One-time payment</span>
                  </div>

                  <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                    {pkg.tagline}
                  </p>

                  <ul className="space-y-1.5 text-[11px] text-slate-300 pt-2 border-t border-slate-800/80">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{totalCredits.toLocaleString()} Total Credits</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Instant Balance Top-Up</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Zero Expiration</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onSelectItemForCheckout({
                      id: pkg.id,
                      type: 'credits',
                      title: `${pkg.credits.toLocaleString()} YTMonster Credits`,
                      description: `Includes +${pkg.bonusCredits.toLocaleString()} bonus coins (Total: ${totalCredits.toLocaleString()} credits)`,
                      priceUsd: pkg.priceUsd,
                      creditsAmount: totalCredits
                    })
                  }
                  className={`w-full py-2.5 rounded-xl font-black text-xs transition mt-5 shadow-lg flex items-center justify-center gap-1.5 ${
                    pkg.popular
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                  }`}
                >
                  <span>Buy with PayPal / BTC</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: MEMBERSHIP PLANS */}
      {storeTab === 'memberships' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MEMBERSHIP_PLANS.map((plan) => {
            const isCurrent = user.membershipTier === plan.id;
            return (
              <div
                key={plan.id}
                className={`relative bg-[#13162a] border rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl ${
                  plan.popular
                    ? 'border-purple-500 ring-2 ring-purple-500/40 shadow-purple-500/10'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white font-black text-[10px] uppercase px-3 py-0.5 rounded-full shadow-md">
                    Recommended VIP
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-black text-white">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-3xl font-black text-white">${plan.priceUsdMonthly}</span>
                      <span className="text-xs text-slate-400">/ month</span>
                    </div>
                  </div>

                  <div className="bg-[#0f1122] p-3.5 rounded-2xl border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Earning Multiplier:</span>
                      <span className="text-emerald-400 font-bold font-mono">{plan.earningMultiplier}x Boost</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Daily Free Credits:</span>
                      <span className="text-amber-300 font-bold font-mono">+{plan.dailyCredits.toLocaleString()} / day</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Campaign Slots:</span>
                      <span className="text-white font-bold font-mono">{plan.activeCampaignSlots} Active</span>
                    </div>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  {plan.priceUsdMonthly === 0 ? (
                    <button
                      disabled
                      className="w-full py-2.5 bg-slate-800 text-slate-400 font-bold text-xs rounded-xl cursor-default"
                    >
                      {isCurrent ? 'Current Plan (Active)' : 'Default Plan'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        onSelectItemForCheckout({
                          id: `plan-${plan.id}`,
                          type: 'membership',
                          title: `${plan.name} Monthly Subscription`,
                          description: `${plan.earningMultiplier}x earning boost + ${plan.dailyCredits} daily bonus credits`,
                          priceUsd: plan.priceUsdMonthly,
                          membershipTier: plan.id as 'lite' | 'premium' | 'pro'
                        })
                      }
                      className={`w-full py-2.5 rounded-xl font-black text-xs transition shadow-lg flex items-center justify-center gap-1.5 ${
                        plan.popular
                          ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                      }`}
                    >
                      <Crown className="w-3.5 h-3.5" />
                      <span>{isCurrent ? 'Extend VIP Plan' : 'Upgrade to ' + plan.name}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: EXPRESS SERVICES */}
      {storeTab === 'express' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXPRESS_SERVICES.map((srv) => (
            <div
              key={srv.id}
              className="bg-[#13162a] border border-slate-800 hover:border-slate-700 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                      Express Direct Order
                    </span>
                    <h3 className="text-lg font-black text-white mt-1">{srv.title}</h3>
                  </div>
                  <span className="text-2xl font-black text-emerald-400 font-display">${srv.priceUsd.toFixed(2)}</span>
                </div>

                <div className="bg-[#0f1122] p-3 rounded-2xl border border-slate-800 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Delivery Speed:</span>
                    <span className="text-indigo-300 font-bold">{srv.deliveryTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Retention Quality:</span>
                    <span className="text-white font-bold">{srv.retention}</span>
                  </div>
                </div>

                <ul className="space-y-1.5 text-xs text-slate-300">
                  {srv.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() =>
                  onSelectItemForCheckout({
                    id: srv.id,
                    type: 'express',
                    title: srv.title,
                    description: `${srv.amount.toLocaleString()} delivery in ${srv.deliveryTime} (${srv.retention})`,
                    priceUsd: srv.priceUsd
                  })
                }
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl transition mt-5 shadow-lg shadow-rose-600/30 flex items-center justify-center gap-1.5"
              >
                <span>Instant Order with PayPal / BTC</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
