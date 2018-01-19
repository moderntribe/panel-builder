import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import alphabetize from 'alphabetize-object-keys';
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
			activeTab: 'content_fields',
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
		const indexMap = this.props.indexMap.slice();
		indexMap.push(this.props.index);
		const Fields = this.state.active ?
			(
				<FieldBuilder
					{...this.props}
					hasChildren={this.props.children.max > 0 && this.props.children.types.length > 0}
					hidePanel={this.hideFields}
					indexMap={indexMap}
					activeTab={this.state.activeTab}
				/>
			) :
			null;

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
						{this.renderTabs()}
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
		const input = e.delegateTarget ? e.delegateTarget : e.target;
		// exit for repeater
		if (domTools.closest(input, '.repeater-field')) {
			return;
		}

		e.stopPropagation();
		panelConditionals.setConditionalClass(this.el, input);

		trigger({
			event: panelConditionals.getConditionalEventName(input),
			native: false,
			data: {
				panel: this.el,
				inputName: input.name,
				inputValue: input.value,
			},
		});
	}

	@autobind
	enableContentMode() {
		this.el.classList.remove(styles.settingsActive);
	}

	@autobind
	enableCurrentTabMode(e) {
		this.setState({ activeTab: e.currentTarget.dataset.id });
	}

	getTabs() {
		const content = {
			content_fields: UI_I18N['tab.content'],
		};
		const tabs = Object.assign({}, content, this.props.tabs);

		return Object.entries(alphabetize(tabs)).map(([tabKey, tabLabel]) => (
			<Button
				ref={r => this[tabKey] = r}
				text={tabLabel}
				full={false}
				key={`${tabKey}`}
				classes={`${styles.settingsButton} ${this.state.activeTab === tabKey && styles.settingsButtonActive}`}
				handleClick={this.enableCurrentTabMode}
				dataID={tabKey}
			/>
		));
	}

	renderPanelInfo() {
		return this.props.thumbnail.length || this.props.description.length ? (
			<div className={styles.info}>
				{this.props.description.length && <div className={styles.infoDesc}>{this.props.description}</div>}
				{this.props.thumbnail.length && <div className={styles.infoThumb}><img src={this.props.thumbnail} alt="" /></div>}
			</div>
		) : null;
	}

	renderTabs() {
		return !_.isEmpty(this.props.tabs) ? (
			<div className={styles.settings}>
				{this.getTabs()}
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
	active: PropTypes.bool,
	children: PropTypes.object,
	classesWrapper: PropTypes.string,
	classesFields: PropTypes.string,
	data: PropTypes.object,
	depth: PropTypes.number,
	index: PropTypes.number,
	indexMap: PropTypes.array,
	type: PropTypes.string,
	label: PropTypes.string,
	description: PropTypes.string,
	thumbnail: PropTypes.string,
	icon: PropTypes.object,
	fields: PropTypes.array,
	liveEdit: PropTypes.bool,
	settings_fields: PropTypes.array,
	panelsActive: PropTypes.bool,
	nestedGroupActive: PropTypes.func,
	panelsActivate: PropTypes.func,
	movePanel: PropTypes.func,
	deletePanel: PropTypes.func,
	updatePanelData: PropTypes.func,
	handleExpanderClick: PropTypes.func,
	tabs: PropTypes.object,
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
	tabs: {},
	nestedGroupActive: () => {},
	panelsActivate: () => {},
	movePanel: () => {},
	deletePanel: () => {},
	updatePanelData: () => {},
	handleExpanderClick: () => {},
};

export default PanelContainer;
