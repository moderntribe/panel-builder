import React, { PropTypes } from 'react';

import Button from './button';

import styles from './expander.pcss';

const Expander = (props) => (
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
