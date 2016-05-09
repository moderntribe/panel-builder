import React from 'react';
import { shallow } from 'enzyme';
import Text from 'components/fields/text';

describe('Text field', () => {
	const wrapper = shallow(<Text />);

	it('renders as a <div>', () => {
		expect(wrapper.type()).to.eql('div');
	});

});
