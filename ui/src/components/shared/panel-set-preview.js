import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import autobind from 'autobind-decorator';

import styles from './panel-set-preview.pcss';

/**
 * Component for panel set preview item
 *
 * @param props
 * @returns {XML}
 * @constructor
 */

class PanelSetPreview extends Component {
	constructor(props) {
		super(props);
		this.state = {
			thumbnails: (this.props.thumbnail) ? [this.props.thumbnail] : [],
			focused: true,
		};
	}

	@autobind
	handleOnMouseover() {
		this.setState({
			focused: true,
		});
		this.props.handleOnMouseover(this.props.preview);
	}

	@autobind
	handleOnMouseout() {
		this.setState({
			focused: false,
		});
		this.props.handleOnMouseout();
	}

	renderPreview() {
		return this.props.preview ? (
			<div className={styles.preview}>
				<img src={this.props.preview} alt={this.props.label} />
			</div>
		) : null;
	}

	render() {
		const containerClasses = classNames({
			[styles.container]: true,
			[styles.containerActive]: this.state.focused,
		});

		return (
			<article
				className={containerClasses}
				onClick={this.props.handleAddPanelSet}
				onMouseOver={this.handleOnMouseover}
				onMouseOut={this.handleOnMouseout}
			>
				<h4>{this.props.label}</h4>
				<p>{this.props.description}</p>
				<div className={styles.thumbnailFrame}>
					<div className={styles.thumbnailTop}><i /><i /><i /><b /></div>
					<figure><img src={this.props.thumbnail} alt={this.props.label} /></figure>
				</div>
				{this.renderPreview()}
			</article>
		);
	}
}

PanelSetPreview.propTypes = {
	label: PropTypes.string,
	description: PropTypes.string,
	thumbnail: PropTypes.string,
	preview: PropTypes.string,
	handleAddPanelSet: PropTypes.func,
	handleOnMouseover: PropTypes.func,
	handleOnMouseout: PropTypes.func,
};

PanelSetPreview.defaultProps = {
	label: '',
	description: '',
	thumbnail: '',
	preview: '',
	handleAddPanelSet: () => {},
	handleOnMouseover: () => {},
	handleOnMouseout: () => {},
};

export default PanelSetPreview;
