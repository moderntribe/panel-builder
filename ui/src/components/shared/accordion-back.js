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
		this.el = null;
	}

	componentDidMount() {
		document.addEventListener('modern_tribe/title_updated', this.updateTitle);
	}

	componentWillUnmount() {
		document.removeEventListener('modern_tribe/title_updated', this.updateTitle);
	}

	@autobind
	updateTitle(e) {
		this.setState({ title: e.detail.text });
	}

	render() {
		return (
			<nav className={styles.back}>
				<Button
					classes={styles.backButton}
					handleClick={this.props.handleClick}
				/>
				<h3>
					{this.state.title}
					<span className={styles.action}>{this.props.panelLabel}</span>
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
	handleExpanderClick: PropTypes.func,
};

AccordionBack.defaultProps = {
	title: UI_I18N['heading.no_title'],
	panelLabel: '',
	handleClick: () => {},
	handleExpanderClick: () => {},
};

export default AccordionBack;
