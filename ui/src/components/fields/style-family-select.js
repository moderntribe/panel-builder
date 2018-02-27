import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import _ from 'lodash';
import ReactSelect from 'react-select-plus';
import classNames from 'classnames';
import styles from './style-family-select.pcss';
import LabelTooltip from './partials/label-tooltip';
import Button from '../shared/button';
import * as DATA_KEYS from '../../constants/data-keys';
import { UI_I18N } from '../../globals/i18n';
import { trigger } from '../../util/events';
import * as EVENTS from '../../constants/events';

class StyleFamilySelect extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: this.props.data,
		};
	}

	@autobind
	handleChange(data) {
		const value = data ? _.toString(data.value) : _.toString(this.props.default);
		this.setState({ value });
		this.props.updatePanelData({
			depth: this.props.depth,
			indexMap: this.props.indexMap,
			parentMap: this.props.parentMap,
			name: this.props.name,
			value,
		});
	}

	/**
	 * Allows external editor to react and enter edit mode for style family
	 */

	@autobind
	editFamily() {
		trigger({ event: EVENTS.EDIT_STYLE_FAMILY, native: false, data: { familyID: this.state.value } });
	}

	/**
	 * Allows external editor to react and enter edit mode for copy of this style family
	 */

	@autobind
	copyFamily() {
		trigger({ event: EVENTS.COPY_STYLE_FAMILY, native: false, data: { familyID: this.state.value } });
	}

	render() {
		const labelClasses = classNames({
			[styles.label]: true,
			'panel-field-label': true,
		});
		const fieldClasses = classNames({
			[styles.field]: true,
			[styles.compact]: this.props.layout === DATA_KEYS.COMPACT_LAYOUT,
			'panel-field': true,
			'panel-conditional-field': true,
		});

		return (
			<div className={fieldClasses}>
				<label className={labelClasses}>
					{this.props.label}
					{this.props.description.length ? <LabelTooltip content={this.props.description} /> : null}
				</label>
				<ReactSelect
					name={`modular-content-${this.props.name}`}
					options={this.props.options}
					onChange={this.handleChange}
					value={this.state.value}
				/>
				<nav className={styles.controls}>
					<Button
						bare
						text={UI_I18N['button.edit_style_family']}
						full={false}
						handleClick={this.editFamily}
						icon="dashicons-edit"
						disabled={this.state.value.length === 0}
					/>
					<Button
						bare
						text={UI_I18N['button.copy_style_family']}
						full={false}
						handleClick={this.copyFamily}
						icon="dashicons-admin-page"
						disabled={this.state.value.length === 0}
					/>
				</nav>
			</div>
		);
	}
}

StyleFamilySelect.propTypes = {
	data: PropTypes.string,
	panelIndex: PropTypes.number,
	label: PropTypes.string,
	name: PropTypes.string,
	description: PropTypes.string,
	indexMap: PropTypes.array,
	parentMap: PropTypes.array,
	depth: PropTypes.number,
	strings: PropTypes.object,
	default: PropTypes.string,
	options: PropTypes.array,
	layout: PropTypes.string,
	updatePanelData: PropTypes.func,
};

StyleFamilySelect.defaultProps = {
	data: '',
	panelIndex: 0,
	label: '',
	name: '',
	description: '',
	indexMap: [],
	parentMap: [],
	depth: 0,
	strings: {},
	default: '',
	options: [],
	layout: 'compact',
	updatePanelData: () => {},
};

export default StyleFamilySelect;
