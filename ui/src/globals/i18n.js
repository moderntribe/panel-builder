import { I18N_DEFAULTS } from './defaults/i18n';

export const I18N = window.ModularContentI18n || I18N_DEFAULTS;
export const FIELDS_I18N = I18N.fields || {};
export const IMAGE_I18N = FIELDS_I18N.image || {};
export const IMAGE_GALLERY_I18N = FIELDS_I18N.image_gallery || {};

console.log("I18N",I18N)
console.log("window.ModularContentI18n",window.ModularContentI18n)
console.log("I18N_DEFAULTS",I18N_DEFAULTS)
