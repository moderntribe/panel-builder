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
			options: this.props.options,
			value: this.props.data,
		};
		this.handleFamilyAdded = this.handleFamilyAdded.bind(this);
	}

	componentDidMount() {
		document.addEventListener('modern_tribe/style_family_added', this.handleFamilyAdded);
	}

	componentWillUnmount() {
		document.removeEventListener('modern_tribe/style_family_added', this.handleFamilyAdded);
	}

	handleFamilyAdded(e) {
		if (e.detail.name !== this.props.name) {
			return;
		}
		const { label, value } = e.detail;
		const options = this.state.options.slice();
		options.push({ label, value });
		this.setState({ options, value }, () => {
			this.props.updatePanelData({
				depth: this.props.depth,
				indexMap: this.props.indexMap,
				parentMap: this.props.parentMap,
				name: this.props.name,
				value,
			});
		});
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
	emitExternalEvent(e) {
		const data = {
			action: e.currentTarget.dataset.id,
			activationTriggers: this.props.activation_triggers,
			familyID: this.state.options.filter(opt => opt.value === this.state.value)[0].label,
		};
		trigger({ event: EVENTS.LAUNCH_STYLE_FAMILY_EDITOR, native: false, data });
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
		const activeOption = this.state.options.filter(opt => opt.value === this.state.value)[0];
		const optionLabel = activeOption ? activeOption.label : '';

		return (
			<div className={fieldClasses}>
				<label className={labelClasses}>
					{this.props.label}
					{this.props.description.length ? <LabelTooltip content={this.props.description} /> : null}
				</label>
				<ReactSelect
					name={`modular-content-${this.props.name}`}
					options={this.state.options}
					onChange={this.handleChange}
					value={this.state.value}
				/>
				<nav className={styles.controls}>
					<Button
						bare
						text={UI_I18N['button.edit_style_family']}
						full={false}
						handleClick={this.emitExternalEvent}
						dataID="edit"
						icon="dashicons-edit"
						disabled={this.state.value.length === 0 || optionLabel === 'default-styles'}
					/>
					<Button
						bare
						text={UI_I18N['button.copy_style_family']}
						full={false}
						handleClick={this.emitExternalEvent}
						dataID="copy"
						icon="dashicons-admin-page"
						disabled={this.state.value.length === 0}
					/>
				</nav>
			</div>
		);
	}
}

StyleFamilySelect.propTypes = {
	activation_triggers: PropTypes.array,
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
	activation_triggers: [],
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
