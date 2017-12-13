/* global expect b:true */

import React from 'react';
import { shallow, mount } from 'enzyme';
import { ImageSelect } from 'components/fields/image-select';

// test data
const OPTIONS1 = [
	{
		src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==',
		label: 'Standard',
		value: 'standard',
	},
	{
		src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==',
		label: 'Cards',
		value: 'cards',
	},
	{
		src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==',
		label: 'Full',
		value: 'full',
	},
];
const OPTIONS2 = [
	{
		src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==',
		label: 'Cows',
		value: 'cows',
	},
	{
		src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==',
		label: 'Orangutan',
		value: 'orangutan',
	},
];

describe('ImageSelect field', () => {
	it('renders as a <div>', () => {
		const wrapper = shallow(<ImageSelect />);
		expect(wrapper.type()).toEqual('div');
	});


	it('has no image select radio buttons without properties.', () => {
		const wrapper = shallow(<ImageSelect />);
		expect(wrapper.find('input').length).toEqual(0);
	});

	it('has a label', () => {
		const wrapper = shallow(<ImageSelect />);
		expect(wrapper.find('label').length).toEqual(1);
	});

	it('has a description paragraph', () => {
		const wrapper = shallow(<ImageSelect />);
		expect(wrapper.find('p').length).toEqual(1);
	});

	it('allows us to set and edit props', () => {
		const wrapper = mount(
			<ImageSelect
				description="This is a test description"
				label="Some test label"
				options={OPTIONS1}
				name="layout"
				default="cards"
			/>
		);

		expect(wrapper.props().description).toEqual('This is a test description');
		wrapper.setProps({ description: 'Change description for test' });
		expect(wrapper.props().description).toEqual('Change description for test');

		expect(wrapper.props().label).toEqual('Some test label');
		wrapper.setProps({ label: 'Change label for test' });
		expect(wrapper.props().label).toEqual('Change label for test');

		expect(wrapper.props().name).toEqual('layout');
		wrapper.setProps({ name: 'animal' });
		expect(wrapper.props().name).toEqual('animal');

		expect(wrapper.props().default).toEqual('cards');
		wrapper.setProps({ default: 'cows' });
		expect(wrapper.props().default).toEqual('cows');

		expect(wrapper.props().options).toEqual(OPTIONS1);
		wrapper.setProps({ options: OPTIONS2 });
		expect(wrapper.props().options).toEqual(OPTIONS2);
	});

	it('allows us to properly formatted image select options', () => {
		const wrapper = mount(
			<ImageSelect
				description="This is a test description"
				label="Some test label"
				options={OPTIONS1}
				name="layout"
				default="cards"
			/>
		);

		expect(wrapper.find('label.plimageselect-label').length).toEqual(3);
		expect(wrapper.find('label.plimageselect-label').first().find('input').length).toEqual(1);
		expect(wrapper.find('label.plimageselect-label').first().find('img').length).toEqual(1);
		expect(wrapper.find('label.plimageselect-label').first().find('input').props().value).toEqual('standard');
		expect(wrapper.find('label.plimageselect-label').first().text()).toEqual('Standard');
	});
});
