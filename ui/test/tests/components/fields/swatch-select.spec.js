/* global expect b:true */

import React from 'react';
import { shallow } from 'enzyme';
import SwatchSelect from 'components/fields/swatch-select';
import renderer from 'react-test-renderer';

describe('SwatchSelect field', () => {
	it('renders correctly', () => {
		const tree = renderer
			.create(<SwatchSelect description="This is a test description" label="Some test label" />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('renders as a <div>', () => {
		const wrapper = shallow(<SwatchSelect />);
		expect(wrapper.type()).toEqual('div');
	});


	it('has no color select radio buttons without properties.', () => {
		const wrapper = shallow(<SwatchSelect />);
		expect(wrapper.find('input').length).toEqual(0);
	});

	it('has a label', () => {
		const wrapper = shallow(<SwatchSelect />);
		expect(wrapper.find('label').length).toEqual(1);
	});
});
