import { writable } from "svelte/store";
import type { Settings } from "../types";
import { DEFAULT_SETTINGS } from "../types";
import { getSettings, setSettings } from "../services/settingsService";

function createSettingsStore() {
  const store = writable<Settings>(DEFAULT_SETTINGS);

  return {
    subscribe: store.subscribe,

    async load() {
      try {
        const settings = await getSettings();
        store.set(settings);
      } catch {
        store.set(DEFAULT_SETTINGS);
      }
    },

    async save(settings: Settings) {
      try {
        await setSettings(settings);
        store.set(settings);
      } catch (e) {
        console.error("Failed to save settings:", e);
        throw e;
      }
    },
  };
}

export const settingsStore = createSettingsStore();
