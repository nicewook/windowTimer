import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/svelte";
import TimeInput from "./TimeInput.svelte";

describe("TimeInput", () => {
  it("renders minutes and seconds inputs", () => {
    render(TimeInput, { props: { minutes: 5, seconds: 30 } });
    const mins = screen.getByTestId("minutes-input") as HTMLInputElement;
    const secs = screen.getByTestId("seconds-input") as HTMLInputElement;
    expect(mins.value).toBe("5");
    expect(secs.value).toBe("30");
  });

  it("disables inputs when disabled prop is true", () => {
    render(TimeInput, { props: { minutes: 5, seconds: 0, disabled: true } });
    expect(screen.getByTestId("minutes-input")).toHaveProperty("disabled", true);
    expect(screen.getByTestId("seconds-input")).toHaveProperty("disabled", true);
  });

  it("has min/max attributes for minutes (0-60)", () => {
    render(TimeInput, { props: { minutes: 5, seconds: 0 } });
    const mins = screen.getByTestId("minutes-input") as HTMLInputElement;
    expect(mins.min).toBe("0");
    expect(mins.max).toBe("60");
  });

  it("has min/max attributes for seconds (0-59)", () => {
    render(TimeInput, { props: { minutes: 5, seconds: 0 } });
    const secs = screen.getByTestId("seconds-input") as HTMLInputElement;
    expect(secs.min).toBe("0");
    expect(secs.max).toBe("59");
  });

  it("renders preset buttons", () => {
    render(TimeInput, { props: { minutes: 5, seconds: 0 } });
    expect(screen.getByTestId("btn-plus-1")).toBeTruthy();
    expect(screen.getByTestId("btn-plus-5")).toBeTruthy();
    expect(screen.getByTestId("btn-plus-10")).toBeTruthy();
    expect(screen.getByTestId("btn-minus-1")).toBeTruthy();
    expect(screen.getByTestId("btn-minus-5")).toBeTruthy();
    expect(screen.getByTestId("btn-minus-10")).toBeTruthy();
  });

  it("disables preset buttons when disabled", () => {
    render(TimeInput, { props: { minutes: 5, seconds: 0, disabled: true } });
    expect(screen.getByTestId("btn-plus-1")).toHaveProperty("disabled", true);
    expect(screen.getByTestId("btn-minus-1")).toHaveProperty("disabled", true);
  });
});
