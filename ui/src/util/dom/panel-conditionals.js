import * as domTools from './tools';

const getFieldClass = input => `condition-input-name-${input.name.replace('modular-content-', '').replace('[]', '')}`;

export const setConditionalClass = (panel, input) => {
	if (!panel) {
		return;
	}
	if (panel.dataset.depth !== input.dataset.depth) {
		return;
	}
	const cssClassKey = getFieldClass(input);

	if (input.getAttribute('data-option-type') === 'single') {
		const classes = panel.className.split(' ').filter(c => (c.lastIndexOf(cssClassKey, 0) !== 0));
		panel.className = classes.join(' ').trim();
		panel.classList.add(`${cssClassKey}-${input.value}`);
	} else if (input.getAttribute('data-field') === 'checkbox') {
		const value = input.dataset.fieldType === 'toggle' ? '1' : input.value;
		if (input.checked) {
			panel.classList.add(`${cssClassKey}-${value}`);
		} else {
			panel.classList.remove(`${cssClassKey}-${value}`);
		}
	}
};

export const initConditionalFields = (panel) => {
	if (!panel) {
		return;
	}
	domTools.convertElements(panel.querySelectorAll('.panel-conditional-field input:checked')).forEach((input) => {
		if (domTools.closest(input, '.repeater-field')) {
			return;
		}
		if (panel.dataset.depth !== input.dataset.depth) {
			return;
		}
		panel.classList.add(`${getFieldClass(input)}-${input.value}`);
	});
};

export const getConditionalEventName = input => (`modern_tribe/panel_${input.getAttribute('data-type')}_changed`);
