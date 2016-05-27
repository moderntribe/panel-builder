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
		'icon-remove': true,
	});

	let Preview;
	if (props.thumbnail){
		Preview = (
			<img src={props.thumbnail} role="presentation" />
		);
	}

	return (
		<div className={selectedPostClassses}>
			<div className="selected-post-preview">
				<div className={thumbnailClasses}>
					{Preview}
				</div>
				<h5 className={titleClasses}>{props.title}</h5>
				<div className={excerptClasses} dangerouslySetInnerHTML={{ __html: props.excerpt }}></div>
			</div>
			<div href="#" onClick={props.onRemoveClick} className={removeClassses} title="Remove This Post"><span class="dashicons dashicons-no-alt"></span></div>
		</div>
	);
}


PostPreview.propTypes = {
	title: PropTypes.string,
	thummbail: PropTypes.string,
	excerpt: PropTypes.string,
	onRemoveClick: PropTypes.func,
};

PostPreview.defaultProps = {
	title: '',
	thummbail: '',
	excerpt: '',
	onRemoveClick: () => {},
};

export default PostPreview;
