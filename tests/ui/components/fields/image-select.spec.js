import React from 'react';
import { shallow, mount } from 'enzyme';
import ImageSelect from 'components/fields/image-select';

// test data
const OPTIONS1 = [
	{
		"src": "http://panels.tribe.dev/content/uploads/test.png",
		"label": "Standard",
		"value": "standard",
	},
	{
		"src": "http://panels.tribe.dev/content/uploads/test.png",
		"label": "Cards",
		"value": "cards",
	},
	{
		"src": "http://panels.tribe.dev/content/uploads/test.png",
		"label": "Full",
		"value": "full",
	},
]
const OPTIONS2 = [
	{
		"src": "http://panels.tribe.dev/content/uploads/test.png",
		"label": "Cows",
		"value": "cows",
	},
	{
		"src": "http://panels.tribe.dev/content/uploads/test.png",
		"label": "Orangutan",
		"value": "orangutan",
	},
]

describe('ImageSelect field', () => {

	it('renders as a <div>', () => {
		const wrapper = shallow(<ImageSelect />);
		expect(wrapper.type()).to.eql('div');
	});


	it('has no image select radio buttons without properties.', () => {
		const wrapper = shallow(<ImageSelect />);
		expect(wrapper.find('input')).to.have.length(0);
	});

	it('has a label', () => {
		const wrapper = shallow(<ImageSelect />);
		expect(wrapper.find('label')).to.have.length(1);
	});

	it('has a description paragraph', () => {
		const wrapper = shallow(<ImageSelect />);
		expect(wrapper.find('p')).to.have.length(1);
	});

	it('allows us to set and edit props', () => {
		const wrapper = mount(<ImageSelect description="This is a test description" label="Some test label" options={OPTIONS1} name="layout" default="cards" />);
		expect(wrapper.props().description).to.equal('This is a test description');
		wrapper.setProps({ description: 'Change description for test' });
		expect(wrapper.props().description).to.equal('Change description for test');

		expect(wrapper.props().label).to.equal('Some test label');
		wrapper.setProps({ label: 'Change label for test' });
		expect(wrapper.props().label).to.equal('Change label for test');

		expect(wrapper.props().name).to.equal('layout');
		wrapper.setProps({ name: 'animal' });
		expect(wrapper.props().name).to.equal('animal');

		expect(wrapper.props().default).to.equal('cards');
		wrapper.setProps({ default: 'cows' });
		expect(wrapper.props().default).to.equal('cows');

		expect(wrapper.props().options).to.equal(OPTIONS1);
		wrapper.setProps({ options: OPTIONS2 });
		expect(wrapper.props().options).to.equal(OPTIONS2);

	});

	it('allows us to properly formatted image select options', () => {
		const wrapper = mount(<ImageSelect description="This is a test description" label="Some test label" options={OPTIONS1} name="layout" default="cards" />);
		expect(wrapper.find('label.plimageselect-label')).to.have.length(3);
		expect(wrapper.find('label.plimageselect-label').first().find('input')).to.have.length(1);
		expect(wrapper.find('label.plimageselect-label').first().find('input').props().value).to.equal('standard')
		expect(wrapper.find('label.plimageselect-label').first().text()).to.eql("Standard");
	});


});
