# Celebrate

![Latest Release Download Count](https://img.shields.io/badge/dynamic/json?label=Downloads@latest&query=assets%5B1%5D.download_count&url=https%3A%2F%2Fapi.github.com%2Frepos%2Fvoodoofrog%2Ffoundryvtt-celebrate%2Freleases%2Flatest)
![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fcelebrate&colorB=4aa94a)
![Foundry Core Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fvoodoofrog%2Ffoundryvtt-celebrate%2Fmain%2Fpublic%2Fmodule.json&label=Foundry%20Version&query=$.compatibility.minimum&colorB=orange)

Celebrate the good times! This module lets you shoot confetti with either some handy-dandy buttons on the chat sidebar or via provided macros. You can also configure the style and colour choices of your confetti which will be synced to other players. Note that settings like scale, multipliers, or glitter colour cycle deviations will _not_ be synced for the comfort of other players.

## Installation

Module JSON:

```
https://github.com/voodoofrog/foundryvtt-celebrate/releases/latest/download/module.json
```

## Screenshots

![Demonstration of the Confetti.](screenshot.png)

## Configuration

| **Name**                  | Description                                                                                                       |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| GM Only                   | [WORLD SETTING] If your players are abusing the confetti, enable this and prevent them shooting it.               |
| Confetti Multiplier       | Multiplies the amount of confetti pieces fired. Set this high at your own peril!                                  |
| Confetti Scale            | How big you want your confetti pieces to be.                                                                      |
| Confetti Colour Base      | Confetti will be coloured with this as the base colour.                                                           |
| Confetti Style Choice     | Default: Multi coloured confetti.                                                                                 |
|                           | Base Colour: Confetti with the chosen colour above.                                                               |
|                           | Glitter: Sparkly colour cycling confetti.                                                                         |
|                           | Base Glitter: Glitter derived from the base colour.                                                               |
| Glitter Colour Deviation  | How much deviation from the starting colour you want when the glitter pieces are colour cycled.                   |
| Mute                      | Mutes the sound. Silence is golden?                                                                               |
| Fire Rate Limit (Seconds) | [WORLD SETTING] Starts a cooldown after each shot. Highly recommended!                                            |
| Show Button               | Disable if you are only interested in using it from macros/modules and/or the button conflicts with other things. |

## Compatibility

No known issues at this time, but if you spot any be sure to report it.

## API

After the hook `celebrateReady` is fired, the following api methods are expected to be on `window.confetti`:

### `confettiStrength`

a javascript object:

```js
const ConfettiStrength = {
  low: 0,
  med: 1,
  high: 2,
};
```

### `getShootConfettiProps(strength: (1 | 2 | 3))`

Returns the properties that `handleShootConfetti` and `shootConfetti` use based on the strength you feed it.

### `handleShootConfetti({ amount, ...shootConfettiProps }: ShootConfettiProps)`

Makes the appropriate amount of confetti fire on only the current user's screen.

### `Confetti.shootConfetti(shootConfettiProps: ShootConfettiProps)`

Makes the appropriate amount of confetti fire on all clients' screens.

### Example:

```js
function makeConfetti() {
  const strength = window.confetti.confettiStrength.low;
  const shootConfettiProps = window.confetti.getShootConfettiProps(strength);

  if (isSecretCelebration) {
    // I only want this to happen on my user's screen
    window.confetti.handleShootConfetti(shootConfettiProps);
  } else {
    // I want confetti on all connected users' screens
    window.confetti.shootConfetti(shootConfettiProps);
  }
}
```

## Known Issues

- Spamming the confetti buttons could cause serious slow down or crashes. That's what the Fire Limit is for.
- If you set the Confetti Multiplier to max, things could get dicey, but it largely depends on your machine.

## Acknowledgements

Sound Effects from [Zapsplat.com](https://www.zapsplat.com/).

This was originally forked from [Confetti](https://github.com/ElfFriend-DnD/foundryvtt-confetti) by ElfFriend-DnD

The template used to bootstrap this module is [template-svelte-esm](https://github.com/typhonjs-fvtt-demo/template-svelte-esm) by TyphonJs who also provided some help.
