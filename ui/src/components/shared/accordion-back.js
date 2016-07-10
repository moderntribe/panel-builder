import React, { PropTypes } from 'react';

import Expander from './expander';
import Button from './button';

import { UI_I18N } from '../../globals/i18n';

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
			<Expander handleClick={props.handleExpanderClick} />
		</h3>
	</nav>
);

AccordionBack.propTypes = {
	title: PropTypes.string,
	panelLabel: PropTypes.string,
	handleClick: PropTypes.func,
	handleExpanderClick: PropTypes.func,
};

AccordionBack.defaultProps = {
	title: UI_I18N['heading.no_title'],
	panelLabel: '',
	handleClick: () => {},
	handleExpanderClick: () => {},
};

export default AccordionBack;
