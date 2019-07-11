/* global expect b:true */

import React from 'react';
import { shallow, mount } from 'enzyme';
import Checkbox from 'components/fields/checkbox';
import renderer from 'react-test-renderer';

// test data
const OPTIONS1 = [
	{
		label: 'Standard',
		value: 'standard',
	},
	{
		label: 'Cards',
		value: 'cards',
	},
	{
		label: 'Full',
		value: 'full',
	},
];
const OPTIONS2 = [
	{
		label: 'Orange',
		value: '1',
	},
	{
		label: 'Raspberry',
		value: '2',
	},
];
const DEFAULT1 = {
	cards: 1,
};
const DEFAULT2 = {
	full: 1,
};

describe('Checkbox field', () => {
	it('renders correctly', () => {
		const tree = renderer
			.create(<Checkbox description="This is a test description" name="layout" label="Some test label" options={OPTIONS1} default={DEFAULT1} />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('renders as a <div>', () => {
		const wrapper = shallow(<Checkbox />);
		expect(wrapper.type()).toEqual('div');
	});

	it('has no checkboxes (without properties).', () => {
		const wrapper = shallow(<Checkbox />);
		expect(wrapper.find('input[type="checkbox"]').length).toEqual(0);
	});

	it('has a label', () => {
		const wrapper = shallow(<Checkbox />);
		expect(wrapper.find('label').length).toEqual(1);
	});

	it('allows us to set and edit props', () => {
		const wrapper = mount(<Checkbox description="This is a test description" name="layout" label="Some test label" options={OPTIONS1} default={DEFAULT1} />);
		expect(wrapper.props().description).toEqual('This is a test description');
		wrapper.setProps({ description: 'Change description for test' });
		expect(wrapper.props().description).toEqual('Change description for test');

		expect(wrapper.props().label).toEqual('Some test label');
		wrapper.setProps({ label: 'Change label for test' });
		expect(wrapper.props().label).toEqual('Change label for test');

		expect(wrapper.props().name).toEqual('layout');
		wrapper.setProps({ name: 'fruit' });
		expect(wrapper.props().name).toEqual('fruit');

		expect(wrapper.props().default).toEqual(DEFAULT1);
		wrapper.setProps({ default: DEFAULT2 });
		expect(wrapper.props().default).toEqual(DEFAULT2);

		expect(wrapper.props().options).toEqual(OPTIONS1);
		wrapper.setProps({ options: OPTIONS2 });
		expect(wrapper.props().options).toEqual(OPTIONS2);
	});

	it('allows us to properly formatted radio options', () => {
		const wrapper = mount(<Checkbox description="This is a test description" name="layout" label="Some test label" options={OPTIONS1} default={DEFAULT1} />);
		expect(wrapper.find('ul').find('li').length).toEqual(3);
		expect(wrapper.find('ul li').first().find('input[type="checkbox"]').length).toEqual(1);
		expect(wrapper.find('ul li').first().find('input[type="checkbox"]').props().value).toEqual('standard');
		expect(wrapper.find('ul li').first().find('label').text()).toEqual('Standard');
	});
});
