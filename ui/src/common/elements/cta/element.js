import React from 'react';
import PropTypes from 'prop-types';
import { find } from 'lodash';
import { __ } from '@wordpress/i18n';
import Text from '../text/element';
import UrlInput from '../url-input/element';
import Select from '../select/element';

const TARGET_OPTIONS = [
	{ label: __( 'Open New Window', 'modular_content' ), value: '_blank' },
	{ label: __( 'Stay in Window', 'modular_content' ), value: '' },
];

const getOptionByValue = ( value ) => {
	return find( TARGET_OPTIONS, { value } ) || {};
};

const CTA = ( {
	label,
	description,
	value,
	onChange,
} ) => {
	const updateUrl = ( url ) => {
		const newValue = {
			...value,
			url,
		};
		onChange( newValue );
	};

	const updateLabel = ( label ) => {
		const newValue = {
			...value,
			label,
		};
		onChange( newValue );
	};

	const updateSelect = ( option ) => {
		const newValue = {
			...value,
			target: option.value,
		};
		onChange( newValue );
	};

	return (
		<div>
			{ label && <h3>{ label }</h3> }
			{ description && <p>{ description }</p> }
			<UrlInput
				label={ __( 'URL', 'modular_content' ) }
				value={ value.url }
				onChange={ updateUrl }
			/>
			<Text
				label={ __( 'Label', 'modular_content' ) }
				value={ value.label }
				onChange={ updateLabel }
			/>
			<Select
				backspaceRemovesValue={ false }
				isSearchable={ false }
				onChange={ updateSelect }
				options={ TARGET_OPTIONS }
				value={ getOptionByValue( value.target ) }
			/>
		</div>
	);
};

CTA.propTypes = {
	label: PropTypes.string,
	description: PropTypes.string,
	value: PropTypes.shape( {
		url: PropTypes.string,
		label: PropTypes.string,
		target: PropTypes.oneOf( [ '_blank', '' ] ),
	} ),
	onChange: PropTypes.func,
};

export default CTA;
