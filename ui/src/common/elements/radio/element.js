/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import { RadioControl } from '@wordpress/components';

const Radio = ( {
	label,
	value,
	options,
	onChange,
} ) => {
	return (
		<RadioControl
			label={ label }
			selected={ value }
			options={ options }
			onChange={ onChange }
		/>
	);
};

Radio.propTypes = {
	label: PropTypes.string,
	value: PropTypes.any,
	options: PropTypes.arrayOf( PropTypes.shape( {
		label: PropTypes.string,
		value: PropTypes.any,
	} ) ),
	onChange: PropTypes.func,
};

export default Radio;
