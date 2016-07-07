import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import autobind from 'autobind-decorator';
import { UI_I18N } from '../../globals/i18n';

import Button from './button';

import styles from './panel-set-preview.pcss';

/**
 * Component for panel set preview item
 *
 * @param props
 * @returns {XML}
 * @constructor
 */

class PanelSetPreview extends Component {
	@autobind
	handleOnMouseover() {
		this.props.togglePreview(this.props.preview);
	}

	@autobind
	handleOnMouseout() {
		this.props.togglePreview();
	}

	render() {
		const containerClasses = classNames({
			[styles.container]: true,
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
					<figure>
						<img src={this.props.thumbnail} alt={this.props.label} />
						<figcaption className={styles.select}>
							<div><span>{UI_I18N['button.select_set']}</span></div>
						</figcaption>
					</figure>
				</div>
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
	togglePreview: PropTypes.func,
};

PanelSetPreview.defaultProps = {
	label: '',
	description: '',
	thumbnail: '',
	preview: '',
	handleAddPanelSet: () => {},
	togglePreview: () => {},
};

export default PanelSetPreview;
