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
		document.removeEventListener('modern_tribe/panel_toggled', this.handlePanelToggled);
		document.removeEventListener('modern_tribe/panels_added', this.handlePanelsAdded);
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

		document.addEventListener('modern_tribe/panel_toggled', this.handlePanelToggled);
		document.addEventListener('modern_tribe/panels_added', this.handlePanelsAdded);
	}

	deactivatePanel(panel) {
		panel.classList.remove(styles.active);
	}

	deactivatePanels() {
		_.forEach(this.panelCollection.querySelectorAll('.panel'), (panel) => this.deactivatePanel(panel));
	}

	scrollToPanel(index) {
		const target = this.panelCollection.querySelectorAll(`.panel[data-index="${index}"]`)[0];
		this.iframeScroller.center(target, 500, 0, () => {
			target.classList.add(styles.active);
		});
	}

	createPlaceholder() {
		return `
			<div class="${styles.placeholder}">
				<span class="${styles.placeholderMessage}">${UI_I18N['message.panel_placeholder']}</span>
			</div>
		`;
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
		this.props.spawnPickerAtIndex(index, position);
	}

	@autobind
	handlePanelsAdded(e) {
		ajax.getPanelHTML(e.detail)
			.done((data) => {
				this.panelCollection.insertAdjacentHTML('beforeend', data.panels);
				this.updateNewPanels();
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
		panel.classList.add(styles.panel);
		panel.setAttribute('data-index', i);
		panel.insertAdjacentHTML('beforeend', this.createMask(panel.getAttribute('data-type')));
	}

	injectCSS() {
		const iframeCSS = this.iframe.document.createElement('link');
		iframeCSS.href = CSS_FILE;
		iframeCSS.rel = 'stylesheet';
		iframeCSS.type = 'text/css';
		this.iframe.document.body.appendChild(iframeCSS);
	}

	injectPreviewMasks() {
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
		this.injectCSS();
		this.bindIframeEvents();
		_.delay(() => {
			this.injectPreviewMasks();
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
	mode: PropTypes.string,
	liveEdit: PropTypes.bool,
	panelsActivate: PropTypes.func,
	spawnPickerAtIndex: PropTypes.func,
};

CollectionPreview.defaultProps = {
	panels: [],
	mode: 'full',
	liveEdit: false,
	panelsActivate: () => {},
	spawnPickerAtIndex: () => {},
};

export default CollectionPreview;
