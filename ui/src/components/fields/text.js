import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';

import styles from './text.pcss';
import * as styleUtil from '../../util/dom/styles';

class Text extends Component {

	state = {
		text: this.props.data,
	};

	/**
	 * Handler for changes to the text field. Initiates panel update call.
	 *
	 * @method handleChange
	 */
	@autobind
	handleChange(e) {
		const text = e.currentTarget.value;
		this.setState({ text });
		this.props.updatePanelData({
			depth: this.props.depth,
			index: this.props.panelIndex,
			indexMap: this.props.indexMap,
			name: this.props.name,
			value: text,
		});
	}

	render() {
		const { fieldClasses, descriptionClasses, labelClasses } = styleUtil.defaultFieldClasses(styles);
		return (
			<div className={fieldClasses}>
				<label className={labelClasses}>{this.props.label}</label>
				<span className={styles.inputContainer}>
					<input type="text" name={`modular-content-${this.props.name}`} value={this.state.text} size="40" onChange={this.handleChange} />
				</span>
				<p className={descriptionClasses}>{this.props.description}</p>
			</div>
		);
	}
}

Text.propTypes = {
	data: PropTypes.string,
	panelIndex: PropTypes.number,
	label: PropTypes.string,
	name: PropTypes.string,
	description: PropTypes.string,
	depth: PropTypes.number,
	indexMap: PropTypes.array,
	strings: PropTypes.object,
	default: PropTypes.string,
	updatePanelData: PropTypes.func,
};

Text.defaultProps = {
	data: '',
	panelIndex: 0,
	label: '',
	name: '',
	description: '',
	indexMap: [],
	depth: 0,
	strings: {},
	default: '',
	updatePanelData: () => {},
};

export default Text;
