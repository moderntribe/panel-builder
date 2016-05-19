import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import styles from './video.pcss';
import VideoPreview from './parts/video-preview';

class Video extends Component {
	constructor(props) {
		super(props);

		const fid = _.uniqueId('field-');
		this.ids = {
			plVideoInput: `video-input-${fid}`,
		};
		this.videoInput = null;
		this.state = {
			videoURL: 'https://youtu.be/M3r2XDceM6A',
			preview: '',
		};

		this.handleChange = this.handleChange.bind(this);
		this.handlePreviewResponse = this.handlePreviewResponse.bind(this);
	}

	componentDidMount() {
		this.initPreviewer();
		this.previewVideo();
	}

	initPreviewer() {
		this.videoInput = ReactDOM.findDOMNode(this.refs[this.ids.plVideoInput]);
	}

	handlePreviewResponse(data) {
		if (data.preview !== '') {
			this.setState({
				preview: data.preview,
			});
		}
	}

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

	handleChange(event) {
		this.setState({
			videoURL: event.target.value,
		}, this.previewVideo);
	}

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
					{(this.state.preview !== '') && <VideoPreview preview={this.state.preview} />}
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
