import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import autobind from 'autobind-decorator';

import Button from './shared/button';

import { UI_I18N } from '../globals/i18n';

import styles from './collection-edit-bar.pcss';

/**
 * Stateless component for top bar when in live edit mode
 *
 * @param props
 * @returns {XML}
 * @constructor
 */

class EditBar extends Component {

	componentDidMount() {
		this.lockBody();
		const target = ReactDOM.findDOMNode(this.refs.right);
		const publish = document.getElementById('publish');
		if (!publish) {
			return;
		}
		target.appendChild(publish);
	}

	componentWillUnmount() {
		this.unLockBody();
		const target = document.getElementById('publishing-action');
		const publish = document.getElementById('publish');
		if (!publish) {
			return;
		}
		target.appendChild(publish);
	}

	lockBody() {
		const html = document.getElementsByTagName('html')[0];
		html.style.overflow = 'hidden';
		html.style.height = '100%';
	}

	unLockBody() {
		const html = document.getElementsByTagName('html')[0];
		html.style.overflow = 'auto';
		html.style.height = 'auto';
	}

	@autobind
	setSizeFull() {
		this.props.handleResizeClick('full');
	}

	@autobind
	setSizeTablet() {
		this.props.handleResizeClick('tablet');
	}

	@autobind
	setSizeMobile() {
		this.props.handleResizeClick('mobile');
	}

	renderTitle() {
		const titleEl = document.getElementById('title');
		const pageTitle = { __html: titleEl ? titleEl.value : UI_I18N['heading.no_title'] };
		return (
			<h4>
				<span className={styles.editing}>{UI_I18N['heading.editing_panels']}:</span>
				<span className={styles.page} dangerouslySetInnerHTML={pageTitle} />
			</h4>
		);
	}

	render() {
		const wrapperClasses = classNames({
			[styles.wrapper]: true,
		});

		return (
			<section className={wrapperClasses}>
				<div className={styles.left}>
					<nav className={styles.cancel}>
						<Button
							bare
						    icon="dashicons-no-alt"
						    handleClick={this.props.handleCancelClick}
						/>
					</nav>
					<div className={styles.title}>
						{this.renderTitle()}
					</div>
				</div>
				<div className={styles.resizer}>
					<Button
						bare
						icon="dashicons-laptop"
						handleClick={this.setSizeFull}
						classes={styles.desktop}
					/>
					<Button
						bare
						icon="dashicons-tablet"
						handleClick={this.setSizeTablet}
						classes={styles.tablet}
					/>
					<Button
						bare
						icon="dashicons-smartphone"
						handleClick={this.setSizeMobile}
					    classes={styles.mobile}
					/>
				</div>
				<div ref="right" className={styles.right} />
			</section>
		);
	}
}

EditBar.propTypes = {
	handleCancelClick: PropTypes.func,
	handleResizeClick: PropTypes.func,
};

EditBar.defaultProps = {
	handleCancelClick: () => {},
	handleResizeClick: () => {},
};

export default EditBar;
