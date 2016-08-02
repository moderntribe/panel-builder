import { CSS_FILE, BLUEPRINT_TYPES } from '../../globals/config';
import { UI_I18N } from '../../globals/i18n';

let iframeEl;
let styles;
let collection;

export const createMask = (type = '') => {
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

const injectCSS = () => {
	const appCSS = iframeEl.createElement('link');
	appCSS.href = CSS_FILE;
	appCSS.rel = 'stylesheet';
	appCSS.type = 'text/css';
	iframeEl.body.appendChild(appCSS);
};

const injectLockMask = () => {
	iframeEl.body.classList.add('modular-content-live-preview');
};

const addClasses = () => {
	collection.insertAdjacentHTML('afterend', `<div class="${styles.iframeLock} modular-content-iframe-lock"></div>`);
};

export const setupIframe = (iframe = null, panelCollection, collectionStyles = {}) => {
	if (!iframe) {
		return;
	}

	iframeEl = iframe;
	styles = collectionStyles;
	collection = panelCollection;

	injectCSS();
	injectLockMask();
	addClasses();
};
