import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import autobind from 'autobind-decorator';

import Button from './shared/button';
import PanelPreview from './shared/panel-preview';

import { UI_I18N } from '../globals/i18n';
import { BLUEPRINTS } from '../globals/config';

import styles from './picker.pcss';

/**
 * Class Picker
 *
 * @package ModularContent
 *
 * The panel picker view
 */

class Picker extends Component {
	state = {
		active: false,
	};

	@autobind
	handleAddPanel(type) {
		this.props.handleAddPanel({ type });
		this.handleCancelPicker();
	}

	@autobind
	handleCancelPicker() {
		this.setState({ active: false });
		this.props.handlePickerUpdate(false);
	}

	@autobind
	handleSpawnPicker() {
		this.setState({ active: true });
		this.props.handlePickerUpdate(true);
	}

	renderPicks() {
		return this.state.active ? _.map(BLUEPRINTS, (blueprint, i) =>
			<PanelPreview
				key={`panel-preview-${i}`}
				{...blueprint}
				handleAddPanel={this.handleAddPanel}
			/>
		) : null;
	}

	renderCancelButton() {
		return this.state.active ? (
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
		return !this.state.active ? (
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
	data: PropTypes.object,
	handlePickerUpdate: PropTypes.func,
	handleAddPanel: PropTypes.func,
};

Picker.defaultProps = {
	data: {},
	handlePickerUpdate: () => {},
	handleAddPanel: () => {},
};

export default Picker;

