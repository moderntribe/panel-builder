/* global expect b:true */

import React from 'react';
import { shallow, mount } from 'enzyme';
import NumericInput from 'components/fields/numeric-input';
import renderer from 'react-test-renderer';

const props = {
	name: 'padding-top',
	label: 'Top',
	default: 0,
	step: 2,
	max: 3000,
	layout: 'compact',
	input_width: 3,
};

describe('Numeric input field', () => {
	it('renders correctly', () => {
		const tree = renderer
			.create(<NumericInput {...props} />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('renders as a <div>', () => {
		const wrapper = shallow(<NumericInput step={1} />);
		expect(wrapper.type()).toEqual('div');
	});

	it('allows us to set props', () => {
		const wrapper = mount(<NumericInput step={1} description="This is a test" />);
		expect(wrapper.props().description).toEqual('This is a test');
		wrapper.setProps({ description: 'Change props for test' });
		expect(wrapper.props().description).toEqual('Change props for test');
	});

	it('has a label', () => {
		const wrapper = shallow(<NumericInput step={1} />);
		expect(wrapper.find('label').length).toEqual(1);
	});
});
