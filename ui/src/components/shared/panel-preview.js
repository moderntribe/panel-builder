import React, { PropTypes } from 'react';
import classNames from 'classnames';

import { BLUEPRINT_CATEGORIES } from '../../globals/config';

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
	const checkIsComponent = () => {
		const componentCategory = BLUEPRINT_CATEGORIES.filter(c => c.category === 'components')[0];
		if (!componentCategory) {
			return false;
		}
		return _.isArray(componentCategory.types) && componentCategory.types.indexOf(props.type) !== -1;
	};
	const isComponent = checkIsComponent();
	const containerClasses = classNames({
		[styles.container]: true,
		[styles.isComponent]: isComponent,
	});

	return (
		<article
			className={containerClasses}
			onClick={addPanel}
		>
			{!isComponent && <h4>{props.label}</h4>}
			{!isComponent && <p>{props.description}</p>}
			<figure><img src={props.thumbnail} alt={props.label} /></figure>
			{isComponent && <h4 className={styles.componentTitle}>{props.label}</h4>}
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

