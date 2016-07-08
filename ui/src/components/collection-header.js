import React, { PropTypes } from 'react';
import classNames from 'classnames';
import Modal from 'react-modal';

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
	const shouldRender = () => !props.panelSetPickerActive && !props.pickerActive && !props.active;
	const shouldRenderLiveEdit = () => !props.liveEdit;
	const canSavePanelSet = () => TEMPLATE_SAVER.enabled && props.count > 0 && !props.panelSetPickerEditLink.length;
	const canEditPanelSet = () => TEMPLATE_SAVER.enabled && props.panelSetPickerEditLink.length;

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

	const renderEditPanelSet = () => {
		let EditSet;
		if (canEditPanelSet()) {
			EditSet = (
				<a href={props.panelSetPickerEditLink} target="_blank">
					<i className="icon-edit" />
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
					icon="dashicons-visibility"
					classes={liveEditClasses}
				/>
			);
		}

		return LiveEdit;
	};

	const modalContent = () => {
		let Content;
		if (props.panelSetSaveError) {
			Content = (
				<div>Error</div>
			);
		} else {
			Content = (
				<div>Success</div>
			);
		}
		return Content;
	};

	const renderModal = () => (
		<Modal
			isOpen={props.panelSetModalIsOpen}
			onRequestClose={props.closeModal}
			className={styles.modal}
		    overlayClassName={styles.overlay}
		>
			<h2>Hello</h2>
			<button onClick={props.closeModal}>close</button>
			{modalContent()}
		</Modal>
	);

	// render
	return shouldRender() ? (
		<header className={wrapperClasses}>
			<span className={styles.heading}>{UI_I18N['heading.active_panels']}</span>
			{renderLaunchLiveEdit()}
			{renderSavePanelSet()}
			{renderEditPanelSet()}
			{renderModal()}
		</header>
	) : null;
};

CollectionHeader.propTypes = {
	handleSavePanelSet: PropTypes.func,
	handleLiveEditClick: PropTypes.func,
	closeModal: PropTypes.func,
	active: PropTypes.bool,
	count: PropTypes.number,
	panelSetSaveError: PropTypes.bool,
	panelSetModalIsOpen: PropTypes.bool,
	panelSetPickerEditLink: PropTypes.string,
	panelSetPickerActive: PropTypes.bool,
	pickerActive: PropTypes.bool,
	liveEdit: PropTypes.bool,
};

CollectionHeader.defaultProps = {
	handleSavePanelSet: () => {},
	handleLiveEditClick: () => {},
	closeModal: () => {},
	active: false,
	count: 0,
	panelSetSaveError: false,
	panelSetModalIsOpen: false,
	panelSetPickerEditLink: '',
	panelSetPickerActive: false,
	pickerActive: false,
	liveEdit: false,
};

export default CollectionHeader;
