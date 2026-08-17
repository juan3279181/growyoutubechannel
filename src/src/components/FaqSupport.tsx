import React, { useState } from 'react';
import { PAYMENT_CONFIG } from '../data/ytmonsterData';
import { 
  HelpCircle, ChevronDown, ChevronUp, ShieldCheck, 
  CreditCard, MessageSquare, Send, CheckCircle2, 
  ExternalLink, Sparkles
} from 'lucide-react';

export const FaqSupport: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMsg, setTicketMsg] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const faqs = [
    {
      q: 'How does payment and digital fulfillment work on YTMonster?',
      a: `We provide instant digital fulfillment for all packages. We accept direct payments via PayPal (sent directly to ${PAYMENT_CONFIG.paypalEmail}) and Bitcoin (sent directly to ${PAYMENT_CONFIG.btcAddress}). Because this is a 100% digital goods service, NO physical shipping or delivery address is required. Upon payment confirmation, your credits or VIP membership are credited immediately to your account balance so you get what you purchased without delay.`
    },
    {
      q: 'Is YTMonster safe for YouTube Monetization and AdSense?',
      a: 'Yes, 100%. YTMonster uses a pure peer-to-peer exchange network where real human creators watch each other’s videos. We do not use automated bot proxies or click farms. All views include natural retention, user engagement, and geographic distribution compliant with YouTube terms of service.'
    },
    {
      q: 'How do I earn free credits with the Client Exchanger?',
      a: 'Simply click the "Client Exchanger" tab and press "Start Auto-Exchanger". Leave the browser tab open in the background. As the client plays videos from other community members, you earn credits automatically every 30-60 seconds. You can also like videos or subscribe to channels for instant coin bursts.'
    },
    {
      q: 'How do I reach the 4,000 Watch Hours monetization threshold?',
      a: 'You can create a High-Retention Campaign with longer duration (e.g. 180-300 seconds) or purchase our dedicated 1,000 - 4,000 Watch Hours Express package in the Store. This delivers long-duration views on your 15+ minute videos.'
    },
    {
      q: 'How fast are YouTube campaigns delivered?',
      a: 'You can customize your exact hourly delivery speed (from 50 views/hr for natural slow drip, up to 1,500/hr for viral pushes). Campaigns start within minutes of submission.'
    },
    {
      q: 'How does the Referral Partner program work?',
      a: 'You receive a unique referral link in your Dashboard. Whenever someone signs up through your link, you earn a 15% lifetime commission on all credit and VIP package purchases they make.'
    }
  ];

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMsg) return;
    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketSubject('');
      setTicketMsg('');
    }, 1000);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-300 max-w-4xl mx-auto pb-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-indigo-950/60 border border-indigo-500/30 px-3.5 py-1.5 rounded-full text-xs font-black text-indigo-300">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Creator Knowledgebase & Support</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Everything you need to know about credit exchange, campaigns, and instant payment delivery.
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openFaq === idx;
          return (
            <div
              key={idx}
              className={`bg-[#121528] border rounded-2xl overflow-hidden transition ${
                isOpen ? 'border-indigo-500/60 shadow-lg shadow-indigo-600/10' : 'border-slate-800'
              }`}
            >
              <button
                onClick={() => setOpenFaq(isOpen ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-4"
              >
                <span className="text-sm font-bold text-white">{faq.q}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-indigo-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Direct Contact & Support Ticket Form */}
      <div className="bg-[#121528] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Submit a Support Ticket</h3>
            <p className="text-xs text-slate-400">Need help with your campaign or payment? Our team replies in under 2 hours.</p>
          </div>
        </div>

        {ticketSubmitted ? (
          <div className="bg-emerald-950/40 border border-emerald-800 p-6 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-white">Ticket Submitted Successfully!</h4>
            <p className="text-xs text-slate-300">
              Ticket reference: <strong className="text-emerald-400 font-mono">#TKT-{Math.floor(10000 + Math.random() * 90000)}</strong>. A response will be dispatched to your account email.
            </p>
            <button
              onClick={() => setTicketSubmitted(false)}
              className="mt-2 text-xs text-indigo-400 hover:underline font-bold"
            >
              Submit another question
            </button>
          </div>
        ) : (
          <form onSubmit={handleTicketSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Subject / Department:</label>
              <input
                type="text"
                required
                placeholder="e.g. Campaign pacing, PayPal digital order credit, or BTC confirmation"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                className="w-full bg-[#0d0f1e] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Detailed Message:</label>
              <textarea
                rows={4}
                required
                placeholder="Please describe your question or issue in detail..."
                value={ticketMsg}
                onChange={(e) => setTicketMsg(e.target.value)}
                className="w-full bg-[#0d0f1e] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Priority Ticket</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
