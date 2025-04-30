# Celebrate

![Latest Release Download Count](https://img.shields.io/badge/dynamic/json?label=Downloads@latest&query=assets%5B1%5D.download_count&url=https%3A%2F%2Fapi.github.com%2Frepos%2Fvoodoofrog%2Ffoundryvtt-celebrate%2Freleases%2Flatest)
![Foundry Core Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fvoodoofrog%2Ffoundryvtt-celebrate%2Fmain%2Fpublic%2Fmodule.json&label=Foundry%20Version&query=$.compatibility.maximum&colorB=orange)

## Celebrate the good times!

This module lets you shoot confetti with either some handy-dandy buttons on the chat sidebar or via provided macros. You can configure the style and color choices of your confetti and these changes will be shown to other players when you fire! Also, if needed, you can change some settings to prevent certain effects from being displayed, see below for more details.

## Installation

Module JSON:

`https://github.com/voodoofrog/foundryvtt-celebrate/releases/latest/download/module.json`

## Screenshots

![Demonstration of the Confetti.](screenshot.png)

## Configuration

### Base

| **Name**                            | Description                                                                                                       |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Confetti Appearance                 | Change your confetti appearance.                                                                                  |
| GM Only                             | [WORLD SETTING] If your players are abusing the confetti, enable this and prevent them shooting it.               |
| Fire Rate Limit (Seconds)           | [WORLD SETTING] Starts a cooldown after each shot. Highly recommended!                                            |
| Confetti Multiplier                 | Multiplies the amount of confetti pieces fired. Set this high at your own peril!                                  |
| Show Buttons                        | Disable if you are only interested in using it from macros/modules and/or the buttons conflict with other things. |
| Sound Volume                        | Sets the volume for the confetti firing sounds.                                                                   |
| High Intensity Sound                | [WORLD SETTING] Sets the sound file for the high intensity confetti.                                              |
| Medium Intensity Sound              | [WORLD SETTING] Sets the sound file for the medium intensity confetti.                                            |
| Low Intensity Sound                 | [WORLD SETTING] Sets the sound file for the low intensity confetti.                                               |
| Show Other Players Confetti Scale   | Tick if you want to see the confetti from other players scaled by their settings.                                 |
| Show Other Players Glitter Strength | Tick if you want to see the glitter confetti from other players at their chosen strength.                         |

### Confetti Appearance

| **Name**              | Description                                           |
| --------------------- | ----------------------------------------------------- |
| Confetti Texture      | Classic: Classic rectangle.                           |
|                       | Circle                                                |
|                       | Crescent                                              |
|                       | Lightning Bolt                                        |
|                       | Music Note                                            |
|                       | Skull                                                 |
|                       | Star                                                  |
|                       | Tree                                                  |
| Confetti Style Choice | Default: Multi colored confetti.                      |
|                       | Base Color: Confetti with the chosen color below.     |
|                       | Glitter: Sparkly color cycling confetti.              |
|                       | Base Glitter: Glitter derived from the base color.    |
| Confetti Color Base   | Confetti will be colored with this as the base color. |
| Glitter Strength      | How glittery you want your confetti glitter to be.    |
| Confetti Scale        | How big you want your confetti pieces to be.          |

## Compatibility

No known issues at this time, but if you spot any be sure to report it.

## API

After the hook `celebrateApiReady` is fired (the hook itself also passes the api in the first argument), the following api methods are expected to be on `game.modules.get('celebrate').api`:

### `confettiStrength`

a javascript object:

```js
const confettiStrength = {
  low: 0,
  med: 1,
  high: 2,
};
```

### `confettiStyles`

a javascript object:

```js
const confettiStyles = {
  default: 'default',
  base: 'base',
  glitter: 'glitter',
  baseGlitter: 'baseGlitter',
};
```

### `confettiTextures`

a javascript object:

```js
const confettiTextures = {
  classic: 'classic',
  circle: 'circle',
  crescent: 'crescent',
  skull: 'skull',
  star: 'star',
};
```

### `getShootConfettiProps(strength: (0 | 1 | 2), options?: {style?, scale?, color?, glitterStr?, texture?})`

Returns the properties that `handleShootConfetti` and `shootConfetti` use based on the strength and optional parameters you feed it.

### `handleShootConfetti({ amount, ...shootConfettiProps }: ShootConfettiProps)`

Makes the appropriate amount of confetti fire on only the current user's screen.

### `shootConfetti(shootConfettiProps: ShootConfettiProps)`

Makes the appropriate amount of confetti fire on all clients' screens.

### Example:

```js
let celebrateApi;

Hooks.once('celebrateApiReady', (api) => {
  celebrateApi = api;
});

function makeConfetti(isSecretCelebration) {
  const strength = celebrateApi.confettiStrength.low;
  const shootConfettiProps = celebrateApi.getShootConfettiProps(strength);
  const glitterStyle = celebrateApi.confettiStyles.baseGlitter;
  const fancyConfettiProps = celebrateApi.getShootConfettiProps(strength, {
    style: glitterStyle,
    scale: 0.5,
    color: '#ff0000',
    glitterStr: 255,
    texture: 'star'
  });

  if (isSecretCelebration) {
    // I only want this to happen on my user's screen
    celebrateApi.handleShootConfetti(shootConfettiProps);
  } else {
    // I want confetti on all connected users' screens
    celebrateApi.shootConfetti(fancyConfettiProps);
  }
}
```

## Known Issues

- Spamming the confetti buttons could cause serious slow down or crashes. That's what the Fire Limit is for.
- If you set the Confetti Multiplier to max, things could get dicey, but it largely depends on your machine.
- You must have an active scene in order to see the confetti.

## Acknowledgements

Default sound effects from [Zapsplat.com](https://www.zapsplat.com/).

This was originally forked from [Confetti](https://github.com/ElfFriend-DnD/foundryvtt-confetti) by ElfFriend-DnD, so big thanks to him for letting me continue his work and for making it in the first place.

The template used to bootstrap this module is [template-svelte-esm](https://github.com/typhonjs-fvtt-demo/template-svelte-esm) by TyphonJs who also provided some help.
