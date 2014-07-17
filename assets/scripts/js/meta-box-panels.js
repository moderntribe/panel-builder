jQuery(document).ready( function($) {
	var win = window.dialogArguments || opener || parent || top;
	var panels_div = $('div.panels');
	var new_panel_container = null;

	/* jshint ignore:start */
	// http://stackoverflow.com/a/2117523/500277
	var create_uuid = function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	};
	/* jshint ignore:end */

	panels_div.sortable({
		axis: 'y',
		items: '> div.panel-row',
		handle: '.panel-row-header'
	});

	panels_div.on( 'click', 'a.delete_panel', function(e) {
		e.preventDefault();
		var row = $(this).closest('.panel-row');
		row.css({backgroundColor: 'lightYellow'});
		if ( confirm('Delete this panel?') ) { // TODO: localize
			row.fadeOut(750, function() {
				row.remove();
			});
		} else {
			row.css({backgroundColor: 'transparent'});
		}
	});

	$('body').on('click', '.new-panel-option .thumbnail', function(e) {
		e.preventDefault();
		if ( new_panel_container === null ) {
			return;
		}
		var wrapper = $(this).closest('.panel-template');
		var panel_type = wrapper.data('panel-type');
		var template = wp.template('panel-'+panel_type);
		var uuid = create_uuid();
		var new_row = $(template({
			panel_id: uuid,
			field_name: uuid,
			panel_title: 'Untitled', // TODO: localize
			fields: { title: '' },
			depth: new_panel_container.data('depth')
		}));
		var child_container = new_row.find('.panel-children');
		if ( child_container.length == 1 ) {
			child_container.sortable({
				axis: 'y',
				items: '> div.panel-row',
				handle: '.panel-row-header'
			});
		}
		new_panel_container.append(new_row);
		win.tb_remove();
		new_row.trigger('new-panel-row', [uuid, {}]);
		new_panel_container = null;
	});

	panels_div.on('keyup', '.input-name-title input:text', function() {
		var title = $(this).val();
		if ( title === '' ) {
			title = 'Untitled'; // TODO: localize
		}
		$(this).closest('.panel-row').children('.panel-row-header .panel-title').text(title);
	});

	panels_div.on('click', '.panel-row-header a.edit_panel', function(e) {
		e.preventDefault();
		$(this).closest('.panel-row').children('.panel-row-editor').slideToggle();
	});

	$('#modular-content').on('click', '.create-new-panel', function(e) {
		e.preventDefault();
		var container;
		if ( $(this).hasClass('create-new-child') ) {
			container = $(this).siblings('div.panel-children');
		} else {
			container = $(this).siblings('div.panels');
		}
		var max = container.data('max_children');
		if ( typeof max == 'number' ) {
			if ( container.children('.panel-row').length >= max ) {
				return false; // the panel selector should not work
			}
		}

		var depth = container.data('depth');

		var new_panel_list = $('#new-panel').find('.panel-template');
		new_panel_list.each( function() {
			var template = $(this);
			var template_max_depth = template.data('max_depth');
			if ( typeof template_max_depth == 'number' && template_max_depth < depth ) {
				template.parent().hide();
			} else {
				template.parent().show();
			}
		});

		new_panel_container = container;
	});

	var ModularContent = window.ModularContent || {};
	ModularContent.panels = ModularContent.panels || [];

	(function() {
		var parents = {
			0: panels_div
		};
		var deepest_parent = 0;
		$.each(ModularContent.panels, function( index, panel ) {
			var template = wp.template('panel-'+panel.type);
			var uuid = create_uuid();
			var new_row = $(template({
				panel_id: uuid,
				field_name: uuid,
				panel_title: panel.data.title,
				fields: panel.data,
				depth: panel.depth
			}));
			new_row.children('.panel-row-editor').hide();

			while ( panel.depth < deepest_parent && deepest_parent > 0 ) {
				delete parents[deepest_parent];
				deepest_parent--;
			}

			var current_container = parents[deepest_parent];

			var child_container = new_row.find('.panel-children');
			if ( child_container.length == 1 ) {
				deepest_parent++;
				parents[deepest_parent] = child_container;
				child_container.sortable({
					axis: 'y',
					items: '> div.panel-row',
					handle: '.panel-row-header'
				});
			}

			current_container.append(new_row);
			new_row.trigger('load-panel-row', [uuid, panel.data]);
		});
	})();

	// autosave
	$(document).on('before-autosave.panel-autosave', function( e, postdata ) {
		postdata.post_content_filtered = $('#modular-content').find('input, select, textarea').serialize();
	});
});