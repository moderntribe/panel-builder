import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import classNames from 'classnames';

import LinkGroup from '../shared/link-group';
import styles from './link.pcss';

class Link extends Component {
	state = {
		url: this.props.data.url,
		label: this.props.data.label,
		target: this.props.data.target,
	};

	getValue() {
		return {
			url: this.state.url,
			target: this.state.target,
			label: this.state.label,
		};
	}

	@autobind
	initiateUpdatePanelData() {
		this.props.updatePanelData({
			depth: this.props.depth,
			indexMap: this.props.indexMap,
			name: this.props.name,
			value: this.getValue(),
		});
	}

	@autobind
	handleURLChange(e) {
		const url = e.currentTarget.value;
		this.setState({ url }, this.initiateUpdatePanelData);
	}

	@autobind
	handleLabelChange(e) {
		const label = e.currentTarget.value;
		this.setState({ label }, this.initiateUpdatePanelData);
	}

	@autobind
	handleSelectChange(data) {
		const target = data.value.length ? data.value : '_self';
		this.setState({ target }, this.initiateUpdatePanelData);
	}

	render() {
		const fieldClasses = classNames({
			[styles.field]: true,
			'panel-field': true,
		});
		const labelClasses = classNames({
			[styles.label]: true,
			'panel-field-label': true,
		});
		const descriptionClasses = classNames({
			[styles.description]: true,
			'panel-field-description': true,
		});

		return (
			<div className={fieldClasses}>
				<fieldset className={styles.fieldset}>
					<legend className={labelClasses}>{this.props.label}</legend>
					<LinkGroup handleTargetChange={this.handleSelectChange} handleLabelChange={this.handleLabelChange} handleURLChange={this.handleURLChange} valueTarget={this.state.target} valueUrl={this.state.url} valueLabel={this.state.label} strings={this.props.strings} />
					<p className={descriptionClasses}>{this.props.description}</p>
				</fieldset>
			</div>
		);
	}
}

Link.propTypes = {
	label: PropTypes.string,
	name: PropTypes.string,
	depth: React.PropTypes.number,
	description: PropTypes.string,
	indexMap: React.PropTypes.array,
	strings: PropTypes.object,
	default: React.PropTypes.object,
	data: PropTypes.object,
	panelIndex: PropTypes.number,
	updatePanelData: PropTypes.func,
};

Link.defaultProps = {
	label: '',
	name: '',
	depth: 0,
	description: '',
	indexMap: [],
	strings: {},
	default: {},
	data: {},
	panelIndex: 0,
	updatePanelData: () => {},
};

export default Link;
