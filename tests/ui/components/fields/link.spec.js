import React from 'react';
import { shallow, mount } from 'enzyme';
import Link from 'components/fields/link';
import LinkGroup from 'components/shared/link-group';


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

	it('has a LinkGroup', () => {
		const wrapper = shallow(<Link />);
		expect(wrapper.find('fieldset').childAt(1).type()).to.equal(LinkGroup);
	});

});

