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

  it("renders preset chips", () => {
    render(TimeInput, { props: { minutes: 5, seconds: 0 } });
    expect(screen.getByTestId("preset-5")).toBeTruthy();
    expect(screen.getByTestId("preset-10")).toBeTruthy();
    expect(screen.getByTestId("preset-15")).toBeTruthy();
    expect(screen.getByTestId("preset-25")).toBeTruthy();
  });

  it("disables preset chips when disabled", () => {
    render(TimeInput, { props: { minutes: 5, seconds: 0, disabled: true } });
    expect(screen.getByTestId("preset-5")).toHaveProperty("disabled", true);
    expect(screen.getByTestId("preset-10")).toHaveProperty("disabled", true);
  });

  it("highlights selected preset chip", () => {
    render(TimeInput, { props: { minutes: 10, seconds: 0 } });
    const chip10 = screen.getByTestId("preset-10");
    const chip5 = screen.getByTestId("preset-5");
    expect(chip10.classList.contains("selected")).toBe(true);
    expect(chip5.classList.contains("selected")).toBe(false);
  });

  it("calls onchange when preset chip clicked", async () => {
    const onchange = vi.fn();
    render(TimeInput, { props: { minutes: 5, seconds: 0, onchange } });
    await fireEvent.click(screen.getByTestId("preset-15"));
    expect(onchange).toHaveBeenCalledWith(15, 0);
  });
});
