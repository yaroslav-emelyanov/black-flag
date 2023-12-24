# black-flags

🏴‍☠️ Create feature flags stores using effector.

## Install

```sh
npm install black-flags
# or
pnpm add black-flags
```

## Basic usage

```tsx
import { createEvent, restore } from "effector";
import { createFlags, Flags } from "black-flags";

type FeatureFlags = Flags<{
  button: "text" | "icon";
}>;

const changedFlags = createEvent<FeatureFlags>();

const $flags = restore(changedFlags, {});

const { enabled, flag, variant } = createFlags({ source: $flags });

enabled("button"); // => Store<boolean>'

variant("button"); // => Store<'text' | 'icon' | '__otherwise'>

flag("button"); // => Store<Flag<'text' | 'icon' | '__otherwise'>>
```

## Features

- check enabling features
- get flag information
- get feature variants
- can connect to any "feature toggle" libraries

## Examples of combination with other libraries

### @effector/reflect

```tsx
import { createFlags, Flags } from "black-flags";
import { variant } from "@effector/reflect";
import { createStore } from "effector";

const $flags = createStore<Flags<{ button: "text" | "icon" }>>({});

const flags = createFlags({ source: $flags });

const TextButton = () => <button>approve</button>;
const IconButton = () => <button>✔️</button>;
```

```ts
const Button = variant({
  source: flags.variant("button"),
  cases: {
    text: TextButton,
    icon: IconButton,
  },
});
```

or

```ts
const Button = variant({
  if: flags.enabled("button"),
  then: TextButton,
});
```

### patronum

```ts
import { createFlags, Flags } from "black-flags";
import { createStore } from "effector";
import { either } from "patronum";

const $flags = createStore<Flags<{ dataFormat: "" }>>({});

const flags = createFlags({ source: $flags });

const oldData = createStore(null);
const newData = createStore(null);

const data = either(flags.enabled("dataFormat"), newData, oldData);
```

### effector

```ts
import { createFlags, Flag, Flags } from "black-flag";
import { createStore, createEffect, attach } from "effector";

type FeatureFlags = Flags<{ translation: "ru" | "en" }>;

const $flags = createStore<FeatureFlags>({});

const flags = createFlags({ source: $flags });

const getTranslationFx = createEffect<Flag<"ru" | "en" | "__otherwise">, void>(
  (flag) => {
    if (flag.enabled) {
      switch (flag.variant) {
        case "ru": {
          // ...
          break;
        }
        case "en": {
          // ...
          break;
        }
        case "__otherwise": {
          // ...
        }
      }
    } else {
      // default logic
    }
  },
);

const getTranslationWithFeatureToggleFx = attach({
  source: flags.flag("translation"),
  effect: getTranslationFx,
});
```
