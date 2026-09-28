import { DailyPriorities, ShutdownChecklist } from '../types';

export interface IPlanRepository {
  getDailyPriorities(userId: string, date: string): Promise<DailyPriorities | null>;
  saveDailyPriorities(userId: string, priorities: DailyPriorities): Promise<void>;
  getShutdownChecklist(userId: string): Promise<ShutdownChecklist | null>;
  saveShutdownChecklist(userId: string, checklist: ShutdownChecklist): Promise<void>;
  delete(userId: string): Promise<void>;
}
