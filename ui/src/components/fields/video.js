import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import styles from './video.pcss';

class Video extends Component {
	state = {
		videoURL: '',
	};

	/**
	 * Handler for when a user types in the video input field
	 *
	 * @method handleChange
	 * @param {Object} event.
	 */
	@autobind
	handleChange(event) {
		this.setState({
			videoURL: event.target.value,
		});
	}

	/**
	 * Inject to dom.
	 *
	 * @method render
	 */

	render() {
		const videoInputStyles = classNames({
			'video-url': true,
		});
		const videoSpanStyles = classNames({
			'panel-input-field': true,
			[styles.inputContainer]: true,
		});

		return (
			<div className={styles.field}>
				<label className={styles.label}>{this.props.label}</label>
				<span className={videoSpanStyles}>
					<input type="text" className={videoInputStyles} name={this.props.name} value={this.state.videoURL} size="40" onChange={this.handleChange} />
				</span>
				<p className={styles.description}>{this.props.description}</p>
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
};

Video.defaultProps = {
	label: '',
	name: '',
	description: '',
	strings: [],
	default: '',
};

export default Video;
