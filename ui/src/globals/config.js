import { CONFIG_DEFAULTS } from './defaults/config';

export const CONFIG = window.ModularContentConfig || CONFIG_DEFAULTS;
export const URL_CONFIG = CONFIG.url_config || {};
// todo: when Jonathan adds in the defaults at the php level we can avoid this defaults merge
export const PERMISSIONS = CONFIG.permissions ? Object.assign({}, CONFIG_DEFAULTS.permissions, CONFIG.permissions) : CONFIG_DEFAULTS.permissions;
export const CSS_FILE = CONFIG.css_file || '';
export const IFRAME_SCROLL_OFFSET = CONFIG.iframe_scroll_offset || '';

export const MODULAR_CONTENT = window.ModularContent || CONFIG_DEFAULTS;
export const BLUEPRINTS = MODULAR_CONTENT.blueprint;
export const BLUEPRINT_TYPES = BLUEPRINTS.types;
export const BLUEPRINT_CATEGORIES = BLUEPRINTS.categories || [];
export const ADMIN_CACHE = MODULAR_CONTENT.cache;
export const PANELS = MODULAR_CONTENT.panels;
export const TEMPLATES = MODULAR_CONTENT.templates;
export const TEMPLATE_SAVER = MODULAR_CONTENT.template_saver;

export const mediaButtonsHTML = MODULAR_CONTENT.media_buttons_html;
export const previewUrl = MODULAR_CONTENT.preview_url;

export const POST_LIST_CONFIG = CONFIG_DEFAULTS.fields.post_list;
