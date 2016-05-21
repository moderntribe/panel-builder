import React from 'react';
import styles from './html.pcss';

const HTML = (props) => (
	<div className={styles.panel}>
		<div className={styles.description} dangerouslySetInnerHTML={{ __html: props.description }} ></div>
	</div>
);

HTML.propTypes = {
	description: React.PropTypes.string,
};

HTML.defaultProps = {
	description: '',
};


export default HTML;
