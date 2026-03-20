<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { get } from "svelte/store";
  import CircularProgress from "../lib/components/CircularProgress.svelte";
  import TimeInput from "../lib/components/TimeInput.svelte";
  import TimerControls from "../lib/components/TimerControls.svelte";
  import SettingsPanel from "../lib/components/SettingsPanel.svelte";
  import { timerStore } from "../lib/stores/timerStore";
  import { settingsStore } from "../lib/stores/settingsStore";
  import { notifyCompletion } from "../lib/services/notificationService";
  import { registerHotkey, unregisterHotkey } from "../lib/services/hotkeyService";
  import type { Settings } from "../lib/types";

  let showSettings = $state(false);
  let inputMinutes = $state(5);
  let inputSeconds = $state(0);

  const timeText = timerStore.timeText;
  const progress = timerStore.progress;

  onMount(async () => {
    await settingsStore.load();
    const settings = get(settingsStore);
    inputMinutes = settings.default_minutes;
    inputSeconds = settings.default_seconds;
    timerStore.setDuration((inputMinutes * 60 + inputSeconds) * 1000);

    timerStore.onComplete(() => {
      const s = get(settingsStore);
      notifyCompletion(s.sound_enabled);
    });

    try {
      await registerHotkey(settings.hotkey, toggleWindow);
    } catch {
      // Hotkey registration may fail outside Tauri
    }
  });

  onDestroy(() => {
    timerStore.destroy();
    unregisterHotkey();
  });

  async function toggleWindow() {
    try {
      const { getCurrentWindow } = await import("@tauri-apps/api/window");
      const win = getCurrentWindow();
      const visible = await win.isVisible();
      if (visible) {
        await win.hide();
      } else {
        await win.show();
        await win.setFocus();
      }
    } catch {
      // Not in Tauri context
    }
  }

  function handleTimeChange(minutes: number, seconds: number) {
    inputMinutes = minutes;
    inputSeconds = seconds;
    timerStore.setDuration((minutes * 60 + seconds) * 1000);
  }

  function handleStart() {
    timerStore.start();
  }

  function handlePause() {
    timerStore.pause();
  }

  function handleReset() {
    timerStore.reset();
  }

  async function handleSettingsSave(settings: Settings) {
    await settingsStore.save(settings);
    inputMinutes = settings.default_minutes;
    inputSeconds = settings.default_seconds;
    showSettings = false;

    try {
      await unregisterHotkey();
      await registerHotkey(settings.hotkey, toggleWindow);
    } catch {
      // Hotkey may fail
    }

    try {
      const { getCurrentWindow } = await import("@tauri-apps/api/window");
      const win = getCurrentWindow();
      await win.setSize(
        new (await import("@tauri-apps/api/dpi")).LogicalSize(
          settings.window_width,
          settings.window_height
        )
      );
    } catch {
      // Not in Tauri context
    }
  }
</script>

<div class="timer-page">
  {#if showSettings}
    <SettingsPanel
      settings={$settingsStore}
      onsave={handleSettingsSave}
      oncancel={() => (showSettings = false)}
    />
  {:else}
    <button
      class="settings-btn"
      onclick={() => (showSettings = true)}
      aria-label="Settings"
      data-testid="settings-btn"
    >
      ⚙
    </button>

    <CircularProgress progress={$progress} timeText={$timeText} />

    <TimeInput
      minutes={inputMinutes}
      seconds={inputSeconds}
      disabled={$timerStore.status !== "idle"}
      onchange={handleTimeChange}
    />

    <TimerControls
      status={$timerStore.status}
      onstart={handleStart}
      onpause={handlePause}
      onreset={handleReset}
    />
  {/if}
</div>

<style>
  .timer-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    padding: 16px;
    position: relative;
  }

  .settings-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    background: transparent;
    color: #888;
    font-size: 20px;
    padding: 4px 8px;
    border: none;
  }
  .settings-btn:hover {
    color: #e0e0e0;
  }
</style>
