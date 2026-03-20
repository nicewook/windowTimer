<script lang="ts">
  import type { TimerStatus } from "../types";

  interface Props {
    status: TimerStatus;
    onstart?: () => void;
    onpause?: () => void;
    onreset?: () => void;
  }

  let { status, onstart, onpause, onreset }: Props = $props();
</script>

<div class="timer-controls" data-testid="timer-controls">
  {#if status === "idle"}
    <button class="btn-primary btn-start" onclick={onstart} data-testid="start-btn">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
      START
    </button>
  {:else if status === "running"}
    <button class="btn-primary btn-pause" onclick={onpause} data-testid="pause-btn">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="3" width="5" height="18" rx="1"/><rect x="14" y="3" width="5" height="18" rx="1"/></svg>
      PAUSE
    </button>
  {:else if status === "paused"}
    <button class="btn-primary btn-start" onclick={onstart} data-testid="resume-btn">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
      RESUME
    </button>
  {:else if status === "completed"}
    <!-- Timer completed -->
  {/if}

  {#if status !== "idle"}
    <button class="btn-secondary" onclick={onreset} data-testid="reset-btn">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
      RESET
    </button>
  {/if}
</div>

<style>
  .timer-controls {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 14px;
  }

  .btn-primary,
  .btn-secondary {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 9px 20px;
    font-size: 12px;
    letter-spacing: 1.5px;
    font-weight: 500;
    border-radius: 8px;
  }

  .btn-start {
    background: linear-gradient(135deg, #2d8a54, #247a48);
    color: #e0f0e6;
    box-shadow: 0 2px 12px rgba(45, 138, 84, 0.25);
  }
  .btn-start:hover {
    background: linear-gradient(135deg, #35a063, #2d8a54);
    box-shadow: 0 4px 20px rgba(45, 138, 84, 0.35);
  }

  .btn-pause {
    background: linear-gradient(135deg, #c9a96e, #b8944f);
    color: #1a1a22;
    box-shadow: 0 2px 12px rgba(201, 169, 110, 0.2);
  }
  .btn-pause:hover {
    background: linear-gradient(135deg, #d4b87e, #c9a96e);
    box-shadow: 0 4px 20px rgba(201, 169, 110, 0.3);
  }

  .btn-secondary {
    background: rgba(255, 255, 255, 0.05);
    color: #8a8898;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #b0aec0;
    border-color: rgba(255, 255, 255, 0.15);
  }
</style>
