/**
 * External Dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { TextControl } from '@wordpress/components';

const Text = ( {
	className,
	label,
	value,
	onChange,
} ) => (
	<TextControl
		className={ classNames( 'blockpanels__text', className ) }
		type='text'
		label={ label }
		value={ value }
		onChange={ onChange }
	/>
);

Text.propTypes = {
	className: PropTypes.string,
	label: PropTypes.string,
	value: PropTypes.string,
	onChange: PropTypes.func,
};

export default Text;
