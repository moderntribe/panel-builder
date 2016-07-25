import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import zenscroll from 'zenscroll';
import autobind from 'autobind-decorator';
import classNames from 'classnames';

import Loader from './shared/loader';

import { MODULAR_CONTENT, CSS_FILE, BLUEPRINT_TYPES } from '../globals/config';
import { UI_I18N } from '../globals/i18n';

import { trigger } from '../util/events';
import * as ajax from '../util/ajax';
import * as domTools from '../util/dom/tools';

import styles from './collection-preview.pcss';

class CollectionPreview extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
		};
		this.saving = false;
	}

	componentDidMount() {
		this.iframe = ReactDOM.findDOMNode(this.refs.frame);
		this.bindEvents();
	}

	componentWillUnmount() {
		this.unBindEvents();
	}

	bindEvents() {
		this.iframe.addEventListener('load', this.intializeIframeScripts);
	}

	bindIframeEvents() {
		$(this.panelCollection)
			.off('click mouseover')
			.on('mouseover', `.${styles.maskButtonAdd}, .${styles.maskButton}`, (e) => this.handleButtonMousover(e))
			.on('click', `.${styles.mask}`, (e) => this.handlePanelTriggerClick(e))
			.on('click', `.${styles.maskButtonAdd}`, (e) => this.handlePanelAddClick(e))
			.on('click', `.${styles.maskButtonUp}`, (e) => this.handlePanelUpClick(e))
			.on('click', `.${styles.maskButtonDown}`, (e) => this.handlePanelDownClick(e))
			.on('click', `.${styles.maskButtonDelete}`, (e) => this.handlePanelDeleteClick(e));

		document.addEventListener('modern_tribe/panel_moved', this.handlePanelMoved);
		document.addEventListener('modern_tribe/panel_toggled', this.handlePanelToggled);
		document.addEventListener('modern_tribe/panel_updated', this.handlePanelUpdatedLive);
		document.addEventListener('modern_tribe/panel_updated', _.debounce(this.handlePanelUpdated, 500, true));
		document.addEventListener('modern_tribe/panels_added', this.handlePanelsAdded);
		document.addEventListener('modern_tribe/picker_cancelled', this.cancelPickerInjection);
		document.addEventListener('modern_tribe/delete_panel', this.deletePanelFromPreview);
	}

	unBindEvents() {
		document.removeEventListener('modern_tribe/panel_moved', this.handlePanelMoved);
		document.removeEventListener('modern_tribe/panel_toggled', this.handlePanelToggled);
		document.removeEventListener('modern_tribe/panel_updated', this.handlePanelUpdatedLive);
		document.removeEventListener('modern_tribe/panel_updated', _.debounce(this.handlePanelUpdated, 500, true));
		document.removeEventListener('modern_tribe/panels_added', this.handlePanelsAdded);
		document.removeEventListener('modern_tribe/picker_cancelled', this.cancelPickerInjection);
		document.removeEventListener('modern_tribe/delete_panel', this.deletePanelFromPreview);
	}

	deactivatePanel(panel) {
		panel.classList.remove(styles.active);
		this.activePanelNode = null;
	}

	deactivatePanels() {
		_.forEach(this.panelCollection.querySelectorAll('.panel'), (panel) => this.deactivatePanel(panel));
	}

	scrollToPanel(index) {
		const target = this.panelCollection.querySelectorAll(`.panel[data-index="${index}"]`)[0];
		this.iframeScroller.center(target, 500, 0, () => {
			target.classList.add(styles.active);
			this.activePanelNode = target;
		});
	}

	createPlaceholder() {
		return `
			<div class="${styles.placeholder}">
				<span class="${styles.placeholderMessage}">${UI_I18N['message.panel_placeholder']}</span>
			</div>
		`;
	}

	injectPanelAtPlaceholder(panels, index) {
		const placeholder = this.panelCollection.querySelectorAll(`.${styles.placeholder}`)[0];
		if (!placeholder) {
			return;
		}
		placeholder.insertAdjacentHTML('beforebegin', panels);
		placeholder.parentNode.removeChild(placeholder);
		this.panelCollection.classList.remove(styles.placeholderActive);
		this.initializePanels();
		this.deactivatePanels();
		const panel = this.panelCollection.querySelectorAll(`.${styles.panel}[data-index="${index}"]`)[0];
		panel.classList.add(styles.active);
		this.activePanelNode = panel;
		trigger({
			event: 'modern_tribe/panel_activated',
			native: false,
			data: {
				index,
			},
		});
		this.iframeScroller.center(panel, 500, 0);
	}

	injectUpdatedPanelHtml(panelHtml) {
		this.activePanelNode.insertAdjacentHTML('beforebegin', panelHtml);
		this.activePanelNode = $(this.activePanelNode).prev().get(0);
		this.activePanelNode.parentNode.removeChild($(this.activePanelNode).next().get(0));
		this.initializePanels();
		this.activePanelNode.classList.add(styles.active);
	}

	@autobind
	cancelPickerInjection() {
		if (!this.panelCollection.classList.contains(styles.placeholderActive)) {
			return;
		}

		const placeholder = this.panelCollection.querySelectorAll(`.${styles.placeholder}`)[0];
		this.panelCollection.classList.remove(styles.placeholderActive);
		if (placeholder) {
			placeholder.parentNode.removeChild(placeholder);
		}
	}

	@autobind
	handlePanelMoved(e) {
		const el = this.panelCollection.querySelectorAll(`.${styles.panel}[data-index="${e.detail.oldIndex}"]`)[0];
		const target = this.panelCollection.querySelectorAll(`.${styles.panel}[data-index="${e.detail.newIndex}"]`)[0];
		if (e.detail.newIndex < e.detail.oldIndex) {
			domTools.insertBefore(el, target);
		} else {
			domTools.insertAfter(el, target);
		}
		this.initializePanels();
	}

	@autobind
	handlePanelUpdated(e) {
		if (!this.activePanelNode || this.saving) {
			return;
		}

		if (this.activePanelNode.querySelectorAll(`[data-name="${e.detail.name}"][data-livetext]`)[0]) {
			return;
		}

		this.saving = true;
		this.props.panelsSaving(true);
		this.activePanelNode.classList.add(styles.loadingPanel);

		ajax.getPanelHTML([this.props.panels[e.detail.index]])
			.done((data) => {
				this.injectUpdatedPanelHtml(data.panels);
			})
			.fail(() => {
				this.activePanelNode.classList.remove(styles.loadingPanel);
			})
			.always(() => {
				this.props.panelsSaving(false);
				this.saving = false;
			});
	}

	@autobind
	handlePanelUpdatedLive(e) {
		if (!this.activePanelNode) {
			return;
		}

		const livetextField = this.activePanelNode.querySelectorAll(`[data-name="${e.detail.name}"][data-livetext]`)[0];
		if (livetextField) {
			livetextField.innerHTML = e.detail.value;
		}
	}

	@autobind
	handlePanelTriggerClick(e) {
		if (!e.target.classList.contains(styles.mask) && !e.target.classList.contains(styles.maskAdd)) {
			return;
		}

		const panel = e.currentTarget.parentNode;
		if (panel.classList.contains(styles.active)) {
			return;
		}

		const index = parseInt(panel.getAttribute('data-index'), 10);
		if (isNaN(index)) {
			return;
		}

		this.deactivatePanels();
		panel.classList.add(styles.active);
		this.activePanelNode = panel;
		trigger({
			event: 'modern_tribe/panel_activated',
			native: false,
			data: {
				index,
			},
		});
	}

	handleButtonMousover(e) {
		const tooltip = e.currentTarget.querySelectorAll('[data-tooltip]')[0];
		if (!tooltip) {
			return;
		}
		const width = Math.max(this.iframe.document.documentElement.clientWidth, this.iframe.window.innerWidth || 0);

		if (tooltip.parentNode.classList.contains(styles.maskButton) && width > 768) {
			tooltip.style.marginLeft = `-${tooltip.offsetWidth - 28}px`;
		} else {
			tooltip.style.marginLeft = `-${tooltip.offsetWidth / 2}px`;
		}
	}

	handlePanelAddClick(e) {
		const panel = domTools.closest(e.currentTarget, `.${styles.panel}`);
		const placeholder = this.createPlaceholder();
		const index = parseInt(panel.getAttribute('data-index'), 10);
		const position = e.target.classList.contains(styles.addPanelAbove) ? 'beforebegin' : 'afterend';

		panel.insertAdjacentHTML(position, placeholder);
		this.iframeScroller.center(this.panelCollection.querySelectorAll(`.${styles.placeholder}`)[0], 500, 0);
		this.panelCollection.classList.add(styles.placeholderActive);
		trigger({ event: 'modern_tribe/deactivate_panels', native: false });
		_.delay(() => {
			this.props.spawnPickerAtIndex(index, position);
		}, 150);
	}

	@autobind
	handlePanelsAdded(e) {
		ajax.getPanelHTML(e.detail.panels)
			.done((data) => {
				if (e.detail.index === -1) {
					this.panelCollection.insertAdjacentHTML('beforeend', data.panels);
					this.updateNewPanels();
				} else {
					this.injectPanelAtPlaceholder(data.panels, e.detail.index);
				}
			})
			.fail((err) => {
				console.log(err);
			});
	}

	dispatchSort(panel, oldIndex, newIndex) {
		this.deactivatePanel(panel);
		trigger({ event: 'modern_tribe/deactivate_panels', native: false });
		_.delay(() => {
			this.props.updatePanelOrder({
				oldIndex,
				newIndex,
			});
			this.iframeScroller.center(panel, 500, 0);
		}, 150);
	}

	handlePanelUpClick(e) {
		const panel = domTools.closest(e.currentTarget, `.${styles.panel}`);
		const oldIndex = parseInt(panel.getAttribute('data-index'), 10);
		const newIndex = oldIndex - 1;
		this.dispatchSort(panel, oldIndex, newIndex);
	}

	handlePanelDownClick(e) {
		const panel = domTools.closest(e.currentTarget, `.${styles.panel}`);
		const oldIndex = parseInt(panel.getAttribute('data-index'), 10);
		const newIndex = oldIndex + 1;
		this.dispatchSort(panel, oldIndex, newIndex);
	}

	handlePanelDeleteClick(e) {
		trigger({
			event: 'modern_tribe/open_dialog',
			native: false,
			data: {
				type: 'confirm',
				heading: UI_I18N['message.confirm_delete_panel'],
				data: {
					panelIndex: parseInt(domTools.closest(e.currentTarget, `.${styles.panel}`).getAttribute('data-index'), 10),
				},
				confirmCallback: 'modern_tribe/delete_panel',
			},
		});
	}

	@autobind
	deletePanelFromPreview(e) {
		const el = this.panelCollection.querySelectorAll(`.${styles.panel}[data-index="${e.detail.panelIndex}"]`)[0];
		if (!el) {
			return;
		}
		el.parentNode.removeChild(el);
		this.initializePanels();
	}

	@autobind
	handlePanelToggled(e) {
		if (e.detail.depth === 0) {
			this.deactivatePanels();
		}
		if (e.detail.active) {
			this.scrollToPanel(e.detail.index);
		}
	}

	createMask(type) {
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
	}

	updateNewPanels() {
		let oldPanels = this.panelCollection.querySelectorAll(`.${styles.panel}`).length;
		_.forEach(this.panelCollection.querySelectorAll(`[data-modular-content]:not(.${styles.panel})`), (panel) => {
			this.configurePanel(panel, oldPanels);
			oldPanels++;
		});
	}

	configurePanel(panel, i) {
		panel.setAttribute('data-index', i);
		if (panel.classList.contains(styles.panel)) {
			return;
		}
		panel.classList.add(styles.panel);
		panel.insertAdjacentHTML('beforeend', this.createMask(panel.getAttribute('data-type')));
	}

	injectCSS() {
		const appCSS = this.iframe.document.createElement('link');
		appCSS.href = CSS_FILE;
		appCSS.rel = 'stylesheet';
		appCSS.type = 'text/css';
		this.iframe.document.body.appendChild(appCSS);
	}

	initializePanels() {
		_.forEach(this.panelCollection.querySelectorAll('[data-modular-content]'), (panel, i) => this.configurePanel(panel, i));
	}

	revealIframe() {
		ReactDOM.findDOMNode(this.refs.loader).style.opacity = 0;
		_.delay(() => {
			this.setState({ loading: false });
			this.props.iframeLoaded();
		}, 500);
	}

	@autobind
	intializeIframeScripts() {
		this.iframe.removeEventListener('load', this.intializeIframeScripts);
		this.iframe = this.iframe.contentWindow;
		this.panelCollection = this.iframe.document.body.querySelectorAll('[data-modular-content-collection]')[0];
		if (!this.panelCollection) {
			this.revealIframe();
			console.error('Front end missing required collection html attribute "data-modular-content-collection", exiting.');
			return;
		}
		this.iframeScroller = zenscroll.createScroller(this.iframe.document.body);
		this.panelCollection.id = 'panel-collection-preview';
		this.injectCSS();
		this.bindIframeEvents();
		_.delay(() => {
			this.initializePanels();
			this.revealIframe();
		}, 500);
	}

	render() {
		const iframeClasses = classNames({
			'panel-preview-iframe': true,
		});

		return (
			<div className={styles.iframe}>
				{this.state.loading &&
					<div ref="loader" className={styles.loaderWrap}>
						<div className={styles.loading}><Loader active /></div>
					</div>
				}
				<iframe ref="frame" className={iframeClasses} src={MODULAR_CONTENT.preview_url} />
			</div>
		);
	}
}

CollectionPreview.propTypes = {
	panels: PropTypes.array,
	liveEdit: PropTypes.bool,
	panelsSaving: PropTypes.func,
	panelsActivate: PropTypes.func,
	spawnPickerAtIndex: PropTypes.func,
	updatePanelOrder: PropTypes.func,
	iframeLoaded: PropTypes.func,
};

CollectionPreview.defaultProps = {
	panels: [],
	liveEdit: false,
	panelsSaving: () => {},
	panelsActivate: () => {},
	spawnPickerAtIndex: () => {},
	updatePanelOrder: () => {},
	iframeLoaded: () => {},
};

export default CollectionPreview;
