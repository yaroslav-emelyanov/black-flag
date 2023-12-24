import { createEvent, restore } from "effector";
import { Flags, createFlags } from ".";

describe("create-flags", () => {
  describe("enabled", () => {
    test("should return enabled by key", () => {
      const changedFlags = createEvent<Flags<{ "submit-button": "" }>>();

      const $flags = restore(changedFlags, {
        "submit-button": { enabled: true, variant: "" },
      });

      const { enabled } = createFlags({ source: $flags });

      const $enabled = enabled("submit-button");

      expect($enabled.getState()).toBeTruthy();
      changedFlags({ "submit-button": { enabled: false, variant: "" } });

      expect($enabled.getState()).toBeFalsy();
    });
  });

  describe("variant", () => {
    test("should return variant by key", () => {
      const changedFlags = createEvent<Flags<{ text: "ru" | "en" }>>();

      const $flags = restore(changedFlags, {
        text: { enabled: true, variant: "ru" },
      });

      const { variant } = createFlags({ source: $flags });

      const $variant = variant("text");

      expect($variant.getState()).toBe("ru");

      changedFlags({ text: { enabled: true, variant: "en" } });
      expect($variant.getState()).toBe("en");

      changedFlags({ text: { enabled: false, variant: "en" } });
      expect($variant.getState()).toBe("__otherwise");
    });
  });

  describe("flag", () => {
    test("should return flag by key", () => {
      const changedFlags = createEvent<Flags<{ text: "ru" | "en" }>>();

      const $flags = restore(changedFlags, {
        text: { enabled: true, variant: "ru" },
      });

      const { flag } = createFlags({ source: $flags });

      const $flag = flag("text");

      expect($flag.getState()).toEqual({ enabled: true, variant: "ru" });

      changedFlags({ text: { enabled: true, variant: "en" } });
      expect($flag.getState()).toEqual({ enabled: true, variant: "en" });
    });

    test("should not trigger if there is not changes", () => {
      const changedFlags = createEvent<Flags<{ text: "ru" | "en" }>>();

      const $flags = restore(changedFlags, {
        text: { enabled: true, variant: "ru" },
      });

      const { flag } = createFlags({ source: $flags });

      const onChangeMock = jest.fn();

      flag("text").watch(onChangeMock);

      expect(onChangeMock).toHaveBeenCalledTimes(1);

      changedFlags({ text: { enabled: true, variant: "ru" } });
      expect(onChangeMock).toHaveBeenCalledTimes(1);

      changedFlags({ text: { enabled: false, variant: "ru" } });
      expect(onChangeMock).toHaveBeenCalledTimes(2);
    });
  });
});
