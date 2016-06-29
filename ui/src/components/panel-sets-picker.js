import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import autobind from 'autobind-decorator';

import PanelSetPreview from './shared/panel-set-preview';

import { UI_I18N } from '../globals/i18n';
import { TEMPLATES } from '../globals/config';

import styles from './panel-sets-picker.pcss';

/**
 * Class PanelSetsPicker
 *
 * @package ModularContent
 *
 * The panel set picker
 */

class PanelSetsPicker extends Component {

	renderStartPageFromScratch() {
		return (
			<div className={styles.newPage} onClick={this.props.handleStartNewPage}>
				<div className={styles.createIcon}></div>
				<h3 className={styles.createHeader}>Create Page From Scratch</h3>
			</div>
		);
	}

	@autobind
	handleAddPanelSet(panelSet) {
		this.props.handleAddPanelSet(panelSet);
	}

	renderPanelSets() {
		const panels = _.map(TEMPLATES, (template, i) =>
			<PanelSetPreview
				key={`panel-preview-${i}`}
				{...template}
				handleAddPanelSet={this.handleAddPanelSet}
				handleOnMouseover={this.props.handleShowPanelSetThumbnail}
				handleOnMouseout={this.props.handleHidePanelSetThumbnail}
			/>
		);
		return (
			<div className={styles.container}>
				{panels}
			</div>
		);
	}

	render() {
		const wrapperClasses = classNames({
			[styles.container]: true,
		});

		return (
			<div className={wrapperClasses}>
				<h3 className={styles.actionHeader}>Start a New Page</h3>
				{this.renderStartPageFromScratch()}
				<h3 className={styles.actionHeader}>Or Start from a Page Set</h3>
				{this.renderPanelSets()}
			</div>
		);
	}
}

PanelSetsPicker.propTypes = {
	data: PropTypes.object,
	handlePickerUpdate: PropTypes.func,
	handleAddPanelSet: PropTypes.func,
	handleStartNewPage: PropTypes.func,
	handleShowPanelSetThumbnail: PropTypes.func,
	handleHidePanelSetThumbnail: PropTypes.func,
};

PanelSetsPicker.defaultProps = {
	data: {},
	handlePickerUpdate: () => {},
	handleAddPanelSet: () => {},
	handleStartNewPage: () => {},
	handleShowPanelSetThumbnail: () => {},
	handleHidePanelSetThumbnail: () => {},
};

export default PanelSetsPicker;

