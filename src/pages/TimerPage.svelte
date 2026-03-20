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

  let totalMinutes = $derived(Math.min(60, Math.ceil((inputMinutes * 60 + inputSeconds) / 60)));

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
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    </button>

    <div class="timer-container">
      <CircularProgress
        progress={$progress}
        timeText={$timeText}
        {totalMinutes}
      />
    </div>

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
    padding: 12px 16px;
    position: relative;
  }

  .settings-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: transparent;
    color: #4a4a58;
    padding: 6px;
    border: none;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.25s;
  }
  .settings-btn:hover {
    color: #c9a96e;
    background: rgba(201, 169, 110, 0.08);
  }

  .timer-container {
    margin-bottom: 2px;
  }
</style>
