import { CONFETTI_STRENGTH, CONFETTI_STYLES, MODULE_ID, SETTINGS, CONFETTI_TEXTURES } from './constants';
import { registerAppearanceSettings, registerSettings } from './settings';
import CelebrateButtons from './view/CelebrateButtons.svelte';
import { Confetti } from './classes/Confetti';

const getFoundryMajorVer = () => Number(game?.version?.split('.')?.[0]);
const getGmOnly = () => game.settings.get(MODULE_ID, SETTINGS.GM_ONLY);
const getShowButton = () => game.settings.get(MODULE_ID, SETTINGS.SHOW_BUTTONS);

Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
  registerPackageDebugFlag(MODULE_ID);
});

Hooks.once('init', async () => {
  registerSettings();
  registerAppearanceSettings();
});

Hooks.on('renderChatLog', (app, html) => {
  if (getFoundryMajorVer() < 13) {
    if (getShowButton()) {
      if (!getGmOnly() || game.user.isGM) {
        const chatForm = html.find('#chat-form');
        const btnContainer = document.createElement('div');
        btnContainer.className = 'flex0';
        chatForm.after(btnContainer);
        new CelebrateButtons({ target: btnContainer });
      }
    }
  }
});

Hooks.on('renderPlayers', () => {
  if (getFoundryMajorVer() >= 13) {
    if (getShowButton()) {
      if (!getGmOnly || game.user.isGM) {
        const playerList = document.querySelector('#players');
        const btnContainer = document.createElement('aside');
        playerList.after(btnContainer);
        new CelebrateButtons({ target: btnContainer, props: { v13: true } });
      }
    }
  }
});

Hooks.once('ready', () => {
  new Confetti();

  const api = {
    confettiStrength: CONFETTI_STRENGTH,
    confettiStyles: Object.values(CONFETTI_STYLES).reduce((acc, style) => ({ ...acc, [style.key]: style.key }), {}),
    confettiTextures: Object.values(CONFETTI_TEXTURES).reduce(
      (acc, texture) => ({ ...acc, [texture.key]: texture.key }),
      {}
    ),
    getShootConfettiProps: Confetti.getShootConfettiProps,
    handleShootConfetti: Confetti.instance.handleShootConfetti.bind(Confetti.instance),
    shootConfetti: Confetti.instance.shootConfetti.bind(Confetti.instance),
    registerTexture: Confetti.instance.registerTexture.bind(Confetti.instance),
    unregisterTexture: Confetti.instance.unregisterTexture.bind(Confetti.instance)
  };

  Object.freeze(api);
  game.modules.get(MODULE_ID).api = api;

  console.log('Celebrate | Ready');
  Hooks.callAll(`celebrateApiReady`, api);
});
