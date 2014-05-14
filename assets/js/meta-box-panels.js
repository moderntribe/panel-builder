jQuery(document).ready( function($) {
	var win = window.dialogArguments || opener || parent || top;
	var panels_div = $('div.panels');

	// http://stackoverflow.com/a/2117523/500277
	var create_uuid = function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	};

	panels_div.sortable({
		axis: 'y',
		items: 'div.panel-row',
		handle: '.move-panel'
	});

	panels_div.on( 'click', 'a.delete_panel', function() {
		var row = $(this).parents('.panel-row');
		row.css({backgroundColor: 'lightYellow'});
		if ( confirm('Delete this panel?') ) { // TODO: localize
			row.fadeOut(750, function() {
				row.remove();
			});
		} else {
			row.css({backgroundColor: 'transparent'});
		}
		return false;
	});

	$('body').on('click', '.new-panel-option .thumbnail', function() {
		var wrapper = $(this).closest('.panel-template');
		var panel_type = wrapper.data('panel-type');
		var template = wp.template('panel-'+panel_type);
		var new_row = template({
			panel_id: create_uuid(),
			panel_title: 'Untitled', // TODO: localize
			fields: { title: '' }
		});
		panels_div.append(new_row);
		win.tb_remove();
		return false;
	});

	panels_div.on('keyup', '.input-name-title input:text', function() {
		var title = $(this).val();
		if ( title == '' ) {
			title = 'Untitled'; // TODO: localize
		}
		$(this).parents('.panel-row').find('.panel-row-header .panel-title').text(title);
	});

	panels_div.on('click', '.panel-row-header a.edit_panel', function() {
		$(this).parents('.panel-row').find('.panel-row-editor').slideToggle();
		return false;
	});

	var ModularContent = window.ModularContent || {};
	ModularContent.panels = ModularContent.panels || [];
	$.each(ModularContent.panels, function( index, panel ) {
		var template = wp.template('panel-'+panel.type);
		var new_row = $(template({
			panel_id: create_uuid(),
			panel_title: panel.data.title,
			fields: panel.data
		}));
		new_row.find('.panel-row-editor').hide();
		panels_div.append(new_row);
	});
});