import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import autobind from 'autobind-decorator';

import PanelSetPreview from './shared/panel-set-preview';

import { TEMPLATES } from '../globals/config';
import { UI_I18N } from '../globals/i18n';

import styles from './panel-sets-picker.pcss';

/**
 * Class PanelSetsPicker
 *
 * @package ModularContent
 *
 * The panel set picker
 */

class PanelSetsPicker extends Component {
	state = {
		preview: '',
	};

	@autobind
	togglePreview(preview = '') {
		this.setState({ preview });
	}

	renderStartPageFromScratch() {
		return (
			<div className={styles.newPage} onClick={this.props.handleStartNewPage}>
				<div className={styles.createIcon}></div>
				<h3 className={styles.createHeader}>{UI_I18N['heading.start_from_scr']}</h3>
			</div>
		);
	}

	renderPanelSets() {
		const PanelSetPreviews = _.map(TEMPLATES, (template, i) =>
			<PanelSetPreview
				key={`panel-preview-${i}`}
				{...template}
				togglePreview={this.togglePreview}
				handleAddPanelSet={this.props.handleAddPanelSet}
			/>
		);

		return (
			<div className={styles.container}>
				{PanelSetPreviews}
			</div>
		);
	}

	renderActivePreview() {
		return this.state.preview ? (
			<div className={styles.preview}>
				<img src={this.state.preview} role="presentation" />
			</div>
		) : null;
	}

	render() {
		return (
			<div className={styles.container}>
				<div className={styles.inner}>
					<h3 className={styles.actionHeader}>{UI_I18N['heading.start_new_page']}</h3>
					{this.renderStartPageFromScratch()}
					<h3 className={styles.actionHeader}>{UI_I18N['heading.start_from_set']}</h3>
					{this.renderPanelSets()}
				</div>
				{this.renderActivePreview()}
			</div>
		);
	}
}

PanelSetsPicker.propTypes = {
	data: PropTypes.object,
	handlePickerUpdate: PropTypes.func,
	handleAddPanelSet: PropTypes.func,
	handleStartNewPage: PropTypes.func,
};

PanelSetsPicker.defaultProps = {
	data: {},
	handlePickerUpdate: () => {},
	handleAddPanelSet: () => {},
	handleStartNewPage: () => {},
};

export default PanelSetsPicker;

