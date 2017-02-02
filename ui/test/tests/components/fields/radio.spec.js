/* global expect b:true */

import React from 'react';
import { shallow, mount } from 'enzyme';
import Radio from 'components/fields/radio';

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


describe('Radio field', () => {
	it('renders as a <div>', () => {
		const wrapper = shallow(<Radio />);
		expect(wrapper.type()).toEqual('div');
	});

	it('has no radio buttons without properties.', () => {
		const wrapper = shallow(<Radio />);
		expect(wrapper.find('input').length).toEqual(0);
	});

	it('has a label', () => {
		const wrapper = shallow(<Radio />);
		expect(wrapper.find('label').length).toEqual(1);
	});

	it('has a description paragraph', () => {
		const wrapper = shallow(<Radio />);
		expect(wrapper.find('p').length).toEqual(1);
	});

	it('allows us to set and edit props', () => {
		const wrapper = mount(<Radio description="This is a test description" label="Some test label" options={OPTIONS1} />);
		expect(wrapper.props().description).toEqual('This is a test description');
		wrapper.setProps({ description: 'Change description for test' });
		expect(wrapper.props().description).toEqual('Change description for test');

		expect(wrapper.props().label).toEqual('Some test label');
		wrapper.setProps({ label: 'Change label for test' });
		expect(wrapper.props().label).toEqual('Change label for test');

		expect(wrapper.props().options).toEqual(OPTIONS1);
		wrapper.setProps({ options: OPTIONS2 });
		expect(wrapper.props().options).toEqual(OPTIONS2);
	});

	it('allows us to properly formatted radio options', () => {
		const wrapper = mount(<Radio description="This is a test description" label="Some test label" options={OPTIONS1} />);
		expect(wrapper.find('label.plradio-label').length).toEqual(3);
		expect(wrapper.find('label.plradio-label').first().find('input').length).toEqual(1);
		expect(wrapper.find('label.plradio-label').first().find('input').props().value).toEqual('standard');
		expect(wrapper.find('label.plradio-label').first().text()).toEqual('Standard');
	});
});
