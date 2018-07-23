import { CONFIG_DEFAULTS } from './defaults/config';

export const CONFIG = window.ModularContentConfig || CONFIG_DEFAULTS;
export const PERMISSIONS = CONFIG.permissions ? Object.assign({}, CONFIG_DEFAULTS.permissions, CONFIG.permissions) : CONFIG_DEFAULTS.permissions;
export const URL_CONFIG = CONFIG.url_config || {};
export const STYLE_FAMILIES = CONFIG.style_families || {};
export const CSS_FILE = CONFIG.css_file || '';
export const IFRAME_SCROLL_OFFSET = CONFIG.iframe_scroll_offset || '';
export const AUTOSAVE_AJAX_ENDPOINT = CONFIG.autosave_ajax_endpoint || '';

export const MODULAR_CONTENT = window.ModularContent || CONFIG_DEFAULTS;
export const BLUEPRINTS = MODULAR_CONTENT.blueprint;
export const BLUEPRINT_TYPES = BLUEPRINTS.types;
export const BLUEPRINT_CATEGORIES = BLUEPRINTS.categories || [];
export const ADMIN_CACHE = MODULAR_CONTENT.cache;
export const PANELS = MODULAR_CONTENT.panels;
export const TEMPLATES = MODULAR_CONTENT.templates;
export const TEMPLATE_SAVER = MODULAR_CONTENT.template_saver;

CONFIG.icon_libraries = {};
export const ICON_LIBRARIES = CONFIG.icon_libraries;
export const ICONS_AJAX_ACTION = CONFIG.icons_ajax_action || '';

export const mediaButtonsHTML = MODULAR_CONTENT.media_buttons_html;
export const previewUrl = MODULAR_CONTENT.preview_url;

export const POST_LIST_CONFIG = CONFIG_DEFAULTS.fields.post_list;
