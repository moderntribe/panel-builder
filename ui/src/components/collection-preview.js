import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import zenscroll from 'zenscroll';
import wpautop from 'wpautop';
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
import * as EVENTS from '../constants/events';

import styles from './collection-preview.pcss';

class CollectionPreview extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
		};
		this.saving = false;
		this.nestedEvent = null;
		this.updateDebounceRate = 1000;
		this.iframeUrl = heartbeat.iframePreviewUrl();
	}

	componentDidMount() {
		this.iframe = this.frame;
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
			.off('click mouseover mouseout')
			.on('mouseover', `.${styles.maskButtonAdd}, .${styles.maskButton}`, e => this.handleButtonMousover(e))
			.on('mouseout', `.${styles.maskButtonAdd}, .${styles.maskButton}`, e => this.handleButtonMousout(e))
			.on('click', `.${styles.mask}`, e => this.handlePanelTriggerClick(e))
			.on('click', `.${styles.cancelInsert}`, e => this.handleCancelInsertClick(e))
			.on('click', `.${styles.maskButtonAdd}`, e => this.handlePanelAddClick(e))
			.on('click', `.${styles.maskButtonUp}`, e => this.handlePanelUpClick(e))
			.on('click', `.${styles.maskButtonDown}`, e => this.handlePanelDownClick(e))
			.on('click', `.${styles.maskButtonDelete}`, e => this.handlePanelDeleteClick(e));

		// panel events
		document.addEventListener('modern_tribe/panel_moved', this.handlePanelMoved);
		document.addEventListener('modern_tribe/panel_toggled', this.handlePanelToggled);
		document.addEventListener('modern_tribe/panel_updated', this.handlePanelUpdatedLive);
		document.addEventListener('modern_tribe/panel_updated', _.debounce(this.handlePanelUpdated, this.updateDebounceRate, true));
		document.addEventListener('modern_tribe/panels_added', this.handlePanelsAdded);
		document.addEventListener('modern_tribe/picker_cancelled', this.cancelPickerInjection);
		document.addEventListener('modern_tribe/delete_panel', this.deletePanelFromPreview);
		// repeater events
		document.addEventListener(EVENTS.REPEATER_ROW_ACTIVATED, this.handleNestedUpdates);
		document.addEventListener(EVENTS.REPEATER_ROW_DEACTIVATED, this.handleNestedUpdates);
		document.addEventListener(EVENTS.REPEATER_ROW_ADDED, this.handleNestedUpdates);
		document.addEventListener(EVENTS.REPEATER_ROW_UPDATED, this.handleNestedUpdates);
		document.addEventListener(EVENTS.REPEATER_ROW_MOVED, this.handleNestedUpdates);
		document.addEventListener(EVENTS.REPEATER_ROW_DELETED, this.handleNestedUpdates);
		// child panel events
		document.addEventListener(EVENTS.CHILD_PANEL_ACTIVATED, this.handleNestedUpdates);
		document.addEventListener(EVENTS.CHILD_PANEL_DEACTIVATED, this.handleNestedUpdates);
		document.addEventListener(EVENTS.CHILD_PANEL_ADDED, this.handleNestedUpdates);
		document.addEventListener(EVENTS.CHILD_PANEL_MOVED, this.handleNestedUpdates);
		document.addEventListener(EVENTS.CHILD_PANEL_DELETED, this.handleNestedUpdates);
	}

	unBindEvents() {
		// panel events
		document.removeEventListener('modern_tribe/panel_moved', this.handlePanelMoved);
		document.removeEventListener('modern_tribe/panel_toggled', this.handlePanelToggled);
		document.removeEventListener('modern_tribe/panel_updated', this.handlePanelUpdatedLive);
		document.removeEventListener('modern_tribe/panel_updated', _.debounce(this.handlePanelUpdated, this.updateDebounceRate, true));
		document.removeEventListener('modern_tribe/panels_added', this.handlePanelsAdded);
		document.removeEventListener('modern_tribe/picker_cancelled', this.cancelPickerInjection);
		document.removeEventListener('modern_tribe/delete_panel', this.deletePanelFromPreview);
		// repeater events
		document.removeEventListener(EVENTS.REPEATER_ROW_ACTIVATED, this.handleNestedUpdates);
		document.removeEventListener(EVENTS.REPEATER_ROW_DEACTIVATED, this.handleNestedUpdates);
		document.removeEventListener(EVENTS.REPEATER_ROW_ADDED, this.handleNestedUpdates);
		document.removeEventListener(EVENTS.REPEATER_ROW_MOVED, this.handleNestedUpdates);
		document.removeEventListener(EVENTS.REPEATER_ROW_DELETED, this.handleNestedUpdates);
		// child panel events
		document.removeEventListener(EVENTS.CHILD_PANEL_ACTIVATED, this.handleNestedUpdates);
		document.removeEventListener(EVENTS.CHILD_PANEL_DEACTIVATED, this.handleNestedUpdates);
		document.removeEventListener(EVENTS.CHILD_PANEL_ADDED, this.handleNestedUpdates);
		document.removeEventListener(EVENTS.CHILD_PANEL_MOVED, this.handleNestedUpdates);
		document.removeEventListener(EVENTS.CHILD_PANEL_DELETED, this.handleNestedUpdates);
	}

	deactivatePanel(panel) {
		panel.classList.remove(styles.active);
		_.delay(() => {
			panel.classList.remove(styles.noTransition);
		}, 350);

		this.activePanelNode = null;
	}

	deactivatePanels() {
		_.forEach(this.panelCollection.querySelectorAll('.panel'), panel => this.deactivatePanel(panel));
	}

	scrollToPanel(index, activate = true) {
		const target = this.panelCollection.querySelectorAll(`.panel[data-index="${index}"]`)[0];
		if (!target) {
			console.warn(`Couldn't find panel to scroll to at index ${index}`);
			return;
		}
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
				<button class="${styles.cancelInsert}">${UI_I18N['button.cancel']}</button>
			</div>
		`;
	}

	emitPreviewUpdatedEvent(parentEvent, nestedEvent) {
		trigger({
			event: 'modular_content/panel_preview_updated',
			native: false,
			el: this.iframe,
			data: {
				parent: {
					type: parentEvent.type,
					data: parentEvent.detail,
				},
			},
		});
		console.log('Panel Builder: Emitted custom event modular_content/panel_preview_updated into preview iframe.');
		if (!nestedEvent) {
			return;
		}
		_.delay(() => {
			trigger({
				event: nestedEvent.type,
				native: false,
				el: this.iframe,
				data: nestedEvent.detail,
			});
			console.log(`Panel Builder: Emitted custom nested event ${nestedEvent.type} into preview iframe.`);
		}, 200);
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
		const nestedEvent = this.nestedEvent;
		const value = _.isNumber(e.detail.childIndex) ? e.detail.childValue : e.detail.value;
		const selector = previewTools.getLiveTextSelector(e.detail);
		if (this.activePanelNode.querySelectorAll(selector)[0] && _.isString(value)) {
			return;
		}

		this.saving = true;
		this.props.panelsSaving(true);
		this.activePanelNode.classList.add(styles.loadingPanel);

		ajax.getPanelHTML([this.props.panels[e.detail.index]], e.detail.index)
			.done((data) => {
				this.injectUpdatedPanelHtml(data.panels);
				this.emitPreviewUpdatedEvent(e, nestedEvent);
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

		const value = _.isNumber(e.detail.childIndex) ? e.detail.childValue : e.detail.value;
		if (!_.isString(value)) {
			return;
		}

		const selector = previewTools.getLiveTextSelector(e.detail);

		const livetextField = this.activePanelNode.querySelectorAll(selector)[0];
		if (livetextField) {
			if (livetextField.getAttribute('data-autop')) {
				livetextField.innerHTML = wpautop(value);
				return;
			}

			livetextField.innerHTML = value;
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

	@autobind
	handleCancelInsertClick(e) {
		e.currentTarget.parentNode.parentNode.removeChild(e.currentTarget.parentNode);
		trigger({
			event: 'modern_tribe/cancel_picker',
			native: false,
		});
	}

	isImmediateNestedEvent(type) {
		return type === EVENTS.REPEATER_ROW_ACTIVATED || type === EVENTS.REPEATER_ROW_DEACTIVATED || type === EVENTS.CHILD_PANEL_ACTIVATED || type === EVENTS.CHILD_PANEL_DEACTIVATED;
	}

	@autobind
	handleNestedUpdates(e) {
		// some events are immediate as they dont trigger ajax updating of the preview for the active panel
		if (this.isImmediateNestedEvent(e.type)) {
			trigger({
				event: e.type,
				native: false,
				el: this.iframe,
				data: e.detail,
			});
			console.log(`Panel Builder: Emitted custom nested event ${e.type} into preview iframe.`);
			return;
		}
		// some nested events are delayed and have to fire after ajax has run to update the preview.
		// We pass them around here, wiping them out after 100 ms plus the debounce rate to make sure
		// the only fire for the associated panel_updated event triggering the ajax
		this.nestedEvent = e;
		_.delay(() => {
			this.nestedEvent = null;
		}, this.updateDebounceRate + 100);
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
		tooltip.style.opacity = 1;
	}

	handleButtonMousout(e) {
		const tooltip = e.currentTarget.querySelectorAll('[data-tooltip]')[0];
		if (!tooltip) {
			return;
		}
		tooltip.style.opacity = 0;
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
		// send along an index the ajax handler can use to determine if the panel is the first in set or not,
		// or do other index based opts.
		const panelIndex = e.detail.index === -1 && !this.panelCollection.querySelectorAll('[data-modular-content]')[0] ? 0 : e.detail.index;
		const nestedEvent = this.nestedEvent;
		ajax.getPanelHTML(e.detail.panels, panelIndex)
			.done((data) => {
				if (e.detail.index === -1) {
					this.panelCollection.insertAdjacentHTML('beforeend', data.panels);
					this.updateNewPanels();
					this.activateLastPanel();
				} else {
					this.injectPanelAtPlaceholder(data.panels, e.detail.index);
				}
				this.emitPreviewUpdatedEvent(e, nestedEvent);
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
		this.loader.style.opacity = 0;
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
					<div ref={r => this.loader = r} className={styles.loaderWrap}>
						<div className={styles.loading}><Loader active /></div>
					</div>
				}
				<iframe ref={r => this.frame = r} className={iframeClasses} src={this.iframeUrl} />
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
