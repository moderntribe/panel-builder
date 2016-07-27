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
		this.setup();
	}

	componentWillUnmount() {
		this.reset();
	}

	setup() {
		this.lockBody();
		const wrapper = ReactDOM.findDOMNode(this.refs.wrapper);
		_.delay(() => wrapper.classList.add(styles.loaded), 25);
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

	reset() {
		this.unLockBody();
	}

	publishPost() {
		const postForm = document.getElementById('publish');
		if (postForm) {
			postForm.click();
		}
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

	renderTitle() {
		const titleEl = document.getElementById('title');
		const pageTitle = { __html: titleEl && titleEl.value.length ? titleEl.value : UI_I18N['heading.no_title'] };
		return (
			<h4>
				<span className={styles.editing}>{UI_I18N['heading.editing_panels']}:</span>
				<span className={styles.page} dangerouslySetInnerHTML={pageTitle} />
			</h4>
		);
	}

	render() {
		const publishButtonText = document.getElementById('publish').value;

		const wrapperClasses = classNames({
			[styles.wrapper]: true,
			'modular-content-admin-bar': true,
		});

		const publishClasses = classNames({
			[styles.publish]: true,
			button: true,
			'button-primary': true,
			'button-large': true,
		});

		return (
			<section ref="wrapper" className={wrapperClasses}>
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
					<span className={styles.resizerHeading}>{UI_I18N['heading.resizer']}:</span>
					<Button
						bare
						handleClick={this.setSizeFull}
						classes={styles.desktop}
					/>
					<Button
						bare
						handleClick={this.setSizeTablet}
						classes={styles.tablet}
					/>
					<Button
						bare
						handleClick={this.setSizeMobile}
						classes={styles.mobile}
					/>
				</div>
				<div ref="right" className={styles.right}>
					<Button
						text={publishButtonText}
						handleClick={this.publishPost}
						primary={false}
						full={false}
						classes={publishClasses}
					/>
				</div>
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
