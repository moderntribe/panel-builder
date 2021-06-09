import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import autobind from 'autobind-decorator';
import { UI_I18N } from '../../globals/i18n';

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
	addSet() {
		this.props.handleAddPanelSet(this.props.template.panels);
	}

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
				onClick={this.addSet}
				onMouseOver={this.handleOnMouseover}
				onMouseOut={this.handleOnMouseout}
			>
				<h4 dangerouslySetInnerHTML={this.props.label} />
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
	template: PropTypes.object,
	preview: PropTypes.string,
	handleAddPanelSet: PropTypes.func,
	togglePreview: PropTypes.func,
};

PanelSetPreview.defaultProps = {
	label: '',
	description: '',
	thumbnail: '',
	template: {},
	preview: '',
	handleAddPanelSet: () => {},
	togglePreview: () => {},
};

export default PanelSetPreview;
