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
		expect(wrapper.type()).to.eql('div');
	});

	it('has no radio buttons without properties.', () => {
		const wrapper = shallow(<Select />);
		expect(wrapper.find('input')).to.have.length(0);
	});

	it('has a label', () => {
		const wrapper = shallow(<Select />);
		expect(wrapper.find('label')).to.have.length(1);
	});

	it('has a description paragraph', () => {
		const wrapper = shallow(<Select />);
		expect(wrapper.find('p')).to.have.length(1);
	});

	it('allows us to set and edit props', () => {
		const wrapper = mount(<Select description="This is a test description" label="Some test label" options={OPTIONS1} name="layout" default="cards" />);
		expect(wrapper.props().description).to.equal('This is a test description');
		wrapper.setProps({ description: 'Change description for test' });
		expect(wrapper.props().description).to.equal('Change description for test');

		expect(wrapper.props().label).to.equal('Some test label');
		wrapper.setProps({ label: 'Change label for test' });
		expect(wrapper.props().label).to.equal('Change label for test');

		expect(wrapper.props().name).to.equal('layout');
		wrapper.setProps({ name: 'fruit' });
		expect(wrapper.props().name).to.equal('fruit');

		expect(wrapper.props().default).to.equal('cards');
		wrapper.setProps({ default: '1' });
		expect(wrapper.props().default).to.equal('1');

		expect(wrapper.props().options).to.equal(OPTIONS1);
		wrapper.setProps({ options: OPTIONS2 });
		expect(wrapper.props().options).to.equal(OPTIONS2);

	});
	
});
