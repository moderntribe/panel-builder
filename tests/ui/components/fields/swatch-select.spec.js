/* global expect b:true */

import React from 'react';
import { shallow } from 'enzyme';
import SwatchSelect from 'components/fields/swatch-select';

describe('SwatchSelect field', () => {
	it('renders as a <div>', () => {
		const wrapper = shallow(<SwatchSelect />);
		expect(wrapper.type()).to.eql('div');
	});


	it('has no color select radio buttons without properties.', () => {
		const wrapper = shallow(<SwatchSelect />);
		expect(wrapper.find('input')).to.have.length(0);
	});

	it('has a label', () => {
		const wrapper = shallow(<SwatchSelect />);
		expect(wrapper.find('label')).to.have.length(1);
	});

	it('has a description paragraph', () => {
		const wrapper = shallow(<SwatchSelect />);
		expect(wrapper.find('p')).to.have.length(1);
	});
});
