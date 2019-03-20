import Panel from './panel/container';
import { PANEL_TYPES } from '../configs/settings';

const getConfigType = ( config ) => {
	const def = config.default;
	let type = '';

	if ( Number.isInteger( def ) ) {
		type = 'integer';
	} else if ( typeof def === 'string' ) {
		if ( config.type === 'TextArea' && config.richText ) {
			type = 'html';
		} else {
			type = 'string';
		}
	} else if ( Array.isArray( def ) ) {
		type = 'array';
	} else {
		type = 'object';
	}

	return type;
}

const getPanelConfig = ( config ) => {
	const type = getConfigType( config );

	return {
		type,
		default: config.default,
	};
}

const panelTypes = PANEL_TYPES.map( panelType => {
	const attributes = panelType.fields.reduce( ( acc, current ) => {
		const newConfig = {
			...acc,
			[ current.name ]: getPanelConfig( current ),
		};

		return newConfig;
	}, {} );

	return {
		id: panelType.type,
		title: panelType.label,
		description: panelType.description,
		icon: panelType.thumbnail,
		category: 'tribe-panels',
		keywords: [],
		supports: {
			html: false,
		},
		attributes,
		edit: Panel,
		save: () => null,
	}
} );

export default panelTypes;
