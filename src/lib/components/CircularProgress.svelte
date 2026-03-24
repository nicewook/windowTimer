<script lang="ts">
  import type { TimerStatus } from "../types";

  interface Props {
    progress: number;
    timeText: string;
    totalMinutes: number;
    remainingMinutes: number;
    status: TimerStatus;
    size?: number;
  }

  let { progress, timeText, totalMinutes, remainingMinutes, status, size = 260 }: Props = $props();

  const strokeWidth = 4;
  const outerDecoRadius = 124;
  const tickOuterRadius = 112;
  const tickLength = 4;
  const tickLengthMajor = 10;
  let radius = $derived((size - strokeWidth * 2) / 2 - 18);
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

  // Art Deco sunburst decorative points (12 rays)
  function sunburstPos(index: number, r: number) {
    const angle = (index / 12) * 2 * Math.PI - Math.PI / 2;
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
      const isActive = totalMinutes > 0 && i <= remainingMinutes && i > 0;
      return { outer, inner, isMajor, isActive, minute: i };
    })
  );

  // 12 decorative chevrons around the outer ring
  let chevrons = $derived(
    Array.from({ length: 12 }, (_, i) => {
      const outer = sunburstPos(i, outerDecoRadius);
      const mid = sunburstPos(i, outerDecoRadius - 6);
      return { outer, mid, index: i };
    })
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
    <filter id="gold-glow">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="soft-glow">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="blur" in2="SourceGraphic" operator="over" />
    </filter>
    <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e2c074" />
      <stop offset="40%" stop-color="#c5973e" />
      <stop offset="100%" stop-color="#9a7230" />
    </linearGradient>
    <linearGradient id="decoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(197, 151, 62, 0.4)" />
      <stop offset="100%" stop-color="rgba(197, 151, 62, 0.1)" />
    </linearGradient>
    <radialGradient id="innerGlow" cx="50%" cy="45%" r="50%">
      <stop offset="0%" stop-color="rgba(197, 151, 62, 0.04)" />
      <stop offset="100%" stop-color="transparent" />
    </radialGradient>
  </defs>

  <!-- Inner ambient glow -->
  <circle
    cx={center}
    cy={center}
    r={radius - 10}
    fill="url(#innerGlow)"
  />

  <!-- Outer decorative ring -->
  <circle
    cx={center}
    cy={center}
    r={outerDecoRadius}
    fill="none"
    stroke="rgba(197, 151, 62, 0.12)"
    stroke-width="0.5"
  />

  <!-- Outer thin accent ring -->
  <circle
    cx={center}
    cy={center}
    r={outerDecoRadius + 4}
    fill="none"
    stroke="rgba(197, 151, 62, 0.06)"
    stroke-width="0.5"
  />

  <!-- Art Deco chevron decorations at 12 points -->
  {#each chevrons as chev}
    <circle
      cx={chev.outer.x}
      cy={chev.outer.y}
      r="1.5"
      fill="rgba(197, 151, 62, 0.35)"
      class="deco-dot"
    />
  {/each}

  <!-- Tick marks -->
  {#each ticks as tick}
    <line
      x1={tick.outer.x}
      y1={tick.outer.y}
      x2={tick.inner.x}
      y2={tick.inner.y}
      stroke={tick.isActive ? "#c5973e" : tick.isMajor ? "#2a3448" : "#151d2e"}
      stroke-width={tick.isMajor ? 1.5 : 0.5}
      stroke-linecap="round"
      class:tick-active={tick.isActive}
    />
  {/each}

  <!-- Background ring -->
  <circle
    cx={center}
    cy={center}
    r={radius}
    fill="none"
    stroke="#111a2e"
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
    class:progress-paused={status === "paused"}
    class:progress-completed={status === "completed"}
    filter="url(#gold-glow)"
    data-testid="progress-circle"
  />

  <!-- Corner Art Deco brackets (top-left, top-right, bottom-left, bottom-right) -->
  <g class="deco-corners" opacity="0.2">
    <!-- Top-left -->
    <path d="M 18 30 L 18 18 L 30 18" fill="none" stroke="#c5973e" stroke-width="1" stroke-linecap="round" />
    <!-- Top-right -->
    <path d="M {size - 18} 30 L {size - 18} 18 L {size - 30} 18" fill="none" stroke="#c5973e" stroke-width="1" stroke-linecap="round" />
    <!-- Bottom-left -->
    <path d="M 18 {size - 30} L 18 {size - 18} L 30 {size - 18}" fill="none" stroke="#c5973e" stroke-width="1" stroke-linecap="round" />
    <!-- Bottom-right -->
    <path d="M {size - 18} {size - 30} L {size - 18} {size - 18} L {size - 30} {size - 18}" fill="none" stroke="#c5973e" stroke-width="1" stroke-linecap="round" />
  </g>

  <!-- Center time display -->
  {#if status === "completed"}
    <text
      x="50%"
      y="43%"
      text-anchor="middle"
      dominant-baseline="central"
      fill="#c5973e"
      font-size="42"
      font-weight="400"
      font-family="Bodoni Moda, Georgia, serif"
      filter="url(#gold-glow)"
      data-testid="completion-icon"
    >
      &#10003;
    </text>
    <text
      x="50%"
      y="58%"
      text-anchor="middle"
      dominant-baseline="central"
      fill="#c5973e"
      font-size="10"
      font-weight="400"
      font-family="Josefin Sans, sans-serif"
      letter-spacing="4"
      data-testid="completion-text"
    >
      COMPLETE
    </text>
  {:else}
    <text
      x="50%"
      y="46%"
      text-anchor="middle"
      dominant-baseline="central"
      fill="#e8dcc8"
      font-size="38"
      font-weight="400"
      font-family="Bodoni Moda, Georgia, serif"
      letter-spacing="3"
      data-testid="time-text"
    >
      {timeText}
    </text>

    <!-- Decorative line under time -->
    <line
      x1={center - 24}
      y1={center + 18}
      x2={center + 24}
      y2={center + 18}
      stroke="rgba(197, 151, 62, 0.3)"
      stroke-width="0.5"
    />

    <!-- Duration label -->
    {#if totalMinutes > 0}
      <text
        x="50%"
        y="63%"
        text-anchor="middle"
        dominant-baseline="central"
        fill="#6b6458"
        font-size="10"
        font-weight="300"
        font-family="Josefin Sans, sans-serif"
        letter-spacing="3"
      >
        {totalMinutes} MIN
      </text>
    {/if}
  {/if}
</svg>

<style>
  .timer-svg {
    filter: drop-shadow(0 0 60px rgba(197, 151, 62, 0.04));
    animation: deco-fade-in 0.8s cubic-bezier(0.4, 0, 0.2, 1) both;
  }

  .progress-ring {
    transition: stroke-dashoffset 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .progress-paused {
    animation: blink 1.6s ease-in-out infinite;
  }

  .progress-completed {
    animation: pulse-glow 2.5s ease-in-out infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.2; }
  }

  @keyframes pulse-glow {
    0%, 100% { filter: url(#gold-glow) drop-shadow(0 0 4px rgba(197, 151, 62, 0.3)); }
    50% { filter: url(#gold-glow) drop-shadow(0 0 16px rgba(197, 151, 62, 0.5)); }
  }

  .tick-active {
    filter: drop-shadow(0 0 3px rgba(197, 151, 62, 0.5));
  }

  .deco-dot {
    animation: deco-fade-in 1.2s cubic-bezier(0.4, 0, 0.2, 1) both;
  }

  .deco-corners {
    animation: deco-fade-in 1.5s cubic-bezier(0.4, 0, 0.2, 1) both;
  }
</style>
