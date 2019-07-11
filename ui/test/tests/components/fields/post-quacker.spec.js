/* global expect b:true */

import React from 'react';
import { shallow } from 'enzyme';
import PostQuacker from 'components/fields/post-quacker';
import renderer from 'react-test-renderer';

describe('PostQuacker field', () => {
	it('renders correctly', () => {
		const tree = renderer
			.create(<PostQuacker />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('renders as a <fieldset>', () => {
		const wrapper = shallow(<PostQuacker />);
		expect(wrapper.type()).toEqual('fieldset');
	});

	it('has a label', () => {
		const wrapper = shallow(<PostQuacker />);
		expect(wrapper.find('legend').length).toEqual(1);
	});
});
