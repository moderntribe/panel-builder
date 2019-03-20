/**
 * External Dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { TextControl } from '@wordpress/components';

const Text = ( {
	className,
	value,
	name
} ) => (
	<TextControl
		className={ classNames( 'blockpanels__text', className ) }
		type='text'
		name={ name }
		value={ value }
	/>
);

Text.propTypes = {
	className: PropTypes.string,
	value: PropTypes.string,
	name: PropTypes.string,
};

export default Text;
