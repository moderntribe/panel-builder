import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import classNames from 'classnames';

import styles from './title.pcss';
import LabelTooltip from './partials/label-tooltip';

import * as events from '../../util/events';

class Title extends Component {
	state = {
		text: this.props.data,
	};

	@autobind
	handleChange(e) {
		const text = e.currentTarget.value;
		this.setState({ text });
		this.props.updatePanelData({
			depth: this.props.depth,
			indexMap: this.props.indexMap,
			parentMap: this.props.parentMap,
			name: this.props.name,
			value: text,
		});
		events.trigger({
			event: 'modern_tribe/title_updated',
			native: false,
			data: {
				text,
			},
		});
	}

	render() {
		const labelClasses = classNames({
			[styles.label]: true,
			'panel-input-label-title': true,
			'panel-field-label': true,
		});
		const fieldClasses = classNames({
			[styles.field]: true,
			'panel-field': true,
		});

		return (
			<div className={fieldClasses}>
				<label className={labelClasses}>
					{this.props.label}
					{this.props.description.length ? <LabelTooltip content={this.props.description} /> : null}
				</label>
				<span className={styles.inputContainer}>
					<input type="text" name={`modular-content-${this.props.name}`} value={this.state.text} onChange={this.handleChange} />
				</span>
			</div>
		);
	}
}

Title.propTypes = {
	data: PropTypes.string,
	panelIndex: PropTypes.number,
	indexMap: PropTypes.array,
	parentMap: PropTypes.array,
	label: PropTypes.string,
	name: PropTypes.string,
	description: PropTypes.string,
	depth: PropTypes.number,
	strings: PropTypes.object,
	default: PropTypes.string,
	updatePanelData: PropTypes.func,
};

Title.defaultProps = {
	data: '',
	panelIndex: 0,
	indexMap: [],
	parentMap: [],
	label: '',
	name: '',
	description: '',
	depth: 0,
	strings: {},
	default: '',
	updatePanelData: () => {},
};

export default Title;
