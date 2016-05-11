import React from 'react';
import { shallow, mount } from 'enzyme';
import HTML from 'components/fields/html';

describe('HTML field', () => {


	it('renders as a <div>', () => {
		const wrapper = shallow(<HTML />);
		expect(wrapper.type()).to.eql('div');
	});

	it('allows us to set props', () => {
		const wrapper = mount(<HTML description="<p>Some HTML text <b>goes</b> <i>here</i></p>" />);
		expect(wrapper.props().description).to.equal('<p>Some HTML text <b>goes</b> <i>here</i></p>');
		wrapper.setProps({ description: 'Change props for test' });
		expect(wrapper.props().description).to.equal('Change props for test');
	});

});
