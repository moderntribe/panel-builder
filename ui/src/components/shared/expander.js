import PropTypes from 'prop-types';
import React from 'react';

import Button from './button';

import styles from './expander.pcss';

const Expander = props => (
	<Button
		handleClick={props.handleClick}
		bare
		full={false}
		classes={styles.link}
	/>
);

Expander.propTypes = {
	handleClick: PropTypes.func,
};

Expander.defaultProps = {
	handleClick: () => {},
};

export default Expander;
