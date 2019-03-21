/**
 * External dependencies
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { __ } from '@wordpress/i18n';
import { MediaUpload } from '@wordpress/editor';

class ImageUpload extends PureComponent {
	static propTypes = {
		label: PropTypes.string,
		description: PropTypes.string,
		value: PropTypes.string,
		onChange: PropTypes.func,
	};

	constructor( props ) {
		super( props );
		this.state = {
			url: '',
		};
	}

	onRemove = () => {
		this.props.onChange( 0 );
	};

	onSelect = ( image ) => {
		this.setState( { url: image.sizes.medium.url } );
		this.props.onChange( image.id );
	};

	renderImageUploadButton = ( { open } ) => (
		<button onClick={ open }>
			{ __( 'Select Image', 'modular_content' ) }
		</button>
	);

	renderImage = ( imageId, onRemove ) => (
		<div className="tribe-editor__image-upload__image-wrapper">
			<img src={ imageId } />
			<button onClick={ onRemove }>
				{ __( 'remove', 'modular_content' ) }
			</button>
		</div>
	);

	render() {
		const { label, description, value } = this.props;

		return (
			<div>
				{ label && <h3>{ label }</h3> }
				{ description && (
					<p>{ description }</p>
				) }
				{
					value
						? this.renderImage( this.state.url, this.onRemove )
						: (
							<MediaUpload
								onSelect={ this.onSelect }
								type="image"
								render={ this.renderImageUploadButton }
								value={ value }
							/>
						)
				}
			</div>
		);
	}
}

export default ImageUpload;
