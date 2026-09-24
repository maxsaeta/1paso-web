import { SubscriptionEntitlement } from '../types';

/**
 * En la web no existe Google Play Billing: la compra se realiza únicamente
 * en la app móvil (unfoco/NeuroPaso Android). Este adaptador es un no-op:
 * la suscripción se sincroniza sola vía Firestore (users/{uid}.subscription).
 */
export interface IPurchaseAdapter {
  startPurchase(productId: string): Promise<SubscriptionEntitlement | null>;
  restorePurchases(): Promise<SubscriptionEntitlement | null>;
}

export interface ISubscriptionRepository {
  getSubscription(userId: string): Promise<SubscriptionEntitlement>;
  subscribe(
    userId: string,
    callback: (entitlement: SubscriptionEntitlement) => void
  ): () => void;
  activate(userId: string, entitlement: SubscriptionEntitlement): Promise<void>;
  purchase(userId: string, productId: string): Promise<SubscriptionEntitlement | null>;
  restore(userId: string): Promise<SubscriptionEntitlement | null>;
}
