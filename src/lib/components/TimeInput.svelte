<script lang="ts">
  interface Props {
    minutes: number;
    seconds: number;
    disabled?: boolean;
    onchange?: (minutes: number, seconds: number) => void;
  }

  let { minutes, seconds, disabled = false, onchange }: Props = $props();

  function handleMinutes(e: Event) {
    const val = Math.max(0, Math.min(99, Number((e.target as HTMLInputElement).value)));
    onchange?.(val, seconds);
  }

  function handleSeconds(e: Event) {
    const val = Math.max(0, Math.min(59, Number((e.target as HTMLInputElement).value)));
    onchange?.(minutes, val);
  }
</script>

<div class="time-input" data-testid="time-input">
  <input
    type="number"
    min="0"
    max="99"
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

<style>
  .time-input {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  input {
    width: 50px;
  }

  .separator {
    font-size: 20px;
    font-weight: bold;
  }
</style>
