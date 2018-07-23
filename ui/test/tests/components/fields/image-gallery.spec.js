/* global expect b:true */

import React from 'react';
import { shallow, mount } from 'enzyme';
import ImageGallery from 'components/fields/image-gallery';

describe('Image Gallery field', () => {
	it('renders as a <div>', () => {
		const wrapper = shallow(<ImageGallery />);
		expect(wrapper.type()).toEqual('div');
	});

	it('has a label', () => {
		const wrapper = shallow(<ImageGallery />);
		expect(wrapper.find('label.panel-field-label').length).toEqual(1);
	});

	it('has a gallery field name', () => {
		const wrapper = shallow(<ImageGallery />);
		expect(wrapper.find('input[name="gallery-field-name"]').length).toEqual(1);
	});

	it('has a gallery edit button', () => {
		const wrapper = shallow(<ImageGallery />);
		expect(wrapper.find('button').length).toEqual(1);
	});

	it('allows us to set and edit props', () => {
		const wrapper = mount(<ImageGallery description="This is a test description" label="Some test label" />);
		expect(wrapper.props().description).toEqual('This is a test description');
		wrapper.setProps({ description: 'Change description for test' });
		expect(wrapper.props().description).toEqual('Change description for test');

		expect(wrapper.props().label).toEqual('Some test label');
		wrapper.setProps({ label: 'Change label for test' });
		expect(wrapper.props().label).toEqual('Change label for test');
	});
});
