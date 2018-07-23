/* global expect b:true */

import React from 'react';
import { shallow } from 'enzyme';
import TextArea from 'components/fields/textarea';

describe('TextArea field', () => {
	it('renders as a <div>', () => {
		const wrapper = shallow(<TextArea />);
		expect(wrapper.type()).toEqual('div');
	});

	it('has a label', () => {
		const wrapper = shallow(<TextArea />);
		expect(wrapper.find('label').length).toEqual(1);
	});

	it('has a textarea', () => {
		const wrapper = shallow(<TextArea />);
		expect(wrapper.find('textarea').length).toEqual(1);
	});
});
