import React, { PropTypes } from 'react';
import classNames from 'classnames';

import Button from './shared/button';

import { UI_I18N } from '../globals/i18n';

import styles from './collection-header.pcss';

/**
 * Stateless component for header above panel collection
 *
 * @param props
 * @returns {XML}
 * @constructor
 */

const CollectionHeader = (props) => {
	// render logic
	const shouldRender = () => !props.panelSetPickerActive && !props.pickerActive && !props.active;
	const shouldRenderLiveEdit = () => !props.liveEdit;
	const canSavePanelSet = () => props.count > 0;

	// dynamic classes
	const wrapperClasses = classNames({
		[styles.wrapper]: true,
		[styles.liveEdit]: props.liveEdit,
	});

	const panelSetClasses = classNames({
		[styles.saveSet]: true,
	});

	const liveEditClasses = classNames({
		[styles.editButton]: true,
	});

	// render partials
	const renderSavePanelSet = () => {
		let SaveSet;
		if (canSavePanelSet()) {
			SaveSet = (
				<Button
					text={UI_I18N['button.save_as_template']}
					handleClick={props.handleSavePanelSet}
					bare
					full={false}
					icon="icon-save"
					classes={panelSetClasses}
				/>
			);
		}

		return SaveSet;
	};

	const renderLaunchLiveEdit = () => {
		let LiveEdit;
		if (shouldRenderLiveEdit()) {
			LiveEdit = (
				<Button
					text={UI_I18N['button.launch_edit']}
					handleClick={props.handleLiveEditClick}
					primary={false}
					full={false}
					icon="dashicons-visibility"
					classes={liveEditClasses}
				/>
			);
		}

		return LiveEdit;
	};

	// render
	return shouldRender() ? (
		<header className={wrapperClasses}>
			<span className={styles.heading}>{UI_I18N['heading.active_panels']}</span>
			{renderLaunchLiveEdit()}
			{renderSavePanelSet()}
		</header>
	) : null;
};

CollectionHeader.propTypes = {
	handleSavePanelSet: PropTypes.func,
	handleLiveEditClick: PropTypes.func,
	active: PropTypes.bool,
	count: PropTypes.number,
	panelSetPickerActive: PropTypes.bool,
	pickerActive: PropTypes.bool,
	liveEdit: PropTypes.bool,
};

CollectionHeader.defaultProps = {
	handleSavePanelSet: () => {},
	handleLiveEditClick: () => {},
	active: false,
	count: 0,
	panelSetPickerActive: false,
	pickerActive: false,
	liveEdit: false,
};

export default CollectionHeader;
