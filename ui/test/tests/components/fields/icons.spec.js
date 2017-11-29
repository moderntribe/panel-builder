/* global expect b:true */

import React from 'react';
import { shallow, mount } from 'enzyme';
import Icons from 'components/fields/icons';

describe('Icons field', () => {
	it('renders as a <div>', () => {
		const wrapper = shallow(<Icons />);
		expect(wrapper.type()).toEqual('div');
	});

	it('has a container for the icons.', () => {
		const wrapper = shallow(<Icons />);
		expect(wrapper.find('.panel-icon-container').length).toEqual(1);
	});

	it('has a container for the description.', () => {
		const wrapper = shallow(<Icons />);
		expect(wrapper.find('.panel-field-description').length).toEqual(1);
	});

	it('renders a search field if that prop is true', () => {
		const wrapper = mount(<Icons search />);
		expect(wrapper.find('.panel-icon-search').length).toEqual(1);
	});
});
