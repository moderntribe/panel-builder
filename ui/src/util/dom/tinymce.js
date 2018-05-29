import { tinyMCE, tinyMCEPreInit, switchEditors, QTags, quicktags, wpEditor } from '../../globals/wp';

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

	tinyMCE.on('SetupEditor', (instance) => {
		// pre wp 4.9.6 editor instance here is the directly passed object, after, its a sub entry
		const editor = instance.editor ? instance.editor : instance;
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

	delete window.tinyMCEPreInit.mceInit[options.fid];
	delete window.tinyMCEPreInit.qtInit[options.fid];
	window.tinymce.execCommand('mceRemoveControl', true, options.fid);
	options.editor.removeEventListener('click', () => {
		window.wpActiveEditor = this.fid;
	});
};
