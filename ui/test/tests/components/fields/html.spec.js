/* global expect b:true */

import React from 'react';
import { shallow, mount } from 'enzyme';
import Html from 'components/fields/html';
import renderer from 'react-test-renderer';

describe('HTML field', () => {
	it('renders correctly', () => {
		const tree = renderer
			.create(<Html />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('renders as a <div>', () => {
		const wrapper = shallow(<Html />);
		expect(wrapper.type()).toEqual('div');
	});

	it('allows us to set props', () => {
		const wrapper = mount(<Html description="<p>Some HTML text <b>goes</b> <i>here</i></p>" />);
		expect(wrapper.props().description).toEqual('<p>Some HTML text <b>goes</b> <i>here</i></p>');
		wrapper.setProps({ description: 'Change props for test' });
		expect(wrapper.props().description).toEqual('Change props for test');
	});
});
