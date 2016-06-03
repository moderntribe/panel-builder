import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import LinkGroup from '../shared/link-group';

import classNames from 'classnames';

import styles from './link.pcss';

class Link extends Component {
	state = {
		url: this.props.data.url ? this.props.data.url : this.props.default.url,
		label: this.props.data.label ? this.props.data.label : this.props.default.label,
		target: this.props.data.target ? this.props.data.target : this.props.default.target,
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
			index: this.props.panelIndex,
			name: this.props.name,
			value: this.getValue(),
		});
	}

	@autobind
	handleURLChange(e) {
		const url = e.currentTarget.value;
		this.setState({ url });
		this.initiateUpdatePanelData();
	}

	@autobind
	handleLabelChange(e) {
		const label = e.currentTarget.value;
		this.setState({ label });
		this.initiateUpdatePanelData();
	}

	@autobind
	handleSelectChange(data) {
		const target = data.value.length ? data.value : '_self';
		this.setState({ target }, () => {
			this.initiateUpdatePanelData();
		});
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
					<LinkGroup handleTargetChange={this.handleSelectChange} handleLabelChange={this.handleLabelChange} handleURLChange={this.handleURLChange} valueTarget={this.state.target} valueUrl={this.state.url} valueLabel={this.state.label} />
					<p className={descriptionClasses}>{this.props.description}</p>
				</fieldset>
			</div>
		);
	}
}

Link.propTypes = {
	label: PropTypes.string,
	name: PropTypes.string,
	description: PropTypes.string,
	strings: PropTypes.array,
	default: React.PropTypes.object,
	data: PropTypes.object,
	panelIndex: PropTypes.number,
	updatePanelData: PropTypes.func,
};

Link.defaultProps = {
	label: '',
	name: '',
	description: '',
	strings: [],
	default: {},
	data: {},
	panelIndex: 0,
	updatePanelData: () => {},
};

export default Link;
