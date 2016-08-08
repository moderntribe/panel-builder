import React, { PropTypes } from 'react';
import classNames from 'classnames';

import Loader from './loader';

import styles from './button.pcss';

/**
 * Stateless component for main button used throughout ui.
 *
 * @param props
 * @returns {XML}
 * @constructor
 */

const Button = (props) => {
	const getLoader = () => {
		let Load = null;
		if (props.useLoader && props.showLoader) {
			Load = (
				<Loader active width={20} height={20} />
			);
		}

		return Load;
	};

	const getIcon = () => {
		let Icon = null;
		if (props.icon.length && !props.showLoader) {
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
		[styles.rounded]: props.rounded,
		[styles.loading]: props.showLoader,
		[props.classes]: props.classes.length,
	});

	const title = props.title.length ? props.title : props.text;

	return (
		<button
			type={props.type}
			title={title}
			className={buttonClasses}
			onClick={props.handleClick}
			data-loading={props.showLoader}
			disabled={props.disabled}
		>
			{getLoader()}
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
	disabled: PropTypes.bool,
	rounded: PropTypes.bool,
	handleClick: PropTypes.func,
	useLoader: PropTypes.bool,
	showLoader: PropTypes.bool,
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
	disabled: false,
	rounded: false,
	handleClick: () => {},
	useLoader: false,
	showLoader: false,
};

export default Button;
