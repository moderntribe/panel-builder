import classNames from 'classnames';

/**
 * Returns the default classes that most fields use on their wrapper and label/desc
 *
 * @param styles
 * @returns {{fieldClasses: *, descriptionClasses: *, labelClasses: *}}
 */

export const defaultFieldClasses = (styles) => {
	const labelClasses = classNames({
		[styles.label]: true,
		'panel-field-label': true,
	});
	const descriptionClasses = classNames({
		[styles.description]: true,
		'panel-field-description': true,
	});
	const fieldClasses = classNames({
		[styles.field]: true,
		'panel-field': true,
	});

	return {
		fieldClasses,
		descriptionClasses,
		labelClasses,
	};
};
