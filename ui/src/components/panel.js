import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import _ from 'lodash';
import autobind from 'autobind-decorator';
import Button from './shared/button';

import FieldBuilder from './shared/field-builder';

import styles from './panel.pcss';

class PanelContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			active: false,
		};
		this.el = null;
	}

	componentDidMount() {
		this.el = ReactDOM.findDOMNode(this.refs.panel);
	}

	handleHeights() {
		if (!this.state.active) {
			this.updateHeight();
		} else {
			this.el.parentNode.style.height = 'auto';
		}
	}

	updateHeight() {
		_.delay(() => {
			const fields = this.el.querySelectorAll('.panel-row-fields');
			fields[0].style.marginTop = `-${this.el.offsetTop - 12}px`;
			this.el.parentNode.style.height = `${fields[0].offsetHeight}px`;
		}, 50);
	}

	@autobind
	handleHeightChange() {
		if (this.state.active) {
			this.updateHeight();
		}
	}

	@autobind
	handleClick() {
		this.setState({
			active: !this.state.active,
		});
		this.props.panelsActive(!this.state.active);
		this.handleHeights();
	}

	getFields() {
		let FieldContainer = null;
		const Fields = this.state.active ? <FieldBuilder {...this.props} /> : null;

		if (this.state.active) {
			const fieldClasses = classNames({
				[styles.fields]: true,
				[styles.fieldsEdit]: this.props.liveEdit,
				'panel-row-fields': true,
			});
			const fieldInnerClasses = classNames({
				[styles.inner]: true,
			});

			FieldContainer = (
				<div className={fieldClasses}>
					<div className={fieldInnerClasses}>
						<nav className={styles.back}>
							<Button
								classes={styles.backButton}
								handleClick={this.handleClick}
							/>
							<h3>
								<span className={styles.action}>
									Editing
								</span>
								{this.props.label}
							</h3>
						</nav>
						<div className={styles.fieldWrap}>
							{Fields}
						</div>
					</div>
				</div>
			);
		}

		return FieldContainer;
	}

	render() {
		const wrapperClasses = classNames({
			[styles.row]: true,
			[`panel-type-${this.props.type}`]: true,
			[`panel-depth-${this.props.depth}`]: true,
		});
		const headerClasses = classNames({
			[styles.header]: true,
			'panel-row-header': true,
		});
		const arrowClasses = classNames({
			dashicons: true,
			[styles.arrow]: true,
			'panel-row-arrow': true,
			'dashicons-arrow-right-alt2': true,
		});

		return (
			<div ref="panel" className={wrapperClasses}>
				<div className={headerClasses} onClick={this.handleClick}>
					<h3>{this.props.label}</h3>
					<i className={arrowClasses} />
				</div>
				{this.getFields()}
			</div>
		);
	}
}

PanelContainer.propTypes = {
	data: React.PropTypes.object,
	depth: React.PropTypes.number,
	index: React.PropTypes.number,
	type: React.PropTypes.string,
	label: React.PropTypes.string,
	description: React.PropTypes.string,
	icon: React.PropTypes.object,
	fields: React.PropTypes.array,
	liveEdit: React.PropTypes.bool,
	panelsActive: PropTypes.func,
	movePanel: PropTypes.func,
	updatePanelData: PropTypes.func,
};

PanelContainer.defaultProps = {
	data: {},
	depth: 0,
	index: 0,
	type: '',
	label: '',
	description: '',
	icon: {},
	fields: [],
	liveEdit: false,
	panelsActive: () => {},
	movePanel: () => {},
	updatePanelData: () => {},
};

export default PanelContainer;
