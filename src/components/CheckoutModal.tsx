import React, { useState } from 'react';
import { PAYMENT_CONFIG } from '../data/ytmonsterData';
import { PaymentOrder } from '../types';
import { 
  X, Check, Copy, ExternalLink, ShieldCheck, Zap, 
  CreditCard, Sparkles, CheckCircle2, ArrowRight, Lock, 
  AlertCircle, RefreshCw, QrCode
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: string;
    type: 'credits' | 'membership' | 'express';
    title: string;
    description: string;
    priceUsd: number;
    creditsAmount?: number;
    membershipTier?: 'lite' | 'premium' | 'pro';
  } | null;
  onPaymentSuccess: (order: PaymentOrder) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  item,
  onPaymentSuccess
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'btc'>('paypal');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedBtcAddress, setCopiedBtcAddress] = useState(false);
  const [copiedBtcAmount, setCopiedBtcAmount] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'select' | 'confirming' | 'completed'>('select');
  const [customerEmail, setCustomerEmail] = useState('juan819171@gmail.com');
  const [txHashInput, setTxHashInput] = useState('');

  if (!isOpen || !item) return null;

  // Calculate BTC equivalent
  const btcAmount = Number((item.priceUsd / PAYMENT_CONFIG.btcRateUsd).toFixed(8));

  // Direct PayPal link for digital goods with no shipping required (no_shipping=1)
  const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(PAYMENT_CONFIG.paypalEmail)}&item_name=${encodeURIComponent(`YTMonster: ${item.title}`)}&amount=${item.priceUsd.toFixed(2)}&currency_code=USD&no_shipping=1&no_note=1`;

  const handleCopy = (text: string, type: 'email' | 'btc_address' | 'btc_amount') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else if (type === 'btc_address') {
      setCopiedBtcAddress(true);
      setTimeout(() => setCopiedBtcAddress(false), 2000);
    } else if (type === 'btc_amount') {
      setCopiedBtcAmount(true);
      setTimeout(() => setCopiedBtcAmount(false), 2000);
    }
  };

  const handleCompleteOrder = () => {
    setIsProcessing(true);
    setStep('confirming');

    // Simulate instant digital verification and fulfillment
    setTimeout(() => {
      setIsProcessing(false);
      setStep('completed');

      const completedOrder: PaymentOrder = {
        id: `ord-${Date.now().toString().slice(-6)}`,
        itemId: item.id,
        itemType: item.type,
        itemName: item.title,
        itemDetails: item.description,
        amountUsd: item.priceUsd,
        amountBtc: btcAmount,
        paymentMethod: paymentMethod,
        status: 'completed',
        timestamp: new Date().toISOString(),
        recipientPayPal: PAYMENT_CONFIG.paypalEmail,
        recipientBtc: PAYMENT_CONFIG.btcAddress,
        txHash: txHashInput || `tx_${Math.random().toString(36).substring(2, 12)}`
      };

      onPaymentSuccess(completedOrder);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111322] border border-slate-800 rounded-3xl max-w-xl w-full text-slate-100 shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#16192d]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base tracking-tight">Instant Digital Checkout</h3>
              <p className="text-xs text-slate-400">100% Digital Delivery &bull; Zero Shipping &bull; Direct Balance Top-Up</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          {step === 'select' && (
            <>
              {/* Item Summary Card */}
              <div className="bg-[#181b30] border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">Selected Package</span>
                  <h4 className="text-lg font-black text-white mt-0.5">{item.title}</h4>
                  <p className="text-xs text-slate-400">{item.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-400">${item.priceUsd.toFixed(2)}</span>
                  <span className="block text-[11px] text-slate-400 font-mono">≈ {btcAmount} BTC</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* PayPal Option */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 ${
                      paymentMethod === 'paypal'
                        ? 'bg-blue-950/40 border-blue-500 ring-1 ring-blue-500/50 shadow-md shadow-blue-500/10'
                        : 'bg-[#16192d] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                      PP
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white">PayPal</span>
                        <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded font-semibold">
                          Direct
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block">No shipping fee / Instant</span>
                    </div>
                  </button>

                  {/* Bitcoin Option */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('btc')}
                    className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 ${
                      paymentMethod === 'btc'
                        ? 'bg-amber-950/30 border-amber-500 ring-1 ring-amber-500/50 shadow-md shadow-amber-500/10'
                        : 'bg-[#16192d] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                      ₿
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white">Bitcoin (BTC)</span>
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-semibold">
                          Crypto
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block">Zero-fee / Anonymous</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* PAYPAL SECTION DETAILS */}
              {paymentMethod === 'paypal' && (
                <div className="bg-[#151930] border border-blue-900/40 rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4" />
                      <span>PayPal Digital Goods Payment (No Shipping Required)</span>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                      Direct to Balance
                    </span>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 font-medium block mb-1">
                      Recipient PayPal Account (Payment Sent Directly):
                    </label>
                    <div className="flex items-center gap-2 bg-[#0d0f1e] p-2.5 rounded-xl border border-slate-800">
                      <code className="text-xs font-bold text-indigo-300 flex-1 truncate font-mono">
                        {PAYMENT_CONFIG.paypalEmail}
                      </code>
                      <button
                        type="button"
                        onClick={() => handleCopy(PAYMENT_CONFIG.paypalEmail, 'email')}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                      >
                        {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedEmail ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-blue-950/30 border border-blue-800/30 rounded-xl p-3 text-xs text-slate-300 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-blue-300">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Digital Service Policy:</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      This purchase is a <strong>digital goods / virtual credit service</strong>. No physical delivery address or shipping is requested or required. The payment is transferred directly to <strong>{PAYMENT_CONFIG.paypalEmail}</strong> and your credits are delivered immediately into your account.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 pt-1">
                    <a
                      href={paypalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold py-3 px-4 rounded-xl text-sm transition shadow-lg shadow-blue-900/30"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Pay ${item.priceUsd.toFixed(2)} via PayPal (Direct)</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                    </a>

                    <button
                      type="button"
                      onClick={handleCompleteOrder}
                      className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-sm transition shadow-lg shadow-emerald-900/30"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>I Have Sent Payment &bull; Claim Instant Credits</span>
                    </button>
                  </div>
                </div>
              )}

              {/* BITCOIN (BTC) SECTION DETAILS */}
              {paymentMethod === 'btc' && (
                <div className="bg-[#181a2e] border border-amber-900/40 rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                      <Zap className="w-4 h-4" />
                      <span>Bitcoin (BTC) Direct Crypto Invoice</span>
                    </div>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                      Native SegWit
                    </span>
                  </div>

                  {/* QR Code and Address Area */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#0d0f1e] p-3.5 rounded-2xl border border-slate-800">
                    <div className="bg-white p-2 rounded-xl shadow-md shrink-0">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=bitcoin:${PAYMENT_CONFIG.btcAddress}?amount=${btcAmount}`}
                        alt="BTC QR Code"
                        className="w-28 h-28"
                      />
                    </div>
                    <div className="space-y-2.5 w-full">
                      <div>
                        <span className="text-[11px] text-slate-400 block font-medium">Exact Amount to Send:</span>
                        <div className="flex items-center justify-between bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                          <span className="text-sm font-black text-amber-400 font-mono">{btcAmount} BTC</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(btcAmount.toString(), 'btc_amount')}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-semibold flex items-center gap-1"
                          >
                            {copiedBtcAmount ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedBtcAmount ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-400 block font-medium">Official BTC Receiving Address:</span>
                        <div className="flex items-center justify-between bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                          <span className="text-xs font-bold text-slate-200 font-mono truncate max-w-[180px] sm:max-w-[220px]">
                            {PAYMENT_CONFIG.btcAddress}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(PAYMENT_CONFIG.btcAddress, 'btc_address')}
                            className="px-2 py-1 bg-amber-600/30 hover:bg-amber-600 text-amber-300 hover:text-white rounded text-[11px] font-semibold flex items-center gap-1 transition"
                          >
                            {copiedBtcAddress ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedBtcAddress ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Optional TX Hash Input */}
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">
                      Bitcoin Transaction ID / Hash (Optional for quick credit verification):
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 7c91a0... or leave empty for automatic sync"
                      value={txHashInput}
                      onChange={(e) => setTxHashInput(e.target.value)}
                      className="w-full bg-[#0d0f1e] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleCompleteOrder}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-3 px-4 rounded-xl text-sm transition shadow-lg shadow-amber-900/30"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>I Have Sent {btcAmount} BTC &bull; Confirm & Deliver</span>
                  </button>
                </div>
              )}
            </>
          )}

          {/* Confirming Animation Step */}
          {step === 'confirming' && (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto animate-spin">
                <RefreshCw className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-black text-white">Verifying Direct Payment...</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Processing digital authorization via {paymentMethod === 'paypal' ? 'PayPal API' : 'Bitcoin Blockchain Network'} and allocating digital package directly to your YTMonster balance.
              </p>
            </div>
          )}

          {/* Completed Step */}
          {step === 'completed' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h4 className="text-2xl font-black text-white">Payment Confirmed & Delivered!</h4>
              <p className="text-sm text-emerald-400 font-semibold">
                Your purchase of <span className="text-white">{item.title}</span> has been processed.
              </p>
              <div className="bg-[#16192d] p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 text-left space-y-1.5 max-w-md mx-auto font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Order ID:</span>
                  <span className="text-white font-bold">#YTM-{Math.floor(100000 + Math.random() * 900000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Paid:</span>
                  <span className="text-emerald-400 font-bold">${item.priceUsd.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Channel:</span>
                  <span className="text-indigo-300 uppercase">{paymentMethod === 'paypal' ? `PayPal (${PAYMENT_CONFIG.paypalEmail})` : `BTC (${PAYMENT_CONFIG.btcAddress.slice(0, 10)}...)`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Delivery Status:</span>
                  <span className="text-emerald-400 font-bold">100% Instant Digital Fulfilled</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-2.5 rounded-xl text-sm transition mt-2 shadow-lg shadow-indigo-600/30"
              >
                Go to Dashboard & Campaigns
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
