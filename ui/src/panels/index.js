import { registerBlockType } from '@wordpress/blocks';

// import accordion from './accordion';
// import imageText from './imageText';

const initPanels = () => {
	const panels = [

	];

	panels.forEach( panel => registerBlockType( `tribe/${ panel.id }`, panel ) );
}


export default initPanels;
