import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import styles from './video.pcss';

class Video extends Component {
	/**
	 * @param {props} props
	 * @constructs Video
	 */

	constructor(props) {
		super(props);

		const fid = _.uniqueId('field-');
		this.ids = {
			plVideoInput: `video-input-${fid}`,
		};
		this.videoInput = null;
		this.state = {
			videoURL: '',
			preview: '',
		};

		this.handleChange = this.handleChange.bind(this);
		this.handlePreviewResponse = this.handlePreviewResponse.bind(this);
	}

	componentDidMount() {
		// cache DOM obj
		this.videoInput = ReactDOM.findDOMNode(this.refs[this.ids.plVideoInput]);
		this.previewVideo();
	}

	/**
	 * Handler after wp ajax call to BE for video preview
	 *
	 * @method handlePreviewResponse
	 * @param {Object} data Markup containing video title and thumbnail
	 */

	handlePreviewResponse(data) {
		if (data.preview !== '') {
			this.setState({
				preview: data.preview,
			});
		}
	}

	/**
	 * Empties the current preview and asks the BE for a new preview based on the video URL
	 *
	 * @method previewVideo
	 */

	previewVideo() {
		if (this.state.videoURL === '') { return; }
		this.setState({
			preview: '',
		});
		wp.ajax.send({
			success: this.handlePreviewResponse,
			data: {
				action: 'panel-video-preview',
				url: this.state.videoURL,
			},
		});
	}

	/**
	 * Handler for when a user types in the video input field
	 *
	 * @method handleChange
	 * @param {Object} event.
	 */

	handleChange(event) {
		this.setState({
			videoURL: event.target.value,
		}, this.previewVideo);
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
					<input type="text" ref={this.ids.plVideoInput} id={this.ids.plVideoInput} className={videoInputStyles} name={this.props.name} value={this.state.videoURL} size="40" onChange={this.handleChange} />
					{(this.state.preview !== '') && <div className={styles.preview}><div dangerouslySetInnerHTML={{ __html: this.state.preview }} ></div></div>}
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
