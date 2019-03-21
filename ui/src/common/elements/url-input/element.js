import React from 'react';
import PropTypes from 'prop-types';
import { TextControl } from '@wordpress/components';

const UrlInput = ( {
	label,
	value,
	onChange,
} ) => (
	<TextControl
		type="url"
		label={ label }
		value={ value }
		onChange={ onChange }
	/>
);

UrlInput.propTypes = {
	label: PropTypes.string,
	value: PropTypes.string,
	onChange: PropTypes.func,
};

export default UrlInput;
