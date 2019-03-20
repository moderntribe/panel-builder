import { connect } from 'react-redux';
import { compose } from 'redux';
import { actions, selectors } from '../../data/panels/imageText';
import ImageText from './template';

const mapStateToProps = ( state ) => {
	return {
		imageId: selectors.getImageTextImageId( state ),
		content: selectors.getImageTextContent( state ),
	};
};

const mapDispatchToProps = ( dispatch ) => {
	return {
		onImageSelect: ( id ) => dispatch( actions.setImageTextImageId( id ) ),
		onContentChange: ( content ) => dispatch( actions.setImageTextContent( content ) ),
	};
};

export default compose(
	withStore(),
	connect( mapStateToProps, mapDispatchToProps ),
)( ImageText );
