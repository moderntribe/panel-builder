import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import autobind from 'autobind-decorator';
import Button from './shared/button';

import componentMap from './fields/component-map';

import styles from './panel.pcss';

class PanelContainer extends Component {
	state = {
		active: false,
	};

	getFields() {
		let FieldContainer = null;
		const Fields = this.state.active ? _.map(this.props.fields, (field) => {
			const Field = componentMap[field.type.replace(/\\/g, '')];
			if (!Field) {
				return null;
			}

			const classes = classNames({
				[styles.field]: true,
				'panel-input': true,
				[`input-name-${field.name.toLowerCase()}`]: true,
				[`input-type-${field.type.toLowerCase()}`]: true,
			});

			return (
				<div className={classes} key={_.uniqueId('field-id-')}>
					<Field
						{...field}
						panelIndex={this.props.index}
						data={this.props.data[field.name]}
						updatePanelData={this.props.updatePanelData}
					/>
				</div>
			);
		}) : null;

		if (this.state.active) {
			const fieldClasses = classNames({
				[styles.fields]: true,
				'panel-row-fields': true,
			});
			const fieldInnerClasses = classNames({
				[styles.inner]: true,
			});

			FieldContainer = (
				<div className={fieldClasses}>
					<div className={fieldInnerClasses}>
						<nav className={styles.back}>
							<Button
								text="Back to Panels"
								handleClick={this.handleClick}
							/>
						</nav>
						{Fields}
					</div>
				</div>
			);
		}

		return FieldContainer;
	}

	@autobind
	handleClick() {
		this.setState({
			active: !this.state.active,
		});
		this.props.panelsActive(!this.state.active);
	}

	render() {
		const wrapperClasses = classNames({
			[styles.row]: true,
			[`panel-type-${this.props.type}`]: true,
			[`panel-depth-${this.props.depth}`]: true,
		});
		const headerClasses = classNames({
			[styles.header]: true,
			'panel-row-header': true,
		});
		const arrowClasses = classNames({
			dashicons: true,
			[styles.arrow]: true,
			'panel-row-arrow': true,
			'dashicons-arrow-right-alt2': true,
		});

		return (
			<div className={wrapperClasses}>
				<div className={headerClasses} onClick={this.handleClick}>
					<h3>{this.props.label}</h3>
					<i className={arrowClasses} />
				</div>
				{this.getFields()}
			</div>
		);
	}
}

PanelContainer.propTypes = {
	data: React.PropTypes.object,
	depth: React.PropTypes.number,
	index: React.PropTypes.number,
	type: React.PropTypes.string,
	label: React.PropTypes.string,
	description: React.PropTypes.string,
	icon: React.PropTypes.object,
	fields: React.PropTypes.array,
	panelsActive: PropTypes.func,
	movePanel: PropTypes.func,
	updatePanelData: PropTypes.func,
};

PanelContainer.defaultProps = {
	data: {},
	depth: 0,
	index: 0,
	type: '',
	label: '',
	description: '',
	icon: {},
	fields: [],
	panelsActive: () => {
	},
	movePanel: () => {
	},
	updatePanelData: () => {
	},
};

export default PanelContainer;
