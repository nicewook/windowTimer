<script lang="ts">
  import type { Settings } from "../types";
  import { playAlarmSound } from "../services/notificationService";

  interface Props {
    settings: Settings;
    onsave?: (settings: Settings) => void;
    oncancel?: () => void;
  }

  let { settings, onsave, oncancel }: Props = $props();

  // svelte-ignore state_referenced_locally
  let draft = $state<Settings>({ ...settings });

  function handleSave() {
    onsave?.({ ...draft });
  }

  function handleCancel() {
    draft = { ...settings };
    oncancel?.();
  }
</script>

<div class="settings-panel" data-testid="settings-panel">
  <div class="panel-header">
    <div class="deco-line"></div>
    <h2>Settings</h2>
    <div class="deco-line"></div>
  </div>

  <div class="field">
    <label for="default-minutes">Default Minutes</label>
    <input
      id="default-minutes"
      type="number"
      min="0"
      max="99"
      bind:value={draft.default_minutes}
      data-testid="default-minutes"
    />
  </div>

  <div class="field">
    <label for="default-seconds">Default Seconds</label>
    <input
      id="default-seconds"
      type="number"
      min="0"
      max="59"
      bind:value={draft.default_seconds}
      data-testid="default-seconds"
    />
  </div>

  <div class="field">
    <label for="window-width">Window Width</label>
    <input
      id="window-width"
      type="number"
      min="200"
      max="800"
      bind:value={draft.window_width}
      data-testid="window-width"
    />
  </div>

  <div class="field">
    <label for="window-height">Window Height</label>
    <input
      id="window-height"
      type="number"
      min="200"
      max="800"
      bind:value={draft.window_height}
      data-testid="window-height"
    />
  </div>

  <div class="field">
    <label for="hotkey">Global Hotkey</label>
    <input
      id="hotkey"
      type="text"
      bind:value={draft.hotkey}
      data-testid="hotkey-input"
    />
  </div>

  <div class="field toggle-field">
    <label for="sound-enabled">Alarm Sound</label>
    <div class="sound-controls">
      <button class="btn-test" onclick={playAlarmSound} data-testid="test-sound-btn" title="Test alarm sound">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
        </svg>
      </button>
      <label class="toggle">
        <input
          id="sound-enabled"
          type="checkbox"
          bind:checked={draft.sound_enabled}
          data-testid="sound-toggle"
        />
        <span class="slider"></span>
      </label>
    </div>
  </div>

  <div class="actions">
    <button class="btn-save" onclick={handleSave} data-testid="save-btn">Save</button>
    <button class="btn-cancel" onclick={handleCancel} data-testid="cancel-btn">Cancel</button>
  </div>
</div>

<style>
  .settings-panel {
    padding: var(--space-lg) var(--space-md);
    width: 100%;
    max-width: 280px;
  }

  .panel-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: var(--space-lg);
  }

  .deco-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(197, 151, 62, 0.3), transparent);
  }

  h2 {
    text-align: center;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: 20px;
    letter-spacing: 0.15em;
    color: var(--accent-light);
    text-transform: uppercase;
    white-space: nowrap;
  }

  .field {
    margin-bottom: var(--space-md);
  }

  label {
    display: block;
    font-size: 10px;
    font-weight: 400;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: var(--space-sm);
    color: var(--text-muted);
    font-family: var(--font-body);
  }

  input[type="number"],
  input[type="text"] {
    width: 100%;
    background: rgba(13, 20, 36, 0.8);
    border: 1px solid rgba(197, 151, 62, 0.12);
    border-radius: 2px;
    color: var(--text-color);
    padding: 8px 10px;
    font-size: 14px;
    font-family: var(--font-body);
    font-weight: 300;
    transition: border-color 0.3s, box-shadow 0.3s;
  }

  input:focus {
    outline: none;
    border-color: rgba(197, 151, 62, 0.4);
    box-shadow: 0 0 12px rgba(197, 151, 62, 0.08);
  }

  .toggle-field {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .toggle-field label:first-child {
    margin-bottom: 0;
  }

  .sound-controls {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .btn-test {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 24px;
    padding: 0;
    background: rgba(197, 151, 62, 0.08);
    color: var(--accent-color);
    border: 1px solid rgba(197, 151, 62, 0.15);
    border-radius: 2px;
    letter-spacing: 0;
  }

  .btn-test:hover {
    background: rgba(197, 151, 62, 0.18);
    border-color: rgba(197, 151, 62, 0.35);
  }

  .toggle {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
  }

  .toggle input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #1a2438;
    border-radius: 2px;
    border: 1px solid rgba(197, 151, 62, 0.1);
    transition: 0.3s;
  }

  .slider::before {
    content: "";
    position: absolute;
    height: 18px;
    width: 18px;
    left: 2px;
    bottom: 2px;
    background-color: #6b6458;
    border-radius: 2px;
    transition: 0.3s;
  }

  .toggle input:checked + .slider {
    background-color: rgba(197, 151, 62, 0.15);
    border-color: rgba(197, 151, 62, 0.3);
  }

  .toggle input:checked + .slider::before {
    transform: translateX(20px);
    background-color: var(--accent-color);
  }

  .actions {
    display: flex;
    gap: var(--space-sm);
    margin-top: var(--space-lg);
  }

  .btn-save {
    flex: 1;
    background: linear-gradient(135deg, #c5973e, #a07a2e);
    color: #060b18;
    font-weight: 500;
    letter-spacing: 0.15em;
    border-radius: 2px;
    border: 1px solid rgba(197, 151, 62, 0.4);
    position: relative;
    overflow: hidden;
  }

  .btn-save::after {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
    transition: left 0.5s ease;
  }

  .btn-save:hover::after {
    left: 100%;
  }

  .btn-save:hover {
    box-shadow: 0 4px 16px rgba(197, 151, 62, 0.25);
  }

  .btn-cancel {
    flex: 1;
    background: transparent;
    color: var(--text-muted);
    border: 1px solid rgba(197, 151, 62, 0.1);
    border-radius: 2px;
  }

  .btn-cancel:hover {
    color: var(--accent-light);
    border-color: rgba(197, 151, 62, 0.25);
    background: rgba(197, 151, 62, 0.04);
  }
</style>
