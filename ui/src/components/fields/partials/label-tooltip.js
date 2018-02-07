import React, { Component } from 'react';
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

class LabelTooltip extends Component {
	constructor(props) {
		super(props);
		this.state = {
			label: this.props.label,
			description: this.props.description,
		};
	}

	render() {
		return (
			<Tooltip
				id={this.state.label}
				trigger="hover"
				placement="bottom"
				arrowContent={<div className="rc-tooltip-arrow-inner" />}
				overlay={<div style={tooltipStyles}>{this.state.description}</div>}
			>
				<span className={styles.icon} />
			</Tooltip>);
	}
}

LabelTooltip.propTypes = {
	label: PropTypes.string,
	description: PropTypes.string,
};

LabelTooltip.defaultProps = {
	label: '',
	description: '',
};

export default LabelTooltip;
