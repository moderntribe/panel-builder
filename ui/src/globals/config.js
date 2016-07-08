import { CONFIG_DEFAULTS } from './defaults/config';

export const CONFIG = window.ModularContentConfig || CONFIG_DEFAULTS;
export const FIELDS_CONFIG = CONFIG.fields || {};

export const MODULAR_CONTENT = window.ModularContent || CONFIG_DEFAULTS;
export const BLUEPRINTS = MODULAR_CONTENT.blueprint;
export const ADMIN_CACHE = MODULAR_CONTENT.cache;
export const PANELS = MODULAR_CONTENT.panels;
export const TEMPLATES = MODULAR_CONTENT.templates;
export const TEMPLATE_SAVER = MODULAR_CONTENT.template_saver;

export const mediaButtonsHTML = MODULAR_CONTENT.media_buttons_html;
export const previewUrl = MODULAR_CONTENT.preview_url;
export const AJAXURL = window.ajaxurl || '';

export const POST_LIST_CONFIG = CONFIG_DEFAULTS.fields.post_list;

export const AJAX_ACTIONS = {
	createPanelSet: 'panel-set-create',
};
