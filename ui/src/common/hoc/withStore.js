import React from 'react';
import store from '../../store';

export default () => ( Component ) => {
	return ( props ) => {
		const extraProps = {
			store,
		};

		return <Component { ...props } { ...extraProps } />;
	}
}
