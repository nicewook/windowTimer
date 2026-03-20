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
    padding: 20px;
    width: 100%;
    max-width: 280px;
  }

  h2 {
    margin-bottom: 16px;
    text-align: center;
  }

  .field {
    margin-bottom: 12px;
  }

  label {
    display: block;
    font-size: 13px;
    margin-bottom: 4px;
    color: #aaa;
  }

  input[type="number"],
  input[type="text"] {
    width: 100%;
    background: var(--surface-color);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    color: var(--text-color);
    padding: 6px 8px;
    font-size: 14px;
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
    background-color: #555;
    border-radius: 24px;
    transition: 0.2s;
  }

  .slider::before {
    content: "";
    position: absolute;
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    border-radius: 50%;
    transition: 0.2s;
  }

  .toggle input:checked + .slider {
    background-color: #27ae60;
  }

  .toggle input:checked + .slider::before {
    transform: translateX(20px);
  }

  .actions {
    display: flex;
    gap: 8px;
    margin-top: 20px;
  }

  .btn-save {
    flex: 1;
    background: #27ae60;
    color: white;
  }
  .btn-save:hover {
    background: #219a52;
  }

  .btn-cancel {
    flex: 1;
    background: #555;
    color: white;
  }
  .btn-cancel:hover {
    background: #444;
  }
</style>
