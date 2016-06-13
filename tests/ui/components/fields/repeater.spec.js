import React from 'react';
import { shallow, mount } from 'enzyme';
import Repeater from 'components/fields/repeater';

describe('Repeater field', () => {

	it('renders as a <div>', () => {
		const wrapper = shallow(<Repeater />);
		expect(wrapper.type()).to.eql('div');
	});

	it('simulates click events to hide parent panels', () => {
		const onHeaderClick = sinon.spy();
		const wrapper = mount(
			<Repeater hidePanel={onHeaderClick} />
		);
		wrapper.find('.panel-row-header').simulate('click');
		expect(onHeaderClick.calledOnce).to.equal(true);
	});

	it('allows us to set props', () => {
		const wrapper = mount(<Repeater min={4} />);
		expect(wrapper.props().min).to.equal(4);
		wrapper.setProps({ min: 6 });
		expect(wrapper.props().min).to.equal(6);
	});

	it('accepts minimum count and responds to add row click correctly', () => {
		const wrapper = mount(<Repeater min={4} />);
		wrapper.find('.repeater-add-row').simulate('click');
		expect(wrapper.state().data.length).to.equal(5);
	});

});

