/**
 * External dependencies
 */
import { React } from 'react';
import { PropTypes } from 'prop-types';
import { classNames } from 'classnames';
import { noop } from 'lodash';

/**
 * WordPress dependencies
 */
import { MediaUpload } from '@wordpress/components';

const getImageButton = ( openEvent ) => {
	if ( attributes.imageUrl ) {
		return (
		<img
			src={ attributes.imageUrl }
			onClick={ openEvent }
			className="image"
		/>
		);
	}
	else {
		return (
		<div className="button-container">
			<Button
			onClick={ openEvent }
			className="button button-large"
			>
			Pick an image
			</Button>
		</div>
		);
	}
};

const ImageUpload = ( {
	attributes,
	name
} ) => (
	<MediaUpload
	onSelect={ media => { setAttributes({ imageAlt: media.alt, imageUrl: media.url }); } }
	name={ name }
	type="image"
	value={ attributes.imageID }
	render={ ({ open }) => getImageButton(open) }
	/>
);


ImageUpload.propTypes = {
	className: PropTypes.string,
	value: PropTypes.integer,
	name: PropTypes.string,
};

export default ImageUpload;
