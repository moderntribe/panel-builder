import React, { PropTypes } from 'react';

import Button from '../../shared/button';
import BlankPostUi from '../../shared/blank-post-ui';

import styles from './post-list-manual-type-chooser.pcss';

/**
 * Stateless component for post selection type chooser
 *
 * @param props
 * @returns {XML}
 * @constructor
 */

const PostListManualTypeChooser = (props) => (
	<article className={styles.container} data-index={props.index}>
		<BlankPostUi />
		<Button
			text={props.strings['button.select_post']}
			primary={false}
			full={false}
			classes="type-select"
			handleClick={props.handleClick}
			rounded
		/>
		<span className={styles.divider} />
		<Button
			text={props.strings['button.create_content']}
			primary={false}
			full={false}
			classes="type-manual"
			handleClick={props.handleClick}
			rounded
		/>
	</article>
);

PostListManualTypeChooser.propTypes = {
	index: PropTypes.number,
	strings: PropTypes.object,
	handleClick: PropTypes.func,
};

PostListManualTypeChooser.defaultProps = {
	index: 0,
	strings: {},
	handleClick: () => {},
};

export default PostListManualTypeChooser;

