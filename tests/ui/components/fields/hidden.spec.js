import React from 'react';
import { shallow, mount } from 'enzyme';
import Hidden from 'components/fields/hidden';

describe('Hidden field', () => {

	it('renders as a <div>', () => {
		const wrapper = shallow(<Hidden />);
		expect(wrapper.type()).to.eql('div');
	});

	it('renders a hidden input', () => {
		const wrapper = shallow(<Hidden />);
		expect(wrapper.find('input[type="hidden"]')).to.have.length(1);
	});

	it('allows you to set properties', () => {
		const wrapper = shallow(<Hidden name="test-name" default="test-value" />);
		expect(wrapper.find('input[type="hidden"]')).to.have.length(1);
		expect(wrapper.find('input[type="hidden"]').props().value).to.equal('test-value');
		expect(wrapper.find('input[type="hidden"]').props().name).to.equal('test-name');
	});

});
