import { writable } from 'svelte/store';
import { CONFETTI_STRENGTH, CONFETTI_STYLES, MODULE_ID, SETTINGS } from './constants';
import { registerAppearanceSettings, registerSettings } from './settings';
import CelebrateButtons from './view/CelebrateButtons.svelte';
import CelebrateCanvas from './view/CelebrateCanvas.svelte';
import { Confetti } from './classes/Confetti';

export const cooldownStore = writable(false);

Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
  registerPackageDebugFlag(MODULE_ID);
});

Hooks.once('init', async () => {
  registerSettings();
  registerAppearanceSettings();
});

Hooks.on('renderChatLog', (app, html) => {
  const gmOnly = game.settings.get(MODULE_ID, SETTINGS.GM_ONLY);
  const showButton = game.settings.get(MODULE_ID, SETTINGS.SHOW_BUTTONS);

  if (showButton) {
    if (!gmOnly || game.user.isGM) {
      const chatForm = html.find('#chat-form');
      const div = document.createElement('div');
      div.className = 'flex0';
      chatForm.after(div);
      new CelebrateButtons({ target: div });
    }
  }
});

Hooks.once('ready', () => {
  new Confetti();

  new CelebrateCanvas({
    target: document.body,
  });

  const api = {
    confettiStrength: CONFETTI_STRENGTH,
    confettiStyles: Object.values(CONFETTI_STYLES).map((style) => style.key), // TODO: make this a mapped object
    getShootConfettiProps: Confetti.getShootConfettiProps,
    handleShootConfetti: Confetti.instance.handleShootConfetti.bind(Confetti.instance),
    shootConfetti: Confetti.instance.shootConfetti.bind(Confetti.instance),
  };

  Object.freeze(api);
  game.modules.get(MODULE_ID).api = api;

  console.log('Celebrate | Ready');
});
