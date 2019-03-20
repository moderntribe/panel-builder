import { __ } from '@wordpress/i18n';
import ImageText from './container';

export default {
	id: 'imageText',
	title: __( 'Image Text', 'modular_content' ),
	description: __(
		'Set up an Image and Text panel',
		'modular_content',
	),
	icon: '',
	category: 'tribe-panels',
	keywords: [ 'panels', 'tribe', 'image', 'text', 'image-text' ],
	supports: {
		html: false,
	},
	attributes: {
		imageId: {
			type: 'integer',
			default: 0,
		},
		content: {
			type: 'html',
			default: '',
		},
	},
	edit: ImageText,
	save: () => null,
}
