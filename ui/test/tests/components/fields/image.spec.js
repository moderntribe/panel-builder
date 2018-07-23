/* global expect b:true */

import React from 'react';
import { shallow } from 'enzyme';
import Image from 'components/fields/image';

describe('Image field', () => {
	const wrapper = shallow(<Image />);

	it('renders as a <div>', () => {
		expect(wrapper.type()).toEqual('div');
	});
});
