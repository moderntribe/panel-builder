import React, { PropTypes } from 'react';

import styles from './loader.pcss';

const Loader = (props) => {
	const loaderStyle = {
		width: `${props.width}px`,
		height: `${props.height}px`,
	};

	return props.active ? (
		<div className={styles.loader} style={loaderStyle}>
			<svg className={styles.circular} viewBox="25 25 50 50">
				<circle className={styles.path} cx="50" cy="50" r="20" fill="none" strokeWidth="2" stroke-miterlimit="10" />
			</svg>
		</div>
	) : null;
};

Loader.propTypes = {
	active: PropTypes.bool,
	width: PropTypes.number,
	height: PropTypes.number,
};

Loader.defaultProps = {
	active: false,
	width: 100,
	height: 100,
};

export default Loader;
