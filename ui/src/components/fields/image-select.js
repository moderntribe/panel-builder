import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import _ from 'lodash';

import styles from './image-select.pcss';

class ImageSelect extends Component {
	@autobind
	handleChange() {
		// code to connect to actions that execute on redux store
	}

	render() {
		const imgSelectLabelClasses = classNames({
			'plimageselect-label': true,
			[styles.imageSelectLabel]: true,
		});

		const Options = _.map(this.props.options, (option) =>
			<label
				className={imgSelectLabelClasses}
				key={_.uniqueId('option-img-sel-id-')}
			>
				<input
					type="radio"
					name={this.props.name}
					value={option.value}
					onChange={this.handleChange}
					checked={this.props.default === option.value}
				/>
				<div className={styles.optionImage}><img src={option.src} alt={option.label} /></div>
				{option.label}
			</label>
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
		});

		return (
			<div className={fieldClasses}>
				<label className={labelClasses}>{this.props.label}</label>
				<div>
					{Options}
				</div>
				<p className={descriptionClasses}>{this.props.description}</p>
			</div>
		);
	}
}

ImageSelect.propTypes = {
	label: React.PropTypes.string,
	name: React.PropTypes.string,
	description: React.PropTypes.string,
	strings: React.PropTypes.array,
	default: React.PropTypes.string,
	options: React.PropTypes.array,
};

ImageSelect.defaultProps = {
	label: '',
	name: '',
	description: '',
	strings: [],
	default: '',
	options: [],
};

export default ImageSelect;
