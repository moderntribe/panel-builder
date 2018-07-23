/* global expect b:true */

import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import ColorPicker from 'components/fields/color-picker';

const props =  {
	allow_clear: true,
	input_active: true,
	label: 'Background Color',
	default: '#4a7ef2',
	data: '#4a7ef2',
	swatches: [
		'#4a7ef2',
		'#3c73ef',
		'#3b4664',
		'#5cb85c',
		'#d15e61',
		'#ffa700',
		'#eee',
	],
	description: 'Select your bg color for the body.',
};

const render = (overrideProps) => {
	const colorPicker = mount(<ColorPicker
		{...props}
		{...overrideProps}
	/>);

	return {
		colorPicker,
		buttons: colorPicker.find('button'),
	};
};

describe('Color Picker field', () => {
	it('calls componentDidMount', () => {
		sinon.spy(ColorPicker.prototype, 'componentDidMount');
		const { colorPicker } = render();
		expect(ColorPicker.prototype.componentDidMount.calledOnce).toEqual(true);
	});

	it('renders 2 buttons as allow clear is set to true', () => {
		const { buttons } = render();
		expect(buttons.length).toEqual(2);
	});

	it('has a label', () => {
		const { colorPicker } = render();
		expect(colorPicker.find('label').length).toEqual(1);
	});
});
