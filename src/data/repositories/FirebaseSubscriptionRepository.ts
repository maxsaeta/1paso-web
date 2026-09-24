import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { ISubscriptionRepository } from '../../domain/repositories';
import { SubscriptionEntitlement } from '../../domain/types';

const cacheKey = (userId: string): string => `@unpaso_subscription_${userId}`;

function toNumber(value: unknown): number | undefined {
  if (typeof value === 'number') return value;
  if (value instanceof Date) return value.getTime();
  if (
    value &&
    typeof value === 'object' &&
    typeof (value as { toDate?: unknown }).toDate === 'function'
  ) {
    return (value as { toDate: () => Date }).toDate().getTime();
  }
  return undefined;
}

function mapToEntitlement(
  data?: Record<string, unknown> | null
): SubscriptionEntitlement | null {
  if (!data || typeof data.status !== 'string') return null;
  if (data.status !== 'active') {
    return { status: 'none' };
  }
  const expiresAt = toNumber(data.expiresAt);
  return {
    status: 'active',
    plan: typeof data.plan === 'string' ? data.plan : undefined,
    productId: typeof data.productId === 'string' ? data.productId : undefined,
    startedAt: toNumber(data.startedAt),
    expiresAt,
    autoRenewing: Boolean(data.autoRenewing),
    environment: data.environment === 'sandbox' ? 'sandbox' : 'production',
    updatedAt: toNumber(data.updatedAt),
  };
}

function toEntitlementOrNone(data?: unknown): SubscriptionEntitlement {
  return (
    mapToEntitlement(data as Record<string, unknown> | null) ?? { status: 'none' }
  );
}

export class FirebaseSubscriptionRepository implements ISubscriptionRepository {
  async getSubscription(userId: string): Promise<SubscriptionEntitlement> {
    try {
      const docRef = doc(db, 'users', userId);
      const snapshot = await getDoc(docRef);
      const result = snapshot.exists()
        ? toEntitlementOrNone(snapshot.data().subscription)
        : ({ status: 'none' } as const);
      await AsyncStorage.setItem(cacheKey(userId), JSON.stringify(result));
      return result;
    } catch (error) {
      console.error('Error cargando suscripción:', error);
      const cached = await AsyncStorage.getItem(cacheKey(userId));
      if (cached) {
        try {
          return JSON.parse(cached) as SubscriptionEntitlement;
        } catch {
          // ignorar
        }
      }
      return { status: 'none' };
    }
  }

  subscribe(
    userId: string,
    callback: (entitlement: SubscriptionEntitlement) => void
  ): () => void {
    return onSnapshot(
      doc(db, 'users', userId),
      (snapshot) => {
        const result = snapshot.exists()
          ? toEntitlementOrNone(snapshot.data().subscription)
          : ({ status: 'none' } as const);
        AsyncStorage.setItem(cacheKey(userId), JSON.stringify(result));
        callback(result);
      },
      (error) => {
        console.error('Error en la suscripción (realtime):', error);
      }
    );
  }

  async activate(userId: string, entitlement: SubscriptionEntitlement): Promise<void> {
    await setDoc(
      doc(db, 'users', userId),
      { subscription: entitlement },
      { merge: true }
    );
    await AsyncStorage.setItem(cacheKey(userId), JSON.stringify(entitlement));
  }

  /**
   * En la web no existe Google Play Billing: la compra se realiza únicamente
   * en la app móvil (NeuroPaso/1paso Android). Este método es un no-op; la
   * suscripción se sincroniza sola vía getSubscription/restore desde Firestore.
   */
  async purchase(_userId: string, _productId: string): Promise<SubscriptionEntitlement | null> {
    return null;
  }

  async restore(userId: string): Promise<SubscriptionEntitlement | null> {
    const entitlement = await this.getSubscription(userId);
    await AsyncStorage.setItem(cacheKey(userId), JSON.stringify(entitlement));
    return entitlement;
  }
}

export { mapToEntitlement };
