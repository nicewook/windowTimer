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
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
      START
    </button>
  {:else if status === "running"}
    <button class="btn-primary btn-pause" onclick={onpause} data-testid="pause-btn">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="3" width="5" height="18" rx="1"/><rect x="14" y="3" width="5" height="18" rx="1"/></svg>
      PAUSE
    </button>
  {:else if status === "paused"}
    <button class="btn-primary btn-start" onclick={onstart} data-testid="resume-btn">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
      RESUME
    </button>
  {:else if status === "completed"}
    <button class="btn-primary btn-start" onclick={onreset} data-testid="restart-btn">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
      RESTART
    </button>
  {/if}

  {#if status !== "idle" && status !== "completed"}
    <button class="btn-secondary" onclick={onreset} data-testid="reset-btn">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
      RESET
    </button>
  {/if}
</div>

<style>
  .timer-controls {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: var(--space-md);
    animation: deco-fade-in 0.6s 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
  }

  .btn-primary,
  .btn-secondary {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 24px;
    font-size: 11px;
    letter-spacing: 0.2em;
    font-weight: 400;
    border-radius: 2px;
    position: relative;
    overflow: hidden;
  }

  /* Art Deco shimmer effect on hover */
  .btn-primary::after {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.15),
      transparent
    );
    transition: left 0.5s ease;
  }

  .btn-primary:hover::after {
    left: 100%;
  }

  .btn-start {
    background: linear-gradient(135deg, #c5973e 0%, #a07a2e 100%);
    color: #060b18;
    font-weight: 500;
    box-shadow:
      0 2px 16px rgba(197, 151, 62, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(197, 151, 62, 0.4);
  }

  .btn-start:hover {
    background: linear-gradient(135deg, #d4a84e 0%, #c5973e 100%);
    box-shadow:
      0 4px 24px rgba(197, 151, 62, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }

  .btn-pause {
    background: transparent;
    color: var(--text-color);
    border: 1px solid rgba(197, 151, 62, 0.2);
  }

  .btn-pause:hover {
    border-color: rgba(197, 151, 62, 0.4);
    background: rgba(197, 151, 62, 0.06);
  }

  .btn-secondary {
    background: transparent;
    color: var(--text-muted);
    border: 1px solid rgba(197, 151, 62, 0.1);
  }

  .btn-secondary:hover {
    color: var(--accent-light);
    border-color: rgba(197, 151, 62, 0.25);
    background: rgba(197, 151, 62, 0.04);
  }
</style>
