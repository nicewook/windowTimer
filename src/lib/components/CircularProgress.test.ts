import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import CircularProgress from "./CircularProgress.svelte";

describe("CircularProgress", () => {
  it("renders SVG element", () => {
    render(CircularProgress, { props: { progress: 0, timeText: "05:00" } });
    const svg = screen.getByTestId("circular-progress");
    expect(svg).toBeTruthy();
    expect(svg.tagName).toBe("svg");
  });

  it("displays the time text", () => {
    render(CircularProgress, { props: { progress: 0, timeText: "03:30" } });
    expect(screen.getByTestId("time-text").textContent).toBe("03:30");
  });

  it("has red stroke on progress circle", () => {
    render(CircularProgress, { props: { progress: 0.5, timeText: "02:30" } });
    const circle = screen.getByTestId("progress-circle");
    expect(circle.getAttribute("stroke")).toBe("#e74c3c");
  });

  it("stroke-dashoffset reflects progress", () => {
    const size = 200;
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    render(CircularProgress, { props: { progress: 0.5, timeText: "02:30" } });
    const circle = screen.getByTestId("progress-circle");
    const offset = parseFloat(circle.getAttribute("stroke-dashoffset")!);
    expect(offset).toBeCloseTo(circumference * 0.5, 0);
  });

  it("offset is 0 when progress is 0", () => {
    render(CircularProgress, { props: { progress: 0, timeText: "05:00" } });
    const circle = screen.getByTestId("progress-circle");
    const offset = parseFloat(circle.getAttribute("stroke-dashoffset")!);
    expect(offset).toBeCloseTo(0, 0);
  });

  it("offset equals circumference when progress is 1", () => {
    const size = 200;
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    render(CircularProgress, { props: { progress: 1, timeText: "00:00" } });
    const circle = screen.getByTestId("progress-circle");
    const offset = parseFloat(circle.getAttribute("stroke-dashoffset")!);
    expect(offset).toBeCloseTo(circumference, 0);
  });
});
