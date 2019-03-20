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
	const selected = options.filter( ( option ) => {
		return option.value === value;
	} )[ 0 ] || {};
	const onUpdate = ( selectedOption ) => onChange( selectedOption.value );

	return (
		<RadioControl
			label={ label }
			selected={ selected }
			options={ options }
			onChange={ onUpdate }
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
