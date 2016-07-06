import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

import styles from './panel-set-thumbnail.pcss';

class PanelSetThumbnail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			thumbnails: (this.props.thumbnail) ? [this.props.thumbnail] : [],
		};
	}

	addThumbnail(thumbnail) {
		if (!thumbnail || thumbnail === '' || _.indexOf(this.state.thumbnails, thumbnail) !== -1) {
			return;
		}
		const thumbnails = this.state.thumbnails;
		thumbnails.push(thumbnail);
		this.setState({
			thumbnails,
		});
	}

	renderThumbnails() {
		return _.map(this.state.thumbnails, (thumbnail, i) => {
			const imageContainerClasses = classNames({
				[styles.imageContainer]: true,
				[styles.imageContainerActive]: (thumbnail === this.props.thumbnail),
			});
			return (<div className={imageContainerClasses} key={`panel-set-thumb-${i}`}>
				<img
					src={thumbnail}
					alt="Panel Set Preview"
				/>
			</div>);
		});
	}

	render() {
		const containerClasses = classNames({
			[styles.container]: true,
			[styles.containerActive]: this.props.active && this.props.liveEdit,
		});
		// add thumbnail to list if its not already there.
		// some basic DOM caching
		this.addThumbnail(this.props.thumbnail);
		return (
			<div className={containerClasses}>
				{this.renderThumbnails()}
			</div>
		);
	}
}

PanelSetThumbnail.propTypes = {
	thumbnail: PropTypes.string,
	active: PropTypes.bool,
	liveEdit: PropTypes.bool,
};

PanelSetThumbnail.defaultProps = {
	thumbnail: null,
	active: false,
	liveEdit: false,
};


export default PanelSetThumbnail;
