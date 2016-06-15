import { I18N_DEFAULTS } from './defaults/i18n';

export const I18N = window.ModularContentI18n || I18N_DEFAULTS;
export const UI_I18N = I18N.ui || {};
export const FIELDS_I18N = I18N.fields || {};
export const REPEATER_I18N = FIELDS_I18N.repeater || {};
