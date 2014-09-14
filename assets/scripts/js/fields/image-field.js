(function($) {

	var init_row = function( row, uuid ) {
		var containers = row.find('.attachment-helper-uploader');
		if ( containers.length < 1 ) {
			return;
		}
		containers.each( function() {
			var container = $(this);
			if ( container.data('initialized-uploader') != 1 ) {
				var settings_name = container.data('settings');
				settings_name = settings_name.replace( uuid, '{{data.panel_id}}' );

				if ( AttachmentHelper.settings.hasOwnProperty(settings_name) ) {
					AttachmentHelper.init( container, AttachmentHelper.settings[settings_name]);
					container.data('initialized-uploader', 1);
				}
			}
		});
	};

	var panels_div = $('div.panels');
	panels_div
		.on('new-panel-row load-panel-row', '.panel-row', function(e, uuid) {
			if ( $(this).data( 'panel_id' ) != uuid ) {
				return;
			}
			init_row( $(this), uuid );
		})
		.on('new-panel-repeater-row', '.panel-repeater-row', function(e, uuid) {
			init_row( $(this), uuid );
		})
	;
})(jQuery);