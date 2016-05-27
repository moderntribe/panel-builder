import React from 'react';
import { shallow, mount } from 'enzyme';
import Video from 'components/fields/video';

describe('Video field', () => {

	it('renders as a <div>', () => {
		const wrapper = shallow(<Video />);
		expect(wrapper.type()).to.eql('div');
	});

	it('allows us to set props', () => {
		const wrapper = mount(<Video description="This is a test" label="Cat Video" name="cat_video" />);
		expect(wrapper.props().description).to.equal('This is a test');
		wrapper.setProps({ description: 'Change props for test' });
		expect(wrapper.props().description).to.equal('Change props for test');

		expect(wrapper.props().label).to.equal('Cat Video');
		wrapper.setProps({ label: 'New Label' });
		expect(wrapper.props().label).to.equal('New Label');

		expect(wrapper.props().name).to.equal('cat_video');
		wrapper.setProps({ name: 'new_video' });
		expect(wrapper.props().name).to.equal('new_video');
	});

	it('has a label', () => {
		const wrapper = shallow(<Video />);
		expect(wrapper.find('label')).to.have.length(1);
	});

	it('renders a text input', () => {
		const wrapper = shallow(<Video />);
		expect(wrapper.find('input[type="text"]')).to.have.length(1);
	});

	it('has a description paragraph', () => {
		const wrapper = shallow(<Video />);
		expect(wrapper.find('p')).to.have.length(1);
	});

});