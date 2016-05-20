import React from 'react';
import { shallow, mount } from 'enzyme';
import ImageGallery from 'components/fields/image-gallery';

describe('Image Gallery field', () => {

	it('renders as a <div>', () => {
		const wrapper = shallow(<ImageGallery />);
		expect(wrapper.type()).to.eql('div');
	});

	it('has a label', () => {
		const wrapper = shallow(<ImageGallery />);
		expect(wrapper.find('label.pnl-field-label')).to.have.length(1);
	});

	it('has a description paragraph', () => {
		const wrapper = shallow(<ImageGallery />);
		expect(wrapper.find('p.pnl-field-description')).to.have.length(1);
	});

	it('has a gallery field name', () => {
		const wrapper = shallow(<ImageGallery />);
		expect(wrapper.find('input[name="gallery-field-name"]')).to.have.length(1);
	});

	it('has a gallery edit button', () => {
		const wrapper = shallow(<ImageGallery />);
		expect(wrapper.find('button')).to.have.length(1);
	});

	it('allows us to set and edit props', () => {
		const wrapper = mount(<ImageGallery description="This is a test description" label="Some test label" />);
		expect(wrapper.props().description).to.equal('This is a test description');
		wrapper.setProps({ description: 'Change description for test' });
		expect(wrapper.props().description).to.equal('Change description for test');

		expect(wrapper.props().label).to.equal('Some test label');
		wrapper.setProps({ label: 'Change label for test' });
		expect(wrapper.props().label).to.equal('Change label for test');

	});

});
