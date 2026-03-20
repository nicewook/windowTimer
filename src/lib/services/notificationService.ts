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
    const ctx = new AudioContext();

    function chime(freq: number, startTime: number, duration: number, gain: number) {
      // Main tone
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;

      // Soft harmonic overtone
      const osc2 = ctx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.value = freq * 2.5;

      // Envelope — gentle attack, long decay (bell-like)
      const env = ctx.createGain();
      env.gain.setValueAtTime(0, startTime);
      env.gain.linearRampToValueAtTime(gain, startTime + 0.02);
      env.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      const env2 = ctx.createGain();
      env2.gain.setValueAtTime(0, startTime);
      env2.gain.linearRampToValueAtTime(gain * 0.15, startTime + 0.01);
      env2.gain.exponentialRampToValueAtTime(0.001, startTime + duration * 0.6);

      osc.connect(env);
      osc2.connect(env2);
      env.connect(ctx.destination);
      env2.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
      osc2.start(startTime);
      osc2.stop(startTime + duration);
    }

    const now = ctx.currentTime;

    // Three ascending chimes — C6, E6, G6 (peaceful major triad)
    chime(1047, now, 1.5, 0.3);        // C6
    chime(1319, now + 0.3, 1.3, 0.25); // E6
    chime(1568, now + 0.6, 1.8, 0.3);  // G6

    // Gentle repeat after a pause
    chime(1047, now + 2.2, 1.5, 0.2);
    chime(1319, now + 2.5, 1.3, 0.18);
    chime(1568, now + 2.8, 2.0, 0.22);

    // Close context after sounds finish
    setTimeout(() => ctx.close(), 6000);
  } catch {
    // Web Audio API not available
  }
}

export async function notifyCompletion(soundEnabled: boolean): Promise<void> {
  await sendNotification();
  if (soundEnabled) {
    playAlarmSound();
  }
}
