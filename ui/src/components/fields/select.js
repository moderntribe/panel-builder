import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import _ from 'lodash';
import ReactSelect from 'react-select-plus';
import classNames from 'classnames';
import styles from './select.pcss';
import LabelTooltip from './partials/label-tooltip';
import * as DATA_KEYS from '../../constants/data-keys';
import { CONFIG } from '../../globals/config';
import { trigger } from '../../util/events';
import * as EVENTS from '../../constants/events';

class Select extends Component {
	state = {
		value: this.props.data,
	};

	@autobind
	handleChange(option) {
		const value = option ? _.toString(option.value) : _.toString(this.props.default);
		this.setState({ value });
		this.props.updatePanelData({
			depth: this.props.depth,
			indexMap: this.props.indexMap,
			parentMap: this.props.parentMap,
			name: this.props.name,
			value,
		});
		if (this.props.enable_fonts_injection) {
			const data = [];
			data.push({ groups: [option.label] });
			trigger({ event: EVENTS.INJECT_IFRAME_FONT, native: false, data });
		}
	}

	getOptions() {
		return this.props.global_options ? CONFIG[this.props.global_options] : this.props.options;
	}

	render() {
		const labelClasses = classNames({
			[styles.label]: true,
			'panel-field-label': true,
		});
		const fieldClasses = classNames({
			[styles.field]: true,
			[styles.compact]: this.props.layout === DATA_KEYS.COMPACT_LAYOUT,
			'panel-field': true,
			'panel-conditional-field': true,
		});

		return (
			<div className={fieldClasses}>
				<label className={labelClasses}>
					{this.props.label}
					{this.props.description.length ? <LabelTooltip content={this.props.description} /> : null}
				</label>
				<ReactSelect
					name={`modular-content-${this.props.name}`}
					options={this.getOptions()}
					onChange={this.handleChange}
					value={this.state.value}
				/>
			</div>
		);
	}
}

Select.propTypes = {
	data: PropTypes.string,
	panelIndex: PropTypes.number,
	label: PropTypes.string,
	name: PropTypes.string,
	description: PropTypes.string,
	enable_fonts_injection: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.bool,
	]),
	global_options: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.bool,
	]),
	indexMap: PropTypes.array,
	parentMap: PropTypes.array,
	depth: PropTypes.number,
	strings: PropTypes.object,
	default: PropTypes.string,
	options: PropTypes.array,
	layout: PropTypes.string,
	updatePanelData: PropTypes.func,
};

Select.defaultProps = {
	data: '',
	panelIndex: 0,
	label: '',
	name: '',
	description: '',
	enable_fonts_injection: false,
	global_options: false,
	indexMap: [],
	parentMap: [],
	depth: 0,
	strings: {},
	default: '',
	options: [],
	layout: 'compact',
	updatePanelData: () => {},
};

export default Select;
