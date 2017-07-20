import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import delegate from 'delegate';
import autobind from 'autobind-decorator';
import zenscroll from 'zenscroll';

import FieldBuilder from './shared/field-builder';
import AccordionBack from './shared/accordion-back';
import Button from './shared/button';

import { UI_I18N } from '../globals/i18n';

import { trigger } from '../util/events';
import * as domTools from '../util/dom/tools';
import * as panelConditionals from '../util/dom/panel-conditionals';

import styles from './panel.pcss';

zenscroll.setup(100, 40);

/**
 * Class Panel
 *
 * @package ModularContent
 *
 * An instance of a Panel
 */

class PanelContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			active: this.props.active,
			hidden: false,
		};
		this.el = null;
		this.inputDelegates = null;
		this.mounted = false;
	}

	componentDidMount() {
		this.mounted = true;
		this.el = this.panel;

		this.inputDelegates = delegate(this.el, '.panel-conditional-field input', 'click', e => _.delay(() => {
			this.handleConditionalFields(e);
		}, 100));

		if (this.props.depth > 0) {
			return;
		}
		document.addEventListener('modern_tribe/panel_activated', this.maybeActivate);
		document.addEventListener('modern_tribe/deactivate_panels', this.maybeDeActivate);
		document.addEventListener('modern_tribe/delete_panel', this.maybeDeletePanel);
	}

	componentWillUnmount() {
		this.mounted = false;

		this.inputDelegates.destroy();

		if (this.props.depth > 0) {
			return;
		}
		document.removeEventListener('modern_tribe/panel_activated', this.maybeActivate);
		document.removeEventListener('modern_tribe/deactivate_panels', this.maybeDeActivate);
		document.removeEventListener('modern_tribe/delete_panel', this.maybeDeletePanel);
	}

	/**
	 * Gets the fields for a panel bundled in a hidden accordion ui. Uses Fieldbuilder.
	 *
	 * @returns {*}
	 */

	getFields() {
		let FieldContainer = null;
		const Fields = this.state.active ? <FieldBuilder {...this.props} hasChildren={this.props.children.max > 0 && this.props.children.types.length > 0} hidePanel={this.hideFields} /> : null;

		if (this.state.active) {
			const fieldClasses = classNames({
				[styles.fields]: true,
				[styles.fieldsEdit]: this.props.liveEdit,
				'panel-row-fields': true,
				[this.props.classesFields]: this.props.classesFields.length,
			});

			const BackButton = this.props.depth === 0 ? (
				<AccordionBack
					title={this.props.data.title}
					panelLabel={this.props.label}
					handleClick={this.handleClick}
					handleInfoClick={this.handleInfoClick}
					handleExpanderClick={this.props.handleExpanderClick}
				/>
			) : null;

			const DeleteButton = this.props.depth === 0 ? (
				<Button
					icon="dashicons-trash"
					text={UI_I18N['button.delete_panel']}
					bare
					full={false}
					classes={styles.deletePanel}
					handleClick={this.handleDeletePanel}
				/>
			) : null;

			FieldContainer = (
				<div ref={r => this.fields = r} className={fieldClasses} data-hidden="false" data-show-children="false">
					{BackButton}
					<div className={styles.fieldWrap}>
						{this.renderPanelInfo()}
						{this.renderSettingsToggle()}
						{Fields}
						{DeleteButton}
					</div>
				</div>
			);
		}

		return FieldContainer;
	}

	/**
	 * Renders the header for root level panels.
	 *
	 * @returns {*}
	 */

	getHeader() {
		if (this.props.depth > 0) {
			return null;
		}
		const headerClasses = classNames({
			[styles.header]: true,
			'panel-row-header': true,
		});
		const arrowClasses = classNames({
			'dashicons': true,
			[styles.arrow]: true,
			'panel-row-arrow': true,
			'dashicons-arrow-right-alt2': true,
		});

		return (
			<div className={headerClasses} onClick={this.handleClick}>
				{this.renderTitle()}
				<span className={styles.type}>{this.props.label}</span>
				<i className={arrowClasses} />
			</div>
		);
	}

	@autobind
	maybeActivate(e) {
		if (!this.mounted) {
			return;
		}

		if (e.detail.index !== this.props.index) {
			this.setState({ active: false });
			return;
		}

		if (this.props.panelsActive) {
			this.props.panelsActivate(false);
		}

		_.delay(() => {
			this.props.panelsActivate(true);
			this.setState({ active: true }, () => {
				this.handleHeights();
			});
		}, 300);
	}

	@autobind
	maybeDeActivate() {
		if (!this.state.active) {
			return;
		}

		this.setState({ active: false });
		this.props.panelsActivate(false);
	}

	@autobind
	maybeDeletePanel(e) {
		if (this.props.depth > 0) {
			return;
		}

		if (this.state.active) {
			this.setState({ active: false });
			this.props.panelsActivate(false);
		}

		if (e.detail.panelIndex !== this.props.index) {
			return;
		}

		_.delay(() => {
			this.props.deletePanel({ index: e.detail.panelIndex });
		}, 150);
	}

	@autobind
	handleDeletePanel() {
		trigger({
			event: 'modern_tribe/open_dialog',
			native: false,
			data: {
				type: 'error',
				confirm: true,
				heading: UI_I18N['message.confirm_delete_panel'],
				data: {
					panelIndex: this.props.index,
				},
				confirmCallback: 'modern_tribe/delete_panel',
			},
		});
	}

	@autobind
	enableSettingsMode() {
		this.el.classList.add(styles.settingsActive);
	}

	@autobind
	handleInfoClick() {
		if (this.el.getAttribute('data-info-active') === 'false') {
			this.el.setAttribute('data-info-active', 'true');
		} else {
			this.el.setAttribute('data-info-active', 'false');
		}
	}

	/**
	 * Shows/hides the panel field group with an animation
	 */

	@autobind
	handleClick() {
		if (this.props.depth > 0) {
			return;
		}

		if (!this.props.liveEdit) {
			trigger({ event: 'modern_tribe/deactivate_panels', native: false });
		}

		this.setState({ active: !this.state.active }, () => {
			this.handleHeights();
			if (this.state.active) {
				panelConditionals.initConditionalFields(this.el);
			}
			const duration = this.state.active ? 200 : 10;
			zenscroll.to(this.el, duration);
		});
		this.props.panelsActivate(!this.state.active);
		trigger({
			event: 'modern_tribe/panel_toggled',
			native: false,
			data: {
				active: !this.state.active,
				index: this.props.index,
				depth: this.props.depth,
			},
		});
	}

	handleHeights() {
		if (!this.props.liveEdit) {
			return;
		}
		if (this.state.active) {
			_.delay(() => {
				const offset = this.props.liveEdit && this.props.index !== 0 ? 0 : 12;
				const fields = this.el.querySelectorAll('.panel-row-fields');
				fields[0].style.marginTop = `-${this.el.offsetTop - offset}px`;
			}, 50);
		}
	}

	/**
	 * Hides the panel ui for cases where a nested ui such as a repeater wants to reveal itself.
	 *
	 * @param hidden
	 */

	@autobind
	hideFields(hidden = false) {
		const fieldWrap = this.fields;
		if (!fieldWrap) {
			return;
		}
		fieldWrap.setAttribute('data-hidden', hidden);
		fieldWrap.setAttribute('data-show-children', hidden);
	}

	@autobind
	handleConditionalFields(e) {
		// exit for repeater
		if (domTools.closest(e.delegateTarget, '.repeater-field')) {
			return;
		}

		e.stopPropagation();
		panelConditionals.setConditionalClass(this.el, e.delegateTarget);

		trigger({
			event: panelConditionals.getConditionalEventName(e.delegateTarget),
			native: false,
			data: {
				panel: this.el,
				inputName: e.delegateTarget.name,
				inputValue: e.delegateTarget.value,
			},
		});
	}

	@autobind
	enableContentMode() {
		this.el.classList.remove(styles.settingsActive);
	}

	renderPanelInfo() {
		return this.props.thumbnail.length || this.props.description.length ? (
			<div className={styles.info}>
				{this.props.description.length && <div className={styles.infoDesc}>{this.props.description}</div>}
				{this.props.thumbnail.length && <div className={styles.infoThumb}><img src={this.props.thumbnail} role="presentation" /></div>}
			</div>
		) : null;
	}

	renderSettingsToggle() {
		return this.props.settings_fields.length ? (
			<div className={styles.settings}>
				<Button
					text={UI_I18N['tab.content']}
					full={false}
					classes={styles.contentButton}
					handleClick={this.enableContentMode}
				/>
				<Button
					text={UI_I18N['tab.settings']}
					full={false}
					classes={styles.settingsButton}
					handleClick={this.enableSettingsMode}
				/>
			</div>
		) : null;
	}

	renderTitle() {
		let Title = null;
		if (this.props.data.title && this.props.data.title.length) {
			Title = (
				<h3>{this.props.data.title}</h3>
			);
		} else {
			Title = (
				<h3 className={styles.noTitle}>{UI_I18N['heading.no_title']}</h3>
			);
		}

		return Title;
	}

	render() {
		const wrapperClasses = classNames({
			[styles.row]: true,
			[styles.panelActive]: this.state.active,
			[`panel-type-${this.props.type}`]: true,
			[`panel-depth-${this.props.depth}`]: true,
			[this.props.classesWrapper]: this.props.classesWrapper.length,
		});

		return (
			<div
				ref={r => this.panel = r}
				className={wrapperClasses}
				data-panel
				data-info-active="false"
				data-panel-active={this.state.active}
				data-depth={this.props.depth}
			>
				{this.getHeader()}
				{this.getFields()}
			</div>
		);
	}
}

PanelContainer.propTypes = {
	active: React.PropTypes.bool,
	children: React.PropTypes.object,
	classesWrapper: React.PropTypes.string,
	classesFields: React.PropTypes.string,
	data: React.PropTypes.object,
	depth: React.PropTypes.number,
	index: React.PropTypes.number,
	indexMap: React.PropTypes.array,
	type: React.PropTypes.string,
	label: React.PropTypes.string,
	description: React.PropTypes.string,
	thumbnail: React.PropTypes.string,
	icon: React.PropTypes.object,
	fields: React.PropTypes.array,
	liveEdit: React.PropTypes.bool,
	settings_fields: React.PropTypes.array,
	panelsActive: React.PropTypes.bool,
	nestedGroupActive: PropTypes.func,
	panelsActivate: PropTypes.func,
	movePanel: PropTypes.func,
	deletePanel: PropTypes.func,
	updatePanelData: PropTypes.func,
	handleExpanderClick: PropTypes.func,
};

PanelContainer.defaultProps = {
	active: false,
	children: {},
	classesWrapper: '',
	classesFields: '',
	data: {},
	depth: 0,
	index: 0,
	indexMap: [],
	type: '',
	label: '',
	description: '',
	thumbnail: '',
	icon: {},
	fields: [],
	liveEdit: false,
	panelsActive: false,
	settings_fields: [],
	nestedGroupActive: () => {},
	panelsActivate: () => {},
	movePanel: () => {},
	deletePanel: () => {},
	updatePanelData: () => {},
	handleExpanderClick: () => {},
};

export default PanelContainer;
