/* global expect b:true */

import React from 'react';
import { shallow, mount } from 'enzyme';
import NumericInput from 'components/fields/numeric-input';

describe('Numeric input field', () => {
	it('renders as a <div>', () => {
		const wrapper = shallow(<NumericInput step={1} />);
		expect(wrapper.type()).toEqual('div');
	});

	it('allows us to set props', () => {
		const wrapper = mount(<NumericInput step={1} description="This is a test" />);
		expect(wrapper.props().description).toEqual('This is a test');
		wrapper.setProps({ description: 'Change props for test' });
		expect(wrapper.props().description).toEqual('Change props for test');
	});

	it('has a label', () => {
		const wrapper = shallow(<NumericInput step={1} />);
		expect(wrapper.find('label').length).toEqual(1);
	});
});
