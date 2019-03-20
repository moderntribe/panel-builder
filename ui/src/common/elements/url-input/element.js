/**
 * External Dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { TextControl } from '@wordpress/components';

/**
 * Internal dependencies
 */

const UrlInput = ( { checked, className, onChange, ...rest } ) => (
	<TextControl
		type="url"
		className={ classNames( 'blockpanels__url', className ) }
		onChange={ onChange }
		{ ...rest }
	/>
);

UrlInput.propTypes = {
	className: PropTypes.string,
	onChange: PropTypes.func,
};

export default UrlInput;
