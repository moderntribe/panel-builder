import React, { Component } from 'react';

class Text extends Component {
	render() {
		// graeme you are going to want to use clasnames module and grab styles from the scss in the old assets folder. check the panel.pcss file.
		return (
			<div className="panel-input input-name-nav_title input-type-text">
				<label className="panel-input-label">{this.props.label}</label>
				<span className="panel-input-field">
					<input type="text" name={this.props.name} value="" size="40" />
				</span>
				<p className="description panel-input-description">{this.props.description}</p>
			</div>
		);
	}
}

Text.propTypes = {
	label: React.PropTypes.string,
	name: React.PropTypes.string,
	description: React.PropTypes.string,
	strings: React.PropTypes.array,
	default: React.PropTypes.string,
};

Text.defaultProps = {
	label: '',
	name: '',
	description: '',
	strings: [],
	default: '',
};

export default Text;
