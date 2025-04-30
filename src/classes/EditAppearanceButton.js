import { EditAppearance } from './EditAppearance';

export class EditAppearanceButton extends FormApplication {
  static #editAppearance;

  static showSettings() {
    this.#editAppearance = this.#editAppearance ? this.#editAppearance : new EditAppearance();
    this.#editAppearance.render(true, { focus: true });

    return this.#editAppearance;
  }

  /**
   * @inheritDoc
   */
  constructor(options = {}) {
    super({}, options);
    EditAppearanceButton.showSettings();
  }

  // eslint-disable-next-line no-unused-vars
  async _updateObject(event, formData) {}

  render() {
    this.close();
  }
}
