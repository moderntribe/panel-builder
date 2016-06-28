import React, { PropTypes } from 'react';
import classNames from 'classnames';

import styles from './panel-set-preview.pcss';

/**
 * Stateless component for panel set preview item
 *
 * @param props
 * @returns {XML}
 * @constructor
 */

const PanelSetPreview = (props) => {
	const addPanel = () => props.handleAddPanelSet(props.type);
	const containerClasses = classNames({
		[styles.container]: true,
	});

	return (
		<article
			className={containerClasses}
			onClick={addPanel}
		>
			<h4>{props.label}</h4>
			<p>{props.description}</p>
			<div className={styles.thumbnailFrame}>
				<div className={styles.thumbnailTop}><i /><i /><i /><b /></div>
				<figure><img src={props.thumbnail} alt={props.label}/></figure>
			</div>
		</article>
	);
};

PanelSetPreview.propTypes = {
	label: PropTypes.string,
	description: PropTypes.string,
	thumbnail: PropTypes.string,
	handleAddPanel: PropTypes.func,
};

PanelSetPreview.defaultProps = {
	label: '',
	description: '',
	thumbnail: '',
	handleAddPanelSet: () => {},
};

export default PanelSetPreview;

