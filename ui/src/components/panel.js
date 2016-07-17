import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import _ from 'lodash';
import autobind from 'autobind-decorator';
import zenscroll from 'zenscroll';

import FieldBuilder from './shared/field-builder';
import AccordionBack from './shared/accordion-back';

import { UI_I18N } from '../globals/i18n';

import { trigger } from '../util/events';

import styles from './panel.pcss';

const container = document.getElementById('modular-content');

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
	}

	componentDidMount() {
		this.el = ReactDOM.findDOMNode(this.refs.panel);
		document.addEventListener('modern_tribe/panel_activated', this.maybeActivate);
		document.addEventListener('modern_tribe/deactivate_panels', this.maybeDeActivate);
	}

	componentWillUnmount() {
		document.removeEventListener('modern_tribe/panel_activated', this.maybeActivate);
		document.removeEventListener('modern_tribe/deactivate_panels', this.maybeDeActivate);
	}

	/**
	 * Gets the fields for a panel bundled in a hidden accordion ui. Uses Fieldbuilder.
	 *
	 * @returns {*}
	 */

	getFields() {
		let FieldContainer = null;
		const Fields = this.state.active ? <FieldBuilder {...this.props} hidePanel={this.hideFields} /> : null;

		if (this.state.active) {
			const fieldClasses = classNames({
				[styles.fields]: true,
				[styles.fieldsEdit]: this.props.liveEdit,
				'panel-row-fields': true,
			});

			FieldContainer = (
				<div ref="fields" className={fieldClasses} data-hidden="false" data-show-children="false">
					<AccordionBack
						title={this.props.data.title}
						panelLabel={this.props.label}
						handleClick={this.handleClick}
						handleExpanderClick={this.props.handleExpanderClick}
					/>
					<div className={styles.fieldWrap}>
						{Fields}
					</div>
				</div>
			);
		}

		return FieldContainer;
	}

	/**
	 * Hides the panel ui for cases where a nested ui such as a repeater wants to reveal itself.
	 *
	 * @param hidden
	 */

	@autobind
	hideFields(hidden = false) {
		const fieldWrap = ReactDOM.findDOMNode(this.refs.fields);
		if (!fieldWrap) {
			return;
		}
		fieldWrap.setAttribute('data-hidden', hidden);
		fieldWrap.setAttribute('data-show-children', hidden);
	}

	/**
	 * todo: Code to be refined, just handles the non live edit mode for now
	 * discuss the future of this with kyle
	 */

	handleHeights() {
		if (this.state.active) {
			if (!this.props.liveEdit) {
				zenscroll.to(container, 100);
			}
			_.delay(() => {
				const offset = this.props.liveEdit && this.props.index !== 0 ? 0 : 12;
				const fields = this.el.querySelectorAll('.panel-row-fields');
				fields[0].style.marginTop = `-${this.el.offsetTop - offset}px`;
				this.el.parentNode.style.height = `${fields[0].offsetHeight}px`;
			}, 50);
		} else {
			this.el.parentNode.style.height = 'auto';
			if (!this.props.liveEdit) {
				zenscroll.to(container, 100);
			}
		}
	}

	/**
	 * Shows/hides the panel field group with an animation
	 */

	@autobind
	handleClick() {
		this.setState({ active: !this.state.active }, () => { this.handleHeights(); });
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

	@autobind
	maybeActivate(e) {
		if (e.detail.index !== this.props.index) {
			this.setState({ active: false });
			return;
		}

		if (this.props.panelsActive) {
			this.props.panelsActivate(false);
		}

		_.delay(() => {
			this.props.panelsActivate(true, this.props.index);
			this.setState({ active: true }, () => { this.handleHeights(); });
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
		});
		const headerClasses = classNames({
			[styles.header]: true,
			'panel-row-header': true,
		});
		const arrowClasses = classNames({
			dashicons: true,
			[styles.arrow]: true,
			'panel-row-arrow': true,
			'dashicons-arrow-right-alt2': true,
		});

		return (
			<div ref="panel" className={wrapperClasses} data-panel>
				<div className={headerClasses} onClick={this.handleClick}>
					{this.renderTitle()}
					<span className={styles.type}>{this.props.label}</span>
					<i className={arrowClasses} />
				</div>
				{this.getFields()}
			</div>
		);
	}
}

PanelContainer.propTypes = {
	active: React.PropTypes.bool,
	data: React.PropTypes.object,
	depth: React.PropTypes.number,
	index: React.PropTypes.number,
	type: React.PropTypes.string,
	label: React.PropTypes.string,
	description: React.PropTypes.string,
	icon: React.PropTypes.object,
	fields: React.PropTypes.array,
	liveEdit: React.PropTypes.bool,
	panelsActive: React.PropTypes.bool,
	panelsActivate: PropTypes.func,
	movePanel: PropTypes.func,
	updatePanelData: PropTypes.func,
	handleExpanderClick: PropTypes.func,
};

PanelContainer.defaultProps = {
	active: false,
	data: {},
	depth: 0,
	index: 0,
	type: '',
	label: '',
	description: '',
	icon: {},
	fields: [],
	liveEdit: false,
	panelsActive: false,
	panelsActivate: () => {},
	movePanel: () => {},
	updatePanelData: () => {},
	handleExpanderClick: () => {},
};

export default PanelContainer;
