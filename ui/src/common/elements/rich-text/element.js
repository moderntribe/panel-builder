/**
 * External Dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { RichText } from '@wordpress/editor';

const Text = ( {
	className,
	value,
	name
} ) => (
	<RichText
		tagName="div"
		className={ classNames( 'blockpanels__wysiwyg', className ) }
		palceholder={ __( 'Enter text...', 'custom-block' ) }
		name={ name }
		value={ value }
		keepPlaceholderOnFocus={ true }
	/>
);

Input.propTypes = {
	className: PropTypes.string,
	value: PropTypes.string,
	name: PropTypes.string,
};

export default Text;
