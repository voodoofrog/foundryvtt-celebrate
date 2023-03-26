import { MODULE_ABBREV, MODULE_ID, MySettings, TEMPLATES } from '../constants';
import { log } from '../helpers';
import { Confetti } from './Confetti';

const choiceData = {
  style_choices: {
    default: `${MODULE_ABBREV}.settings.${MySettings.ConfettiStyleChoice}.Choices.Default`,
    base: `${MODULE_ABBREV}.settings.${MySettings.ConfettiStyleChoice}.Choices.Base`,
    glitter: `${MODULE_ABBREV}.settings.${MySettings.ConfettiStyleChoice}.Choices.Glitter`,
    baseGlitter: `${MODULE_ABBREV}.settings.${MySettings.ConfettiStyleChoice}.Choices.BaseGlitter`,
  },
};

export class AppearanceSettings extends FormApplication {
  constructor() {
    super();
    this.tempData = {
      'confetti-color-base': game.settings.get(MODULE_ID, MySettings.ConfettiColorBase),
      'confetti-style-choice': game.settings.get(MODULE_ID, MySettings.ConfettiStyleChoice),
      'confetti-glitter-deviation': game.settings.get(MODULE_ID, MySettings.ConfettiGlitterDeviation),
      'confetti-scale': game.settings.get(MODULE_ID, MySettings.ConfettiScale),
    };
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      closeOnSubmit: false,
      submitOnChange: true,
      width: 500,
      height: 'auto',
      id: 'confetti-appearance-settings',
      template: TEMPLATES.APPEARANCE_SETTINGS,
      title: `${MODULE_ABBREV}.settings.${MySettings.AppearanceMenu}.Title`,
    });
  }

  getData() {
    return { ...this.tempData, ...choiceData };
  }

  async _updateObject(_, formData) {
    const settings = expandObject(formData);

    Object.keys(settings).forEach(async (key) => {
      this.tempData[key] = settings[key];
    });

    this.render();
  }

  async _handleButtonClick(event) {
    const clickedElement = $(event.currentTarget);
    const action = clickedElement.data().action;
    const testFireProps = {
      amount: 200,
      velocity: 3000,
      cStyle: event.delegateTarget[MySettings.ConfettiStyleChoice].value,
      cColor: event.delegateTarget[MySettings.ConfettiColorBase]?.value,
      cScale: event.delegateTarget[MySettings.ConfettiScale]?.value,
      cgDeviation: event.delegateTarget[MySettings.ConfettiGlitterDeviation]?.value,
      strength: 2,
    };

    switch (action) {
      case 'test': {
        Confetti.instance.handleShootConfetti(testFireProps);
        break;
      }
      case 'submit': {
        Object.keys(this.tempData).forEach(async (key) => {
          await game.settings.set(MODULE_ID, key, this.tempData[key]);
        });
        this.close();
        break;
      }
      case 'cancel': {
        this.close();
        break;
      }
      default:
        log(false, 'Invalid action detected', action);
    }
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.on('click', '[data-action]', this._handleButtonClick.bind(this));
  }
}
