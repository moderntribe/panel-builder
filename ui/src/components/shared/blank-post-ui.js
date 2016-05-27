import React, { PropTypes } from 'react';

import styles from './blank-post-ui.pcss';

/**
 * Produces a blank post style ui in pure css other components can use.
 *
 * @returns {XML}
 * @constructor
 */

const BlankPostUi = () => (
	<div className={styles.container}>
		<b /><u />
		<i /><i /><i /><i /><i /><i /><i /><i />
	</div>
);

export default BlankPostUi;
