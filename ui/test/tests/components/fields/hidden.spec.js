/* global expect b:true */

import React from 'react';
import { shallow } from 'enzyme';
import Hidden from 'components/fields/hidden';

describe('Hidden field', () => {
	it('renders as a <div>', () => {
		const wrapper = shallow(<Hidden />);
		expect(wrapper.type()).toEqual('div');
	});

	it('renders a hidden input', () => {
		const wrapper = shallow(<Hidden />);
		expect(wrapper.find('input[type="hidden"]').length).toEqual(1);
	});

	it('allows you to set properties', () => {
		const wrapper = shallow(<Hidden name="test-name" default="test-value" />);
		expect(wrapper.find('input[type="hidden"]').length).toEqual(1);
		expect(wrapper.find('input[type="hidden"]').props().value).toEqual('test-value');
		expect(wrapper.find('input[type="hidden"]').props().name).toEqual('test-name');
	});
});
