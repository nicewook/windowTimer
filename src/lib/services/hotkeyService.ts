let currentShortcut: string | null = null;

export async function registerHotkey(
  hotkey: string,
  callback: () => void
): Promise<void> {
  try {
    const { register, unregister } = await import(
      "@tauri-apps/plugin-global-shortcut"
    );

    if (currentShortcut) {
      try {
        await unregister(currentShortcut);
      } catch {
        // Ignore unregister errors
      }
    }

    await register(hotkey, callback);
    currentShortcut = hotkey;
  } catch (e) {
    console.error("Hotkey registration error:", e);
  }
}

export async function unregisterHotkey(): Promise<void> {
  if (!currentShortcut) return;
  try {
    const { unregister } = await import(
      "@tauri-apps/plugin-global-shortcut"
    );
    await unregister(currentShortcut);
    currentShortcut = null;
  } catch (e) {
    console.error("Hotkey unregister error:", e);
  }
}
