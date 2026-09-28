export interface DailyPriorities {
  date: string; // YYYY-MM-DD
  taskIds: [string | null, string | null, string | null]; // IDs de tareas seleccionadas
  completedPriorities: [boolean, boolean, boolean];
}

export interface ShutdownChecklist {
  tomorrowThing: string;
  calendarChecked: boolean;
  deskCleared: boolean;
  shutdownSaid: boolean;
}
