import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import autobind from 'autobind-decorator';

import Button from './shared/button';
import PanelPreview from './shared/panel-preview';

import { UI_I18N } from '../globals/i18n';
import { BLUEPRINTS } from '../globals/config';

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
			<div className={styles.newPage}>
				<div className={styles.createIcon}></div>
				<h2 className={styles.createHeader}>Create Page From Scratch</h2>
			</div>
		);
	}

	renderPanelSets() {
		return (
			<div>
				list of panel sets
			</div>
		);
	}

	render() {
		const wrapperClasses = classNames({
			[styles.container]: true,
		});

		return (
			<div className={wrapperClasses}>
				<h3 className={styles.h3}>Start a New Page</h3>
				{this.renderStartPageFromScratch()}
				<h3 className={styles.h3}>Or Start from a Page Set</h3>
				{this.renderPanelSets()}
			</div>
		);
	}
}

PanelSetsPicker.propTypes = {
	data: PropTypes.object,
	handlePickerUpdate: PropTypes.func,
	handleAddPanel: PropTypes.func,
};

PanelSetsPicker.defaultProps = {
	data: {},
	handlePickerUpdate: () => {},
	handleAddPanel: () => {},
};

export default PanelSetsPicker;

