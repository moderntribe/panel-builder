/* global expect b:true */

import React from 'react';
import { shallow } from 'enzyme';
import File from 'components/fields/file';
import renderer from 'react-test-renderer';

describe('Image field', () => {
	it('renders correctly', () => {
		const tree = renderer
			.create(<File />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});

	const wrapper = shallow(<File />);

	it('renders as a <div>', () => {
		expect(wrapper.type()).toEqual('div');
	});
});
