import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import styles from './video.pcss';
import $ from 'jquery';

class Video extends Component {
	constructor(props) {
		super(props);
		const fid = _.uniqueId('field-');
		this.ids = {
			plVideoInput: `video-input-${fid}`,
		};
		this.videoInput = null;
		this.state = {
			videoURL: 'http://www.youtube.com/oembed?url=http%3A//youtube.com/watch%3Fv%3DM3r2XDceM6A&format=json',
		};
		this.handleChange = this.handleChange.bind(this);
		//this.handlePreviewResponse = this.handlePreviewResponse.bind(this);
	}

	componentDidMount() {
		this.initPreviewer();
		this.previewVideo();
	}

	componentWillUnmount() {
		this.cleanUp();
	}

	initPreviewer() {
		// cache dom
		this.videoInput = ReactDOM.findDOMNode(this.refs[this.ids.plVideoInput]);
	}

	cleanUp() {
	}

	handlePreviewResponse(data) {
		console.log("handlePreviewResponse",data)
		if (data.preview !== '') {
			var preview = $('<span class="panel-input-preview video-preview">'+data.preview+'</span>');
			preview.hide();
			this.append(preview);
		}
	}

	previewVideo() {
		console.log("previewVideo")
		var url = this.state.videoURL;
		var container = $(this.videoInput).closest('.panel-input');

		if (url === '') {
			return;
		}

		wp.ajax.send({
			success: this.handlePreviewResponse,
			error: function(error){
				console.log("error",error);
			},
			context: container,
			data: {
				action: 'panel-video-preview',
				url: url
			}
		});
	}

	handleChange(event) {
		// code to connect to actions that execute on redux store
		this.setState({
			videoURL: event.target.value
		});
		this.previewVideo();
	}

	render() {
		const videoInputStyles = classNames({
			'video-url':true
		});
		const videoSpanStyles = classNames({
			'panel-input-field':true,
			[styles.inputContainer]:true
		});

		return (
			<div className={styles.field}>
				<label className={styles.label}>{this.props.label}</label>
				<span className={videoSpanStyles}>
					<input type="text" ref={this.ids.plVideoInput} id={this.ids.plVideoInput} className={videoInputStyles} name={this.props.name} value={this.state.videoURL} size="40" onChange={this.handleChange} />
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
