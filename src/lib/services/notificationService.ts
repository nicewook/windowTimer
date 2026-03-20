export async function sendNotification(): Promise<void> {
  try {
    const { sendNotification: notify, isPermissionGranted, requestPermission } =
      await import("@tauri-apps/plugin-notification");

    let granted = await isPermissionGranted();
    if (!granted) {
      const permission = await requestPermission();
      granted = permission === "granted";
    }

    if (granted) {
      notify({
        title: "Window Timer",
        body: "Timer completed!",
      });
    }
  } catch (e) {
    console.error("Notification error:", e);
  }
}

export function playAlarmSound(): void {
  try {
    const audio = new Audio("/alarm.wav");
    audio.play().catch(() => {});
  } catch {
    // Audio not available
  }
}

export async function notifyCompletion(soundEnabled: boolean): Promise<void> {
  await sendNotification();
  if (soundEnabled) {
    playAlarmSound();
  }
}
