/* global expect b:true */

import React from 'react';
import { shallow, mount } from 'enzyme';
import { Number } from 'components/fields/number';

describe('Text field', () => {
	it('renders as a <div>', () => {
		const wrapper = shallow(<Number />);
		expect(wrapper.type()).toEqual('div');
	});

	it('allows us to set props', () => {
		const wrapper = mount(<Number description="This is a test" />);
		expect(wrapper.props().description).toEqual('This is a test');
		wrapper.setProps({ description: 'Change props for test' });
		expect(wrapper.props().description).toEqual('Change props for test');
	});

	it('has a label', () => {
		const wrapper = shallow(<Number />);
		expect(wrapper.find('label').length).toEqual(1);
	});

	it('renders a text input', () => {
		const wrapper = shallow(<Number />);
		expect(wrapper.find('input[type="number"]').length).toEqual(1);
	});

	it('has a description paragraph', () => {
		const wrapper = shallow(<Number />);
		expect(wrapper.find('p').length).toEqual(1);
	});
});
