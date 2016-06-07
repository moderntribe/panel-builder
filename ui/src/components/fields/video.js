import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import styles from './video.pcss';

class Video extends Component {

	state = {
		videoURL: this.props.data.length ? this.props.data : this.props.default,
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
			index: this.props.panelIndex,
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
		const descriptionClasses = classNames({
			[styles.description]: true,
			'panel-field-description': true,
		});
		const fieldClasses = classNames({
			[styles.field]: true,
			'panel-field': true,
		});

		return (
			<div className={fieldClasses}>
				<label className={labelClasses}>{this.props.label}</label>
				<span className={videoSpanClasses}>
					<input type="text" className={videoInputClasses} name={this.props.name} value={this.state.videoURL} size="40" onChange={this.handleChange} />
				</span>
				<p className={descriptionClasses}>{this.props.description}</p>
			</div>
		);
	}
}

Video.propTypes = {
	label: PropTypes.string,
	name: PropTypes.string,
	description: PropTypes.string,
	strings: PropTypes.array,
	default: PropTypes.string,
	data: PropTypes.string,
	panelIndex: PropTypes.number,
	updatePanelData: PropTypes.func,
};

Video.defaultProps = {
	label: '',
	name: '',
	description: '',
	strings: [],
	default: '',
	data: '',
	panelIndex: 0,
	updatePanelData: () => {},
};

export default Video;
