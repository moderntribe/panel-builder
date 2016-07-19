import { CONFIG_DEFAULTS } from './defaults/config';

export const CONFIG = window.ModularContentConfig || CONFIG_DEFAULTS;
export const CSS_FILE = CONFIG.css_file || '';

export const MODULAR_CONTENT = window.ModularContent || CONFIG_DEFAULTS;
export const BLUEPRINTS = MODULAR_CONTENT.blueprint;
export const BLUEPRINT_TYPES = BLUEPRINTS.types;
export const BLUEPRINT_CATEGORIES = BLUEPRINTS.categories;
export const ADMIN_CACHE = MODULAR_CONTENT.cache;
export const PANELS = MODULAR_CONTENT.panels;
export const TEMPLATES = MODULAR_CONTENT.templates;
export const TEMPLATE_SAVER = MODULAR_CONTENT.template_saver;

export const mediaButtonsHTML = MODULAR_CONTENT.media_buttons_html;
export const previewUrl = MODULAR_CONTENT.preview_url;

export const POST_LIST_CONFIG = CONFIG_DEFAULTS.fields.post_list;
