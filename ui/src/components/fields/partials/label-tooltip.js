import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'rc-tooltip';
import styles from './label-tooltip.pcss';

const tooltipStyles = {
	display: 'inline-block',
	width: '150px',
	textAlign: 'left',
	background: '#ffffff',
	borderRadius: '2px',
};

/**
 * Stateless component for tooltips
 *
 * @param props
 * @constructor
 */

const LabelTooltip = props => (
	<Tooltip
		trigger="hover"
		placement="right"
		arrowContent={<div className="rc-tooltip-arrow-inner" />}
		overlay={<div style={tooltipStyles}>{props.content}</div>}
	>
		<span className={styles.icon} />
	</Tooltip>
);

LabelTooltip.propTypes = {
	content: PropTypes.string,
};

LabelTooltip.defaultProps = {
	content: '',
};

export default LabelTooltip;
