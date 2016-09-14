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
	componentDidMount() {
		document.addEventListener('modern_tribe/cancel_picker', this.handleCancelPicker);
	}

	componentWillUnmount() {
		document.removeEventListener('modern_tribe/cancel_picker', this.handleCancelPicker);
	}

	@autobind
	handleAddPanel(type) {
		this.props.handleAddPanel({ type });
		this.props.handlePickerUpdate(false);
		events.trigger({ event: 'modern_tribe/picker_closed', native: false });
	}

	@autobind
	handleCancelPicker() {
		this.props.handlePickerUpdate(false);
		events.trigger({ event: 'modern_tribe/picker_cancelled', native: false });
	}

	@autobind
	handleSpawnPicker() {
		this.props.handlePickerUpdate(true);
		events.trigger({ event: 'modern_tribe/picker_opened', native: false });
	}

	renderPicks() {
		return this.props.activate ? _.map(BLUEPRINT_TYPES, (blueprint, i) =>
			<PanelPreview
				key={`panel-preview-${i}`}
				{...blueprint}
				handleAddPanel={this.handleAddPanel}
			/>
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
	data: PropTypes.object,
	handlePickerUpdate: PropTypes.func,
	handleAddPanel: PropTypes.func,
};

Picker.defaultProps = {
	activate: false,
	data: {},
	handlePickerUpdate: () => {},
	handleAddPanel: () => {},
};

export default Picker;

