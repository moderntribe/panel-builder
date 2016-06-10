import React, { PropTypes } from 'react';
import classNames from 'classnames';
import styles from './post-preview.pcss';

/**
 * Stateless component for links
 *
 * @param props
 * @returns {XML}
 * @constructor
 */

const PostPreview = (props) => {
	// styles
	const selectedPostClassses = classNames({
		[styles.postSelect]: true,
		'selected-post': true,
	});
	const titleClasses = classNames({
		[styles.title]: true,
		'post-title': true,
	});
	const excerptClasses = classNames({
		[styles.excerpt]: true,
		'post-excerpt': true,
	});
	const thumbnailClasses = classNames({
		[styles.thumbnail]: true,
		'post-thumbnail': true,
	});
	const removeClassses = classNames({
		[styles.remove]: true,
		'remove-selected-post': true,
	});

	return (
		<div className={selectedPostClassses}>
			<div className="selected-post-preview">
				<div className={thumbnailClasses} dangerouslySetInnerHTML={{ __html: props.thumbnail }}></div>
				<h5 className={titleClasses}>{props.title}</h5>
				<div className={excerptClasses} dangerouslySetInnerHTML={{ __html: props.excerpt }}></div>
			</div>
			<div onClick={props.onRemoveClick} className={removeClassses} title="Remove This Post"><span className="dashicons dashicons-no-alt"></span></div>
		</div>
	);
};


PostPreview.propTypes = {
	title: PropTypes.string,
	thumbnail: PropTypes.string,
	excerpt: PropTypes.string,
	onRemoveClick: PropTypes.func,
};

PostPreview.defaultProps = {
	title: '',
	thumbnail: '',
	excerpt: '',
	onRemoveClick: () => {},
};

export default PostPreview;
