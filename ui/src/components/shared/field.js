import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';

import * as FIELD_TYPES from '../../constants/field-types';

/**
 * A Higher Order Component for some fields that handles all their common functionality and state dispatches
 *
 * @param WrappedComponent
 * @returns {*}
 */

export function field(WrappedComponent) {
	class Field extends Component {
		state = {
			value: this.getInitialValue(),
		};

		@autobind
		getInitialValue() {
			let value = '';
			switch (this.props.type) {
			case FIELD_TYPES.NUMBER:
				value = this.props.data < this.props.min ? this.props.min : this.props.data;
				break;
			default:
				value = this.props.data;
			}
			return value;
		}

		@autobind
		updateValue(value) {
			this.setState({ value }, () => this.dispatchUpdates());
		}

		@autobind
		dispatchUpdates() {
			this.props.updatePanelData({
				depth: this.props.depth,
				index: this.props.panelIndex,
				indexMap: this.props.indexMap,
				name: this.props.name,
				value: this.state.value,
			});
		}

		render() {
			return (
				<WrappedComponent
					{...this.props}
					updateValue={this.updateValue}
					value={this.state.value}
				/>
			);
		}
	}

	const mapStateToProps = state => ({
		settings: state.settings,
	});

	Field.propTypes = {
		data: PropTypes.oneOfType([
			PropTypes.array,
			PropTypes.number,
			PropTypes.object,
			PropTypes.string,
		]),
		default: PropTypes.oneOfType([
			PropTypes.array,
			PropTypes.number,
			PropTypes.object,
			PropTypes.string,
		]),
		depth: PropTypes.number,
		description: PropTypes.string,
		dispatch: PropTypes.func,
		fields: PropTypes.array,
		indexMap: PropTypes.array,
		label: PropTypes.string,
		max: PropTypes.number,
		min: PropTypes.number,
		name: PropTypes.string,
		options: PropTypes.array,
		panelIndex: PropTypes.number,
		settings: PropTypes.object,
		type: PropTypes.string,
		updatePanelData: PropTypes.func,
	};

	Field.defaultProps = {
		data: '',
		default: '',
		depth: 0,
		description: '',
		dispatch: () => {},
		fields: [],
		indexMap: [],
		label: '',
		max: 0,
		min: 0,
		name: '',
		options: [],
		panelIndex: 0,
		settings: {},
		type: '',
		updatePanelData: () => {},
	};

	return connect(mapStateToProps)(Field);
}

export default field;
