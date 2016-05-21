import React from 'react';
import { shallow} from 'enzyme';
import Image from 'components/fields/image';

describe('Image field', () => {
	const wrapper = shallow(<Image />);

	it('renders as a <div>', () => {
		expect(wrapper.type()).to.eql('div');
	});

	it('has a container for the current image.', () => {
		expect(wrapper.find('.current-image')).to.have.length(1);
	});

	it('has a container for the uploader.', () => {
		expect(wrapper.find('.image-uploader')).to.have.length(1);
	});
});
