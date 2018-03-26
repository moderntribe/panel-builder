import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import autobind from 'autobind-decorator';

import Button from './shared/button';
import RefreshRate from './shared/refresh-rate';

import { UI_I18N } from '../globals/i18n';
import * as events from '../util/events';
import * as storage from '../util/storage/local';

import styles from './collection-edit-bar.pcss';
import * as EVENTS from '../constants/events';

/**
 * Stateless component for top bar when in live edit mode
 *
 * @param props
 * @returns {XML}
 * @constructor
 */

class EditBar extends Component {

	componentDidMount() {
		this.setup();
		document.addEventListener(EVENTS.IFRAME_CHANGE_VIEWPORT, this.changeViewport);
	}

	componentWillUnmount() {
		this.reset();
		document.removeEventListener(EVENTS.IFRAME_CHANGE_VIEWPORT, this.changeViewport);
	}

	setup() {
		this.lockBody();
		_.delay(() => this.wrapper.classList.add(styles.loaded), 25);
	}

	@autobind
	setSizeFull() {
		this.props.handleResizeClick('full');
	}

	@autobind
	setSizeTablet() {
		this.props.handleResizeClick('tablet');
	}

	@autobind
	setSizeMobile() {
		this.props.handleResizeClick('mobile');
	}

	@autobind
	changeViewport(e) {
		this.props.handleResizeClick(e.detail.viewport);
	}

	toggleUnsavedDataMessage(e) {
		if (e.target.checked) {
			storage.put('modular_content_unsaved_prompt_hide', '1');
			return;
		}
		storage.remove('modular_content_unsaved_prompt_hide');
	}

	/**
	 * Handles closing live preview. Will check local storage to see if the user has opted out of
	 * unsaved data messaging. If not prompts if dirty data is found.
	 */

	@autobind
	handleCancel() {
		if (storage.get('modular_content_unsaved_prompt_hide')) {
			this.props.handleCancelClick();
			return;
		}
		if (this.props.dataIsDirty()) {
			events.trigger({
				event: 'modern_tribe/open_dialog',
				native: false,
				data: {
					callback: () => this.props.handleCancelClick(),
					callbackOnClose: true,
					checkBoxCallback: e => this.toggleUnsavedDataMessage(e),
					checkBoxMessage: UI_I18N['message.unsaved_toggle'],
					contentStyles: { height: '360px', marginTop: '-180px' },
					heading: UI_I18N['heading.unsaved_data'],
					largeModal: true,
					message: UI_I18N['message.unsaved_data'],
					saveConfirm: true,
					shouldCloseOnEsc: false,
					shouldCloseOnOverlayClick: false,
					type: 'confirm',
				},
			});
			return;
		}
		this.props.handleCancelClick();
	}

	reset() {
		this.unLockBody();
	}

	publishPost() {
		const postForm = document.getElementById('publish');
		if (postForm) {
			postForm.click();
		}
	}

	lockBody() {
		const html = document.getElementsByTagName('html')[0];
		html.style.overflow = 'hidden';
		html.style.height = '100%';
	}

	unLockBody() {
		const html = document.getElementsByTagName('html')[0];
		html.style.overflow = 'auto';
		html.style.height = 'auto';
	}

	renderTitle() {
		const titleEl = document.getElementById('title');
		const pageTitle = { __html: titleEl && titleEl.value.length ? titleEl.value : UI_I18N['heading.no_title'] };
		return (
			<h4>
				<span className={styles.editing}>{UI_I18N['heading.editing_panels']}:</span>
				<span className={styles.page} dangerouslySetInnerHTML={pageTitle} />
			</h4>
		);
	}

	render() {
		const publishButtonText = document.getElementById('publish').value;

		const wrapperClasses = classNames({
			[styles.wrapper]: true,
			'modular-content-admin-bar': true,
		});

		const publishClasses = classNames({
			[styles.publish]: true,
			'button': true,
			'button-primary': true,
			'button-large': true,
		});

		return (
			<section ref={node => this.wrapper = node} className={wrapperClasses}>
				<div className={styles.left}>
					<nav className={styles.cancel}>
						<Button
							bare
							icon="dashicons-no-alt"
							handleClick={this.handleCancel}
						/>
					</nav>
					<div className={styles.title}>
						{this.renderTitle()}
					</div>
				</div>
				<div className={styles.resizer}>
					<span className={styles.resizerHeading}>{UI_I18N['heading.resizer']}:</span>
					<Button
						bare
						handleClick={this.setSizeFull}
						classes={styles.desktop}
					/>
					<Button
						bare
						handleClick={this.setSizeTablet}
						classes={styles.tablet}
					/>
					<Button
						bare
						handleClick={this.setSizeMobile}
						classes={styles.mobile}
					/>
				</div>
				<div ref={node => this.right = node} className={styles.right}>
					<RefreshRate
						refreshRate={this.props.refreshRate}
						updateRefreshRate={this.props.handleRefreshRateChange}
					/>
					<Button
						text={publishButtonText}
						handleClick={this.publishPost}
						primary={false}
						full={false}
						classes={publishClasses}
					/>
				</div>
			</section>
		);
	}
}

EditBar.propTypes = {
	dataIsDirty: PropTypes.func,
	handleCancelClick: PropTypes.func,
	handleResizeClick: PropTypes.func,
	handleRefreshRateChange: PropTypes.func,
	refreshRate: PropTypes.number,
};

EditBar.defaultProps = {
	dataIsDirty: () => {},
	handleCancelClick: () => {},
	handleResizeClick: () => {},
	handleRefreshRateChange: () => {},
	refreshRate: 1000,
};

export default EditBar;
