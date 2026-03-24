import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import CircularProgress from "./CircularProgress.svelte";

const defaultProps = { progress: 0, timeText: "05:00", totalMinutes: 5, remainingMinutes: 5, status: "idle" as const };

describe("CircularProgress", () => {
  it("renders SVG element", () => {
    render(CircularProgress, { props: defaultProps });
    const svg = screen.getByTestId("circular-progress");
    expect(svg).toBeTruthy();
    expect(svg.tagName).toBe("svg");
  });

  it("displays the time text", () => {
    render(CircularProgress, { props: { ...defaultProps, timeText: "03:30" } });
    expect(screen.getByTestId("time-text").textContent).toBe("03:30");
  });

  it("has gradient stroke on progress circle", () => {
    render(CircularProgress, { props: { ...defaultProps, progress: 0.5 } });
    const circle = screen.getByTestId("progress-circle");
    expect(circle.getAttribute("stroke")).toBe("url(#progressGrad)");
  });

  it("stroke-dashoffset reflects progress", () => {
    const size = 260;
    const strokeWidth = 4;
    const radius = (size - strokeWidth * 2) / 2 - 18;
    const circumference = 2 * Math.PI * radius;

    render(CircularProgress, { props: { ...defaultProps, progress: 0.5 } });
    const circle = screen.getByTestId("progress-circle");
    const offset = parseFloat(circle.getAttribute("stroke-dashoffset")!);
    expect(offset).toBeCloseTo(circumference * 0.5, 0);
  });

  it("offset is 0 when progress is 0", () => {
    render(CircularProgress, { props: defaultProps });
    const circle = screen.getByTestId("progress-circle");
    const offset = parseFloat(circle.getAttribute("stroke-dashoffset")!);
    expect(offset).toBeCloseTo(0, 0);
  });

  it("offset equals circumference when progress is 1", () => {
    const size = 260;
    const strokeWidth = 4;
    const radius = (size - strokeWidth * 2) / 2 - 18;
    const circumference = 2 * Math.PI * radius;

    render(CircularProgress, { props: { ...defaultProps, progress: 1, timeText: "00:00" } });
    const circle = screen.getByTestId("progress-circle");
    const offset = parseFloat(circle.getAttribute("stroke-dashoffset")!);
    expect(offset).toBeCloseTo(circumference, 0);
  });

  it("shows completion icon and text when completed", () => {
    render(CircularProgress, { props: { ...defaultProps, status: "completed" as const, progress: 1, timeText: "00:00" } });
    expect(screen.getByTestId("completion-icon")).toBeTruthy();
    expect(screen.getByTestId("completion-text").textContent).toBe("COMPLETE");
  });

  it("hides time text when completed", () => {
    render(CircularProgress, { props: { ...defaultProps, status: "completed" as const, progress: 1, timeText: "00:00" } });
    expect(screen.queryByTestId("time-text")).toBeNull();
  });
});
