import type { Settings } from "../types";
import { DEFAULT_SETTINGS } from "../types";

export async function getSettings(): Promise<Settings> {
  try {
    const { invoke } = await import("@tauri-apps/api/core");
    return await invoke<Settings>("get_settings");
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function setSettings(settings: Settings): Promise<void> {
  try {
    const { invoke } = await import("@tauri-apps/api/core");
    await invoke("set_settings", { settings });
  } catch (e) {
    console.error("Failed to save settings:", e);
    throw e;
  }
}
