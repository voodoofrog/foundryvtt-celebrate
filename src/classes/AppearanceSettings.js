import { MODULE_ABBREV, MODULE_ID, MySettings, TEMPLATES } from '../constants';

export class AppearanceSettings extends FormApplication {
  static get defaultOptions() {
    const defaults = super.defaultOptions;

    const overrides = {
      closeOnSubmit: true,
      width: 500,
      height: 'auto',
      id: 'confetti-appearance-settings',
      submitOnChange: false,
      template: TEMPLATES.APPEARANCE_SETTINGS,
      title: 'LOCALIZE ME',
      classes: ['sheet'],
    };

    const mergedOptions = foundry.utils.mergeObject(defaults, overrides);

    return mergedOptions;
  }

  // eslint-disable-next-line no-unused-vars
  getData(options) {
    return {
      'confetti-color-base': game.settings.get(MODULE_ID, MySettings.ConfettiColorBase),
      'confetti-style-choice': game.settings.get(MODULE_ID, MySettings.ConfettiStyleChoice),
      'confetti-glitter-deviation': game.settings.get(MODULE_ID, MySettings.ConfettiGlitterDeviation),
      'confetti-scale': game.settings.get(MODULE_ID, MySettings.ConfettiScale),
      style_choices: {
        default: `${MODULE_ABBREV}.settings.${MySettings.ConfettiStyleChoice}.Choices.Default`,
        base: `${MODULE_ABBREV}.settings.${MySettings.ConfettiStyleChoice}.Choices.Base`,
        glitter: `${MODULE_ABBREV}.settings.${MySettings.ConfettiStyleChoice}.Choices.Glitter`,
        baseGlitter: `${MODULE_ABBREV}.settings.${MySettings.ConfettiStyleChoice}.Choices.BaseGlitter`,
      },
    };
  }

  async _updateObject(event, formData) {
    const settings = expandObject(formData);
    Object.keys(settings).forEach((key) => {
      game.settings.set(MODULE_ID, key, settings[key]);
    });
  }
}
