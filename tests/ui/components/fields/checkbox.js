import React from 'react';
import { shallow, mount } from 'enzyme';
import Checkbox from 'components/fields/checkbox';

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

	it('renders as a <div>', () => {
		const wrapper = shallow(<Checkbox />);
		expect(wrapper.type()).to.eql('div');
	});

	it('has no checkboxes (without properties).', () => {
		const wrapper = shallow(<Checkbox />);
		expect(wrapper.find('input[type="checkbox"]')).to.have.length(0);
	});

	it('has a label', () => {
		const wrapper = shallow(<Checkbox />);
		expect(wrapper.find('label')).to.have.length(1);
	});

	it('has a description paragraph', () => {
		const wrapper = shallow(<Checkbox />);
		expect(wrapper.find('p')).to.have.length(1);
	});

	it('allows us to set and edit props', () => {
		const wrapper = mount(<Checkbox description="This is a test description" name="layout" label="Some test label" options={OPTIONS1} default={DEFAULT1} />);
		expect(wrapper.props().description).to.equal('This is a test description');
		wrapper.setProps({ description: 'Change description for test' });
		expect(wrapper.props().description).to.equal('Change description for test');

		expect(wrapper.props().label).to.equal('Some test label');
		wrapper.setProps({ label: 'Change label for test' });
		expect(wrapper.props().label).to.equal('Change label for test');

		expect(wrapper.props().name).to.equal('layout');
		wrapper.setProps({ name: 'fruit' });
		expect(wrapper.props().name).to.equal('fruit');

		expect(wrapper.props().default).to.equal(DEFAULT1);
		wrapper.setProps({ default: DEFAULT2 });
		expect(wrapper.props().default).to.equal(DEFAULT2);

		expect(wrapper.props().options).to.equal(OPTIONS1);
		wrapper.setProps({ options: OPTIONS2 });
		expect(wrapper.props().options).to.equal(OPTIONS2);

	});

	it('allows us to properly formatted radio options', () => {
		const wrapper = mount(<Checkbox description="This is a test description" name="layout" label="Some test label" options={OPTIONS1} default={DEFAULT1} />);
		expect(wrapper.find('ul').find('li')).to.have.length(3);
		expect(wrapper.find('ul li').first().find('input[type="checkbox"]')).to.have.length(1);
		expect(wrapper.find('ul li').first().find('input[type="checkbox"]').props().value).to.equal('standard');
		expect(wrapper.find('ul li').first().find('label').text()).to.eql('Standard');
	});

});
