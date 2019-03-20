import { registerBlockType } from '@wordpress/blocks';
import panelTypes from './config';

const initPanels = () => {
	panelTypes.forEach( panel => registerBlockType( `tribe-panel/${ panel.id }`, panel ) );
};

export default initPanels;
