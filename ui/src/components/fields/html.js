import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import styles from './html.pcss';

const HTML = (props) => {
	const descriptionClasses = classNames({
		[styles.description]: true,
		'panel-field-description': true,
	});
	const fieldClasses = classNames({
		[styles.field]: true,
		'panel-field': true,
	});
	return (
		<div className={fieldClasses}>
			<div className={descriptionClasses} dangerouslySetInnerHTML={{ __html: props.description }} />
		</div>
	);
};

HTML.propTypes = {
	description: PropTypes.string,
};

HTML.defaultProps = {
	description: '',
};

export default HTML;
