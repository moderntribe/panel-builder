import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import { UI_I18N } from '../../globals/i18n';

import styles from './refresh-rate.pcss';

/**
 * Stateless component for refresh rate used in the live preview bar
 *
 * @param props
 * @returns {XML}
 * @constructor
 */

const RefreshRate = (props) => {
	const wrapperClasses = classNames({
		'modular-content-refresh-rate': true,
		[styles.wrapper]: true,
	});

	return (
		<div
			className={wrapperClasses}
		>
			<label className={styles.text}>{UI_I18N['heading.refresh_delay']}</label>
			<input
				className={styles.input}
				value={props.refreshRate / 1000}
				type="number"
				min="1"
				max="20"
				step="1"
				onChange={props.updateRefreshRate}
			/>
		</div>
	);
};

RefreshRate.propTypes = {
	refreshRate: PropTypes.number,
	updateRefreshRate: PropTypes.func,
};

RefreshRate.defaultProps = {
	refreshRate: 1000,
	updateRefreshRate: () => {},
};

export default RefreshRate;
