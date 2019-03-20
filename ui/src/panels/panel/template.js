import React, { PureComponent } from 'react';
import { PanelBody } from '@wordpress/components';
import { InspectorControls } from '@wordpress/editor';

class Panel extends PureComponent {
	componentDidMount() {
		this.props.onMount();
	}

	componentWillUnmount() {
		this.props.onUnmount();
	}

	render() {
		return (
			this.props.panel
				? [
					<div>{ this.props.panel.type }</div>,
					<InspectorControls>
						<PanelBody title="Content">
							{
								Object.keys( this.props.panel.fields ).map( ( fieldKey ) => {
									this.props.panel.fields[fieldKey];
									// return <Component />
								} )
							}
						</PanelBody>
					</InspectorControls>
				]
				: null
		);
	}
}

export default Panel;
