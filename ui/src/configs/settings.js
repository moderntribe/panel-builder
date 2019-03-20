export const PANELS_CONFIG = window.panels_admin_config || {};
export const PANELS_BLUEPRINT = PANELS_CONFIG.blueprint || {};
export const PANEL_TYPES = PANELS_BLUEPRINT.types || [];

export const getPanelType = ( type ) => (
	PANEL_TYPES.filter( ( panelType ) => {
		return panelType.type === type;
	} )[ 0 ] || {}
);
