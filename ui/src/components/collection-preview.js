import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import autobind from 'autobind-decorator';
import classNames from 'classnames';

import { MODULAR_CONTENT } from '../globals/config';

import styles from './collection-preview.pcss';

class CollectionPreview extends Component {
	render() {
		const iframeClasses = classNames({
			[styles.iframeFull]: this.props.mode === 'full',
			[styles.iframeTablet]: this.props.mode === 'tablet',
			[styles.iframeMobile]: this.props.mode === 'mobile',
			'panel-preview-iframe': true,
		});

		return (
			<div className={styles.iframe}>
				<div className={styles.loaderWrap}><i className={styles.loader} /></div>
				<iframe className={iframeClasses} src={MODULAR_CONTENT.preview_url} />
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
