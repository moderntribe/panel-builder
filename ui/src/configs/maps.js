import { CTA, ImageUpload, Radio, RichText, Text } from '../common/elements';

const TITLE = 'Title';
const IMAGE_SELECT = 'ImageSelect';
const TEXT_AREA = 'TextArea';
const IMAGE = 'Image';
const LINK = 'Link';

const configElementMap = {
	[ TITLE ]: Text,
	[ IMAGE_SELECT ]: Radio,
	[ TEXT_AREA ]: RichText,
	[ IMAGE ]: ImageUpload,
	[ LINK ]: CTA,
};

export const mapConfigToElement = ( config ) => {
	return configElementMap[ config.type ] || null;
};

export const mapConfigToFields = ( config ) => {
	return config.reduce( ( acc, current ) => {
		acc[ current.name ] = {
			type: current.type,
			label: current.label,
			value: current.default,
		};

		if ( current.options ) {
			acc[ current.name ].options = current.options;
		}

		return acc;
	}, {} );
};
