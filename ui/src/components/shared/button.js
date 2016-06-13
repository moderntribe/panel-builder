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
	const getIcon = () => {
		let Icon = null;
		if (props.icon.length) {
			const iconClasses = classNames({
				dashicons: true,
				[props.icon]: true,
				[styles.icon]: true,
			});
			Icon = (
				<i className={iconClasses} />
			);
		}

		return Icon;
	};

	const buttonClasses = classNames({
		'panel-button': true,
		[styles.primary]: !props.bare && props.primary,
		[styles.secondary]: !props.bare && !props.primary,
		[styles.full]: props.full,
		[styles.inline]: !props.full,
		[styles.bare]: props.bare,
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
			{getIcon()}
			<span>{props.text}</span>
		</button>
	);
};

Button.propTypes = {
	text: PropTypes.string,
	title: PropTypes.string,
	icon: PropTypes.string,
	classes: PropTypes.string,
	type: PropTypes.string,
	primary: PropTypes.bool,
	full: PropTypes.bool,
	bare: PropTypes.bool,
	handleClick: PropTypes.func,
};

Button.defaultProps = {
	text: '',
	title: '',
	icon: '',
	classes: '',
	type: 'button',
	primary: true,
	full: true,
	bare: false,
	handleClick: () => {},
};

export default Button;
