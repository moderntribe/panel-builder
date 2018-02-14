import React, { Component } from 'react';
import classNames from 'classnames';
import autobind from 'autobind-decorator';
import Modal from 'react-modal';

import Button from './shared/button';

import styles from './panel-dialog.pcss';

import { UI_I18N } from '../globals/i18n';
import * as events from '../util/events';

const wpWrap = document.getElementById('wpwrap');

Modal.setAppElement('#modular-content-app');

/**
 * Class Panel Dialog
 *
 * @package ModularContent
 *
 * All dialogs for the system are managed here. Event based so any component can trigger it with success/error/confirm types
 */

class Dialog extends Component {
	state = {
		active: false,
		callback: () => {},
		callbackOnClose: false,
		cancelCallback: 'modern_tribe/dialog_cancellation',
		checkBoxCallback: () => {},
		checkBoxMessage: '',
		confirm: false,
		confirmCallback: 'modern_tribe/dialog_confirmation',
		data: {},
		heading: '',
		html: '',
		largeModal: false,
		message: '',
		useCheckbox: false,
		template: '',
		type: 'success',
	};

	componentDidMount() {
		document.addEventListener('modern_tribe/open_dialog', this.openDialog);
		document.addEventListener('modern_tribe/close_dialog', this.closeDialog);
	}

	componentWillUnmount() {
		document.removeEventListener('modern_tribe/open_dialog', this.openDialog);
		document.removeEventListener('modern_tribe/close_dialog', this.closeDialog);
	}

	getPageTitle() {
		const title = document.getElementById('title');
		return title ? title.value : '';
	}

	@autobind
	closeDialog() {
		this.setState({ active: false });

		if (wpWrap) {
			wpWrap.classList.remove(styles.blur);
		}

		if (this.state.callbackOnClose) {
			this.state.callback();
		}
	}

	@autobind
	handleConfirm() {
		const callbackData = {};
		if (this.state.template === 'confirmPanelSetTitle') {
			// special case for the panel set dialog, dont allow confirm if no title set
			const panelTitle = this.panelTitle.value;
			if (!panelTitle.trim().length) {
				return;
			}
			callbackData.panelTitle = panelTitle;
		}
		this.closeDialog();
		events.trigger({
			event: this.state.confirmCallback,
			native: false,
			data: this.state.data,
		});
		this.state.callback(callbackData);
	}

	@autobind
	openDialog(e) {
		this.setState({
			active: true,
			callback: e.detail.callback ? e.detail.callback : () => {},
			callbackOnClose: e.detail.callbackOnClose ? e.detail.callbackOnClose : false,
			cancelCallback: e.detail.cancelCallback ? e.detail.cancelCallback : 'modern_tribe/dialog_cancellation',
			checkBoxCallback: e.detail.checkBoxCallback ? e.detail.checkBoxCallback : () => {},
			checkBoxMessage: e.detail.checkBoxMessage ? e.detail.checkBoxMessage : '',
			confirm: e.detail.confirm ? e.detail.confirm : false,
			confirmCallback: e.detail.confirmCallback ? e.detail.confirmCallback : 'modern_tribe/dialog_confirmation',
			data: e.detail.data ? e.detail.data : {},
			heading: e.detail.heading ? e.detail.heading : '',
			html: e.detail.html ? e.detail.html : '',
			largeModal: e.detail.largeModal ? e.detail.largeModal : false,
			message: e.detail.message ? e.detail.message : '',
			template: e.detail.template ? e.detail.template : '',
			type: e.detail.type ? e.detail.type : 'success',
			useCheckbox: e.detail.useCheckbox ? e.detail.useCheckbox : false,
		});

		if (wpWrap) {
			wpWrap.classList.add(styles.blur);
		}
	}

	confirmPanelSetTitle() {
		return <input ref={r => this.panelTitle = r} className={styles.input} type="text" name="panel-set-title" defaultValue={this.getPageTitle()} />;
	}

	renderMessage() {
		let Message;
		if (this.state.template.length) {
			if (this.state.template === 'confirmPanelSetTitle') {
				Message = this.confirmPanelSetTitle();
			}
		} else if (this.state.message.length) {
			Message = (
				<div className={styles.message}>
					<p>{this.state.message}</p>
				</div>
				);
		}
		return Message;
	}

	renderArbitraryHTML() {
		let HTML;
		if (this.state.html.length) {
			HTML = (
				<div className={styles.html} dangerouslySetInnerHTML={{ __html: this.state.html }} />
			);
		}
		return HTML;
	}

	renderCheckbox() {
		let Checkbox;
		if (this.state.checkBoxMessage.length) {
			Checkbox = (
				<div className={styles.checkbox}>
					<input type="checkbox" onChange={this.state.checkBoxCallback} />
					{this.state.checkBoxMessage}
				</div>
			);
		}
		return Checkbox;
	}

	renderButtons() {
		let Buttons;
		if (this.state.confirm) {
			Buttons = (
				<div className={styles.buttons}>
					<Button
						handleClick={this.handleConfirm}
						text={UI_I18N['button.confirm']}
						full={false}
						primary={false}
						classes={styles.confirmButton}
					/>
					<Button
						handleClick={this.closeDialog}
						text={UI_I18N['button.cancel']}
						bare
						full={false}
						classes={styles.cancelButton}
					/>
				</div>
			);
		}

		return Buttons;
	}

	renderModalContent() {
		const modalClasses = classNames({
			[styles.error]: this.state.type === 'error',
			[styles.success]: this.state.type === 'success',
			[styles.confirm]: this.state.type === 'confirm',
			[styles.outer]: true,
		});

		return (
			<div className={modalClasses}>
				<div className={styles.inner}>
					<span className={styles.icon} />
					{this.state.heading.length && <h4>{this.state.heading}</h4>}
					{this.renderMessage()}
					{this.renderArbitraryHTML()}
					{this.renderCheckbox()}
					{this.renderButtons()}
				</div>
			</div>
		);
	}

	render() {
		const wrapperClasses = classNames({
			[styles.large]: this.state.largeModal,
			[styles.modal]: true,
		});

		return (
			<Modal
				isOpen={this.state.active}
				onRequestClose={this.closeDialog}
				className={wrapperClasses}
				overlayClassName={styles.overlay}
				contentLabel="Modal"
			>
				<Button
					handleClick={this.closeDialog}
					bare
					full={false}
					icon="dashicons-no"
					classes={styles.close}
				/>
				{this.renderModalContent()}
			</Modal>
		);
	}
}

export default Dialog;

