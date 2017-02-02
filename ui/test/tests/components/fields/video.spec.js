/* global expect b:true */

import React from 'react';
import { shallow, mount } from 'enzyme';
import Video from 'components/fields/video';

describe('Video field', () => {
	it('renders as a <div>', () => {
		const wrapper = shallow(<Video />);
		expect(wrapper.type()).toEqual('div');
	});

	it('allows us to set props', () => {
		const wrapper = mount(<Video description="This is a test" label="Cat Video" name="cat_video" />);
		expect(wrapper.props().description).toEqual('This is a test');
		wrapper.setProps({ description: 'Change props for test' });
		expect(wrapper.props().description).toEqual('Change props for test');

		expect(wrapper.props().label).toEqual('Cat Video');
		wrapper.setProps({ label: 'New Label' });
		expect(wrapper.props().label).toEqual('New Label');

		expect(wrapper.props().name).toEqual('cat_video');
		wrapper.setProps({ name: 'new_video' });
		expect(wrapper.props().name).toEqual('new_video');
	});

	it('has a label', () => {
		const wrapper = shallow(<Video />);
		expect(wrapper.find('label').length).toEqual(1);
	});

	it('renders a text input', () => {
		const wrapper = shallow(<Video />);
		expect(wrapper.find('input[type="text"]').length).toEqual(1);
	});

	it('has a description paragraph', () => {
		const wrapper = shallow(<Video />);
		expect(wrapper.find('p').length).toEqual(1);
	});
});
