/* global expect b:true */

import React from 'react';
import { shallow } from 'enzyme';
import Link from 'components/fields/link';
import LinkGroup from 'components/shared/link-group';
import renderer from 'react-test-renderer';


describe('Link field', () => {
	it('renders correctly', () => {
		const tree = renderer
			.create(<Link />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('renders as a <div>', () => {
		const wrapper = shallow(<Link />);
		expect(wrapper.type()).toEqual('div');
	});

	it('has a label', () => {
		const wrapper = shallow(<Link />);
		expect(wrapper.find('legend').length).toEqual(1);
	});

	it('has a LinkGroup', () => {
		const wrapper = shallow(<Link />);
		expect(wrapper.find('fieldset').childAt(1).type()).toEqual(LinkGroup);
	});
});
