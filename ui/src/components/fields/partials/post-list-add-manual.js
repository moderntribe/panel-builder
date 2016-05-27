import React, { PropTypes } from 'react';

import Button from '../../shared/button';
import BlankPostUi from '../../shared/blank-post-ui';

import styles from './post-list-add-manual.pcss';

/**
 * Stateless component for main button used throughout ui.
 *
 * @param props
 * @returns {XML}
 * @constructor
 */

const PostListAddManualPost = (props) => (
	<article className={styles.container}>
		<BlankPostUi />
		<Button
			text={props.strings['button.select_post']}
			primary={false}
			full={false}
			handleClick={props.handleSelectClick}
		/>
		<span className={styles.divider} />
		<Button
			text={props.strings['button.create_content']}
			primary={false}
			full={false}
			handleClick={props.handleManualClick}
		/>
	</article>
);

PostListAddManualPost.propTypes = {
	strings: PropTypes.object,
	handleManualClick: PropTypes.func,
	handleSelectClick: PropTypes.func,
};

PostListAddManualPost.defaultProps = {
	strings: {},
	handleManualClick: () => {},
	handleSelectClick: () => {},
};

export default PostListAddManualPost;

