import React, { PropTypes } from 'react';
import classNames from 'classnames';

import Expander from './shared/expander';
import Button from './shared/button';

import { UI_I18N } from '../globals/i18n';
import { TEMPLATE_SAVER } from '../globals/config';

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
	const shouldRender = () => !props.active;
	const shouldRenderLiveEdit = () => !props.liveEdit;
	const shouldRenderExpander = () => props.liveEdit;
	const canSavePanelSet = () => TEMPLATE_SAVER.enabled && props.count > 0 && !props.panelSetPickerEditLink.length && !props.pickerActive;
	const canEditPanelSet = () => TEMPLATE_SAVER.enabled && props.panelSetPickerEditLink.length && !props.pickerActive;

	// dynamic classes
	const wrapperClasses = classNames({
		[styles.wrapper]: true,
		[styles.liveEdit]: props.liveEdit,
		[styles.setsActive]: props.panelSetPickerActive,
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

	const renderEditPanelSet = () => {
		let EditSet;
		if (canEditPanelSet()) {
			EditSet = (
				<a href={props.panelSetPickerEditLink} className={styles.editSet} target="_blank">
					<i className={styles.editIcon} />
					{UI_I18N['button.edit_template']}
				</a>
			);
		}

		return EditSet;
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
					classes={liveEditClasses}
					icon="yes"
					useLoader
					showLoader={props.triggerLiveEdit}
				/>
			);
		}

		return LiveEdit;
	};

	const renderExpander = () => { //eslint-disable-line
		return shouldRenderExpander() ? <Expander handleClick={props.handleExpanderClick} /> : null;
	};

	// render
	return shouldRender() ? (
		<header className={wrapperClasses}>
			{!props.panelSetPickerActive && !props.pickerActive &&
				<span className={styles.heading}>{UI_I18N['heading.active_panels']}</span>
			}
			{props.pickerActive &&
				<span className={styles.heading}>{UI_I18N['heading.choose_panel']}</span>
			}
			{renderLaunchLiveEdit()}
			{renderSavePanelSet()}
			{renderEditPanelSet()}
			{renderExpander()}
		</header>
	) : null;
};

CollectionHeader.propTypes = {
	handleSavePanelSet: PropTypes.func,
	handleLiveEditClick: PropTypes.func,
	handleExpanderClick: PropTypes.func,
	active: PropTypes.bool,
	count: PropTypes.number,
	panelSetPickerEditLink: PropTypes.string,
	panelSetPickerActive: PropTypes.bool,
	pickerActive: PropTypes.bool,
	liveEdit: PropTypes.bool,
	triggerLiveEdit: PropTypes.bool,
};

CollectionHeader.defaultProps = {
	handleSavePanelSet: () => {},
	handleLiveEditClick: () => {},
	handleExpanderClick: () => {},
	active: false,
	count: 0,
	panelSetPickerEditLink: '',
	panelSetPickerActive: false,
	pickerActive: false,
	liveEdit: false,
	triggerLiveEdit: false,
};

export default CollectionHeader;
