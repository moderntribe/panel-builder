import React from 'react';
import styles from './html.pcss';
import classNames from 'classnames';

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
	description: React.PropTypes.string,
};

HTML.defaultProps = {
	description: '',
};

export default HTML;
