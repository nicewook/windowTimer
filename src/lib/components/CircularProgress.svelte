<script lang="ts">
  interface Props {
    progress: number;
    timeText: string;
    size?: number;
  }

  let { progress, timeText, size = 200 }: Props = $props();

  const strokeWidth = 10;
  let radius = $derived((size - strokeWidth) / 2);
  let circumference = $derived(2 * Math.PI * radius);
  let dashOffset = $derived(circumference * progress);
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 {size} {size}"
  data-testid="circular-progress"
>
  <!-- Background circle -->
  <circle
    cx={size / 2}
    cy={size / 2}
    r={radius}
    fill="none"
    stroke="#2a2a3e"
    stroke-width={strokeWidth}
  />
  <!-- Progress circle -->
  <circle
    cx={size / 2}
    cy={size / 2}
    r={radius}
    fill="none"
    stroke="#e74c3c"
    stroke-width={strokeWidth}
    stroke-linecap="round"
    stroke-dasharray={circumference}
    stroke-dashoffset={dashOffset}
    transform="rotate(-90 {size / 2} {size / 2})"
    class="progress-ring"
    data-testid="progress-circle"
  />
  <!-- Time text -->
  <text
    x="50%"
    y="50%"
    text-anchor="middle"
    dominant-baseline="central"
    fill="#e0e0e0"
    font-size="28"
    font-weight="bold"
    font-family="monospace"
    data-testid="time-text"
  >
    {timeText}
  </text>
</svg>

<style>
  .progress-ring {
    transition: stroke-dashoffset 0.1s linear;
  }
</style>
