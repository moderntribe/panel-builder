import React, { PropTypes, Component } from 'react';
import autobind from 'autobind-decorator';

import Expander from './expander';
import Button from './button';

import { UI_I18N } from '../../globals/i18n';

import styles from './accordion-back.pcss';

/**
 * Top component of field group that allows for back button to parent level and labelling of accordion level header area
 *
 * @returns {XML}
 * @constructor
 */

class AccordionBack extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: this.props.title,
		};
	}

	componentDidMount() {
		document.addEventListener('modern_tribe/title_updated', this.updateTitle);
	}

	componentWillUnmount() {
		this.el = null;
		document.removeEventListener('modern_tribe/title_updated', this.updateTitle);
	}

	@autobind
	updateTitle(e) {
		if (!this.el) {
			return;
		}
		const nested = this.el.parentNode.getAttribute('data-hidden');
		if (nested && nested === 'true') {
			return;
		}
		this.setState({ title: e.detail.text });
	}

	render() {
		return (
			<nav ref={r => this.el = r} className={styles.back}>
				<Button
					classes={styles.backButton}
					handleClick={this.props.handleClick}
				/>
				<h3>
					<span dangerouslySetInnerHTML={{ __html: this.state.title }} />
					<span className={styles.action} onClick={this.props.handleInfoClick}>{this.props.panelLabel}<i /></span>
					<Expander handleClick={this.props.handleExpanderClick} />
				</h3>
			</nav>
		);
	}
}

AccordionBack.propTypes = {
	title: PropTypes.string,
	panelLabel: PropTypes.string,
	handleClick: PropTypes.func,
	handleInfoClick: PropTypes.func,
	handleExpanderClick: PropTypes.func,
};

AccordionBack.defaultProps = {
	title: UI_I18N['heading.no_title'],
	panelLabel: '',
	handleClick: () => {},
	handleInfoClick: () => {},
	handleExpanderClick: () => {},
};

export default AccordionBack;
