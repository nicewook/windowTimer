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
    <button class="btn-start" onclick={onstart} data-testid="start-btn">Start</button>
  {:else if status === "running"}
    <button class="btn-pause" onclick={onpause} data-testid="pause-btn">Pause</button>
  {:else if status === "paused"}
    <button class="btn-start" onclick={onstart} data-testid="resume-btn">Resume</button>
  {:else if status === "completed"}
    <!-- No start/pause button when completed -->
  {/if}

  {#if status !== "idle"}
    <button class="btn-reset" onclick={onreset} data-testid="reset-btn">Reset</button>
  {/if}
</div>

<style>
  .timer-controls {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-top: 16px;
  }

  .btn-start {
    background: #27ae60;
    color: white;
  }
  .btn-start:hover {
    background: #219a52;
  }

  .btn-pause {
    background: #f39c12;
    color: white;
  }
  .btn-pause:hover {
    background: #d68910;
  }

  .btn-reset {
    background: #555;
    color: white;
  }
  .btn-reset:hover {
    background: #444;
  }
</style>
