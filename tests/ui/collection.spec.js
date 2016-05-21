import React from 'react';                    
import { shallow } from 'enzyme';              
import PanelCollection from 'components/collection';  

describe('Panel collection', () => {
	it('renders as a <div>', () => {
		const wrapper = shallow(<PanelCollection />);
		expect(wrapper.type()).to.eql('div');
	});
});
