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
		dispatch,
	};
};

const mergeProps = ( stateProps, dispatchProps, ownProps ) => {
	const { dispatch, ...restDispatchProps } = dispatchProps;

	return {
		...ownProps,
		...stateProps,
		...restDispatchProps,
		onUpdate: ( fieldKey ) => ( value ) => {
			const clientId = ownProps.clientId;
			const type = stateProps.panel.type;
			const fields = Object.assign(
				{},
				stateProps.panel.fields,
				{
					[ fieldKey ]: {
						...stateProps.panel.fields[ fieldKey ],
						value,
					},
				},
			);
			const payload = {
				clientId,
				type,
				fields,
			};
			dispatch( actions.updatePanel( payload ) );
		},
	}
}

export default compose(
	withStore(),
	connect( mapStateToProps, mapDispatchToProps, mergeProps ),
)( Template );
