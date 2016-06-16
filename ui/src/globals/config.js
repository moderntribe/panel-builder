import { CONFIG_DEFAULTS } from './defaults/config';

export const CONFIG = window.ModularContentConfig || CONFIG_DEFAULTS;
export const FIELDS_CONFIG = CONFIG.fields || {};

export const MODULAR_CONTENT = window.ModularContent || CONFIG_DEFAULTS;
export const mediaButtonsHTML = MODULAR_CONTENT.media_buttons_html || null;

export const ADMIN_CACHE = CONFIG_DEFAULTS.fields.cache || {};

export const POST_LIST_CONFIG = CONFIG_DEFAULTS.fields.post_list;
