import React from 'react';
import { shallow, mount } from 'enzyme';
import Link from 'components/fields/link';

// defaults
const DEFAULTS = {
	"label": "News Source",
	"url": "http://nytimes.com",
	"target": "_blank"
}
const DEFAULTS2 = {
	"label": "Blogs",
	"url": "http://blog.com",
	"target": ""
}

describe('Link field', () => {

	it('renders as a <div>', () => {
		const wrapper = shallow(<Link />);
		expect(wrapper.type()).to.eql('div');
	});

	it('has a label', () => {
		const wrapper = shallow(<Link />);
		expect(wrapper.find('legend')).to.have.length(1);
	});

	it('has a description paragraph', () => {
		const wrapper = shallow(<Link />);
		expect(wrapper.find('p')).to.have.length(1);
	});

	it('has a url input', () => {
		const wrapper = shallow(<Link />);
		expect(wrapper.find('.pllink-url input')).to.have.length(1);
	});

	it('has a label input', () => {
		const wrapper = shallow(<Link />);
		expect(wrapper.find('.pllink-label input')).to.have.length(1);
	});

	it('has a target select', () => {
		const wrapper = shallow(<Link />);
		expect(wrapper.find('.pllink-target select')).to.have.length(1);
	});

	it('allows us to set and edit props', () => {
		const wrapper = mount(<Link description="This is a test description" label="Some test label" defaults={DEFAULTS} />);
		expect(wrapper.props().description).to.equal('This is a test description');
		wrapper.setProps({ description: 'Change description for test' });
		expect(wrapper.props().description).to.equal('Change description for test');

		expect(wrapper.props().label).to.equal('Some test label');
		wrapper.setProps({ label: 'Change label for test' });
		expect(wrapper.props().label).to.equal('Change label for test');

		expect(wrapper.props().defaults).to.equal(DEFAULTS);
		wrapper.setProps({ options: DEFAULTS2 });
		expect(wrapper.props().options).to.equal(DEFAULTS2);

	});

});
