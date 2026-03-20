import { writable, derived, get } from "svelte/store";
import type { TimerState } from "../types";
import {
  createTimer,
  start as timerStart,
  pause as timerPause,
  reset as timerReset,
  tick as timerTick,
  formatTime,
  getProgress,
} from "../timer";

const TICK_INTERVAL = 100;

function createTimerStore() {
  const defaultDuration = 5 * 60 * 1000;
  const state = writable<TimerState>(createTimer(defaultDuration));

  let intervalId: ReturnType<typeof setInterval> | null = null;
  let lastTick: number = 0;
  let onCompleteCallback: (() => void) | null = null;

  function clearTicker() {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function startTicker() {
    clearTicker();
    lastTick = Date.now();
    intervalId = setInterval(() => {
      const now = Date.now();
      const delta = now - lastTick;
      lastTick = now;
      state.update((s) => {
        const next = timerTick(s, delta);
        if (next.status === "completed" && s.status === "running") {
          onCompleteCallback?.();
        }
        return next;
      });
    }, TICK_INTERVAL);
  }

  return {
    subscribe: state.subscribe,

    setDuration(ms: number) {
      state.set(createTimer(ms));
      clearTicker();
    },

    start() {
      state.update((s) => timerStart(s));
      const current = get(state);
      if (current.status === "running") {
        startTicker();
      }
    },

    pause() {
      state.update((s) => timerPause(s));
      clearTicker();
    },

    reset() {
      state.update((s) => timerReset(s));
      clearTicker();
    },

    onComplete(callback: () => void) {
      onCompleteCallback = callback;
    },

    destroy() {
      clearTicker();
      onCompleteCallback = null;
    },

    timeText: derived(state, ($s) => formatTime($s.remainingMs)),
    progress: derived(state, ($s) => getProgress($s)),
  };
}

export const timerStore = createTimerStore();
