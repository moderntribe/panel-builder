/* global expect b:true */

import React from 'react';
import { shallow, mount } from 'enzyme';
import Group from 'components/fields/group';

describe('Group field', () => {
	it('renders as a <div>', () => {
		const wrapper = shallow(<Group />);
		expect(wrapper.type()).toEqual('div');
	});

	it('allows us to set props', () => {
		const wrapper = mount(<Group description="testing description" />);
		expect(wrapper.props().description).toEqual('testing description');
		wrapper.setProps({ description: 'Change props for test' });
		expect(wrapper.props().description).toEqual('Change props for test');
	});
});
