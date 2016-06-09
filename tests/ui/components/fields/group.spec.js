import React from 'react';
import { shallow, mount } from 'enzyme';
import Group from 'components/fields/group';

describe('Group field', () => {
	it('renders as a <fieldset>', () => {
		const wrapper = shallow(<Group />);
		expect(wrapper.type()).to.eql('fieldset');
	});

	it('allows us to set props', () => {
		const wrapper = mount(<Group description="testing description" />);
		expect(wrapper.props().description).to.equal('testing description');
		wrapper.setProps({ description: 'Change props for test' });
		expect(wrapper.props().description).to.equal('Change props for test');
	});

});
