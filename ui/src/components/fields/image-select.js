import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

import styles from './image-select.pcss';

class ImageSelect extends Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange() {
		// code to connect to actions that execute on redux store
	}

	render() {

		const imgSelectLabelClasses = classNames({
			'plimageselect-label': true,
			[styles.imageSelectLabel]: true,
		});

		console.log("this.props.options",this.props.options);

		const Options = _.map(this.props.options, (option) =>
			<label
				className={imgSelectLabelClasses }
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

		return (
			<div className={styles.panel}>
				<label className={styles.label}>{this.props.label}</label>
				<div>
					{Options}
				</div>
				<p className={styles.description}>{this.props.description}</p>
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
