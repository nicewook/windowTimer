<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { get } from "svelte/store";
  import { fly, fade } from "svelte/transition";
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
  let remainingMinutes = $derived(() => {
    const state = $timerStore;
    return Math.ceil(state.remainingMs / 60000);
  });

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
  <!-- Art Deco top decorative border -->
  <div class="deco-top">
    <div class="deco-diamond"></div>
  </div>

  <button
    class="settings-btn"
    onclick={() => (showSettings = !showSettings)}
    aria-label="Settings"
    data-testid="settings-btn"
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  </button>

  <div class="timer-container">
    <CircularProgress
      progress={$progress}
      timeText={$timeText}
      {totalMinutes}
      remainingMinutes={remainingMinutes()}
      status={$timerStore.status}
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

  <!-- Art Deco bottom decorative border -->
  <div class="deco-bottom">
    <div class="deco-diamond"></div>
  </div>

  {#if showSettings}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="settings-backdrop" transition:fade={{ duration: 200 }} onclick={() => (showSettings = false)}></div>
    <div class="settings-overlay" transition:fly={{ y: 400, duration: 300 }}>
      <SettingsPanel
        settings={$settingsStore}
        onsave={handleSettingsSave}
        oncancel={() => (showSettings = false)}
      />
    </div>
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
    padding: var(--space-md);
    position: relative;
    overflow: hidden;
  }

  /* Art Deco decorative borders */
  .deco-top,
  .deco-bottom {
    position: absolute;
    left: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: deco-fade-in 1s 0.2s cubic-bezier(0.4, 0, 0.2, 1) both;
  }

  .deco-top {
    top: 12px;
  }

  .deco-bottom {
    bottom: 12px;
  }

  .deco-top::before,
  .deco-top::after,
  .deco-bottom::before,
  .deco-bottom::after {
    content: "";
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(197, 151, 62, 0.2), transparent);
  }

  .deco-diamond {
    width: 6px;
    height: 6px;
    background: rgba(197, 151, 62, 0.25);
    transform: rotate(45deg);
    margin: 0 8px;
    flex-shrink: 0;
  }

  .settings-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: transparent;
    color: #4a4a58;
    padding: 6px;
    border: none;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    z-index: 10;
    letter-spacing: 0;
  }

  .settings-btn:hover {
    color: var(--accent-color);
    background: rgba(197, 151, 62, 0.06);
  }

  .timer-container {
    margin-bottom: 0;
  }

  .settings-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(6, 11, 24, 0.7);
    backdrop-filter: blur(4px);
    z-index: 20;
  }

  .settings-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(180deg, #0d1424 0%, #060b18 100%);
    border-top: 1px solid rgba(197, 151, 62, 0.15);
    z-index: 30;
    display: flex;
    justify-content: center;
  }
</style>
