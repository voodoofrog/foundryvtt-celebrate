import { MODULE_ID, MySettings } from './constants';
import { registerSettings } from './settings';
import CelebrateButtons from './view/CelebrateButtons.svelte';
import { Confetti } from './classes/Confetti';

Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
  registerPackageDebugFlag(MODULE_ID);
});

Hooks.once('init', async () => {
  registerSettings();
});

Hooks.on('renderChatLog', (app, html) => {
  const showButton = game.settings.get(MODULE_ID, MySettings.ShowButton);
  if (showButton) {
    const chatForm = html.find('#chat-form');
    const div = document.createElement('div');
    div.className = 'flex0';
    chatForm.after(div);
    new CelebrateButtons({ target: div });
  }
});

Hooks.once('ready', () => {
  console.log('Celebrate | Ready');
  new Confetti();
});
