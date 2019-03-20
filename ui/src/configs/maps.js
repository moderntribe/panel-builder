const TITLE = 'Title';
const IMAGE_SELECT = 'ImageSelect';
const TEXT_AREA = 'TextArea';

export const configElementMap = ( config ) => {
	switch ( config ) {
		case TITLE:
			return 'Text';
		case IMAGE_SELECT:
			return 'Image Select';
		case TEXT_AREA:
			return 'Text Area';
		default:
			return '';
	}
}
