import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';

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
		name: PropTypes.string,
		options: PropTypes.array,
		panelIndex: PropTypes.number,
		settings: PropTypes.object,
		updatePanelData: PropTypes.func,
	};

	Field.defaultProps = {
		default: '',
		depth: 0,
		description: '',
		dispatch: () => {},
		fields: [],
		indexMap: [],
		label: '',
		name: '',
		options: [],
		panelIndex: 0,
		settings: {},
		updatePanelData: () => {},
	};

	return connect(mapStateToProps)(Field);
}

export default field;
