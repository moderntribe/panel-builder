/* global expect b:true */

import React from 'react';
import { shallow, mount } from 'enzyme';
import Icons from 'components/fields/icons';
import renderer from 'react-test-renderer';

const props = {
	label: 'Arrow Icon',
	class_string: '%s',
	icon_prefix: 'fa-2x ',
	default: 'fas fa-arrow-alt-right',
	options: [
		'far fa-arrow-alt-circle-right',
		'fas fa-arrow-alt-circle-right',
		'fal fa-arrow-alt-circle-right',
		'far fa-arrow-alt-right',
		'fas fa-arrow-alt-right',
		'fal fa-arrow-alt-right',
		'far fa-arrow-alt-square-right',
		'fas fa-arrow-alt-square-right',
		'fal fa-arrow-alt-square-right',
		'far fa-arrow-alt-to-right',
		'fas fa-arrow-alt-to-right',
		'fal fa-arrow-alt-to-right',
		'far fa-arrow-circle-right',
		'fas fa-arrow-circle-right',
		'fal fa-arrow-circle-right',
		'far fa-arrow-right',
		'fas fa-arrow-right',
		'fal fa-arrow-right',
		'far fa-arrow-square-right',
		'fas fa-arrow-square-right',
		'fal fa-arrow-square-right',
		'far fa-arrow-to-right',
		'fas fa-arrow-to-right',
		'fal fa-arrow-to-right',
		'far fa-chevron-circle-right',
		'fas fa-chevron-circle-right',
		'fal fa-chevron-circle-right',
		'far fa-chevron-double-right',
		'fas fa-chevron-double-right',
		'fal fa-chevron-double-right',
		'far fa-chevron-right',
		'fas fa-chevron-right',
		'fal fa-chevron-right',
		'far fa-chevron-square-right',
		'fas fa-chevron-square-right',
		'fal fa-chevron-square-right',
		'far fa-long-arrow-alt-right',
		'fas fa-long-arrow-alt-right',
		'fal fa-long-arrow-alt-right',
		'far fa-long-arrow-right',
		'fas fa-long-arrow-right',
		'fal fa-long-arrow-right',
		'far fa-angle-double-right',
		'fas fa-angle-double-right',
		'fal fa-angle-double-right',
		'far fa-angle-right',
		'fas fa-angle-right',
		'fal fa-angle-right',
	],
	description: 'Select your arrow icon for the slider.',
};

describe('Icons field', () => {
	it('renders correctly', () => {
		const tree = renderer
			.create(<Icons {...props} />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('renders as a <div>', () => {
		const wrapper = shallow(<Icons />);
		expect(wrapper.type()).toEqual('div');
	});

	it('has a container for the icons.', () => {
		const wrapper = shallow(<Icons />);
		expect(wrapper.find('.panel-icon-container').length).toEqual(1);
	});

	it('renders a search field if that prop is true', () => {
		const wrapper = mount(<Icons search />);
		expect(wrapper.find('.panel-icon-search').length).toEqual(1);
	});
});
