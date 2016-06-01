import React from 'react';
import styles from './html.pcss';
import classNames from 'classnames';

const HTML = (props) => {
	const descriptionStyles = classNames({
		[styles.description]: true,
		'panel-field-description': true,
	});
	const fieldStyles = classNames({
		[styles.field]: true,
		'panel-field': true,
	});
	return (
		<div className={fieldStyles}>
			<div className={descriptionStyles} dangerouslySetInnerHTML={{ __html: props.description }} ></div>
		</div>
	);
};

HTML.propTypes = {
	description: React.PropTypes.string,
};

HTML.defaultProps = {
	description: '',
};

export default HTML;
