import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import ReactSelect from 'react-select-plus';

import styles from './post-list-max-chooser.pcss';

class PostListMaxChooser extends Component {
	/**
	 *  Options for the max selected dropdown
	 *  Fills with range based on min and max
	 *
	 * @method getOptions
	 */
	getOptions() {
		const options = [];
		for (let m = this.props.min; m <= this.props.max; m++) {
			options.push({
				label: m,
				value: m,
			});
		}
		return options;
	}

	/**
	 *  Handler when max select is changed
	 *
	 * @method handleMaxChange
	 */
	@autobind
	handleMaxChange(value) {
		this.props.onChange(value);
	}

	render() {
		return (
			<div>
				<label className={styles.label}>{this.props.strings['label.max_results']}</label>
				<span className={styles.inputContainer}>
					<ReactSelect
						value={this.props.maxSelected}
						options={this.getOptions()}
						onChange={this.handleMaxChange}
						clearable={false}
					/>
				</span>
			</div>
		);
	}
}

PostListMaxChooser.propTypes = {
	max: PropTypes.number,
	min: PropTypes.number,
	maxSelected: PropTypes.number,
	onChange: PropTypes.func,
	strings: React.PropTypes.object,
};

PostListMaxChooser.defaultProps = {
	max: 10,
	min: 1,
	maxSelected: 5,
	onChange: () => {},
	strings: {},
};

export default PostListMaxChooser;
