const TITLE = 'Title';
const IMAGE_SELECT = 'ImageSelect';
const TEXT_AREA = 'TextArea';
const LINK = 'Link';

export const configElementMap = ( config ) => {
	switch ( config ) {
		case TITLE:
			return 'Text';
		case IMAGE_SELECT:
			return 'Image Select';
		case TEXT_AREA:
			return 'Text Area';
		case LINK:
			return 'Link';
		default:
			return '';
	}
}

export const configFieldsMap = ( config ) => {
	return config.reduce( ( acc, current ) => {
		acc[ current.name ] = {
			type: current.type,
			label: current.label,
			value: current.default,
		};
		return acc;
	}, {} );
};
