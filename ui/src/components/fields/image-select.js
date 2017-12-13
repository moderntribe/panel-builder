import React, { Component } from 'react';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import _ from 'lodash';

import { injectColumns } from '../../actions/panels';
import styles from './image-select.pcss';
import { trigger } from '../../util/events';
import * as EVENTS from '../../constants/events';
import { UI_I18N } from '../../globals/i18n';

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

		const Options = _.map(this.props.options, option =>
			<label
				className={imgSelectLabelClasses}
				key={_.uniqueId('option-img-sel-id-')}
			>
				<input
					type="radio"
					name={`modular-content-${this.props.name}`}
					value={option.value}
					onChange={this.handleChange}
					checked={this.state.value === option.value}
					data-option-type="single"
					data-field="image-select"
				/>
				<div
					className={styles.optionImage}
				>
					<span className={styles.optInner}>
						<img src={option.src} alt={option.label} />
					</span>
				</div>
				{!this.props.can_add_columns && option.label}
			</label>,
		);

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

		const descriptionClasses = classNames({
			[styles.description]: true,
			'panel-field-description': true,
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
					{this.props.can_add_columns && <i className={arrowClasses} />}
				</label>
				<div className={containerClasses}>
					{Options}
				</div>
				<p className={descriptionClasses}>{this.props.description}</p>
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => ({
	injectColumns: data => dispatch(injectColumns(data)),
});

ImageSelect.propTypes = {
	can_add_columns: React.PropTypes.bool,
	label: React.PropTypes.string,
	name: React.PropTypes.string,
	description: React.PropTypes.string,
	strings: React.PropTypes.object,
	indexMap: React.PropTypes.array,
	depth: React.PropTypes.number,
	default: React.PropTypes.string,
	options: React.PropTypes.array,
	data: React.PropTypes.string,
	panelIndex: React.PropTypes.number,
	injectColumns: React.PropTypes.func,
	updatePanelData: React.PropTypes.func,
};

ImageSelect.defaultProps = {
	can_add_columns: false,
	label: '',
	name: '',
	description: '',
	indexMap: [],
	strings: {},
	depth: 0,
	default: '',
	options: [],
	data: '',
	panelIndex: 0,
	injectColumns: () => {},
	updatePanelData: () => {},
};

export default connect(null, mapDispatchToProps)(ImageSelect);
