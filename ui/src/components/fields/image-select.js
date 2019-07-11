import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import _ from 'lodash';

import styles from './image-select.pcss';
import { trigger } from '../../util/events';
import * as EVENTS from '../../constants/events';
import { UI_I18N } from '../../globals/i18n';
import * as styleUtil from '../../util/dom/styles';
import LabelTooltip from './partials/label-tooltip';

export class ImageSelect extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: _.uniqueId('image-select-'),
			hidden: this.props.can_add_columns,
			layoutRequest: null,
			value: this.props.data,
		};
		this.confirmColumnInjection = this.confirmColumnInjection.bind(this);
	}

	componentDidMount() {
		document.addEventListener(EVENTS.INJECT_LAYOUT, this.confirmColumnInjection);
	}

	componentWillUnmount() {
		document.removeEventListener(EVENTS.INJECT_LAYOUT, this.confirmColumnInjection);
	}

	@autobind
	handleHeader() {
		if (!this.props.can_add_columns) {
			return;
		}
		this.setState({ hidden: !this.state.hidden });
	}

	confirmColumnInjection(e) {
		if (e.detail.id !== this.state.id) {
			return;
		}
		this.updateState(this.state.layoutRequest);
	}

	updateState(value) {
		if (this.props.can_add_columns) {
			this.props.injectColumns({
				indexMap: this.props.indexMap,
				value,
			});
		}
		this.setState({
			value,
			hidden: this.props.can_add_columns,
		}, () => {
			if (!this.props.can_add_columns) {
				return;
			}
			trigger({
				event: EVENTS.COLUMNS_UPDATED,
				native: false,
			});
		});
		this.props.updatePanelData({
			depth: this.props.depth,
			indexMap: this.props.indexMap,
			parentMap: this.props.parentMap,
			name: this.props.name,
			value,
		});
	}

	@autobind
	handleChange(e) {
		const value = e.currentTarget.value;
		if (this.props.can_add_columns) {
			trigger({
				event: EVENTS.OPEN_DIALOG,
				native: false,
				data: {
					type: 'error',
					confirm: true,
					heading: UI_I18N['message.confirm_layout'],
					data: {
						id: this.state.id,
					},
					confirmCallback: EVENTS.INJECT_LAYOUT,
				},
			});
			this.setState({ layoutRequest: value });
			return;
		}
		this.updateState(value);
	}

	render() {
		const imgSelectLabelClasses = classNames({
			'plimageselect-label': true,
			[styles.imageSelectLabel]: true,
			[styles.isColumnImg]: this.props.can_add_columns,
		});
		const itemStyles = styleUtil.optionStyles(this.props);

		const Options = _.map(this.props.options, option => (
			<label
				className={imgSelectLabelClasses}
				key={_.uniqueId('option-img-sel-id-')}
				style={itemStyles}
			>
				<input
					type="radio"
					name={`modular-content-${this.props.name}`}
					value={option.value}
					onChange={this.handleChange}
					checked={this.state.value === option.value}
					data-option-type="single"
					data-field="image-select"
					data-depth={this.props.depth}
				/>
				<div
					className={styles.optionImage}
				>
					<span className={styles.optInner}>
						<img src={option.src} alt={option.label} />
					</span>
				</div>
				{!this.props.can_add_columns && option.label}
			</label>
		));

		const labelClasses = classNames({
			[styles.label]: true,
			'panel-field-label': true,
		});

		const arrowClasses = classNames({
			'dashicons': true,
			'dashicons-arrow-right-alt2': true,
			[styles.arrow]: this.props.can_add_columns,
			[styles.arrowUp]: this.state.hidden,
		});

		const containerClasses = classNames({
			[styles.container]: true,
			[styles.hidden]: this.state.hidden,
			[styles.isColumn]: this.props.can_add_columns,
		});
		const fieldClasses = classNames({
			[styles.field]: true,
			[styles.hidden]: this.state.hidden,
			[styles.isColumnType]: this.props.can_add_columns,
			'panel-field': true,
			'panel-conditional-field': true,
		});

		return (
			<div className={fieldClasses}>
				<label className={labelClasses} onClick={this.handleHeader}>
					{this.props.label}
					{!this.props.can_add_columns && this.props.description.length ? <LabelTooltip content={this.props.description} /> : null}
					{this.props.can_add_columns && <i className={arrowClasses} />}
				</label>
				<div className={containerClasses}>
					{Options}
				</div>
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => ({
	injectColumns: data => dispatch(injectColumns(data)),
});

ImageSelect.propTypes = {
	can_add_columns: PropTypes.bool,
	label: PropTypes.string,
	name: PropTypes.string,
	description: PropTypes.string,
	strings: PropTypes.object,
	indexMap: PropTypes.array,
	parentMap: PropTypes.array,
	depth: PropTypes.number,
	default: PropTypes.string,
	option_width: PropTypes.number,
	options: PropTypes.array,
	data: PropTypes.string,
	panelIndex: PropTypes.number,
	injectColumns: PropTypes.func,
	updatePanelData: PropTypes.func,
};

ImageSelect.defaultProps = {
	can_add_columns: false,
	label: '',
	name: '',
	description: '',
	indexMap: [],
	parentMap: [],
	strings: {},
	depth: 0,
	default: '',
	option_width: 6,
	options: [],
	data: '',
	panelIndex: 0,
	injectColumns: () => {},
	updatePanelData: () => {},
};

export default connect(null, mapDispatchToProps)(ImageSelect);
