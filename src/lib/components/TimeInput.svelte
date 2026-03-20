<script lang="ts">
  interface Props {
    minutes: number;
    seconds: number;
    disabled?: boolean;
    onchange?: (minutes: number, seconds: number) => void;
  }

  let { minutes, seconds, disabled = false, onchange }: Props = $props();

  function adjust(delta: number) {
    if (disabled) return;
    const totalSeconds = Math.max(0, Math.min(60 * 60, (minutes * 60 + seconds) + delta * 60));
    const newMin = Math.floor(totalSeconds / 60);
    const newSec = totalSeconds % 60;
    onchange?.(newMin, newSec);
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
  <!-- Preset buttons -->
  <div class="presets">
    <button class="preset-btn subtract" onclick={() => adjust(-10)} {disabled} data-testid="btn-minus-10">-10</button>
    <button class="preset-btn subtract" onclick={() => adjust(-5)} {disabled} data-testid="btn-minus-5">-5</button>
    <button class="preset-btn subtract" onclick={() => adjust(-1)} {disabled} data-testid="btn-minus-1">-1</button>
    <button class="preset-btn add" onclick={() => adjust(1)} {disabled} data-testid="btn-plus-1">+1</button>
    <button class="preset-btn add" onclick={() => adjust(5)} {disabled} data-testid="btn-plus-5">+5</button>
    <button class="preset-btn add" onclick={() => adjust(10)} {disabled} data-testid="btn-plus-10">+10</button>
  </div>

  <!-- Direct input -->
  <div class="direct-input">
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
    <span class="separator">:</span>
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

<style>
  .time-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-top: 4px;
  }

  .presets {
    display: flex;
    gap: 6px;
  }

  .preset-btn {
    width: 38px;
    height: 30px;
    padding: 0;
    font-size: 12px;
    font-weight: 500;
    font-family: var(--font-body);
    letter-spacing: 0;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .preset-btn.subtract {
    background: rgba(192, 57, 43, 0.12);
    color: #e07a6e;
    border: 1px solid rgba(192, 57, 43, 0.2);
  }

  .preset-btn.subtract:hover:not(:disabled) {
    background: rgba(192, 57, 43, 0.25);
    border-color: rgba(192, 57, 43, 0.4);
  }

  .preset-btn.add {
    background: rgba(201, 169, 110, 0.1);
    color: #c9a96e;
    border: 1px solid rgba(201, 169, 110, 0.2);
  }

  .preset-btn.add:hover:not(:disabled) {
    background: rgba(201, 169, 110, 0.22);
    border-color: rgba(201, 169, 110, 0.4);
  }

  .preset-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    transform: none;
  }

  .direct-input {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .direct-input input {
    width: 44px;
    height: 32px;
    font-size: 14px;
    font-family: var(--font-display);
    font-weight: 400;
    letter-spacing: 1px;
    padding: 4px;
  }

  .separator {
    font-size: 16px;
    font-weight: 300;
    color: var(--text-muted);
    font-family: var(--font-display);
  }
</style>
