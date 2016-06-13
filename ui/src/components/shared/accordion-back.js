import React, { PropTypes } from 'react';

import Button from './button';

import styles from './accordion-back.pcss';

/**
 * Top component of field group that allows for back button to parent level and labelling of accordion level header area
 *
 * @param props
 * @returns {XML}
 * @constructor
 */

const AccordionBack = (props) => (
	<nav className={styles.back}>
		<Button
			classes={styles.backButton}
			handleClick={props.handleClick}
		/>
		<h3>
			{props.title}
			<span className={styles.action}>{props.panelLabel}</span>
		</h3>
	</nav>
);

AccordionBack.propTypes = {
	title: PropTypes.string,
	panelLabel: PropTypes.string,
	handleClick: PropTypes.func,
};

AccordionBack.defaultProps = {
	title: '',
	panelLabel: '',
	handleClick: () => {},
};

export default AccordionBack;
