import React, { Component } from 'react';

import styles from './html.pcss';

class HTML extends Component {

	render() {
		return (
			<div className={ styles.panelHTML }>
				<div className={ styles.panelHTMLDescription } dangerouslySetInnerHTML={{__html: this.props.description}} ></div>
			</div>
		);
	}
}

HTML.propTypes = {
	label: React.PropTypes.string,
	name: React.PropTypes.string,
	description: React.PropTypes.string,
	strings: React.PropTypes.array,
	default: React.PropTypes.string,
};

HTML.defaultProps = {
	label: '',
	name: '',
	description: '',
	strings: [],
	default: '',
};

export default HTML;
