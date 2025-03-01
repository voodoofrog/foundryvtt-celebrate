import { SvelteApplication } from '#runtime/svelte/application';
import { localize } from '#runtime/util/i18n';
import { MODULE_ID } from '../constants';
import EditAppearanceShell from '../view/EditAppearanceShell.svelte';

export class EditAppearance extends SvelteApplication {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: `${MODULE_ID}-edit-appearance`,
      classes: [MODULE_ID],
      resizable: true,
      minimizable: true,
      title: localize(`${MODULE_ID}.settings.appearance.windowTitle`),
      width: 500,
      height: 'auto',
      svelte: {
        class: EditAppearanceShell,
        target: document.body
      }
    });
  }
}
