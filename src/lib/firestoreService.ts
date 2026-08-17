import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  getDocs,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { UserAccount, Campaign, PaymentOrder } from '../types';

// Subscribe to Active Community Campaigns in Real-Time
export const subscribeToCommunityCampaigns = (
  onUpdate: (campaigns: Campaign[]) => void
) => {
  const path = 'campaigns';
  try {
    const q = collection(db, path);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const camps: Campaign[] = [];
        snapshot.forEach((docSnap) => {
          camps.push({ ...docSnap.data(), id: docSnap.id } as Campaign);
        });
        onUpdate(camps);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
    return unsubscribe;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return () => {};
  }
};

// Push a New Campaign into the Global Community Pool
export const createCampaignInFirestore = async (campaign: Campaign) => {
  const path = `campaigns/${campaign.id}`;
  try {
    await setDoc(doc(db, 'campaigns', campaign.id), {
      ...campaign,
      createdAt: campaign.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
};

// Update Delivered Progress (called when other users watch in Exchanger)
export const updateCampaignDelivered = async (
  campaignId: string,
  deliveredAmount: number,
  targetAmount: number
) => {
  const path = `campaigns/${campaignId}`;
  try {
    const isFinished = deliveredAmount >= targetAmount;
    await updateDoc(doc(db, 'campaigns', campaignId), {
      deliveredAmount: deliveredAmount,
      status: isFinished ? 'completed' : 'active',
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

// Toggle Campaign Status (Pause/Resume)
export const toggleCampaignStatusInFirestore = async (
  campaignId: string,
  newStatus: 'active' | 'paused'
) => {
  const path = `campaigns/${campaignId}`;
  try {
    await updateDoc(doc(db, 'campaigns', campaignId), {
      status: newStatus,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
};

// Delete Campaign from Global Pool
export const deleteCampaignInFirestore = async (campaignId: string) => {
  const path = `campaigns/${campaignId}`;
  try {
    await deleteDoc(doc(db, 'campaigns', campaignId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
};

// Get User Profile from Firestore
export const getUserProfileFromFirestore = async (userIdOrEmail: string): Promise<UserAccount | null> => {
  const cleanId = userIdOrEmail.replace(/[^a-zA-Z0-9_-]/g, '_');
  const path = `users/${cleanId}`;
  try {
    const snap = await getDoc(doc(db, 'users', cleanId));
    if (snap.exists()) {
      return snap.data() as UserAccount;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
};

// Sync User Profile and Balance
export const syncUserProfileToFirestore = async (user: UserAccount) => {
  const idToUse = user.uid || user.username || 'creator';
  const cleanId = idToUse.replace(/[^a-zA-Z0-9_-]/g, '_');
  const path = `users/${cleanId}`;
  try {
    await setDoc(
      doc(db, 'users', cleanId),
      {
        ...user,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

// Listen to User Profile Updates in Real Time
export const subscribeToUserProfile = (
  userId: string,
  onUpdate: (user: Partial<UserAccount>) => void
) => {
  const cleanId = userId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const path = `users/${cleanId}`;
  try {
    const unsubscribe = onSnapshot(
      doc(db, 'users', cleanId),
      (docSnap) => {
        if (docSnap.exists()) {
          onUpdate(docSnap.data() as UserAccount);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
    return unsubscribe;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return () => {};
  }
};

// Record Completed Digital Order (PayPal / BTC)
export const recordOrderInFirestore = async (order: PaymentOrder) => {
  const path = `orders/${order.id}`;
  try {
    await setDoc(doc(db, 'orders', order.id), {
      ...order,
      timestamp: order.timestamp || new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

// Heartbeat Presence: Live Online Community Counter
export const sendPresenceHeartbeat = async (
  userId: string,
  username: string,
  isExchanging: boolean
) => {
  const path = `presence/${userId}`;
  try {
    await setDoc(doc(db, 'presence', userId), {
      userId,
      username,
      lastSeen: Date.now(),
      isExchanging
    });
  } catch (error) {
    // Non-blocking for presence
  }
};

// Subscribe to Live Online Presence
export const subscribeToOnlineCommunity = (
  onUpdate: (count: number, activeExchangers: number) => void
) => {
  const path = 'presence';
  try {
    const unsubscribe = onSnapshot(
      collection(db, path),
      (snapshot) => {
        const now = Date.now();
        const twoMinutesAgo = now - 2 * 60 * 1000;
        let onlineCount = 0;
        let exchangingCount = 0;

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.lastSeen && data.lastSeen > twoMinutesAgo) {
            onlineCount++;
            if (data.isExchanging) {
              exchangingCount++;
            }
          }
        });

        // Ensure realistic minimum baseline + live online users
        onUpdate(Math.max(1, onlineCount), exchangingCount);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
    return unsubscribe;
  } catch (error) {
    return () => {};
  }
};
