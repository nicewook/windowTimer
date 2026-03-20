export type TimerStatus = "idle" | "running" | "paused" | "completed";

export interface TimerState {
  status: TimerStatus;
  durationMs: number;
  remainingMs: number;
}

export interface Settings {
  default_minutes: number;
  default_seconds: number;
  window_width: number;
  window_height: number;
  hotkey: string;
  sound_enabled: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  default_minutes: 5,
  default_seconds: 0,
  window_width: 300,
  window_height: 400,
  hotkey: "Ctrl+Shift+T",
  sound_enabled: true,
};
