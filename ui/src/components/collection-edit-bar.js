import React, { PropTypes } from 'react';
import classNames from 'classnames';

import styles from './collection-edit-bar.pcss';

/**
 * Stateless component for top bar when in live edit mode
 *
 * @param props
 * @returns {XML}
 * @constructor
 */

const EditBar = (props) => {
	const wrapperClasses = classNames({
		[styles.wrapper]: true,
	});

	return (
		<section className={wrapperClasses}>
			<span>{props.pageTitle}</span>
		</section>
	);
};

EditBar.propTypes = {
	pageTitle: PropTypes.string,
	handleSaveClick: PropTypes.func,
};

EditBar.defaultProps = {
	pageTitle: '',
	handleSaveClick: () => {},
};

export default EditBar;
