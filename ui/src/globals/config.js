import { CONFIG_DEFAULTS } from './defaults/config';

export const CONFIG = window.ModularContentConfig || CONFIG_DEFAULTS;
export const FIELDS_CONFIG = CONFIG.fields || {};
export const IMAGE_CONFIG = FIELDS_CONFIG.image || null;
