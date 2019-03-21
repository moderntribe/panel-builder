import React from 'react';
import PropTypes from 'prop-types';
import { SelectControl } from '@wordpress/components';

const Select = ( {
	label,
	options,
	value,
	onChange,
} ) => (
	<SelectControl
		label={ label }
		options={ options }
		value={ value }
		onChange={ onChange }
	/>
);

Select.propTypes = {
	label: PropTypes.string,
	options: PropTypes.arrayOf( PropTypes.shape( {
		label: PropTypes.string,
		value: PropTypes.any,
	} ) ),
	value: PropTypes.any,
	className: PropTypes.string,
};

export default Select;
