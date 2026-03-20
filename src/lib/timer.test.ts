import { describe, it, expect } from "vitest";
import {
  createTimer,
  start,
  pause,
  reset,
  tick,
  formatTime,
  getProgress,
} from "./timer";

describe("createTimer", () => {
  it("creates timer with idle status and given duration", () => {
    const t = createTimer(60000);
    expect(t.status).toBe("idle");
    expect(t.durationMs).toBe(60000);
    expect(t.remainingMs).toBe(60000);
  });
});

describe("state transitions", () => {
  it("idle -> running via start", () => {
    const t = start(createTimer(5000));
    expect(t.status).toBe("running");
  });

  it("running -> paused via pause", () => {
    const t = pause(start(createTimer(5000)));
    expect(t.status).toBe("paused");
  });

  it("paused -> running via start (resume)", () => {
    const t = start(pause(start(createTimer(5000))));
    expect(t.status).toBe("running");
  });

  it("any state -> idle via reset", () => {
    const running = start(createTimer(5000));
    const r = reset(running);
    expect(r.status).toBe("idle");
    expect(r.remainingMs).toBe(r.durationMs);
  });

  it("running -> completed when time runs out", () => {
    const t = tick(start(createTimer(100)), 200);
    expect(t.status).toBe("completed");
    expect(t.remainingMs).toBe(0);
  });
});

describe("invalid transitions", () => {
  it("cannot start from completed", () => {
    const completed = tick(start(createTimer(100)), 200);
    expect(completed.status).toBe("completed");
    const result = start(completed);
    expect(result.status).toBe("completed");
  });

  it("cannot pause from idle", () => {
    const t = createTimer(5000);
    const result = pause(t);
    expect(result.status).toBe("idle");
  });

  it("cannot pause from completed", () => {
    const completed = tick(start(createTimer(100)), 200);
    const result = pause(completed);
    expect(result.status).toBe("completed");
  });
});

describe("tick", () => {
  it("decreases remainingMs by deltaMs", () => {
    const t = tick(start(createTimer(5000)), 100);
    expect(t.remainingMs).toBe(4900);
    expect(t.status).toBe("running");
  });

  it("transitions to completed when remainingMs reaches 0", () => {
    const t = tick(start(createTimer(5000)), 5000);
    expect(t.remainingMs).toBe(0);
    expect(t.status).toBe("completed");
  });

  it("clamps remainingMs to 0 (no negative)", () => {
    const t = tick(start(createTimer(100)), 9999);
    expect(t.remainingMs).toBe(0);
    expect(t.status).toBe("completed");
  });

  it("ignores tick when not running", () => {
    const idle = createTimer(5000);
    expect(tick(idle, 100)).toEqual(idle);

    const paused = pause(start(createTimer(5000)));
    expect(tick(paused, 100)).toEqual(paused);
  });
});

describe("formatTime", () => {
  it("formats milliseconds as MM:SS", () => {
    expect(formatTime(0)).toBe("00:00");
    expect(formatTime(1000)).toBe("00:01");
    expect(formatTime(60000)).toBe("01:00");
    expect(formatTime(90000)).toBe("01:30");
    expect(formatTime(3600000)).toBe("60:00");
    expect(formatTime(5999000)).toBe("99:59");
  });

  it("rounds down partial seconds", () => {
    expect(formatTime(1500)).toBe("00:01");
    expect(formatTime(999)).toBe("00:00");
  });
});

describe("getProgress", () => {
  it("returns 0 when no time elapsed", () => {
    const t = createTimer(5000);
    expect(getProgress(t)).toBe(0);
  });

  it("returns ratio of elapsed to total", () => {
    const t = tick(start(createTimer(10000)), 2500);
    expect(getProgress(t)).toBeCloseTo(0.25);
  });

  it("returns 1 when completed", () => {
    const t = tick(start(createTimer(100)), 200);
    expect(getProgress(t)).toBe(1);
  });

  it("handles zero duration", () => {
    const t = createTimer(0);
    expect(getProgress(t)).toBe(1);
  });
});
