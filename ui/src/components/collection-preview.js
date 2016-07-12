import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import autobind from 'autobind-decorator';
import classNames from 'classnames';

import Loader from './shared/loader';

import { MODULAR_CONTENT, CSS_FILE } from '../globals/config';

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

	bindEvents() {
		this.iframe.addEventListener('load', this.intializeIframeScripts);
	}

	bindIframeEvents() {
		$(this.iframe.document.body.querySelectorAll('.panel-collection')[0])
			.on('click', `.${styles.mask}`, (e) => this.handleMaskClick(e));
	}

	handleMaskClick(e) {
		console.log(e);
	}

	createMask() {
		const mask = this.iframe.document.createElement('div');
		mask.classList.add(styles.mask);
		return mask;
	}

	configurePanel(panel) {
		panel.classList.add(styles.panel);
		panel.appendChild(this.createMask());
	}

	injectCSS() {
		const iframeCSS = this.iframe.document.createElement('link');
		iframeCSS.href = CSS_FILE;
		iframeCSS.rel = 'stylesheet';
		iframeCSS.type = 'text/css';
		this.iframe.document.body.appendChild(iframeCSS);
	}

	injectPreviewMasks() {
		_.forEach(this.panelPreviews, (panel) => this.configurePanel(panel));
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
		this.panelPreviews = this.panelCollection.querySelectorAll('.panel');
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
};

CollectionPreview.defaultProps = {
	panels: [],
	mode: 'full',
	liveEdit: false,
};

export default CollectionPreview;
