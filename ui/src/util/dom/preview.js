import { CSS_FILE, BLUEPRINT_TYPES } from '../../globals/config';
import { UI_I18N } from '../../globals/i18n';

export const createMask = (type = '', styles = {}) => {
	const label = _.find(BLUEPRINT_TYPES, { type }) ? _.find(BLUEPRINT_TYPES, { type }).label : '';

	return `
			<div class="${styles.mask}">
				<header class="${styles.maskHeader}">
					<span class="${styles.maskLabel}">
						<span class="${styles.maskEdit}">${UI_I18N['heading.edit_type']}</span><span class="${styles.maskEditing}">${UI_I18N['heading.editing_type']}</span> ${label}
					</span>
					<button class="${styles.maskButton} ${styles.maskButtonUp}">
						<span data-tooltip class="${styles.tooltip}">${UI_I18N['tooltip.panel_up']}</span>
					</button>
					<button class="${styles.maskButton} ${styles.maskButtonDown}">
						<span data-tooltip class="${styles.tooltip}">${UI_I18N['tooltip.panel_down']}</span>
					</button>
					<button class="${styles.maskButton} ${styles.maskButtonDelete}">
						<span data-tooltip class="${styles.tooltip}">${UI_I18N['tooltip.delete_panel']}</span>
					</button>
				</header>
				<div class="${styles.maskTop} ${styles.maskAdd}">
					<button class="${styles.maskButtonAdd} ${styles.addPanelAbove}">
						<span data-tooltip class="${styles.tooltip}">${UI_I18N['tooltip.add_above']}</span>
					</button>
				</div>
				<div class="${styles.maskBottom} ${styles.maskAdd}">
					<button class="${styles.maskButtonAdd} ${styles.addPanelBelow}">
						<span data-tooltip class="${styles.tooltip}">${UI_I18N['tooltip.add_below']}</span>
					</button>
				</div>
			</div>
		`;
};

export const injectCSS = (iframe = null) => {
	if (!iframe) {
		return;
	}

	const appCSS = iframe.createElement('link');
	appCSS.href = CSS_FILE;
	appCSS.rel = 'stylesheet';
	appCSS.type = 'text/css';
	iframe.body.appendChild(appCSS);
};
