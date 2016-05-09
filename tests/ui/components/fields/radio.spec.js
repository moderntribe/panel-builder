import React from 'react';
import { shallow} from 'enzyme';
import Radio from 'components/fields/radio';

// test data
const OPTIONS = {
	"options": [
		{
			"label": "Standard",
			"value": "standard"
		},
		{
			"label": "Cards",
			"value": "cards"
		},
		{
			"label": "Full",
			"value": "full"
		}
	]
}

describe('Radio field', () => {
	const wrapper = shallow(<Radio />);

	it('renders as a <div>', () => {
		expect(wrapper.type()).to.eql('div');
	});

	it('has no radio buttons without properties.', () => {
		expect(wrapper.find('input')).to.have.length(0);
	});

	// set test props
	const wrapper_data = shallow(<Radio />);
	wrapper_data.setProps(OPTIONS);

	it('has 3 radio buttons with test properties.', () => {
		expect(wrapper_data.find('input')).to.have.length(3);
	});

});
