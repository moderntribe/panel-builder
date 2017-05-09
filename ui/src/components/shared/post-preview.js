import React, { PropTypes } from 'react';
import classNames from 'classnames';
import styles from './post-preview.pcss';

/**
 * Stateless component for Post Preview. Simple display of Thumbnail, Title, Excert with optional edit and cancel buttons
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
		'panel-builder__input--no-drag': true,
	});
	const editClassses = classNames({
		[styles.edit]: true,
		'edit-selected-post': true,
		'panel-builder__input--no-drag': true,
	});
	const linkClassses = classNames({
		[styles.link]: true,
		'link-selected-post': true,
	});

	return (
		<div className={selectedPostClassses}>
			<div className="selected-post-preview">
				<div className={thumbnailClasses} dangerouslySetInnerHTML={{ __html: props.thumbnail }} />
				<h5 className={titleClasses}>{props.title}</h5>
				<div className={excerptClasses} dangerouslySetInnerHTML={{ __html: props.excerpt }} />
				{props.url && <a className={linkClassses} href={props.url} target="_blank" rel="noopener noreferrer">{props.url}</a>}
			</div>
			{props.onRemoveClick && <div onClick={props.onRemoveClick} className={removeClassses} title="Remove This Post"><span className="dashicons dashicons-no-alt" /></div>}
			{props.onEditClick && <div onClick={props.onEditClick} className={editClassses} title="Edit This Post"><span className="dashicons dashicons-edit" /></div>}
		</div>
	);
};


PostPreview.propTypes = {
	title: PropTypes.string,
	thumbnail: PropTypes.string,
	excerpt: PropTypes.string,
	url: PropTypes.string,
	onRemoveClick: PropTypes.func,
	onEditClick: PropTypes.func,
};

PostPreview.defaultProps = {
	title: '',
	thumbnail: '',
	url: '',
	excerpt: '',
	onRemoveClick: null,
	onEditClick: null,
};

export default PostPreview;
