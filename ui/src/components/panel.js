import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import _ from 'lodash';
import autobind from 'autobind-decorator';

import FieldBuilder from './shared/field-builder';
import AccordionBack from './shared/accordion-back';

import styles from './panel.pcss';

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
			active: false,
			hidden: false,
		};
		this.el = null;
	}

	componentDidMount() {
		this.el = ReactDOM.findDOMNode(this.refs.panel);
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
		if (!this.state.active) {
			_.delay(() => {
				const fields = this.el.querySelectorAll('.panel-row-fields');
				fields[0].style.marginTop = `-${this.el.offsetTop - 12}px`;
				this.el.parentNode.style.height = `${fields[0].offsetHeight}px`;
			}, 50);
		} else {
			this.el.parentNode.style.height = 'auto';
		}
	}

	/**
	 * Shows/hides the panel field group with an animation
	 */

	@autobind
	handleClick() {
		this.setState({
			active: !this.state.active,
		});
		this.props.panelsActive(!this.state.active);
		this.handleHeights();
	}

	render() {
		const wrapperClasses = classNames({
			[styles.row]: true,
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
			<div ref="panel" className={wrapperClasses}>
				<div className={headerClasses} onClick={this.handleClick}>
					<h3>{this.props.label}</h3>
					<i className={arrowClasses} />
				</div>
				{this.getFields()}
			</div>
		);
	}
}

PanelContainer.propTypes = {
	data: React.PropTypes.object,
	depth: React.PropTypes.number,
	index: React.PropTypes.number,
	type: React.PropTypes.string,
	label: React.PropTypes.string,
	description: React.PropTypes.string,
	icon: React.PropTypes.object,
	fields: React.PropTypes.array,
	liveEdit: React.PropTypes.bool,
	panelsActive: PropTypes.func,
	movePanel: PropTypes.func,
	updatePanelData: PropTypes.func,
};

PanelContainer.defaultProps = {
	data: {},
	depth: 0,
	index: 0,
	type: '',
	label: '',
	description: '',
	icon: {},
	fields: [],
	liveEdit: false,
	panelsActive: () => {},
	movePanel: () => {},
	updatePanelData: () => {},
};

export default PanelContainer;
