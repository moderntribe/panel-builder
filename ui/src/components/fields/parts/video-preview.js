import React from 'react';
import styles from './video-preview.pcss';

const VideoPreview = (props) => (
	<div className={styles.preview}>
		<div dangerouslySetInnerHTML={{ __html: props.preview }} ></div>
	</div>
);

VideoPreview.propTypes = {
	preview: React.PropTypes.string,
};

VideoPreview.defaultProps = {
	preview: '',
};

export default VideoPreview;
