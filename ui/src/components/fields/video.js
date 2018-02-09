import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import styles from './video.pcss';
import LabelTooltip from './partials/label-tooltip';

class Video extends Component {

	state = {
		videoURL: this.props.data,
	};

	/**
	 * Handler for when a user types in the video input field. Calling panel update
	 *
	 * @method handleChange
	 * @param {Object} event.
	 */
	@autobind
	handleChange(e) {
		const videoURL = e.currentTarget.value;
		this.setState({ videoURL });
		this.props.updatePanelData({
			depth: this.props.depth,
			indexMap: this.props.indexMap,
			name: this.props.name,
			value: videoURL,
		});
	}

	/**
	 * Inject to dom.
	 *
	 * @method render
	 */

	render() {
		const videoInputClasses = classNames({
			'video-url': true,
		});
		const videoSpanClasses = classNames({
			'panel-input-field': true,
			[styles.inputContainer]: true,
		});
		const labelClasses = classNames({
			[styles.label]: true,
			'panel-field-label': true,
		});
		const fieldClasses = classNames({
			[styles.field]: true,
			'panel-field': true,
		});

		return (
			<div className={fieldClasses}>
				<label className={labelClasses}>
					{this.props.label}
					{this.props.description.length ? <LabelTooltip content={this.props.description} /> : null}
				</label>
				<span className={videoSpanClasses}>
					<input type="text" className={videoInputClasses} name={`modular-content-${this.props.name}`} value={this.state.videoURL} size="40" onChange={this.handleChange} />
				</span>
			</div>
		);
	}
}

Video.propTypes = {
	label: PropTypes.string,
	name: PropTypes.string,
	description: PropTypes.string,
	depth: PropTypes.number,
	indexMap: PropTypes.array,
	strings: PropTypes.object,
	default: PropTypes.string,
	data: PropTypes.string,
	panelIndex: PropTypes.number,
	updatePanelData: PropTypes.func,
};

Video.defaultProps = {
	label: '',
	name: '',
	description: '',
	depth: 0,
	indexMap: [],
	strings: {},
	default: '',
	data: '',
	panelIndex: 0,
	updatePanelData: () => {},
};

export default Video;
