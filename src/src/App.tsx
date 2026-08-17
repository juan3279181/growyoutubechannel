import React, { useState, useEffect, useRef } from 'react';
import { UserAccount, Campaign, PaymentOrder } from './types';
import { INITIAL_CAMPAIGNS, PAYMENT_CONFIG } from './data/ytmonsterData';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { ExchangeClient } from './components/ExchangeClient';
import { CampaignManager } from './components/CampaignManager';
import { StorePricing } from './components/StorePricing';
import { DashboardOverview } from './components/DashboardOverview';
import { ProfileView } from './components/ProfileView';
import { AuthModal } from './components/AuthModal';
import { FaqSupport } from './components/FaqSupport';
import { CheckoutModal } from './components/CheckoutModal';
import { Footer } from './components/Footer';
import { 
  testConnection, 
  auth, 
  loginWithGoogle, 
  logoutUser 
} from './lib/firebase';
import { 
  subscribeToCommunityCampaigns, 
  createCampaignInFirestore, 
  updateCampaignDelivered, 
  toggleCampaignStatusInFirestore, 
  deleteCampaignInFirestore,
  syncUserProfileToFirestore,
  getUserProfileFromFirestore,
  subscribeToUserProfile,
  recordOrderInFirestore,
  sendPresenceHeartbeat,
  subscribeToOnlineCommunity
} from './lib/firestoreService';
import { onAuthStateChanged } from 'firebase/auth';
import { Sparkles, Check, CheckCircle2, Zap, Gift, X } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'exchange' | 'campaigns' | 'store' | 'pricing' | 'dashboard' | 'profile' | 'faq'>('home');

  // User Profile State
  const [user, setUser] = useState<UserAccount>(() => {
    const saved = localStorage.getItem('ytmonster_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      uid: 'user-juan819',
      username: 'Juan_Creator',
      email: 'juan819171@gmail.com',
      credits: 14500,
      membershipTier: 'pro',
      dailyStreak: 6,
      lastDailyClaim: null,
      totalEarned: 48900,
      totalSpent: 34400,
      viewsGiven: 482,
      likesGiven: 129,
      subsGiven: 54,
      referralCode: 'juan819',
      referralsCount: 14,
      referralEarnings: 8200,
      joinedDate: '2026-08-01',
      verifications: []
    };
  });

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('signup');

  // Real-time Community State
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [onlineCount, setOnlineCount] = useState(1);
  const [activeExchangers, setActiveExchangers] = useState(0);
  const [isExchanging, setIsExchanging] = useState(false);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(true);

  // Completed Orders History
  const [orders, setOrders] = useState<PaymentOrder[]>([
    {
      id: 'ord-948102',
      itemId: 'growth-50k',
      itemType: 'credits',
      itemName: '50,000 YTMonster Credits (+7,500 Bonus)',
      itemDetails: 'Digital Goods &bull; Instant Balance Top-Up',
      amountUsd: 40.00,
      amountBtc: 0.00042194,
      paymentMethod: 'paypal',
      status: 'completed',
      timestamp: '2026-08-14T18:30:00Z',
      recipientPayPal: PAYMENT_CONFIG.paypalEmail,
      recipientBtc: PAYMENT_CONFIG.btcAddress
    }
  ]);

  // Checkout Modal State
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState<{
    id: string;
    type: 'credits' | 'membership' | 'express';
    title: string;
    description: string;
    priceUsd: number;
    creditsAmount?: number;
    membershipTier?: 'lite' | 'premium' | 'pro';
  } | null>(null);

  // Notification Banner
  const [notification, setNotification] = useState<{ title: string; message: string } | null>(null);

  const showNotification = (title: string, message: string) => {
    setNotification({ title, message });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Local storage persistence
  useEffect(() => {
    localStorage.setItem('ytmonster_user_profile', JSON.stringify(user));
  }, [user]);

  // Initial Firebase Test & Real-time Subscriptions
  useEffect(() => {
    testConnection();

    // 1. Subscribe to Live Community Campaigns
    const unsubCampaigns = subscribeToCommunityCampaigns((liveCamps) => {
      if (liveCamps && liveCamps.length > 0) {
        setCampaigns((prev) => {
          const liveIds = new Set(liveCamps.map((c) => c.id));
          const localOnly = prev.filter((p) => !liveIds.has(p.id));
          return [...liveCamps, ...localOnly];
        });
      }
    });

    // 2. Subscribe to Real-Time Online Presence
    const unsubPresence = subscribeToOnlineCommunity((count, exchangers) => {
      setOnlineCount(count);
      setActiveExchangers(exchangers);
    });

    // 3. Heartbeat presence
    const sendHeartbeat = () => {
      sendPresenceHeartbeat(user.username, user.username, isExchanging);
    };
    sendHeartbeat();
    const heartbeatTimer = setInterval(sendHeartbeat, 25000);

    // 4. Firebase Auth listener
    const unsubAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const cloudProf = await getUserProfileFromFirestore(fbUser.uid);
        if (cloudProf) {
          setUser(cloudProf);
        } else {
          setUser((prev) => ({
            ...prev,
            uid: fbUser.uid,
            username: fbUser.displayName || prev.username,
            email: fbUser.email || prev.email
          }));
        }
      }
    });

    return () => {
      unsubCampaigns();
      unsubPresence();
      clearInterval(heartbeatTimer);
      unsubAuth();
    };
  }, [user.username, isExchanging]);

  // Open Auth Modal
  const handleOpenAuthModal = (mode: 'login' | 'signup') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  // Auth Success Handler
  const handleAuthSuccess = (account: UserAccount, isNewUser: boolean) => {
    setUser(account);
    if (isNewUser) {
      showNotification('Account Created Successfully! 🎁', `Welcome ${account.username}! +1,000 Free Credits have been added to your profile!`);
    } else {
      showNotification('Welcome Back!', `Signed in as ${account.username}. Your stats and campaigns are ready!`);
    }
    setActiveTab('profile');
  };

  // Profile Update Handler
  const handleUpdateProfile = (updatedFields: Partial<UserAccount>) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      syncUserProfileToFirestore(updated);
      return updated;
    });
    showNotification('Profile Updated', 'Your creator details were updated and synced with cloud database.');
  };

  // Sign out handler
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {}
    showNotification('Signed Out', 'You have been signed out. You can sign in anytime to access your stats.');
  };

  // Earning Credits Handler
  const handleEarnCredits = (amount: number, type: 'view' | 'like' | 'sub') => {
    setUser((prev) => {
      const updated = {
        ...prev,
        credits: prev.credits + amount,
        totalEarned: prev.totalEarned + amount,
        viewsGiven: type === 'view' ? prev.viewsGiven + 1 : prev.viewsGiven,
        likesGiven: type === 'like' ? prev.likesGiven + 1 : prev.likesGiven,
        subsGiven: type === 'sub' ? prev.subsGiven + 1 : prev.subsGiven
      };
      syncUserProfileToFirestore(updated);
      return updated;
    });
  };

  // Helper to check if user can claim daily bonus
  const canClaimDailyBonus = () => {
    const today = new Date().toDateString();
    const lastClaim = user.lastDailyClaim ? new Date(user.lastDailyClaim).toDateString() : null;
    return lastClaim !== today;
  };

  // Daily Bonus Handler - Limited to 1 claim per day
  const handleClaimDailyBonus = () => {
    // Check if user has already claimed today
    const today = new Date().toDateString();
    const lastClaim = user.lastDailyClaim ? new Date(user.lastDailyClaim).toDateString() : null;
    
    if (lastClaim === today) {
      showNotification('Already Claimed Today', 'You can only claim your daily bonus once per day. Come back tomorrow!');
      return;
    }

    const bonus = 500;
    setUser((prev) => {
      const updated = {
        ...prev,
        credits: prev.credits + bonus,
        totalEarned: prev.totalEarned + bonus,
        dailyStreak: prev.dailyStreak + 1,
        lastDailyClaim: new Date().toISOString()
      };
      syncUserProfileToFirestore(updated);
      return updated;
    });
    showNotification('Daily Bonus Claimed!', `+500 Credits added to your balance. Current streak: ${user.dailyStreak + 1} Days!`);
  };

  // Create Campaign Handler (Saves to cloud for all community users)
  const handleCreateCampaign = (newCampData: Omit<Campaign, 'id' | 'deliveredAmount' | 'status' | 'createdAt'>) => {
    if (user.credits < newCampData.costCredits) {
      return false;
    }

    const newCamp: Campaign = {
      ...newCampData,
      id: `camp-${Date.now().toString().slice(-4)}`,
      userId: user.uid || user.username,
      deliveredAmount: 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUser((prev) => {
      const updated = {
        ...prev,
        credits: prev.credits - newCampData.costCredits,
        totalSpent: prev.totalSpent + newCampData.costCredits
      };
      syncUserProfileToFirestore(updated);
      return updated;
    });

    setCampaigns((prev) => [newCamp, ...prev]);
    // Save to Firestore shared pool
    createCampaignInFirestore(newCamp).catch(() => {});

    showNotification('Campaign Launched in Cloud Pool!', `Your ${newCampData.serviceType} campaign is now live for all creators.`);
    return true;
  };

  // Toggle Campaign Pause/Resume
  const handleToggleCampaign = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus = c.status === 'active' ? 'paused' : 'active';
          toggleCampaignStatusInFirestore(id, nextStatus).catch(() => {});
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  // Delete Campaign
  const handleDeleteCampaign = (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    deleteCampaignInFirestore(id).catch(() => {});
    showNotification('Campaign Removed', 'The campaign was deleted from the community manager.');
  };

  // When a video is watched in exchanger
  const handleCampaignWatched = (campaignId: string, deliveredAmount: number, targetAmount: number) => {
    updateCampaignDelivered(campaignId, deliveredAmount, targetAmount).catch(() => {});
  };

  // Open Checkout
  const handleSelectItemForCheckout = (item: {
    id: string;
    type: 'credits' | 'membership' | 'express';
    title: string;
    description: string;
    priceUsd: number;
    creditsAmount?: number;
    membershipTier?: 'lite' | 'premium' | 'pro';
  }) => {
    setCheckoutItem(item);
    setCheckoutModalOpen(true);
  };

  // Payment Success Handler (Fulfills immediately directly into balance & logs to Firestore)
  const handlePaymentSuccess = (order: PaymentOrder) => {
    const enrichedOrder: PaymentOrder = {
      ...order,
      userId: user.uid || user.username
    };
    setOrders((prev) => [enrichedOrder, ...prev]);
    recordOrderInFirestore(enrichedOrder).catch(() => {});

    if (checkoutItem?.creditsAmount) {
      setUser((prev) => {
        const updated = {
          ...prev,
          credits: prev.credits + checkoutItem.creditsAmount!,
          totalEarned: prev.totalEarned + checkoutItem.creditsAmount!
        };
        syncUserProfileToFirestore(updated);
        return updated;
      });
      showNotification('Instant Credits Delivered!', `+${checkoutItem.creditsAmount.toLocaleString()} Credits added directly to your account balance.`);
    } else if (checkoutItem?.membershipTier) {
      setUser((prev) => {
        const updated = {
          ...prev,
          membershipTier: checkoutItem.membershipTier!
        };
        syncUserProfileToFirestore(updated);
        return updated;
      });
      showNotification('VIP Membership Upgraded!', `Your account is now upgraded to ${checkoutItem.membershipTier.toUpperCase()} VIP.`);
    } else if (checkoutItem?.type === 'express') {
      const expressCamp: Campaign = {
        id: `exp-${Date.now().toString().slice(-4)}`,
        userId: user.uid || user.username,
        videoUrl: 'https://www.youtube.com/watch?v=expressOrder',
        videoTitle: checkoutItem.title,
        channelName: user.username,
        thumbnailUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80',
        serviceType: 'views',
        targetAmount: 2500,
        deliveredAmount: 120,
        durationSec: 120,
        speedPerHour: 200,
        countryTarget: 'Worldwide Express',
        costCredits: 0,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setCampaigns((prev) => [expressCamp, ...prev]);
      createCampaignInFirestore(expressCamp).catch(() => {});
      showNotification('Express Campaign Queued!', `${checkoutItem.title} is now undergoing automated high-speed delivery.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0d17] text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#161a33] border border-emerald-500/50 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h5 className="text-xs font-black text-white">{notification.title}</h5>
            <p className="text-[11px] text-slate-300">{notification.message}</p>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-white p-1 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Header / Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onlineCount={onlineCount}
        isFirebaseConnected={isFirebaseConnected}
        onOpenStore={() => setActiveTab('store')}
        onClaimDailyBonus={handleClaimDailyBonus}
        onOpenAuthModal={handleOpenAuthModal}
        onLogout={handleLogout}
        canClaimDaily={canClaimDailyBonus()}
      />

      {/* Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {activeTab === 'home' && (
          <LandingHero
            campaigns={campaigns}
            onStartExchange={() => setActiveTab('exchange')}
            onOpenStore={() => setActiveTab('store')}
            onOpenCampaigns={() => setActiveTab('campaigns')}
            onOpenAuthModal={handleOpenAuthModal}
            onOpenProfile={() => setActiveTab('profile')}
          />
        )}

        {activeTab === 'exchange' && (
          <ExchangeClient
            user={user}
            communityCampaigns={campaigns}
            onEarnCredits={handleEarnCredits}
            onCampaignWatched={handleCampaignWatched}
            onExchangingStateChange={setIsExchanging}
            onOpenStore={() => setActiveTab('store')}
          />
        )}

        {activeTab === 'campaigns' && (
          <CampaignManager
            user={user}
            campaigns={campaigns}
            onCreateCampaign={handleCreateCampaign}
            onToggleCampaign={handleToggleCampaign}
            onDeleteCampaign={handleDeleteCampaign}
            onOpenStore={() => setActiveTab('store')}
          />
        )}

        {activeTab === 'store' && (
          <StorePricing
            user={user}
            onSelectItemForCheckout={handleSelectItemForCheckout}
            defaultTab="credits"
          />
        )}

        {activeTab === 'pricing' && (
          <StorePricing
            user={user}
            onSelectItemForCheckout={handleSelectItemForCheckout}
            defaultTab="memberships"
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            user={user}
            campaigns={campaigns}
            orders={orders}
            onOpenStore={() => setActiveTab('store')}
            onOpenCampaigns={() => setActiveTab('campaigns')}
            onOpenExchange={() => setActiveTab('exchange')}
            onClaimDailyBonus={handleClaimDailyBonus}
            canClaimDaily={canClaimDailyBonus()}
            onOpenAuthModal={handleOpenAuthModal}
            onLogout={handleLogout}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardOverview
            user={user}
            orders={orders}
            onClaimDailyBonus={handleClaimDailyBonus}
            canClaimDaily={canClaimDailyBonus()}
            onOpenStore={() => setActiveTab('store')}
            onGoToExchange={() => setActiveTab('exchange')}
            onGoToCampaigns={() => setActiveTab('campaigns')}
          />
        )}

        {activeTab === 'faq' && <FaqSupport />}
      </main>

      {/* Auth Modal (Sign In & Sign Up) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Digital Checkout Modal (Direct PayPal & BTC) */}
      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        item={checkoutItem}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;


