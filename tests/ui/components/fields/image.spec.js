import React from 'react';
import { shallow } from 'enzyme';
import Image from 'components/fields/image';

describe('Panel collection', () => {
	it('renders as a <div>', () => {
		const wrapper = shallow(<Image />);
		expect(wrapper.type()).to.eql('div');
	});
});
