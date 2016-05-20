import React from 'react';
import { shallow, mount } from 'enzyme';
import TextArea from 'components/fields/textarea';

describe('TextArea field', () => {

	it('renders as a <div>', () => {
		const wrapper = shallow(<TextArea />);
		expect(wrapper.type()).to.eql('div');
	});

	it('has a label', () => {
		const wrapper = shallow(<TextArea />);
		expect(wrapper.find('label')).to.have.length(1);
	});

	it('has a description paragraph', () => {
		const wrapper = shallow(<TextArea />);
		expect(wrapper.find('p')).to.have.length(1);
	});

	it('has a textarea', () => {
		const wrapper = shallow(<TextArea />);
		expect(wrapper.find('textarea')).to.have.length(1);
	});

});
