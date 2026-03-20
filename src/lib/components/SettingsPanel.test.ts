import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/svelte";
import SettingsPanel from "./SettingsPanel.svelte";
import { DEFAULT_SETTINGS } from "../types";

describe("SettingsPanel", () => {
  it("renders all setting fields", () => {
    render(SettingsPanel, { props: { settings: DEFAULT_SETTINGS } });
    expect(screen.getByTestId("default-minutes")).toBeTruthy();
    expect(screen.getByTestId("default-seconds")).toBeTruthy();
    expect(screen.getByTestId("window-width")).toBeTruthy();
    expect(screen.getByTestId("window-height")).toBeTruthy();
    expect(screen.getByTestId("hotkey-input")).toBeTruthy();
    expect(screen.getByTestId("sound-toggle")).toBeTruthy();
  });

  it("loads initial values from settings", () => {
    render(SettingsPanel, { props: { settings: DEFAULT_SETTINGS } });
    const mins = screen.getByTestId("default-minutes") as HTMLInputElement;
    expect(mins.value).toBe("5");
  });

  it("renders Save and Cancel buttons", () => {
    render(SettingsPanel, { props: { settings: DEFAULT_SETTINGS } });
    expect(screen.getByTestId("save-btn")).toBeTruthy();
    expect(screen.getByTestId("cancel-btn")).toBeTruthy();
  });

  it("calls onsave when Save clicked", async () => {
    const onsave = vi.fn();
    render(SettingsPanel, { props: { settings: DEFAULT_SETTINGS, onsave } });
    await fireEvent.click(screen.getByTestId("save-btn"));
    expect(onsave).toHaveBeenCalledOnce();
  });

  it("calls oncancel when Cancel clicked", async () => {
    const oncancel = vi.fn();
    render(SettingsPanel, { props: { settings: DEFAULT_SETTINGS, oncancel } });
    await fireEvent.click(screen.getByTestId("cancel-btn"));
    expect(oncancel).toHaveBeenCalledOnce();
  });
});
