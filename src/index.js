import { MODULE_ID, MySettings } from './constants';
import { registerAppearanceSettings, registerSettings } from './settings';
import CelebrateButtons from './view/CelebrateButtons.svelte';
import { Confetti } from './classes/Confetti';
import { writable } from 'svelte/store';

export const cooldownStore = writable(false);

Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
  registerPackageDebugFlag(MODULE_ID);
});

Hooks.once('init', async () => {
  registerSettings();
  registerAppearanceSettings();
});

Hooks.on('renderChatLog', (app, html) => {
  const gmOnly = game.settings.get(MODULE_ID, MySettings.GmOnly);
  const showButton = game.settings.get(MODULE_ID, MySettings.ShowButton);

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
  console.log('Celebrate | Ready');
});
