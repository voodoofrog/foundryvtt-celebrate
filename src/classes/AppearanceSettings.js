import { CONFETTI_STYLES, MODULE_ID, SETTINGS, TEMPLATES } from '../constants';
import { log } from '../helpers';
import { Confetti } from './Confetti';

const {
  APPEARANCE: { CONFETTI_COLOR_BASE, CONFETTI_STYLE_CHOICE, CONFETTI_GLITTER_STRENGTH, CONFETTI_SCALE },
} = SETTINGS;

const buildChoiceData = () => {
  const styleObj = {
    style_choices: {},
  };
  Object.keys(CONFETTI_STYLES).forEach((key) => {
    styleObj.style_choices[key] = CONFETTI_STYLES[key].translation;
  });
  return styleObj;
};

export class AppearanceSettings extends FormApplication {
  constructor() {
    super();
    this.tempData = {
      [CONFETTI_COLOR_BASE]: game.settings.get(MODULE_ID, CONFETTI_COLOR_BASE),
      [CONFETTI_STYLE_CHOICE]: game.settings.get(MODULE_ID, CONFETTI_STYLE_CHOICE),
      [CONFETTI_GLITTER_STRENGTH]: game.settings.get(MODULE_ID, CONFETTI_GLITTER_STRENGTH),
      [CONFETTI_SCALE]: game.settings.get(MODULE_ID, CONFETTI_SCALE),
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
      title: `${MODULE_ID}.settings.appearance.windowTitle`,
    });
  }

  getData() {
    return { ...this.tempData, ...buildChoiceData() };
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
      cStyle: event.delegateTarget[CONFETTI_STYLE_CHOICE].value,
      cColor: event.delegateTarget[CONFETTI_COLOR_BASE]?.value,
      cScale: event.delegateTarget[CONFETTI_SCALE]?.value,
      cgDeviation: event.delegateTarget[CONFETTI_GLITTER_STRENGTH]?.value,
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
