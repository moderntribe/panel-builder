import React from 'react';
import { shallow} from 'enzyme';
import HTML from 'components/fields/html';

describe('HTML field', () => {
	const wrapper = shallow(<HTML />);

	it('renders as a <div>', () => {
		expect(wrapper.type()).to.eql('div');
	});

});
