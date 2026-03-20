<script lang="ts">
  interface Props {
    progress: number;
    timeText: string;
    totalMinutes: number;
    size?: number;
  }

  let { progress, timeText, totalMinutes, size = 240 }: Props = $props();

  const strokeWidth = 6;
  const tickOuterRadius = 108;
  const tickLength = 8;
  const tickLengthMajor = 14;
  const numberRadius = 82;
  let radius = $derived((size - strokeWidth * 2) / 2 - 8);
  let circumference = $derived(2 * Math.PI * radius);
  let dashOffset = $derived(circumference * progress);
  let center = $derived(size / 2);

  function tickPos(minute: number, r: number) {
    const angle = (minute / 60) * 2 * Math.PI - Math.PI / 2;
    return {
      x: center + Math.cos(angle) * r,
      y: center + Math.sin(angle) * r,
    };
  }

  let ticks = $derived(
    Array.from({ length: 60 }, (_, i) => {
      const isMajor = i % 5 === 0;
      const len = isMajor ? tickLengthMajor : tickLength;
      const outer = tickPos(i, tickOuterRadius);
      const inner = tickPos(i, tickOuterRadius - len);
      const isActive = totalMinutes > 0 && i <= totalMinutes && i > 0;
      return { outer, inner, isMajor, isActive, minute: i };
    })
  );

  let majorNumbers = $derived(
    [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m) => ({
      ...tickPos(m, numberRadius),
      label: String(m),
    }))
  );
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 {size} {size}"
  data-testid="circular-progress"
  class="timer-svg"
>
  <defs>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e8d5a3" />
      <stop offset="50%" stop-color="#c9a96e" />
      <stop offset="100%" stop-color="#a8884a" />
    </linearGradient>
  </defs>

  <!-- Tick marks -->
  {#each ticks as tick}
    <line
      x1={tick.outer.x}
      y1={tick.outer.y}
      x2={tick.inner.x}
      y2={tick.inner.y}
      stroke={tick.isActive ? "#c9a96e" : tick.isMajor ? "#4a4a58" : "#2a2a35"}
      stroke-width={tick.isMajor ? 2 : 1}
      stroke-linecap="round"
      class:tick-active={tick.isActive}
    />
  {/each}

  <!-- Minute numbers -->
  {#each majorNumbers as num}
    <text
      x={num.x}
      y={num.y}
      text-anchor="middle"
      dominant-baseline="central"
      fill="#4a4a58"
      font-size="11"
      font-weight="400"
      font-family="Outfit, sans-serif"
      class="minute-label"
    >
      {num.label}
    </text>
  {/each}

  <!-- Background ring -->
  <circle
    cx={center}
    cy={center}
    r={radius}
    fill="none"
    stroke="#1e1e2a"
    stroke-width={strokeWidth}
  />

  <!-- Progress ring -->
  <circle
    cx={center}
    cy={center}
    r={radius}
    fill="none"
    stroke="url(#progressGrad)"
    stroke-width={strokeWidth}
    stroke-linecap="round"
    stroke-dasharray={circumference}
    stroke-dashoffset={dashOffset}
    transform="rotate(-90 {center} {center})"
    class="progress-ring"
    filter="url(#glow)"
    data-testid="progress-circle"
  />

  <!-- Center time display -->
  <text
    x="50%"
    y="48%"
    text-anchor="middle"
    dominant-baseline="central"
    fill="#e8e4dc"
    font-size="36"
    font-weight="300"
    font-family="Cormorant Garamond, Georgia, serif"
    letter-spacing="2"
    data-testid="time-text"
  >
    {timeText}
  </text>

  <!-- Duration label -->
  {#if totalMinutes > 0}
    <text
      x="50%"
      y="62%"
      text-anchor="middle"
      dominant-baseline="central"
      fill="#6a6878"
      font-size="11"
      font-weight="400"
      font-family="Outfit, sans-serif"
      letter-spacing="1.5"
    >
      {totalMinutes} MIN
    </text>
  {/if}
</svg>

<style>
  .timer-svg {
    filter: drop-shadow(0 0 40px rgba(201, 169, 110, 0.06));
  }

  .progress-ring {
    transition: stroke-dashoffset 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .tick-active {
    filter: drop-shadow(0 0 2px rgba(201, 169, 110, 0.4));
  }

  .minute-label {
    user-select: none;
  }
</style>
