import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/svelte";
import TimerControls from "./TimerControls.svelte";

describe("TimerControls", () => {
  it("shows Start button when idle", () => {
    render(TimerControls, { props: { status: "idle" } });
    expect(screen.getByTestId("start-btn")).toBeTruthy();
    expect(screen.getByTestId("start-btn").textContent).toContain("START");
  });

  it("shows Pause button when running", () => {
    render(TimerControls, { props: { status: "running" } });
    expect(screen.getByTestId("pause-btn")).toBeTruthy();
    expect(screen.getByTestId("pause-btn").textContent).toContain("PAUSE");
  });

  it("shows Resume button when paused", () => {
    render(TimerControls, { props: { status: "paused" } });
    expect(screen.getByTestId("resume-btn")).toBeTruthy();
    expect(screen.getByTestId("resume-btn").textContent).toContain("RESUME");
  });

  it("shows Reset button when not idle", () => {
    render(TimerControls, { props: { status: "running" } });
    expect(screen.getByTestId("reset-btn")).toBeTruthy();
  });

  it("does not show Reset button when idle", () => {
    render(TimerControls, { props: { status: "idle" } });
    expect(screen.queryByTestId("reset-btn")).toBeNull();
  });

  it("calls onstart when Start clicked", async () => {
    const onstart = vi.fn();
    render(TimerControls, { props: { status: "idle", onstart } });
    await fireEvent.click(screen.getByTestId("start-btn"));
    expect(onstart).toHaveBeenCalledOnce();
  });

  it("calls onpause when Pause clicked", async () => {
    const onpause = vi.fn();
    render(TimerControls, { props: { status: "running", onpause } });
    await fireEvent.click(screen.getByTestId("pause-btn"));
    expect(onpause).toHaveBeenCalledOnce();
  });

  it("calls onreset when Reset clicked", async () => {
    const onreset = vi.fn();
    render(TimerControls, { props: { status: "running", onreset } });
    await fireEvent.click(screen.getByTestId("reset-btn"));
    expect(onreset).toHaveBeenCalledOnce();
  });
});
