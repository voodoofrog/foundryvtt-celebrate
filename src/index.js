import { MODULE_ID, MySettings, MODULE_ABBREV } from './constants';
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
  try {
    window.Ardittristan.ColorSetting.tester;
  } catch {
    ui.notifications.notify(
      'Please make sure you have the "lib - ColorSettings" module installed and enabled.',
      'error',
    );
  }

  new window.Ardittristan.ColorSetting(MODULE_ID, MySettings.ConfettiColorBase, {
    name: `${MODULE_ABBREV}.settings.${MySettings.ConfettiColorBase}.Name`,
    hint: `${MODULE_ABBREV}.settings.${MySettings.ConfettiColorBase}.Hint`,
    label: 'Color Picker',
    restricted: false,
    defaultColor: '#000000ff',
    scope: 'client',
    insertAfter: `${MODULE_ID}.${MySettings.AllowOtherConfettiDeviation}`,
  });

  new Confetti();
  console.log('Celebrate | Ready');
});
