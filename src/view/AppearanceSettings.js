import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application';
import AppearanceSettingsShell from './AppearanceSettingsShell.svelte';

export class AppearanceSettings extends SvelteApplication {
  static settings;

  static async show(options = {}, dialogData = {}) {
    return new Promise((resolve) => {
      options.resolve = resolve;
      new this(options, dialogData).render(true, { focus: true });
    });
  }

  /**
   * Default Application options
   *
   * @returns {object} options - Application options.
   * @see https://foundryvtt.com/api/interfaces/client.ApplicationOptions.html
   */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: 'confetti-appearance-settings',
      resizable: true,
      minimizable: true,
      width: 500,
      height: 320,
      title: 'Confetti Appearance',
      positionOrtho: false,
      transformOrigin: null,

      svelte: {
        class: AppearanceSettingsShell,
        target: document.body,
        props: {
          settings: AppearanceSettings.settings,
        },
      },
    });
  }
}

export default class SettingsShim extends FormApplication {
  /**
   * @inheritDoc
   */
  constructor() {
    super({});
    AppearanceSettings.show();
  }

  // eslint-disable-next-line no-unused-vars
  async _updateObject(event, formData) {}

  render() {
    this.close();
  }
}
