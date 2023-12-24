import { Store, combine } from "effector";

const DEFAULT_VARIANT = "__otherwise";

export type Flag<Variant extends string> = {
  enabled: boolean;
  variant: Variant;
};

export type Flags<Map extends { [key: string]: string }> = {
  [key in keyof Map]?: Flag<Map[key]>;
};

export const createFlags = <Values extends { [key: string]: string }>({
  source: $flags,
}: {
  source: Store<Flags<Values>>;
}) => {
  const enabled = <Key extends keyof Values>(key: Key): Store<boolean> =>
    $flags.map((flags) => Boolean(flags[key]?.enabled));

  const variant = <Key extends keyof Values>(
    key: Key,
  ): Store<Values[Key] | typeof DEFAULT_VARIANT> =>
    $flags.map((flags) => {
      const flag = flags[key];

      if (flag?.enabled) {
        return flag.variant;
      }

      return DEFAULT_VARIANT;
    });

  const flag = <Key extends keyof Values>(key: Key) =>
    combine({ enabled: enabled(key), variant: variant(key) }) as Store<
      Flag<Values[Key] | typeof DEFAULT_VARIANT>
    >;

  return {
    enabled,
    variant,
    flag,
  };
};
