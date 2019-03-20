/**
 * External Dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { TextareaControl } from '@wordpress/components';

const TextArea = ( {
	className,
	name,
	value
} ) => (
	<TextareaControl
		className={ classNames( 'blockpanels__textarea', className ) }
		name={ name }
		type='text'
		value={ value }
	/>
);

TextArea.propTypes = {
	className: PropTypes.string,
	value: PropTypes.string,
	name: PropTypes.string,
};

export default TextArea;
