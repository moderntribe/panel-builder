import { connect } from 'react-redux';
import { compose } from 'redux';
import { withStore } from '../../common/hoc';
import { actions } from '../../data/panels';
import { getPanelType } from '../../configs/settings';
import { mapConfigToFields } from '../../configs/maps';
import Template from './template';

const mapStateToProps = ( state, ownProps ) => {
	return {
		panel: state.panels[ ownProps.clientId ],
	};
};

const mapDispatchToProps = ( dispatch, ownProps ) => {
	return {
		onMount: () => {
			const type = ownProps.name.split( '/' ).pop();
			const config = getPanelType( type );
			const fields = mapConfigToFields( config.fields );
			const payload = {
				clientId: ownProps.clientId,
				type,
				fields,
			};
			dispatch( actions.addPanel( payload ) );
		},
		onUnmount: () => {
			const payload = {
				clientId: ownProps.clientId,
			};
			dispatch( actions.removePanel( payload ) );
		},
	}
};

export default compose(
	withStore(),
	connect( mapStateToProps, mapDispatchToProps ),
)( Template );
