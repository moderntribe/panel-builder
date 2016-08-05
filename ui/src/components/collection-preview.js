import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import zenscroll from 'zenscroll';
import autobind from 'autobind-decorator';
import classNames from 'classnames';

import Loader from './shared/loader';

import { IFRAME_SCROLL_OFFSET } from '../globals/config';
import { UI_I18N } from '../globals/i18n';

import { trigger } from '../util/events';
import * as ajax from '../util/ajax';
import * as previewTools from '../util/dom/preview';
import * as heartbeat from '../util/data/heartbeat';
import * as domTools from '../util/dom/tools';
import * as tests from '../util/tests';

import styles from './collection-preview.pcss';

class CollectionPreview extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
		};
		this.saving = false;
		this.iframeUrl = heartbeat.iframePreviewUrl();
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
		_.delay(() => {
			panel.classList.remove(styles.noTransition);
		}, 350);

		this.activePanelNode = null;
	}

	deactivatePanels() {
		_.forEach(this.panelCollection.querySelectorAll('.panel'), (panel) => this.deactivatePanel(panel));
	}

	scrollToPanel(index, activate = true) {
		const target = this.panelCollection.querySelectorAll(`.panel[data-index="${index}"]`)[0];
		this.iframeScroller.to(target, 500, () => {
			if (!activate) {
				return;
			}

			target.classList.add(styles.active);
			target.classList.add(styles.noTransition);
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
		panel.classList.add(styles.noTransition);
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
		this.activePanelNode = this.activePanelNode.previousElementSibling;
		this.activePanelNode.parentNode.removeChild(this.activePanelNode.nextElementSibling);
		this.initializePanels();
		this.activePanelNode.classList.add(styles.active);
		this.activePanelNode.classList.add(styles.noTransition);
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
		this.scrollToPanel(parseInt(el.getAttribute('data-index'), 10), false);
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

		this.activateNewPanel(panel, index);
	}

	activateNewPanel(panel = null, index = 0) {
		if (!panel) {
			return;
		}

		this.deactivatePanels();
		panel.classList.add(styles.active);
		panel.classList.add(styles.noTransition);
		this.activePanelNode = panel;
		trigger({
			event: 'modern_tribe/panel_activated',
			native: false,
			data: {
				index,
			},
		});
	}

	activateLastPanel() {
		const panel = this.panelCollection.lastElementChild;
		const index = parseInt(panel.getAttribute('data-index'), 10);
		this.activateNewPanel(panel, index);
		_.delay(() => this.scrollToPanel(index), 200);
	}

	handleButtonMousover(e) {
		const tooltip = e.currentTarget.querySelectorAll('[data-tooltip]')[0];
		if (!tooltip) {
			return;
		}
		const width = Math.max(this.iframe.documentElement.clientWidth, this.iframeWindow.innerWidth || 0);

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
					this.activateLastPanel();
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
			this.scrollToPanel(parseInt(panel.getAttribute('data-index'), 10), false);
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
				type: 'error',
				confirm: true,
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
		panel.insertAdjacentHTML('beforeend', previewTools.createMask(panel.getAttribute('data-type'), styles));
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
		this.iframeWindow = this.iframe.contentWindow || this.iframe;
		this.iframe = this.iframe.contentDocument || this.iframe.contentWindow.document;
		this.panelCollection = this.iframe.body.querySelectorAll('[data-modular-content-collection]')[0];
		if (!this.panelCollection) {
			this.revealIframe();
			console.error('Front end missing required collection html attribute "data-modular-content-collection", exiting.');
			return;
		}
		const scrollable = tests.browserTests().firefox || tests.browserTests().ie ? this.iframe.querySelectorAll('html')[0] : this.iframe.body;
		this.iframeScroller = zenscroll.createScroller(scrollable, null, IFRAME_SCROLL_OFFSET);
		this.panelCollection.id = 'panel-collection-preview';
		previewTools.setupIframe(this.iframe, styles);
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
				<iframe ref="frame" className={iframeClasses} src={this.iframeUrl} />
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
