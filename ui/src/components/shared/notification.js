import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import styles from './notification.pcss';

/**
 * Stateless component for notifications used throughout ui.
 *
 * @param props
 * @returns {XML}
 * @constructor
 */

const Notification = (props) => {
	const iconClasses = classNames({
		'dashicons': true,
		'dashicons-warning': props.type === 'warn',
		'panel-notification-icon': true,
		[styles.icon]: true,
	});

	const notificationClasses = classNames({
		'panel-notification': true,
		[styles.base]: true,
		[styles.error]: props.type === 'error',
		[styles.warn]: props.type === 'warn',
		[styles.success]: props.type === 'success',
		[props.classes]: props.classes.length,
	});

	return (
		<article
			className={notificationClasses}
		>
			<i className={iconClasses} />
			<span>{props.text}</span>
		</article>
	);
};

Notification.propTypes = {
	text: PropTypes.string,
	classes: PropTypes.string,
	type: PropTypes.string,
};

Notification.defaultProps = {
	text: '',
	classes: '',
	type: 'warn',
};

export default Notification;
