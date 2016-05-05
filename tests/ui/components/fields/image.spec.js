import React from 'react';
import { shallow } from 'enzyme';
import Image from 'components/fields/image';

describe('Image field', () => {
	it('renders as a <div>', () => {
		const wrapper = shallow(<Image />);
		expect(wrapper.type()).to.eql('div');
	});
	
	it('has style with height 100%', () => {
		const expectedStyles = {
			height: '100%',
			background: '#333',
		};
		expect(wrapper.prop('style')).to.eql(expectedStyles);
	});

	it('contains a header explaining the app', () => {
		expect(wrapper.find('.welcome-header')).to.have.length(1);
	});
});
