/* global expect b:true */

import React from 'react';
import { shallow, mount } from 'enzyme';
import Select from 'components/fields/select';

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

describe('Select field', () => {
	it('renders as a <div>', () => {
		const wrapper = shallow(<Select />);
		expect(wrapper.type()).toEqual('div');
	});

	it('has no radio buttons without properties.', () => {
		const wrapper = shallow(<Select />);
		expect(wrapper.find('input').length).toEqual(0);
	});

	it('has a label', () => {
		const wrapper = shallow(<Select />);
		expect(wrapper.find('label').length).toEqual(1);
	});

	it('allows us to set and edit props', () => {
		const wrapper = mount(<Select description="This is a test description" label="Some test label" options={OPTIONS1} name="layout" default="cards" />);
		expect(wrapper.props().description).toEqual('This is a test description');
		wrapper.setProps({ description: 'Change description for test' });
		expect(wrapper.props().description).toEqual('Change description for test');

		expect(wrapper.props().label).toEqual('Some test label');
		wrapper.setProps({ label: 'Change label for test' });
		expect(wrapper.props().label).toEqual('Change label for test');

		expect(wrapper.props().name).toEqual('layout');
		wrapper.setProps({ name: 'fruit' });
		expect(wrapper.props().name).toEqual('fruit');

		expect(wrapper.props().default).toEqual('cards');
		wrapper.setProps({ default: '1' });
		expect(wrapper.props().default).toEqual('1');

		expect(wrapper.props().options).toEqual(OPTIONS1);
		wrapper.setProps({ options: OPTIONS2 });
		expect(wrapper.props().options).toEqual(OPTIONS2);
	});
});
