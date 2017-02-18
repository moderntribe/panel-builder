import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import autobind from 'autobind-decorator';

import Button from './shared/button';
import PanelPreview from './shared/panel-preview';

import { UI_I18N } from '../globals/i18n';
import { BLUEPRINT_TYPES } from '../globals/config';

import * as events from '../util/events';

import styles from './panel-picker.pcss';

/**
 * Class Picker
 *
 * @package ModularContent
 *
 * The panel picker view
 */

class Picker extends Component {
	constructor(props) {
		super(props);

		this.eventNameCancel = this.props.child ? 'modern_tribe/cancel_child_picker' : 'modern_tribe/cancel_picker';
		this.eventNamePickerClosed = this.props.child ? 'modern_tribe/child_picker_closed' : 'modern_tribe/picker_closed';
		this.eventNamePickerCancelled = this.props.child ? 'modern_tribe/child_picker_cancelled' : 'modern_tribe/picker_cancelled';
		this.eventNamePickerOpened = this.props.child ? 'modern_tribe/child_picker_opened' : 'modern_tribe/picker_opened';
	}

	componentDidMount() {
		document.addEventListener(this.eventNameCancel, this.handleCancelPicker);
	}

	componentWillUnmount() {
		document.removeEventListener(this.eventNameCancel, this.handleCancelPicker);
	}

	@autobind
	handleAddPanel(type) {
		this.props.handleAddPanel({ type });
		this.props.handlePickerUpdate(false);
		events.trigger({ event: this.eventNamePickerClosed, native: false });
	}

	@autobind
	handleCancelPicker() {
		this.props.handlePickerUpdate(false);
		events.trigger({ event: this.eventNamePickerCancelled, native: false });
	}

	@autobind
	handleSpawnPicker() {
		this.props.handlePickerUpdate(true);
		events.trigger({ event: this.eventNamePickerOpened, native: false });
	}

	renderPicks() {
		return this.props.activate ? _.map(this.props.types, (blueprint, i) =>
			<PanelPreview
				key={`panel-preview-${i}`}
				{...blueprint}
				handleAddPanel={this.handleAddPanel}
			/>,
		) : null;
	}

	renderCancelButton() {
		return this.props.activate ? (
			<Button
				icon="dashicons-dismiss"
				text={UI_I18N['button.cancel_add_new']}
				bare
				classes={styles.button}
				handleClick={this.handleCancelPicker}
			/>
		) : null;
	}

	renderPickButton() {
		return !this.props.activate ? (
			<Button
				icon="dashicons-plus-alt"
				text={UI_I18N['button.add_new']}
				bare
				classes={styles.button}
				handleClick={this.handleSpawnPicker}
			/>
		) : null;
	}

	render() {
		const wrapperClasses = classNames({
			[styles.container]: true,
			'panel-picker': true,
			[this.props.classes]: this.props.classes.length,
		});

		return (
			<div className={wrapperClasses}>
				{this.renderPicks()}
				{this.renderPickButton()}
				{this.renderCancelButton()}
			</div>
		);
	}
}

Picker.propTypes = {
	activate: PropTypes.bool,
	child: PropTypes.bool,
	classes: PropTypes.string,
	data: PropTypes.object,
	handlePickerUpdate: PropTypes.func,
	handleAddPanel: PropTypes.func,
	types: PropTypes.array,
};

Picker.defaultProps = {
	activate: false,
	child: false,
	classes: '',
	data: {},
	handlePickerUpdate: () => {},
	handleAddPanel: () => {},
	types: BLUEPRINT_TYPES,
};

export default Picker;

