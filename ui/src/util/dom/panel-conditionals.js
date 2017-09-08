import * as domTools from './tools';

const getFieldClass = input => `condition-input-name-${input.name.replace('modular-content-', '').replace('[]', '')}`;

export const setConditionalClass = (panel, input) => {
	if (!panel) {
		return;
	}
	const cssClassKey = getFieldClass(input);

	if (input.getAttribute('data-option-type') === 'single') {
		const classes = panel.className.split(' ').filter(c => (c.lastIndexOf(cssClassKey, 0) !== 0));
		panel.className = classes.join(' ').trim();
		panel.classList.add(`${cssClassKey}-${input.value}`);
	} else if (input.getAttribute('data-field') === 'checkbox') {
		if (input.checked) {
			panel.classList.add(`${cssClassKey}-${input.value}`);
		} else {
			panel.classList.remove(`${cssClassKey}-${input.value}`);
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
		panel.classList.add(`${getFieldClass(input)}-${input.value}`);
	});
};

export const getConditionalEventName = input => (`modern_tribe/panel_${input.getAttribute('data-type')}_changed`);
