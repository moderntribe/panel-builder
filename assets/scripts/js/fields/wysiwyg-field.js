(function($) {
	var wysiwyg_field = {
		counter: 0,
		settings: {},

		init_editor: function( wysiwyg ) {
			if ( wysiwyg.hasClass('wp-editor-initialized') ) {
				return;
			}
			var wysiwyg_container = wysiwyg.parents( '.wp-editor-container' );
			var wysiwyg_id = 'panels-wysiwyg-'+wysiwyg_field.counter;
			wysiwyg_field.counter++;
			wysiwyg.attr('id', wysiwyg_id);
			wysiwyg_container.attr('id', 'wp-'+wysiwyg_id+'-editor-container');
			wysiwyg.parents( '.panel-input.input-type-textarea' ).find( '.add_media' ).data( 'editor', wysiwyg_id );

			var wrap = wysiwyg.parents('.wp-editor-wrap');

			wrap.attr('id', 'wp-'+wysiwyg_id+'-wrap');
			wrap.find('.wp-switch-editor.switch-html').attr('id', wysiwyg_id+'-html');
			wrap.find('.wp-switch-editor.switch-tmce').attr('id', wysiwyg_id+'-tmce');

			var settings_id = wysiwyg_container.data('settings_id');
			var settings = $.extend({}, wysiwyg_field.settings[settings_id] || {});
			settings.body_class = wysiwyg_id;
			settings.selector = '#'+wysiwyg_id;

			var qt_settings = {id:wysiwyg_id,buttons:"strong,em,link,block,del,ins,img,ul,ol,li,code,more,close"};

			try {
				settings = tinymce.extend( {}, tinyMCEPreInit.ref, settings );
				tinyMCEPreInit.mceInit[wysiwyg_id] = settings;
				tinyMCEPreInit.qtInit[wysiwyg_id] = qt_settings;
				quicktags( tinyMCEPreInit.qtInit[wysiwyg_id] ); // sets up the quick tags toolbar
				QTags._buttonsInit(); // adds buttons to the new quick tags toolbar

				if ( wrap.hasClass('tmce-active') ) {
					switchEditors.go( wysiwyg_id, 'tmce' );
				}

				if ( ! window.wpActiveEditor ) {
					window.wpActiveEditor = wysiwyg_id;
				}

				document.getElementById( 'wp-' + wysiwyg_id + '-wrap' ).onclick = function() {
					window.wpActiveEditor = this.id.slice( 3, -5 );
				};

				wysiwyg.addClass('wp-editor-initialized');
			} catch(e){}
		},

		setup_editor_template: function( generic_id ) {

			if ( tinyMCEPreInit.mceInit.hasOwnProperty(generic_id) ) {
				delete tinyMCEPreInit.mceInit[generic_id];
			}
			if ( tinyMCEPreInit.qtInit.hasOwnProperty(generic_id) ) {
				delete tinyMCEPreInit.qtInit[generic_id];
			}

			var panels_div = $('div.panels');
			panels_div.on('new-panel-row load-panel-row', '.panel-row', function(e, uuid) {
				var row = $(this);
				if ( row.data('panel_id') != uuid ) {
					return;
				}
				var wysiwyg = row.find('textarea.wysiwyg-'+generic_id);
				wysiwyg.each( function() {
					wysiwyg_field.init_editor( $(this) );
				});
			});
			panels_div.on('new-panel-repeater-row', '.panel-repeater-row', function(e, uuid) {
				var row = $(this);
				var wysiwyg = row.find('textarea.wysiwyg-'+generic_id);
				wysiwyg.each( function() {
					wysiwyg_field.init_editor( $(this) );
				});
			});
		}

	};

	window.tribe = window.tribe || {};
	window.tribe.panels = window.tribe.panels || {};
	window.tribe.panels.wysywig_field = wysiwyg_field;

})(jQuery);