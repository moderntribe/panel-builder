import _ from 'lodash';

import { CSS_FILE, BLUEPRINT_TYPES } from '../../globals/config';
import { UI_I18N } from '../../globals/i18n';
import * as tests from '../tests';

let iframeEl;
let styles;

export const createMask = (type = '') => {
	const label = _.find(BLUEPRINT_TYPES, { type }) ? _.find(BLUEPRINT_TYPES, { type }).label : '';

	return `
			<div class="${styles.mask}">
				<header class="${styles.maskHeaderLeft}">
					<span class="${styles.maskLabel}">
						<span class="${styles.maskEdit}">${UI_I18N['heading.edit_type']}</span><span class="${styles.maskEditing}">${UI_I18N['heading.editing_type']}</span> ${label}
					</span>
				</header>
				<header class="${styles.maskHeaderRight}">
					<button class="${styles.maskButton} ${styles.maskButtonUp}">
						<span data-tooltip class="${styles.tooltip}">
							<span class="${styles.maskScreenReaderText}">${UI_I18N['tooltip.panel_up']}</span>
						</span>
					</button>
					<button class="${styles.maskButton} ${styles.maskButtonDown}">
						<span class="${styles.maskScreenReaderText}">
							<span data-tooltip class="${styles.tooltip}">${UI_I18N['tooltip.panel_down']}</span>
						</span>
					</button>
					<button class="${styles.maskButton} ${styles.maskButtonDelete}">
						<span class="${styles.maskScreenReaderText}">
							<span data-tooltip class="${styles.tooltip}">${UI_I18N['tooltip.delete_panel']}</span>
						</span>
					</button>
				</header>
				<div class="${styles.maskTop} ${styles.maskAdd}">
					<button class="${styles.maskButtonAdd} ${styles.addPanelAbove}">
						<span class="${styles.maskScreenReaderText}">
							<span data-tooltip class="${styles.tooltip}">${UI_I18N['tooltip.add_above']}</span>
						</span>
					</button>
				</div>
				<div class="${styles.maskBottom} ${styles.maskAdd}">
					<button class="${styles.maskButtonAdd} ${styles.addPanelBelow}">
						<span class="${styles.maskScreenReaderText}">
							<span data-tooltip class="${styles.tooltip}">${UI_I18N['tooltip.add_below']}</span>
						</span>
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

const addClasses = () => {
	iframeEl.body.classList.add('modular-content-live-preview');
	if (tests.isHeaderLayout()) {
		iframeEl.body.classList.add('post-type-header_layout');
	} else if (tests.isFooterLayout()) {
		iframeEl.body.classList.add('post-type-footer_layout');
	}
};

export const setupIframe = (iframe = null, collectionStyles = {}) => {
	if (!iframe) {
		return;
	}

	iframeEl = iframe;
	styles = collectionStyles;

	injectCSS();
	addClasses();
};

export const getLiveTextSelector = (data) => {
	let selector = `[data-depth="${data.depth}"][data-name="${data.name}"][data-livetext]`;
	if (_.isNumber(data.childIndex)) {
		selector += ` [data-index="${data.childIndex}"]`;
		selector += `[data-name="${data.childName}"]`;
		selector += '[data-livetext]';
	}
	return selector;
};
