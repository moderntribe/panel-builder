import React, { PropTypes } from 'react';
import classNames from 'classnames';

import styles from './panel-preview.pcss';

/**
 * Stateless component for panel picker preview item
 *
 * @param props
 * @returns {XML}
 * @constructor
 */

const PanelPreview = (props) => {
	const addPanel = () => props.handleAddPanel(props.type);
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
			<figure><img src={props.thumbnail} alt={props.label}/></figure>
		</article>
	);
};

PanelPreview.propTypes = {
	label: PropTypes.string,
	description: PropTypes.string,
	thumbnail: PropTypes.string,
	type: PropTypes.string,
	handleAddPanel: PropTypes.func,
};

PanelPreview.defaultProps = {
	label: '',
	description: '',
	thumbnail: '',
	type: '',
	handleAddPanel: () => {},
};

export default PanelPreview;

