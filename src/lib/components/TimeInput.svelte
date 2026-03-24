<script lang="ts">
  interface Props {
    minutes: number;
    seconds: number;
    disabled?: boolean;
    onchange?: (minutes: number, seconds: number) => void;
  }

  let { minutes, seconds, disabled = false, onchange }: Props = $props();

  const presets = [5, 10, 15, 25];

  function selectPreset(value: number) {
    if (disabled) return;
    onchange?.(value, 0);
  }

  function handleMinutes(e: Event) {
    const val = Math.max(0, Math.min(60, Number((e.target as HTMLInputElement).value)));
    onchange?.(val, seconds);
  }

  function handleSeconds(e: Event) {
    const val = Math.max(0, Math.min(59, Number((e.target as HTMLInputElement).value)));
    onchange?.(minutes, val);
  }
</script>

<div class="time-controls" data-testid="time-input">
  <!-- Preset chips -->
  <div class="presets" class:faded={disabled}>
    {#each presets as value}
      <button
        class="preset-chip"
        class:selected={minutes === value && seconds === 0}
        onclick={() => selectPreset(value)}
        disabled={disabled}
        data-testid="preset-{value}"
      >
        {value}m
      </button>
    {/each}
  </div>

  <!-- Direct input -->
  <div class="direct-input">
    <div class="input-frame">
      <input
        type="number"
        min="0"
        max="60"
        value={minutes}
        {disabled}
        oninput={handleMinutes}
        data-testid="minutes-input"
        aria-label="Minutes"
      />
    </div>
    <span class="separator">:</span>
    <div class="input-frame">
      <input
        type="number"
        min="0"
        max="59"
        value={seconds}
        {disabled}
        oninput={handleSeconds}
        data-testid="seconds-input"
        aria-label="Seconds"
      />
    </div>
  </div>
</div>

<style>
  .time-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-top: var(--space-xs);
    animation: deco-fade-in 0.6s 0.3s cubic-bezier(0.4, 0, 0.2, 1) both;
  }

  .presets {
    display: flex;
    gap: 6px;
    transition: opacity 0.3s ease;
  }

  .presets.faded {
    opacity: 0.25;
    pointer-events: none;
  }

  .preset-chip {
    min-width: 46px;
    height: 30px;
    padding: 0 10px;
    font-size: 11px;
    font-weight: 400;
    font-family: var(--font-body);
    letter-spacing: 0.12em;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    color: var(--text-muted);
    border: 1px solid rgba(197, 151, 62, 0.12);
    position: relative;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .preset-chip::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(197, 151, 62, 0.08), transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }

  .preset-chip:hover:not(:disabled)::before {
    opacity: 1;
  }

  .preset-chip:hover:not(:disabled) {
    border-color: rgba(197, 151, 62, 0.35);
    color: var(--accent-light);
  }

  .preset-chip.selected {
    background: rgba(197, 151, 62, 0.1);
    border-color: var(--accent-color);
    color: var(--accent-color);
    box-shadow: 0 0 12px rgba(197, 151, 62, 0.1);
  }

  .preset-chip.selected::before {
    opacity: 1;
  }

  .preset-chip:disabled {
    cursor: not-allowed;
    transform: none;
  }

  .direct-input {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
  }

  .input-frame {
    position: relative;
  }

  /* Art Deco decorative corners on input */
  .input-frame::before,
  .input-frame::after {
    content: "";
    position: absolute;
    width: 6px;
    height: 6px;
    border-color: rgba(197, 151, 62, 0.2);
    border-style: solid;
    pointer-events: none;
    transition: border-color 0.3s;
  }

  .input-frame::before {
    top: -1px;
    left: -1px;
    border-width: 1px 0 0 1px;
  }

  .input-frame::after {
    bottom: -1px;
    right: -1px;
    border-width: 0 1px 1px 0;
  }

  .input-frame:focus-within::before,
  .input-frame:focus-within::after {
    border-color: rgba(197, 151, 62, 0.5);
  }

  .direct-input input {
    width: 46px;
    height: 32px;
    font-size: 15px;
    font-family: var(--font-display);
    font-weight: 400;
    letter-spacing: 2px;
    padding: 4px;
    border-radius: 2px;
    background: rgba(13, 20, 36, 0.8);
    border: 1px solid rgba(197, 151, 62, 0.12);
  }

  .separator {
    font-size: 18px;
    font-weight: 300;
    color: var(--accent-color);
    font-family: var(--font-display);
    opacity: 0.5;
  }
</style>
