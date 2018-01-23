import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import _ from 'lodash';

import styles from './image-select.pcss';

class ImageSelect extends Component {
	state = {
		value: this.props.data,
	};

	@autobind
	handleChange(e) {
		const value = e.currentTarget.value;
		this.setState({ value });
		this.props.updatePanelData({
			depth: this.props.depth,
			indexMap: this.props.indexMap,
			name: this.props.name,
			value,
		});
	}

	render() {
		const imgSelectLabelClasses = classNames({
			'plimageselect-label': true,
			[styles.imageSelectLabel]: true,
		});

		const Options = _.map(this.props.options, option =>
			(<label
				className={imgSelectLabelClasses}
				key={_.uniqueId('option-img-sel-id-')}
			>
				<input
					type="radio"
					name={`modular-content-${this.props.name}`}
					value={option.value}
					onChange={this.handleChange}
					checked={this.state.value === option.value}
					data-option-type="single"
					data-field="image-select"
				/>
				<div
					className={styles.optionImage}
				>
					<span className={styles.optInner}>
						<img src={option.src} alt={option.label} />
					</span>
				</div>
				{option.label}
			</label>),
		);

		const labelClasses = classNames({
			[styles.label]: true,
			'panel-field-label': true,
		});
		const descriptionClasses = classNames({
			[styles.description]: true,
			'panel-field-description': true,
		});
		const fieldClasses = classNames({
			[styles.field]: true,
			'panel-field': true,
			'panel-conditional-field': true,
		});

		return (
			<div className={fieldClasses}>
				<label className={labelClasses}>{this.props.label}</label>
				<div className={styles.container}>
					{Options}
				</div>
				<p className={descriptionClasses}>{this.props.description}</p>
			</div>
		);
	}
}

ImageSelect.propTypes = {
	label: PropTypes.string,
	name: PropTypes.string,
	description: PropTypes.string,
	strings: PropTypes.object,
	indexMap: PropTypes.array,
	depth: PropTypes.number,
	default: PropTypes.string,
	options: PropTypes.array,
	data: PropTypes.string,
	panelIndex: PropTypes.number,
	updatePanelData: PropTypes.func,
};

ImageSelect.defaultProps = {
	label: '',
	name: '',
	description: '',
	indexMap: [],
	strings: {},
	depth: 0,
	default: '',
	options: [],
	data: '',
	panelIndex: 0,
	updatePanelData: () => {},
};

export default ImageSelect;
