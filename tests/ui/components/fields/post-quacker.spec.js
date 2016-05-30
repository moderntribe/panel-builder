import React from 'react';
import { shallow, mount } from 'enzyme';
import PostQuacker from 'components/fields/post-quacker';

describe('PostQuacker field', () => {

	it('renders as a <fieldset>', () => {
		const wrapper = shallow(<PostQuacker />);
		expect(wrapper.type()).to.eql('fieldset');
	});

	it('has a label', () => {
		const wrapper = shallow(<PostQuacker />);
		expect(wrapper.find('legend')).to.have.length(1);
	});

	it('has a description paragraph', () => {
		const wrapper = shallow(<PostQuacker />);
		expect(wrapper.find('p')).to.have.length(1);
	});

});
