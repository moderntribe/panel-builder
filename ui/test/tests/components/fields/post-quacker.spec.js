/* global expect b:true */

import React from 'react';
import { shallow } from 'enzyme';
import PostQuacker from 'components/fields/post-quacker';

describe('PostQuacker field', () => {
	it('renders as a <fieldset>', () => {
		const wrapper = shallow(<PostQuacker />);
		expect(wrapper.type()).toEqual('fieldset');
	});

	it('has a label', () => {
		const wrapper = shallow(<PostQuacker />);
		expect(wrapper.find('legend').length).toEqual(1);
	});

	it('has a description paragraph', () => {
		const wrapper = shallow(<PostQuacker />);
		expect(wrapper.find('p').length).toEqual(1);
	});
});
