import React, { PropTypes } from 'react';
import classNames from 'classnames';

import styles from './button.pcss';

/**
 * Stateless component for main button used throughout ui.
 *
 * @param props
 * @returns {XML}
 * @constructor
 */

const Button = (props) => {
	const buttonClasses = classNames({
		'panel-button': true,
		[styles.primary]: props.primary,
		[styles.secondary]: !props.primary,
		[styles.full]: props.full,
		[styles.inline]: !props.full,
		[props.classes]: props.classes.length,
	});

	const title = props.title.length ? props.title : props.text;

	return (
		<button
			type={props.type}
			title={title}
			className={buttonClasses}
			onClick={props.handleClick}
		>
			<span>{props.text}</span>
		</button>
	);
};

Button.propTypes = {
	text: PropTypes.string,
	title: PropTypes.string,
	classes: PropTypes.string,
	type: PropTypes.string,
	primary: PropTypes.bool,
	full: PropTypes.bool,
	handleClick: PropTypes.func,
};

Button.defaultProps = {
	text: '',
	title: '',
	classes: '',
	type: 'button',
	primary: true,
	full: true,
	handleClick: () => {},
};

export default Button;
