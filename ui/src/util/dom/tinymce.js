import { tinyMCE, tinyMCEPreInit, switchEditors, QTags, quicktags, wpEditor } from '../../globals/wp';

const instances = {};

/**
 * @function maybeInitNinjaForms
 * @description If ninja forms active init. Some nasty hackin to patch their bugs and workaround that old school ish
 */

const maybeInitNinjaForms = (editor) => {
	const insertNinja = editor.querySelectorAll('.nf-insert-form')[0];
	if (!insertNinja) {
		return;
	}
	insertNinja.addEventListener('click', e => e.preventDefault());
	instances.jBox = $(editor.querySelectorAll('.nf-insert-form')[0]).jBox('Modal', {
		title: 'Insert Form',
		position: {
			x: 'center',
			y: 'center',
		},
		closeButton: 'title',
		closeOnClick: 'overlay',
		closeOnEsc: true,
		content: $('#nf-insert-form-modal'),
		onOpen () {
			$('.nf-forms-combobox').combobox();
			$(this)[0].content.find('.ui-autocomplete-input').attr('placeholder', 'Select a form or type to search');
			$(this)[0].content.css('overflow', 'visible');
			$(this)[0].content.find('.ui-icon-triangle-1-s').addClass('dashicons dashicons-arrow-down').css('margin-left', '-7px');
		},
	});

	$(document.body).on('click.modularmce', '#nf-insert-form', (e) => {
		e.preventDefault();
		e.stopPropagation();
		const formSelect = e.currentTarget.parentNode.parentNode.querySelectorAll('#nf-form-select')[0];
		const formId = formSelect.value;
		if (!formId.length) {
			instances.jBox.close();
			return;
		}
		const shortcode = `[ninja_form id=${formId}]`;
		window.parent.send_to_editor(shortcode);
		instances.jBox.close();
		formSelect.value = '';
	});
};

/**
 * @function maybeDestroyNinjaForms
 * @description If ninja forms active destroy
 */

const maybeDestroyNinjaForms = (editor) => {
	const insertNinja = editor.querySelectorAll('.nf-insert-form')[0];
	if (!insertNinja) {
		return;
	}
	if (instances.jBox) {
		instances.jBox.destroy();
	}
	$(document.body).off('.modularmce');
};

/**
 * Initializes events for a tinymce instance. You need to pass and editor dom node, a unique id editor settings
 * reference. Call on componentDidMount.
 * @param opts
 * @param callback get data back if you want ;)
 */

export const init = (opts = {}, callback = () => {}) => {
	const options = {
		editor: null,
		fid: '',
		editor_settings: '',
	};

	// merge options
	Object.assign(options, opts);

	if (!options.editor) {
		console.warn('You tried to bind events for a tinymce instance but didn\'t pass a valid dom node.');
		return;
	}

	maybeInitNinjaForms(options.editor);

	tinyMCE.on('SetupEditor', (editor) => {
		if (editor.id === options.fid) {
			editor.on('change keyup paste', () => {
				callback(wpEditor.removep(editor.getContent()));
			});
		}
	});
	let settings = tinyMCEPreInit.mceInit[options.editor_settings];
	const qtSettings = {
		id: options.fid,
		buttons: tinyMCEPreInit.qtInit[options.editor_settings].buttons,
	};
	settings.selector = `#${options.fid}`;
	settings = tinyMCE.extend({}, tinyMCEPreInit.ref, settings);

	tinyMCEPreInit.mceInit[options.fid] = settings;
	tinyMCEPreInit.qtInit[options.fid] = qtSettings;
	quicktags(tinyMCEPreInit.qtInit[options.fid]);
	QTags._buttonsInit(); // eslint-disable-line no-underscore-dangle

	if (!window.wpActiveEditor) {
		window.wpActiveEditor = options.fid;
	}

	options.editor.addEventListener('click', () => {
		window.wpActiveEditor = options.fid;
	});

	if (options.editor.classList.contains('tmce-active')) {
		_.delay(() => {
			switchEditors.go(options.fid, 'tmce');
		}, 100);
	}
};

/**
 * Cleans up, call on unmount.
 * @param opts
 */

export const destroy = (opts = {}) => {
	const options = {
		editor: null,
		fid: '',
	};

	// merge options
	Object.assign(options, opts);

	if (!options.editor) {
		return;
	}

	maybeDestroyNinjaForms(options.editor);

	delete window.tinyMCEPreInit.mceInit[options.fid];
	delete window.tinyMCEPreInit.qtInit[options.fid];
	window.tinymce.execCommand('mceRemoveControl', true, options.fid);
	options.editor.removeEventListener('click', () => {
		window.wpActiveEditor = this.fid;
	});
};
