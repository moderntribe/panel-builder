import React from 'react';
import PropTypes from 'prop-types';
import ReactSelect, { components } from 'react-select';
import { Dashicon } from '@wordpress/components';

const DropdownIndicator = ( props ) => (
	components.DropdownIndicator && (
		<components.DropdownIndicator { ...props }>
			<Dashicon icon="arrow-down" />
		</components.DropdownIndicator>
	)
);

const IndicatorSeparator = () => null;

const Select = ( props ) => (
	<ReactSelect
		components={ { DropdownIndicator, IndicatorSeparator } }
		{ ...props }
	/>
);

Select.propTypes = {
	className: PropTypes.string,
};

export default Select;
