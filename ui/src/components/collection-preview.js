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
	}

	componentDidMount() {
		this.iframe = ReactDOM.findDOMNode(this.refs.frame);
		this.bindEvents();
	}

	componentWillUnmount() {
		document.removeEventListener('modern_tribe/panel_moved', this.handlePanelMoved);
		document.removeEventListener('modern_tribe/panel_toggled', this.handlePanelToggled);
		document.removeEventListener('modern_tribe/panel_updated', this.handlePanelUpdated);
		document.removeEventListener('modern_tribe/panels_added', this.handlePanelsAdded);
		document.removeEventListener('modern_tribe/picker_cancelled', this.cancelPickerInjection);
	}

	bindEvents() {
		this.iframe.addEventListener('load', this.intializeIframeScripts);
	}

	bindIframeEvents() {
		$(this.panelCollection)
			.off('click')
			.on('click', `.${styles.mask}`, (e) => this.handlePanelTriggerClick(e))
			.on('click', `.${styles.maskButtonAdd}`, (e) => this.handlePanelAddClick(e))
			.on('click', `.${styles.maskButtonUp}`, (e) => this.handlePanelUpClick(e))
			.on('click', `.${styles.maskButtonDown}`, (e) => this.handlePanelDownClick(e))
			.on('click', `.${styles.maskButtonDelete}`, (e) => this.handlePanelDeleteClick(e));

		document.addEventListener('modern_tribe/panel_moved', this.handlePanelMoved);
		document.addEventListener('modern_tribe/panel_toggled', this.handlePanelToggled);
		document.addEventListener('modern_tribe/panel_updated', this.handlePanelUpdated);
		document.addEventListener('modern_tribe/panels_added', this.handlePanelsAdded);
		document.addEventListener('modern_tribe/picker_cancelled', this.cancelPickerInjection);
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
		this.activePanelNode = this.activePanelNode.previousSibling;
		this.activePanelNode.parentNode.removeChild(this.activePanelNode.nextSibling);
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
		if (!this.activePanelNode || this.props.saving) {
			return;
		}

		const livetextField = this.activePanelNode.querySelectorAll(`[data-name="${e.detail.name}"][data-livetext]`)[0];
		if (livetextField) {
			livetextField.innerHTML = e.detail.value;
			return;
		}

		this.props.panelsSaving(true);
		this.activePanelNode.classList.add(styles.loadingPanel);

		ajax.getPanelHTML([this.props.panels[e.detail.index]])
			.done((data) => {
				this.injectUpdatedPanelHtml(data.panels);
			})
			.fail(() => {
				this.activePanelNode.classList.remove(styles.loadingPanel);
			})
			.always(() => this.props.panelsSaving(false));
	}

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

	handlePanelUpClick(e) {

	}

	handlePanelDownClick(e) {

	}

	handlePanelDeleteClick(e) {

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
		return `
			<div class="${styles.mask}">
				<header class="${styles.maskHeader}">
					<span class="${styles.maskLabel}">${_.find(BLUEPRINT_TYPES, { type }).label}</span>
					<button class="${styles.maskButton} ${styles.maskButtonUp}"></button>
					<button class="${styles.maskButton} ${styles.maskButtonDown}"></button>
					<button class="${styles.maskButton} ${styles.maskButtonDelete}"></button>
				</header>
				<div class="${styles.maskTop} ${styles.maskAdd}">
					<button class="${styles.maskButtonAdd} ${styles.addPanelAbove}"></button>
				</div>
				<div class="${styles.maskBottom} ${styles.maskAdd}">
					<button class="${styles.maskButtonAdd} ${styles.addPanelBelow}"></button>
				</div>
			</div>
		`;
	}

	updateNewPanels() {
		let oldPanels = this.panelCollection.querySelectorAll(`.${styles.panel}`).length;
		_.forEach(this.panelCollection.querySelectorAll(`.panel:not(.${styles.panel})`), (panel) => {
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
		const iframeCSS = this.iframe.document.createElement('link');
		iframeCSS.href = CSS_FILE;
		iframeCSS.rel = 'stylesheet';
		iframeCSS.type = 'text/css';
		this.iframe.document.body.appendChild(iframeCSS);
	}

	initializePanels() {
		_.forEach(this.panelCollection.querySelectorAll('.panel'), (panel, i) => this.configurePanel(panel, i));
	}

	revealIframe() {
		ReactDOM.findDOMNode(this.refs.loader).style.opacity = 0;
		_.delay(() => {
			this.setState({ loading: false });
		}, 500);
	}

	@autobind
	intializeIframeScripts() {
		this.iframe.removeEventListener('load', this.intializeIframeScripts);
		this.iframe = this.iframe.contentWindow;
		this.panelCollection = this.iframe.document.body.querySelectorAll('.panel-collection')[0];
		if (!this.panelCollection) {
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
			[styles.iframeFull]: this.props.mode === 'full',
			[styles.iframeTablet]: this.props.mode === 'tablet',
			[styles.iframeMobile]: this.props.mode === 'mobile',
			'panel-preview-iframe': true,
		});

		return (
			<div className={styles.iframe}>
				{this.state.loading &&
					<div ref="loader" className={styles.loaderWrap}>
						<div className={styles.loading}><Loader active /></div>
					</div>
				}
				<iframe ref="frame" className={iframeClasses} src={MODULAR_CONTENT.preview_url}/>
			</div>
		);
	}
}

CollectionPreview.propTypes = {
	panels: PropTypes.array,
	saving: PropTypes.bool,
	mode: PropTypes.string,
	liveEdit: PropTypes.bool,
	panelsSaving: PropTypes.func,
	panelsActivate: PropTypes.func,
	spawnPickerAtIndex: PropTypes.func,
};

CollectionPreview.defaultProps = {
	panels: [],
	saving: false,
	mode: 'full',
	liveEdit: false,
	panelsSaving: () => {},
	panelsActivate: () => {},
	spawnPickerAtIndex: () => {},
};

export default CollectionPreview;
