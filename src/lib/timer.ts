import type { TimerState } from "./types";

export function createTimer(durationMs: number): TimerState {
  return {
    status: "idle",
    durationMs,
    remainingMs: durationMs,
  };
}

export function start(state: TimerState): TimerState {
  if (state.status === "idle" || state.status === "paused") {
    return { ...state, status: "running" };
  }
  return state;
}

export function pause(state: TimerState): TimerState {
  if (state.status === "running") {
    return { ...state, status: "paused" };
  }
  return state;
}

export function reset(state: TimerState): TimerState {
  return {
    ...state,
    status: "idle",
    remainingMs: state.durationMs,
  };
}

export function tick(state: TimerState, deltaMs: number): TimerState {
  if (state.status !== "running") {
    return state;
  }
  const remaining = Math.max(0, state.remainingMs - deltaMs);
  return {
    ...state,
    remainingMs: remaining,
    status: remaining <= 0 ? "completed" : "running",
  };
}

export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function getProgress(state: TimerState): number {
  if (state.durationMs === 0) return 1;
  return (state.durationMs - state.remainingMs) / state.durationMs;
}
