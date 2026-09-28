import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { IPlanRepository } from '../../domain/repositories';
import { DailyPriorities, ShutdownChecklist } from '../../domain/types';

export class FirebasePlanRepository implements IPlanRepository {
  async getDailyPriorities(userId: string, date: string): Promise<DailyPriorities | null> {
    const docRef = doc(db, 'users', userId, 'dailyPlan', date);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as DailyPriorities;
    }
    return null;
  }

  async saveDailyPriorities(userId: string, priorities: DailyPriorities): Promise<void> {
    const docRef = doc(db, 'users', userId, 'dailyPlan', priorities.date);
    await setDoc(docRef, priorities, { merge: true });
  }

  async getShutdownChecklist(userId: string): Promise<ShutdownChecklist | null> {
    const docRef = doc(db, 'users', userId, 'shutdown', 'current');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as ShutdownChecklist;
    }
    return null;
  }

  async saveShutdownChecklist(userId: string, checklist: ShutdownChecklist): Promise<void> {
    const docRef = doc(db, 'users', userId, 'shutdown', 'current');
    await setDoc(docRef, checklist, { merge: true });
  }

  async delete(userId: string): Promise<void> {
    try {
      const collections = ['dailyPlan', 'moods', 'shutdown'];
      for (const col of collections) {
        const colRef = collection(db, 'users', userId, col);
        const snapshot = await getDocs(colRef);
        for (const d of snapshot.docs) {
          await deleteDoc(d.ref);
        }
      }
    } catch (error) {
      console.error('Error deleting plan data:', error);
    }
  }
}
