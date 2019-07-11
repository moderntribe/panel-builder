/* global expect b:true */

import React from 'react';
import { shallow } from 'enzyme';
import Image from 'components/fields/image';
import renderer from 'react-test-renderer';

describe('Image field', () => {
	it('renders correctly', () => {
		const tree = renderer
			.create(<Image />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});

	const wrapper = shallow(<Image />);

	it('renders as a <div>', () => {
		expect(wrapper.type()).toEqual('div');
	});
});
