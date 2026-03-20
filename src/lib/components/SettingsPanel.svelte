<script lang="ts">
  import type { Settings } from "../types";

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
  <h2>Settings</h2>

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

  <div class="actions">
    <button class="btn-save" onclick={handleSave} data-testid="save-btn">Save</button>
    <button class="btn-cancel" onclick={handleCancel} data-testid="cancel-btn">Cancel</button>
  </div>
</div>

<style>
  .settings-panel {
    padding: 24px 20px;
    width: 100%;
    max-width: 280px;
  }

  h2 {
    margin-bottom: 20px;
    text-align: center;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: 22px;
    letter-spacing: 2px;
    color: var(--accent-light);
  }

  .field {
    margin-bottom: 14px;
  }

  label {
    display: block;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    margin-bottom: 6px;
    color: var(--text-muted);
  }

  input[type="number"],
  input[type="text"] {
    width: 100%;
    background: var(--surface-color);
    border: 1px solid var(--surface-border);
    border-radius: 6px;
    color: var(--text-color);
    padding: 8px 10px;
    font-size: 14px;
    font-family: var(--font-body);
    transition: border-color 0.2s;
  }

  input:focus {
    outline: none;
    border-color: var(--accent-color);
  }

  .toggle-field {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .toggle-field label:first-child {
    margin-bottom: 0;
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
    background-color: #2a2a35;
    border-radius: 24px;
    transition: 0.25s;
  }

  .slider::before {
    content: "";
    position: absolute;
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: #6a6878;
    border-radius: 50%;
    transition: 0.25s;
  }

  .toggle input:checked + .slider {
    background-color: rgba(201, 169, 110, 0.25);
  }

  .toggle input:checked + .slider::before {
    transform: translateX(20px);
    background-color: var(--accent-color);
  }

  .actions {
    display: flex;
    gap: 8px;
    margin-top: 24px;
  }

  .btn-save {
    flex: 1;
    background: linear-gradient(135deg, #c9a96e, #b8944f);
    color: #1a1a22;
    font-weight: 600;
    letter-spacing: 1px;
  }
  .btn-save:hover {
    background: linear-gradient(135deg, #d4b87e, #c9a96e);
    box-shadow: 0 4px 16px rgba(201, 169, 110, 0.25);
  }

  .btn-cancel {
    flex: 1;
    background: rgba(255, 255, 255, 0.05);
    color: #6a6878;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
  .btn-cancel:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #8a8898;
  }
</style>
