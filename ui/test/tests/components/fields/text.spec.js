/* global expect b:true */

import React from 'react';
import { shallow, mount } from 'enzyme';
import Text from 'components/fields/text';
import renderer from 'react-test-renderer';

describe('Text field', () => {
	it('renders correctly', () => {
		const tree = renderer
			.create(<Text description="This is a test description" label="Some test label" />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('renders as a <div>', () => {
		const wrapper = shallow(<Text />);
		expect(wrapper.type()).toEqual('div');
	});

	it('allows us to set props', () => {
		const wrapper = mount(<Text description="This is a test" />);
		expect(wrapper.props().description).toEqual('This is a test');
		wrapper.setProps({ description: 'Change props for test' });
		expect(wrapper.props().description).toEqual('Change props for test');
	});

	it('has a label', () => {
		const wrapper = shallow(<Text />);
		expect(wrapper.find('label').length).toEqual(1);
	});

	it('renders a text input', () => {
		const wrapper = shallow(<Text />);
		expect(wrapper.find('input[type="text"]').length).toEqual(1);
	});
});
