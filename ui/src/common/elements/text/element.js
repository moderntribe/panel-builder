/**
 * External Dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import { TextControl } from '@wordpress/components';

const Text = ( {
	label,
	value,
	onChange,
} ) => (
	<TextControl
		type='text'
		label={ label }
		value={ value }
		onChange={ onChange }
	/>
);

Text.propTypes = {
	label: PropTypes.string,
	value: PropTypes.string,
	onChange: PropTypes.func,
};

export default Text;
