import React, { PropTypes } from 'react';

const Hidden = props => (
	<div className="panel-field">
		<input type="hidden" name={props.name} value={props.default} />
	</div>
);

Hidden.propTypes = {
	name: PropTypes.string,
	default: PropTypes.string,
};

Hidden.defaultProps = {
	name: '',
	default: '',
};

export default Hidden;
