import store from '../store';
import { sagas as accordion } from './panels/accordion';
import { sagas as imageText } from './panels/imageText';

export default () => {
	[
		accordion,
		imageText,
	].forEach( sagas => store.run( sagas ) );
};
