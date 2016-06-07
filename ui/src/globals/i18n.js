import { I18N_DEFAULTS } from './defaults/i18n';

export const I18N = window.ModularContentI18n || I18N_DEFAULTS;
export const UI_I18N = I18N.ui || {};
export const FIELDS_I18N = I18N.fields || {};
export const IMAGE_I18N = FIELDS_I18N.image || {};
export const QUACKER_I18N = FIELDS_I18N.quacker || {};
export const POST_LIST_I18N = FIELDS_I18N.post_list || {};
export const TEXTAREA_I18N = FIELDS_I18N.textarea || {};
